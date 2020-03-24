<template>
  <div>
    <div class="caption">
      <h1>分页加载渲染</h1>
      <p v-show="totalCount!==null">
        数据量 {{ totalCount | formatNumber }}
      </p>
    </div>
    <div class="tool">
      <h3>分页加载</h3>
      <el-progress
        :percentage="percentage"
        color="#f56c6c"
      />
      <el-button-group>
        <el-button
          icon="el-icon-plus"
          size="mini"
          @click="loadPage"
        />
        <el-button
          size="mini"
          @click="autoLoadPage"
        >
          自动加载分页
        </el-button>
        <el-button
          size="mini"
          @click="cleanLayer"
        >
          清空图层
        </el-button>
      </el-button-group>
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
// 初始数据
var initData = []
// 源数据
var orgData = []
// 点云层
var cloudLayer
// 图标层
var iconLayer

var curSize = 30

export default {
  name: 'SwitchLayer',
  data () {
    return {
      limitZoom: 16,
      totalCount: null,
      percentage: 20
    }
  },
  watch: {
    // dataScope (val) {
    //   this.changeOrgData(val)
    // }
  },
  mounted () {
    initMap({
      zoom: 10,
      pitch: 0
    })
    getMap().on('complete', _ => {
      this.initCloudLayer()
      this.initIconLayer()
      // this.autoFixLayer(getMap().getZoom())
      const loading = getLoading()
      axios.get('/static/massiveData.json').then(res => {
        initData = res.data.data.splice(0, 10000)
        orgData = initData
        console.log(orgData[1])

        // 数据量
        this.totalCount = orgData.length

        this.renderCloudLayer(orgData)
      }).finally(() => {
        loading.close()
      })
      // 绘制南沙边界
      renderBoundary()
      console.log('complete')
    })
    getMap().on('zoomend', (event) => {
      let zoom = getMap().getZoom()
      console.log(zoom)
      this.autoFixLayer(zoom)
    })
    getMap().on('moveend', (event) => {
      let zoom = getMap().getZoom()
      this.autoFixLayer(zoom)
    })
  },
  methods: {

    cleanLayer () {
      orgData = initData.concat([])
      cloudLayer.setData([], {
        lnglat: 'lngLat'
      })
      cloudLayer.render()
      this.percentage = 20
    },

    autoLoadPage () {
      let clock = setInterval(() => {
        if (this.percentage >= 100) {
          clearInterval(clock)
          return
        }
        this.loadPage()
      }, 500)

      // todo:控制渲染在500ms执行一次
    },

    loadPage () {
      let step = 10
      if (this.percentage >= 100) {
        return
      }
      // 复制模拟数据
      this.addData(this.percentage / step)
      this.percentage += step
      // 重新渲染点云层
      this.renderCloudLayer(orgData)
    },

    // 追加数据
    addData (val) {
      let newData = []

      // 复制一组数据
      initData.forEach(item => {
        newData.push({
          id: item.id + val,
          location: {
            longitude: parseFloat(item.location.longitude) + val,
            latitude: parseFloat(item.location.latitude)
          }
        })
      })

      orgData = orgData.concat(newData)
      this.totalCount = orgData.length
    },

    // 初始化点云图
    initCloudLayer () {
      var layer = new Loca.RoundPointLayer({
        map: getMap()
      })
      layer.setOptions({
        unit: 'px',
        style: {
          // 半径可函数化
          radius: 1,
          // 可设定多种颜色
          color: '#097CFF',
          height: 10,
          opacity: 0.9
        }
      })
      // layer.on('complete', function () {
      //   debugger
      // })
      // layer.on('render', function () {
      //   debugger
      // })
      cloudLayer = layer
    },
    // 渲染点云图
    renderCloudLayer (data) {
      console.time('renderCloudLayer')
      cloudLayer.setData(data, {
        lnglat: function (obj) {
          var info = obj.value
          return [info.location.longitude, info.location.latitude]
        }
      })
      cloudLayer.render()
      console.timeEnd('renderCloudLayer')
    },
    // 根据地图缩放情况自动
    autoFixLayer (zoom) {
      if (zoom > this.limitZoom) {
        cloudLayer && cloudLayer.hide()
        iconLayer && iconLayer.show()
        this.renderIconLayer(orgData)
      } else {
        cloudLayer && cloudLayer.show()
        iconLayer && iconLayer.hide()
      }
    },

    // 初始化图标层
    initIconLayer () {
      // 2D 标注建议在 3000 点内
      // 3D 标注建议在 30000 点内
      var layer = new Loca.IconLayer({
        zooms: [3, 20],
        zIndex: 2000,
        map: getMap(),
        eventSupport: true // 数量大的话会卡
      })

      layer.setOptions({
        source: './images/svg/bracelet.svg',
        style: {
          // 默认半径单位为像素
          size: curSize
        }
      })

      layer.on('click', function (event) {
        console.log(event.rawData)
        alert('设备id:' + event.rawData.id)
      })

      iconLayer = layer
    },

    // 渲染图标层
    renderIconLayer (data) {
      console.time('render')

      let bounds = getMap().getBounds()
      let fdata = data.filter((item) => {
        return bounds.contains([item.location.longitude, item.location.latitude])
      })
      console.log('render count:' + fdata.length)

      iconLayer.setData(fdata.splice(0, 100), {
        lnglat: function (obj) {
          var info = obj.value
          return [info.location.longitude, info.location.latitude]
        }
      })
      iconLayer.render()
      console.timeEnd('render')
    }

  }
}
</script>

<style lang="scss" scoped>
  .tool{
    position: absolute;
    bottom:30px;
    right:80px;
    padding: 1em;
    width: 300px;
    background-color: #fff;
    z-index: 99;
    text-align: left;
    h3{
      padding:  0 0 .5em;
    }
  }
</style>
