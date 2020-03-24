<template>
  <div>
    <div class="caption">
      <h1>cloudLayer和iconLayer切换显示</h1>
      <p v-show="totalCount!==null">
        数据量 {{ totalCount }}
      </p>
    </div>
    <div id="container" />

    <el-dialog
      append-to-body
      title="高速视频"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <div
        id="video_dom"
        style="height:400px;background-color: #7e959e;"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">
          关 闭
        </el-button>
      </div>
    </el-dialog>
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
// 图标层
var iconLayer

var curSize = 14

var player = null

export default {
  name: 'Highway',
  data () {
    return {
      totalCount: null,
      dialogVisible: false,
      currUid: null
    }
  },

  mounted () {
    initMap({
      zoom: 8,
      pitch: 30
    })
    getMap().on('complete', _ => {
      this.initIconLayer()
      const loading = getLoading()
      axios.get('http://eserve.runoneapp.com/api/Equipment/cameraEquipmentList').then(res => {
        orgData = res.data.data
        console.log('数据量：' + orgData.length)
        // 数据量
        this.totalCount = orgData.length
        this.renderIconLayer(orgData)
      }).catch(error => {
        this.$message({
          message: '获取接口数据失败',
          type: 'error'
        })
      }).finally(() => {
        loading.close()
      })
      // 绘制南沙边界
      renderBoundary()
      console.log('complete')
    })
    getMap().on('zoom', (event) => {
      console.log(event.value)
      // this.autoFixLayer(event.value)
      // 随着地图缩放尺寸的调整重新渲染图层
      this.autoFixLayer(event.value)
    })
    // 高速路网
    var trafficLayer = new AMap.TileLayer.Traffic({
      zIndex: 10
    })
    trafficLayer.setMap(getMap());
  },
  methods: {

    // 根据地图缩放情况自动
    autoFixLayer (zoom) {
      let _size
      let _url
      if (zoom > 12) {
        _size = 30
        _url = './images/svg/camera_m_1.svg'
      } else {
        _size = 14
        _url = './images/svg/node.svg'
      }

      if (_size !== curSize) {
        curSize = _size
        iconLayer.setOptions({
          source: _url,
          style: { size: curSize }
        })
        this.renderIconLayer(orgData)
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
        source: './images/svg/node.svg',
        style: {
          // 默认半径单位为像素
          size: curSize
        },
        selectStyle: {
          // radius: 14,
          borderWidth: 1,
          borderColor: '#FFF684'
        }
      })

      layer.on('click', (event) => {
        let data = event.rawData
        console.log(data)
        // 获取视频源地址
        axios.get(`http://eserve.runoneapp.com/api/Equipment/getVideoPushUrl?camera_uid=${data.uid}`).then(res => {
          console.log(res.data.data.result)
          let data = res.data.data.result
          this.showVideo(data['RTMP'])
        })
      })

      iconLayer = layer
    },

    // 渲染图标层
    renderIconLayer (data) {
      console.time('render')
      iconLayer.setData(data, {
        lnglat: function (obj) {
          var info = obj.value
          return [info.longitude, info.latitude]
        }
      })
      iconLayer.render()
      console.timeEnd('render')
    },

    resetVideoPlayer (url) {
      if (player) {
        player.newVideo(url)
      } else {
        player = new ckplayer({
          container: '#video_dom', // “#”代表容器的ID，“.”或“”代表容器的class
          variable: 'player', // 该属性必需设置，值等于下面的new chplayer()的对象
          flashplayer: false, // 如果强制使用flashplayer则设置成true
          autoplay: true,
          video: url// 视频地址
        })
      }
    },

    showVideo (url) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.resetVideoPlayer(url)
        player.videoPlay()
      })
    },

    // 弹窗关闭后执行
    handleClose () {
      player.videoPause()
      this.dialogVisible = false
    }

  }
}
</script>

<style scoped>

</style>
