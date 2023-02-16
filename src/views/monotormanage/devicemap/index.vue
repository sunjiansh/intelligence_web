<template>
  <div class="">
    <div style="position: absolute;z-index: 999999;margin-top: 30px;margin-left: 50px;">
      <el-select v-model="selId" clearable placeholder="请选择或输入手环IMEI" filterable="true" class="filter-item" style="width: 330px">
        <el-option v-for="item in markersData" :key="item.id" :label="item.imei" :value="item.id"  />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"   @click="moveTo">搜索</el-button>
      <span style="font-size: 15px;">共 {{markersData.length}} 台</span>
    </div>
    <div class="map">
      <div id="map" />
    </div>
  </div>
</template>

<script>

  import {getDeviceLocationList,getUserInfoByImei} from "@/api/devicemap"
  import {initMap} from "../../../utils/TMap"
  export default {
    name: 'index',
    data() {
      return {
        'xx':null,
        tMap:null,
        markersData: [], // 标记数据
        infoWin: null, // 信息窗口实例
        markersDataMap:{},
        selId:null
      }
    },
    created() {

    },
    mounted(){
      initMap().then((TMap) => {
        this.TXMap = TMap;
        let center = new TMap.LatLng(30, 119)
        this.tMap = new TMap.Map("map", {
          center: center, //设置地图中心点坐标
          zoom: 12, //设置地图缩放级别
          //viewMode: "2D",
        });

        //加载点位坐标信息
        this.initDeviceListMap()

      })
    },
    methods: {

      initDeviceListMap(){

        this.getMarkersData()

      },
      // 获取标记数据集合 根据项目自行实现。
      getMarkersData() {
        getDeviceLocationList().then(res => {
          //console.error(res)
          let list = res
          list.forEach((item, index) => {
            //alert(item.lat)
            this.markersData.push(item)
            this.markersDataMap[item.id]=item
          })

          //渲染marker
          this.renderMarker()

        }).catch(err => {
          console.log(err)
        })
      },
      // 将坐标点处理为地图可以识别的坐标
      hanleMarker() {
        let myMarkers = []
        this.markersData.map((item, index) => {
          let obj = {
            id: item.id,
            styleId: "marker" + item.imei,
            position: new this.TXMap.LatLng(item.lat * 1, item.lon * 1),
            properties: {
              name: item.realName,
              phone:item.phone,
              sex:item.sex,
              imei:item.imei,
              locationDesc:item.locationDesc,
              lat:item.lat,
              lon:item.lon
            },
          }
          myMarkers.push(obj)
        })
        return myMarkers
      },

      // 渲染marker
      renderMarker() {
        let markerArr = this.hanleMarker()
        let map = this.tMap;
        this.marker = new this.TXMap.MultiMarker({
          id: "marker-layer",
          map: map,
          //styles: this.setMarkImg(),
          style: {
              myStyle: new window.TMap.MarkerStyle({
                width: 25, // 点标记样式宽度（像素）
                height: 35 // 点标记样式高度（像素）
                //src: '../img/marker.png',  //图片路径
            })
          },

          geometries: markerArr,
        })

        //给标识添加点击事件
        this.marker.on("click", (event) => {
          let { lat, lng } = event.latLng;
          let { name, phone,sex,imei, locationDesc,avatar} = event.geometry.properties;
          this.initWindow(name, sex,phone,imei, locationDesc,lat, lng,avatar);
          this.infoWin.open();
        })

          this.selfAdaptionMarker(markerArr)

      },
      // 看上面的动图发现 2个marker图标不一样，这里代码就是实现此功能
      setMarkImg() {
        let styleOption = {};
        // 遍历图标集合
        this.typeOptions.map((item) => {
          styleOption["marker" + item.id] = new this.TXMap.MarkerStyle({
            cursor: "pointer",
            width: 25,
            height: 25,
            anchor: { x: 16, y: 32 },
            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png',
          });
        });
        return styleOption;
      },

      // 设置自适应显示marker
      selfAdaptionMarker(markersArr) {
        let bounds = new TMap.LatLngBounds();
        markersArr.forEach(item => {
          if (bounds.isEmpty() || !bounds.contains(item.position)) {
            bounds.extend(item.position);
          }
        })
        //   设置地图可是范围
        this.tMap.fitBounds(bounds, {
          padding: 100 //自适应边距
        })
      },

      // 初始化一个信息窗口
      initWindow(name,sex,phone,imei,locationDesc,lat,lon,avatar) {
        // 一次只能打开一个窗口 打开之前先关闭之前打开的
        if (this.infoWin) {
          this.closeWindow()
        }
        this.infoWin = new this.TXMap.InfoWindow({
          map: this.tMap,
          position: new this.TXMap.LatLng(lat, lon),
          // enableCustom: true,
          content: `<ul class="equipment">
                      <li><a href="https://image.dayouqiantu.cn/5e79f6cfd33b6.png" class="el-avatar" /></li>
                      <li>名称：<span>${name}</span></li>
                      <li>性别：<span class="${sex == 1 ? "male" : "female"}">${sex == 1 ? "男" : sex==0 ? "女" : "未知"}</span></li>
                      <li>电话：<span>${phone}</span></li>
                      <li>地址：<span>${locationDesc}</span></li>
                    </ul>`,

          content:`<el-card class="box-card" >
                    <div class="card-header">
                    <span>
                      <a style="color: #42b983" target="_blank"><img src="${avatar}" alt="点击打开" class="el-avatar"></a>
                    </span>
                    </div>
                    <div style="height: 200px;width: 200px;text-align: left;font-size: 20px; white-space:normal;word-break:break-all;word-wrap:break-word; ">
                      <div>${name}</div>
                      <div>${sex == 1 ? "男" : sex==0 ? "女" : "未知"}</div>
                      <div>${phone}</div>
                      <div>${locationDesc}</div>
                    </div>
                  </el-card>`,
          offset: { x: 0, y: -30 }, //设置信息窗相对position偏移像素
        })

        // 信息窗口关闭回调
        this.infoWin.on("closeclick", () => {
          // ...
        })
      },
      // 关闭信息窗口
      closeWindow() {
        if (this.infoWin) {
          this.infoWin.close()
        }
      },
      moveTo(){

        let item = this.markersDataMap[this.selId]
        let lat = item['lat']
        let lon = item['lon']
        let ce = new TMap.LatLng(lat, lon)
        this.tMap.setCenter(ce)

      }

    }
  }
</script>

<style scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 0px;
    margin-top: 10px;
  }

  .box-card {
    width: 480px;
  }




</style>
