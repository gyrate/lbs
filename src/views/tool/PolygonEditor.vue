<template>
  <div>
    <div class="caption">
      <h1>编辑行政区域</h1>
    </div>
    <div id="container" />
    <div style="position: absolute; bottom:2em;left:2em; padding:1em; width:400px; background-color: #fff;">
      <el-input
        v-model="pathsValue"
        :rows="4"
        type="textarea"
      />
      <p style="padding:0.5em 0; text-align: right;">
        <el-button
          size="mini"
          @click="getPolyPaths"
        >
          获取多边形坐标
        </el-button>
        <el-button
          size="mini"
          type="primary"
          @click="renderPolygon"
        >
          绘制
        </el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { getMap, initMap } from '@/utils/mainMap'
let AMap = window.AMap
export default {
  name: 'PolygonEditor',
  data () {
    return {
      // 多边形相关点坐标
      paths: [[113.543896, 22.825075], [113.51849, 22.783615], [113.570675, 22.73961], [113.627667, 22.752274]],
      pathsValue: '',
      // 是否处于编辑模式
      isEditing: false
    }
  },

  mounted () {
    this.pathsValue = JSON.stringify(this.paths)

    initMap({ viewMode: '2D' })
    getMap().on('complete', _ => {
      this.initPolygon()
      this.initPolygonEditor()
    })
  },
  methods: {
    initPolygon () {
      let polygon = new AMap.Polygon({
        map: getMap(),
        path: this.paths,
        draggable: true,
        strokeColor: '#415bff',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#69a0f5',
        fillOpacity: 0.35
      })
      this.polygon = polygon
    },

    initPolygonEditor () {
      AMap.plugin(['AMap.PolyEditor'], () => {
        this.editor = new AMap.PolyEditor(getMap(), this.polygon)
        this.polygon.on('click', (event) => {
          if (this.isEditing) {
            this.editor.close()
          } else {
            this.editor.open()
          }
          this.isEditing = !this.isEditing
        })
      })
    },

    renderPolygon () {
      try {
        let formatPaths = JSON.parse(this.pathsValue)

        this.paths = formatPaths
        this.isEditing = false
        this.editor.close()
        this.polygon.setOptions({
          path: this.paths
        })
      } catch (e) {
        this.$alert('坐标数据解析出错')
      }
    },

    getPolyPaths () {
      let arr = []
      this.polygon.getPath().forEach(item => {
        arr.push([item.lng, item.lat])
      })

      this.pathsValue = JSON.stringify(arr)
    }

  }
}
</script>

<style scoped>

</style>
