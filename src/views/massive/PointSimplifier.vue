<template>
  <div>
    <div class="caption">
      <h1>PointSimplifier海量点展示方案</h1>
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
let AMapUI = window.AMapUI
let AMap = window.AMap
// 源数据
var orgData = []
// 图表层
var iconLayer

function onIconLoad () {
  iconLayer.renderLater()
}

function onIconError (e) {
  console.log('图片加载失败！')
}

export default {
  name: 'PointSimplifier',
  data () {
    return {
      isLayerReady: false,
      totalCount: null
    }
  },
  watch: {
    isLayerReady (val) {
      if (val === true) {
        const loading = getLoading()
        axios.get('/static/massiveData.json').then(res => {
          orgData = res.data.data
          console.log('数据量：' + orgData.length)
          // 数据量
          this.totalCount = orgData.length
          console.log(orgData[1])
          this.renderIconLayer(orgData)
        }).finally(() => {
          loading.close()
        })
      }
    }
  },
  mounted () {
    initMap({ viewMode: '2D' })
    // 地图加载完成
    getMap().on('complete', _ => {
      console.log('complete')
      this.initIconLayer()
      // 绘制南沙边界
      renderBoundary()
    })
    // 地图缩放
    getMap().on('zoom', (event) => {
      console.log(event.value)
      this.autoFixLayer(event.value)
    })
  },
  methods: {

    // 初始化海量点标注
    initIconLayer () {
      AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], (PointSimplifier, $) => {
        if (!PointSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }

        var groupStyleMap = {
          '0': {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                // imgDict[0], null, null),
                './images/svg/light.svg', onIconLoad, onIconError),
              // 宽度
              width: 16,
              // 高度
              height: 16,
              // 定位点为中心
              offset: ['-50%', '-50%'],
              fillStyle: null
              // strokeStyle: null
            }
          },
          '1': {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                // imgDict[1], null, null),
                './images/svg/light3.svg', onIconLoad, onIconError),
              // 宽度
              width: 16,
              // 高度
              height: 16,
              // 定位点为中心
              offset: ['-50%', '-50%'],
              fillStyle: null
              // strokeStyle: null
            }
          },
          '2': {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                // imgDict[2], null, null),
                './images/svg/phone.svg', onIconLoad, onIconError),
              // 宽度
              width: 16,
              // 高度
              height: 16,
              // 定位点为中心
              offset: ['-50%', '-50%'],
              fillStyle: null
              // strokeStyle: null
            }
          },
          '3': {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                // imgDict[3], null, null),
                './images/svg/station.svg', onIconLoad, onIconError),
              // 宽度
              width: 16,
              // 高度
              height: 16,
              // 定位点为中心
              offset: ['-50%', '-50%'],
              fillStyle: null
              // strokeStyle: null
            }
          }
        }

        var layer = new PointSimplifier({
          map: getMap(), // 所属的地图实例
          autoSetFitView: false, // 自动调整地图视野以适合全部点

          getPosition: function (item) {
            if (!item) {
              return null
            }
            let location = item.location

            // 返回经纬度
            return [parseFloat(location.longitude), parseFloat(location.latitude)]
          },
          getHoverTitle: function (dataItem, idx) {
            return 'my Index :' + idx
          },
          // 使用GroupStyleRender分组定义图标
          renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            // 点的样式
            pointStyle: {
              width: 5,
              height: 5,
              fillStyle: '#097CFF'
            },
            getGroupId: function (item, idx) {
              return parseInt(Math.random() * 4).toString()
            },
            groupStyleOptions: function (gid) {
              return groupStyleMap[gid]
            },
            topNAreaStyle: {
              fillStyle: '#075ab9'
            },
            // 鼠标hover时的title信息
            hoverTitleStyle: {
              position: 'top'
            }
          }
        })

        layer.on('pointClick', (e, record) => {
          console.log(e.type, record)
        })

        iconLayer = layer

        this.isLayerReady = true
      })
    },

    // 渲染点云图
    renderIconLayer (data) {
      iconLayer.setData(data)
    },
    // 根据地图缩放情况自动
    autoFixLayer (zoom) {
    }

  }
}
</script>

<style scoped>

</style>
