<template>
  <div>
    <div class="caption">
      <h1>cloudLayer和iconLayer切换显示</h1>
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

var layer

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
      zoom: 12,
      pitch: 30
    })

    getMap().on('complete', _ => {
      this.initLayer()
      this.getData()

      renderBoundary()
    })
  },
  methods: {
    getData () {
      const loading = getLoading()
      axios.get(process.env.BASE_URL + 'static/nanshaEpidemic.json').then(res => {
        orgData = res.data.data
        // 预处理数据
        orgData.forEach(item => {
          item.count = 1
        })
        console.log('数据量：' + orgData.length)
        // 数据量
        this.totalCount = orgData.length
        this.renderLayer(orgData)
      }).finally(() => {
        loading.close()
      })
    },
    initLayer () {
      console.log(getMap())
      layer = new Loca.HeatmapLayer({
        zIndex: 999,
        map: getMap()
      })
    },
    renderLayer () {
      layer.setData(orgData, {
        lnglat: function (data) {
          return [data.value.JD, data.value.WD]
        },
        value: 'count'
      })

      layer.setOptions({
        style: {
          radius: 10,
          color: {
            0.5: '#2c7bb6',
            0.65: '#abd9e9',
            0.7: '#ffffbf',
            0.9: '#fde468',
            1.0: '#d7191c'
          }
        }
      }).render()
    }
  }
}
</script>

<style scoped>

</style>
