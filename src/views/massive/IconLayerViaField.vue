<template>
  <div>
    <div class="caption">
      <h1>iconLayer按需渲染</h1>
      <p v-show="totalCount!==null">
        数据量 {{ totalCount }}
      </p>
    </div>
    <div class="tool">
      <h3>数据规模</h3>
      <el-radio-group
        v-model="dataScope"
        size="small"
      >
        <el-radio-button label="1">
          5万
        </el-radio-button>
        <el-radio-button label="4">
          10万
        </el-radio-button>
        <el-radio-button label="10">
          50万
        </el-radio-button>
        <el-radio-button label="15">
          百万
        </el-radio-button>
      </el-radio-group>
    </div>
    <div id="container" />
  </div>
</template>

<script>
import { getMap, initMap, renderBoundary, destoryMap } from '@/utils/mainMap'
import { getLoading } from '@/utils'
import axios from 'axios'
// 迁就ESLint
let Loca = window.Loca
let AMap = window.AMap
// 初始数据
var initData = []
// 源数据
var orgData = []
// 点云层
var cloudLayer
// 图标层
var iconLayer
// 初始坐标
var initLngLat

var curSize = 30

export default {
  name: 'SwitchLayer',
  data () {
    return {
      limitZoom: 16,
      totalCount: null,
      dataScope: 1
    }
  },
  watch: {
    dataScope (val) {
      this.changeOrgData(val)
    }
  },
  mounted () {
    initMap({
      // zoom: 16
    })
    getMap().on('complete', _ => {
      this.initCloudLayer()
      this.initIconLayer()
      this.initOrgData()
      // 绘制南沙边界
      renderBoundary()
      console.log('complete')
      this.handelWebGLError()
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

    // 处理WebGL上下文丢失
    handelWebGLError () {
      let canvas = document.querySelector('Canvas')
      console.log(canvas)
      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault()

        this.$confirm(`WebGL上下文丢失，即将刷新页面，是否继续？`, '提示', {
          confirmButtonText: '刷新页面',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.reload()
        }).catch(() => {
          console.log('已取消')

          destoryMap()
          console.log('检查地图')
          console.log(getMap())
          // todo: 重新渲染图层
        })
      }, false)

      canvas.addEventListener('webglcontextrestored', function () {
        console.log('webgl restored')
      })
    },

    initOrgData () {
      const loading = getLoading()
      axios.get('/static/massiveData.json').then(res => {
        orgData = res.data.data
        initData = res.data.data
        console.log(orgData[1])

        // 数据量
        this.totalCount = orgData.length
        // 缓存原始坐标
        initLngLat = getMap().getCenter()

        this.renderCloudLayer(orgData)
      }).finally(() => {
        loading.close()
      })
    },

    // 修改地图上的数据
    changeOrgData (val) {
      // 复制模拟数据
      this.copyData(val)
      // 调整缩放程度到只显示点云层
      getMap().setZoomAndCenter(13, initLngLat)
      // 重新渲染点云层
      this.renderCloudLayer(orgData)
      this.$message({
        message: `调整数据规模到${this.totalCount}`,
        type: 'success'
      })
    },

    /**
     * 复制数据
     * @param val 倍数
     */
    copyData (val) {
      let newData = []
      console.time('copyData')
      if (val <= 0) {
        return
      }
      for (let i = 0; i < val; i++) {
        let random = parseInt(Math.random() * 1000000)
        initData.forEach(item => {
          newData.push({
            id: item.id + random + i,
            location: {
              longitude: parseFloat(item.location.longitude) + i,
              latitude: parseFloat(item.location.latitude)
            }
          })
        })
      }
      console.timeEnd('copyData')
      this.totalCount = newData.length
      orgData = newData
    },

    // 初始化点云图
    initCloudLayer () {
      var layer = new Loca.PointCloudLayer({
        map: getMap(),
        visible: true
      })
      // 兼容1.3.2版本
      layer.setData([], {
        lnglat: 'lnglat',
        type: 'json'
      })
      layer.setOptions({
        style: {
          // 每个点的半径，范围在 0~2 之间。超过 2 时将会自动取 2
          radius: 2,
          // 不支持函数映射等类型，因为点云图层所有点只能是一种颜色
          color: '#097CFF',
          // 每个点的透明度，会影响点云叠加效果
          opacity: 1
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
        },
        type: 'json'
      })
      cloudLayer.render()
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

      iconLayer.setData(fdata, {
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
  background-color: #fff;
  z-index: 99;
  text-align: left;
  h3{
    padding:  0 0 .5em;
  }
}
</style>
