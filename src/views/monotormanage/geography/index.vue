<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="650px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="170px">
          <el-form-item label="id" v-if="false">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员ID" v-if="false">
            <el-input v-model="form.memberId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员人员名称" prop="memberName">
            <el-input v-model="form.memberName"  style="width: 370px;" @click.native="toggleUserListDialog" />
          </el-form-item>
          <el-form-item label="手环IMEI" prop="imei">
            <el-input v-model="form.imei" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="围栏名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="围栏地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="围栏半径（单位：米）" prop="regionRange">
            <el-input v-model.number="form.regionRange" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="经度" prop="lon">
            <el-input v-model.number="form.lon" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model.number="form.lat" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item>
            <el-button  size="medium" type="primary" @click="showPosition">获取经纬度</el-button>
          </el-form-item>
          <!--<el-form-item label="创建时间">-->
            <!--<el-input v-model="form.createTime" style="width: 370px;" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="更新时间">-->
            <!--<el-input v-model="form.updateTime" style="width: 370px;" />-->
          <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>

        <el-dialog :visible.sync="userlistdialog" v-if="userlistdialog" height="400px" append-to-body>
          会员用户列表
          <userlist ref="userform" @tt="inputMmemberInfo"></userlist>
        </el-dialog>

        <el-dialog :visible.sync="watchlistdialog" v-if="watchlistdialog" height="400px" append-to-body>
          会员用户列表
          <watchlist ref="userform" @tt="inputWatchInfo"></watchlist>
        </el-dialog>

        <!--<el-dialog :visible.sync="mapselectdialog" v-if="mapselectdialog" height="600px" append-to-body destroy-on-close>-->
              <!--<MapSelect ref="ms"  />-->
        <!--</el-dialog>-->



        <el-dialog
          :visible.sync="positionDialog"
          title="选取坐标"
          width="65%"
          append-to-body
          destroy-on-close>
          <span>
               <el-input v-model="searhAdddress" style="width: 400px;" />
               <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"   @click="searchddd">搜索</el-button>
          </span>
          <div class="map">
            <div id="map" />
          </div>
          <span class="dialog-footer"></span>
          纬度
          <el-input v-model.number="form.lat" style="width: 200px;" />
          经度
          <el-input v-model.number="form.lon" style="width: 200px;" />
          地址
          <el-input v-model="form.address" style="width: 250px;" />
          围栏半径（单位：米）
          <el-input v-model.number="form.regionRange" @change="" style="width: 100px;" />
          <el-button type="primary" @click="saveLatLng">确 定</el-button>
        </el-dialog>




      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="false" prop="id" label="id" />
        <el-table-column v-if="false" prop="memberId" label="会员ID" />
        <el-table-column v-if="columns.visible('memberName')" prop="memberName" label="会员人员名称" />
        <el-table-column v-if="columns.visible('imei')" prop="imei" label="手环IMEI" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="围栏名称" />
        <el-table-column v-if="columns.visible('address')" prop="address" label="围栏地址" />
        <el-table-column v-if="columns.visible('regionRange')" prop="regionRange" label="围栏半径（单位：米）" />
        <el-table-column v-if="false" prop="lon" label="经度" />
        <el-table-column v-if="false" prop="lat" label="纬度" />
        <!--<el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{ parseTime(scope.row.createTime) }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sGeography:edit','sGeography:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSGeography from '@/api/sGeography'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";
import Userlist from './userlist'
import Watchlist from './watchlist'




