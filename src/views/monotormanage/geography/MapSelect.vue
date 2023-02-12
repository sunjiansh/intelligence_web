<template>
  <div  id="app">
  </div>
</template>

<script>

  export default {
    data () {
      return {
      }
    },
    methods: {
      loadInitialMap() {
        var arr=[];
        arr[0] = 30
        arr[1] = 119
        var addressName="xx"
        // 设置中心点坐标
        const center = new window.TMap.LatLng( arr[0] , arr[1] )
        // 初始化地图
        const map = new window.TMap.Map(document.getElementById("app"), {
          rotation: 20, // 设置地图旋转角度
          pitch: 30, // 设置俯仰角度（0~45）
          zoom: 12, // 设置地图缩放级别
          center: center // 设置地图中心点坐标
        })

        const maketLyer = new window.TMap.MultiMarker({
          map: map,
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
              position: new window.TMap.LatLng(arr[0], arr[1]), // 点标记坐标位置
              properties: {
                // 自定义属性
                title: 'marker1'
              }
            }
          ]
        })
        // 简单文本标记
        const label = new window.TMap.MultiLabel({
          id: '1',
          map: map,
          styles: {
            label: new window.TMap.LabelStyle({
              color: '#6589DB', // 颜色属性
              size: 14, // 文字大小属性
              offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
              angle: 0, // 文字旋转属性
              alignment: 'center', // 文字水平对齐属性
              verticalAlignment: 'middle' // 文字垂直对齐属性
            })
          },
          geometries: [
            {
              id: 'label', // 点图形数据的标志信息
              styleId: 'label', // 样式id
              position: center, // 标注点位置
              content: addressName, // 标注文本
              properties: {
                // 标注点的属性数据
                title: 'label'
              }
            }
          ]
        })
        // 创建信息窗口
        const info = new window.TMap.InfoWindow({
          map,
          position: map.getCenter(),
          offset: { x: 0, y: -32 }
        })
        info.close()
        map.on('click', (evt) => {
          console.log(evt)
          // 获取click事件返回的poi信息
          const poi = evt.poi
          if (poi) {
            // 拾取到POI
            info.setContent(poi.name).setPosition(poi.latLng).open()
          } else {
            // 没有拾取到POI
            info.close()
          }
        })
        // 自执行中心点方法
        setCenter(map, arr)

        maketLyer.on('click', (event) => {
          console.log(event)
          info.open()
          info.setPosition(event.geometry.position)
          info.setContent(event.geometry.position.toString())
        })
      }
    },
    mounted () {
      this.loadInitialMap()
    }
  }
</script>
<style>

</style>
