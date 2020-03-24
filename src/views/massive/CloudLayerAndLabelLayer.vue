<template>
  <div>
    <div class="caption">
      <h1>cloudLayer和labelLayer切换显示</h1>
      <p v-show="totalCount!==null">
        数据量 {{ totalCount }}
      </p>
    </div>
    <div id="container" />
  </div>
</template>

<script>
import { getMap, initMap, renderBoundary } from '@/utils/mainMap'
import { getLoading } from '@/utils'
import axios from 'axios'
// 迁就ESLint
let Loca = window.Loca
let AMap = window.AMap
// 源数据
var orgData = []
// 点云层
var cloudLayer
// 图标层
var iconLayer

export default {
  name: 'SwitchLayer',
  data () {
    return {
      totalCount: null,
      isIconLayerRendered: false
    }
  },
  mounted () {
    initMap()
    getMap().on('complete', _ => {
      this.initCloudLayer()
      this.initIconLayer()
      const loading = getLoading()
      axios.get('/static/massiveData.json').then(res => {
        orgData = res.data.data
        console.log('数据量：' + orgData.length)
        // 数据量
        this.totalCount = orgData.length
        this.renderCloudLayer(orgData)
        // this.renderIconLayer(orgData)
      }).finally(() => {
        loading.close()
      })
      // 绘制南沙边界
      renderBoundary()
      console.log('complete')
    })
    getMap().on('zoom', (event) => {
      console.log(event.value)
      this.autoFixLayer(event.value)
    })
  },
  methods: {

    // 初始化点云图
    initCloudLayer () {
      var layer = new Loca.PointCloudLayer({
        map: getMap(),
        visible: true
      })
      layer.setOptions({
        style: {
          // 每个点的半径，范围在 0~2 之间。超过 2 时将会自动取 2
          radius: 2,
          // 不支持函数映射等类型，因为点云图层所有点只能是一种颜色
          color: '#097CFF',
          // 每个点的透明度，会影响点云叠加效果
          opacity: 0.9
        }
      })
      cloudLayer = layer
    },
    // 渲染点云图
    renderCloudLayer (data) {
      cloudLayer.setData(data, {
        lnglat: function (obj) {
          var info = obj.value
          return [info.location.longitude, info.location.latitude]
        }
      })
      cloudLayer.render()
    },
    // 根据地图缩放情况自动
    autoFixLayer (zoom) {
      if (zoom <= 14) {
        iconLayer && iconLayer.hide()
        cloudLayer && cloudLayer.show()
      } else {
        if (!this.isIconLayerRendered) {
          this.renderIconLayer(orgData)
          this.isIconLayerRendered = true
        } else {
          iconLayer && iconLayer.show()
        }
        cloudLayer && cloudLayer.hide()
      }
    },

    // 初始化图标层
    initIconLayer () {
      // 2D 标注建议在 3000 点内
      // 3D 标注建议在 30000 点内
      var layer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 2000,
        animation: false,
        collision: false
      })
      getMap().add(layer)
      iconLayer = layer
    },

    // 渲染图标层
    renderIconLayer (data) {
      let tempMarkers = []
      let iconConf = {
        type: 'image',
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        size: [9, 12],
        anchor: 'bottom-center',
        angel: 0,
        retina: false
      }

      console.time('travel')
      for (var i = 0; i < data.length; i++) {
        let location = data[i % data.length].location
        let marker = new AMap.LabelMarker({
          position: [location.longitude, location.latitude],
          icon: iconConf
        })
        tempMarkers.push(Object.seal(marker))
      }
      console.timeEnd('travel')

      console.time('render')
      // iconLayer.clear()
      iconLayer.add(tempMarkers)
      console.timeEnd('render')
    }

  }
}
</script>

<style scoped>

</style>