// crud交由presenter持有
const defaultCrud = CRUD({ title: '电子围栏管理', url: 'api/sGeography', sort: 'id,desc', crudMethod: { ...crudSGeography }})
const defaultForm = { id: null, imei: null, name: null, address: null, regionRange: null, lon: null, lat: null, createTime: null, updateTime: null, memberId: null, memberName: null }
export default {
  name: 'SGeography',
  components: { Watchlist, pagination, crudOperation, rrOperation, udOperation ,MaterialList,Userlist},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      userlistdialog:false,
      watchlistdialog:false,
      mapselectdialog:false,
      positionDialog:false,
      point:null,
      map:null,
      circle:null,
      searhAdddress:'',
      permission: {
        add: ['admin', 'sGeography:add'],
        edit: ['admin', 'sGeography:edit'],
        del: ['admin', 'sGeography:del']
      },
      rules: {
        memberName: [
          {required: true, message: '会员人员名称不能为空', trigger: 'blur'}
        ],
        imei: [
          {required: true, message: 'IMEI不能为空', trigger: 'blur'}
        ],
        lat: [
          {required: true, message: '纬度称不能为空', trigger: 'blur'}
        ],
        lon: [
          {required: true, message: '经度称不能为空', trigger: 'blur'}
        ],
        regionRange: [
          {required: true, message: '围栏半径不能为空', trigger: 'blur'}
        ]

      },
      queryTypeOptions: [
        { key: 'imei', display_name: '手环IMEI' }
      ]
    }
  },
  watch: {

  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }else{
        delete this.crud.params.imei
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    inputMmemberInfo(data){
      this.form.memberId = data.uid
      this.form.memberName =data.realName
      this.form.imei = data.imei
      this.userlistdialog = !this.userlistdialog
    },
    toggleUserListDialog(){
      this.userlistdialog = !this.userlistdialog
    },
    inputWatchInfo(imei){
      this.form.imei = imei
      this.watchlistdialog = !this.watchlistdialog
    },
    toggleWatchListDialog(){
      this.watchlistdialog = !this.watchlistdialog
    },
    searchddd(){
      if(this.searhAdddress.trim==''){
        return
      }
      crudSGeography.getLatLngByAddress(this.searhAdddress)
        .then(res => {
          this.setCenter(this.map,[res.location.lat,res.location.lng])
          //this.form.address = res.result.address
        }).catch(err => {
        console.log(err);
      })
    },
    showPosition() {
      this.positionDialog = true
      this.latitude = 30
      this.longitude = 119
      if (this.latitude !== 0 || this.longitude !== 0) {
        this.initMap()
        this.initCircle()
      }
    },
    saveLatLng(){
      this.positionDialog = false
    },

    clearMarkers(){
      if(this.point != null){
        this.point.setMap(null)
      }
    },
    addMarker(latLng){
      let maketLyer = new window.TMap.MultiMarker({
        map: this.map,
        style: {
          myStyle: new window.TMap.MarkerStyle({
            width: 25, // 点标记样式宽度（像素）
            height: 35 // 点标记样式高度（像素）
          })
        },
        geometries: [
          {
            id: 'label-layer', // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
            styleId: 'myStyle', // 指定样式id
            position: new window.TMap.LatLng(latLng.lat, latLng.lng), // 点标记坐标位置
            properties: {
              // 自定义属性
              title: 'marker1'
            }
          }
        ]
      })
      this.point = maketLyer
    },
    clearCircles(){
      if(this.circle != null){
        this.circle.setMap(null)
      }
    },
    addCircle(latLng,radius){
      var center=new window.TMap.LatLng(latLng.lat,latLng.lng);
      let map = this.map
      var circle = new TMap.MultiCircle({
        map,
        styles: { // 设置圆形样式
          'circle': new TMap.CircleStyle({
            'color': 'rgba(41,91,255,0.16)',
            'showBorder': true,
            'borderColor': 'rgba(41,91,255,1)',
            'borderWidth': 2,
          }),
        },
        geometries: [{
          styleId: 'circle',
          center: center, //圆形中心点坐标
          radius: radius,	//半径（单位：米）
        }],
      });
      this.circle = circle
    },
    initCircle(){
        const timer = setInterval(() => {
          if (this.map != null) {
            if(this.form.lat != null && this.form.lon != null && this.form.regionRange > 0){
              this.clearMarkers()
              this.clearCircles()
              this.addMarker({'lat':this.form.lat,'lng':this.form.lon})
              this.addCircle({'lat':this.form.lat,'lng':this.form.lon},this.form.regionRange)
              this.setCenter(this.map,[this.form.lat,this.form.lon])
            }
            clearInterval(timer)
          }
        }, 200)
    },
    setCenter(map, arr) {
      map.setCenter(new window.TMap.LatLng(arr[0], arr[1]))
    },
    initMap() {
      const timer = setInterval(() => {
        const map = document.querySelector('#map')
        if (map) {
          const address = [this.latitude, this.longitude]
          this.loadInitialMap('map', address, '')
          clearInterval(timer)
        }
      }, 200)
    },
    // 地图点击事件
    clickHandler(evt) {
      this.form.lat = evt.latLng.lat
      this.form.lon = evt.latLng.lng

      this.clearMarkers()
      this.clearCircles()
      this.addMarker(evt.latLng)

      if(this.form.regionRange == null || this.form.regionRange < 0){
        this.$message.error('请先设定半径大小')
        return
      }

      this.addCircle(evt.latLng,this.form.regionRange)

      crudSGeography.getAddressByLatLng(evt.latLng.lat,evt.latLng.lng)
        .then(res => {
          this.form.address = res.result.address
      }).catch(err => {
        console.log(err);
      })
    },
    loadInitialMap(domID, arr, addressName) {
      // 设置中心点坐标
      const center = new window.TMap.LatLng(arr[0], arr[1])
      // 初始化地图
      const map = new window.TMap.Map(document.getElementById(domID), {
        //rotation: 20, // 设置地图旋转角度
        //pitch: 30, // 设置俯仰角度（0~45）
        zoom: 12, // 设置地图缩放级别
        center: center // 设置地图中心点坐标
      })

      this.map = map

      // const maketLyer = new window.TMap.MultiMarker({
      //   map: map,
      //   style: {
      //     myStyle: new window.TMap.MarkerStyle({
      //       width: 25, // 点标记样式宽度（像素）
      //       height: 35 // 点标记样式高度（像素）
      //     })
      //   },
      //   geometries: [
      //     {
      //       id: 'label-layer', // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
      //       styleId: 'myStyle', // 指定样式id
      //       position: new window.TMap.LatLng(arr[0], arr[1]), // 点标记坐标位置
      //       properties: {
      //         // 自定义属性
      //         title: 'marker1'
      //       }
      //     }
      //   ]
      // })
      // 简单文本标记
      // const label = new window.TMap.MultiLabel({
      //   id: '1',
      //   map: map,
      //   styles: {
      //     label: new window.TMap.LabelStyle({
      //       color: '#6589DB', // 颜色属性
      //       size: 14, // 文字大小属性
      //       offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
      //       angle: 0, // 文字旋转属性
      //       alignment: 'center', // 文字水平对齐属性
      //       verticalAlignment: 'middle' // 文字垂直对齐属性
      //     })
      //   },
      //   geometries: [
      //     {
      //       id: 'label', // 点图形数据的标志信息
      //       styleId: 'label', // 样式id
      //       position: center, // 标注点位置
      //       content: addressName, // 标注文本
      //       properties: {
      //         // 标注点的属性数据
      //         title: 'label'
      //       }
      //     }
      //   ]
      // })
      // 创建信息窗口
      // const info = new window.TMap.InfoWindow({
      //   map,
      //   position: map.getCenter(),
      //   offset: { x: 0, y: -32 }
      // })
      // info.close()

      map.on('click', (evt) => {
        this.clickHandler(evt)
        console.log(evt)
        // 获取click事件返回的poi信息
        const poi = evt.poi
        if (poi) {
          // 拾取到POI
          //info.setContent(poi.name).setPosition(poi.latLng).open()
        } else {
          // 没有拾取到POI
          //info.close()
        }
      })
      // 自执行中心点方法
      this.setCenter(map, arr)

      // maketLyer.on('click', (event) => {
      //   console.log(event)
      //   info.open()
      //   info.setPosition(event.geometry.position)
      //   info.setContent(event.geometry.position.toString())
      //
      // })
    }
  }
}



</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }

</style>
