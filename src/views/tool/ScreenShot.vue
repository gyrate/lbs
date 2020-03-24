<template>
  <div class="main">
    <div id="test">
      <div ref="fromDom" class="contain">
        <div id="chart" class="chart"/>
      </div>
      <el-button type="primary" @click="capture">截屏</el-button>
      <el-button :disabled="dontSave" @click="saveImage">
        保存图片
      </el-button>
    </div>
    <div>
      <div ref="targetDom" class="contain"/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import HTML2Canvas from 'html2canvas'
export default {
  name: 'ScreenShot',
  data () {
    return {
      canvas: null
    }
  },
  computed: {
    dontSave () {
      return this.canvas == null
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      var instance = echarts.init(document.getElementById('chart'))
      // 绘制图表
      instance.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    capture () {
      HTML2Canvas(this.$refs['fromDom'].children[0]).then(canvas => {
        this.canvas = canvas
        this.$refs['targetDom'].appendChild(canvas)
      })
    },
    saveImage () {
      // 将mime-type改为image/octet-stream,强制让浏览器下载
      let data = this.canvas.toDataURL().replace('image/png', 'image/octet-stream')
      let link = document.createElement('a')
      link.href = data
      link.download = 'screenshot.jpg'
      let event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      link.dispatchEvent(event)
    }
  }

}
</script>

<style lang="scss" scoped>
  .main{
    margin: 100px auto;
    display: flex;
    flex-direction: row ;
    width: 1000px;
    min-height: 500px;

    & > div{
      flex: 1;
      width:500px;
      padding:.5em;
      text-align: left;
    }

    .contain{
      position: relative;
      margin-bottom: 1em;
      height:400px;
      border:1px solid #ccc;
      background-color: #fff;
    }
    .chart{
      position: absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
    }
  }
</style>
