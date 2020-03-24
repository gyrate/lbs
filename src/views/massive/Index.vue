<template>
  <div style="padding:3em;">
    <el-table
      :data="layerList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="技术方案"
      />
      <el-table-column
        prop="desc"
        label="说明"
      />
      <el-table-column
        prop="scale"
        label="性能限制"
      />
      <el-table-column
        prop="good"
        label="优点"
      />
      <el-table-column
        prop="bad"
        label="缺点"
      />
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      layerList: [{
        name: 'Marker',
        desc: '标签点标记',
        scale: '1000以上就会有明显的卡顿现象',
        good: '点标注可高度定制，比如做动画图标；可做点聚合',
        bad: '个数不能太多'
      }, {
        name: 'MassMarks',
        desc: '海量点标记',
        scale: '10万以内有较好的性能表现',
        good: '能够展示所有点',
        bad: '适合2D模式，在3D模式下是个贴着地图的平面'
      }, {
        name: 'PointSimplifier',
        desc: '海量点展示',
        scale: '100万规模',
        good: '性能优越',
        bad: '只支持2D模式，低级别缩放模式下只能展示部分点'
      }, {
        name: 'PointCloudLayer',
        desc: '点云图层',
        scale: '2D模式50万以内，20万以内有最佳体验\n3D模式100万规模',
        good: '低级别缩放模式下效果较好',
        bad: '不支持鼠标事件；仅支持纯色图标，半径0-2之间；5万以上数据，快速拖拽或缩放会使地图崩溃'
      }, {
        name: 'IconLayer',
        desc: '图标图层',
        scale: '配置支持鼠标事件时，规模在1万以内\n',
        good: '渲染时间非常短\n',
        bad: '图标尺寸大于20会产生边缘模糊；\n数量上万，支持鼠标事件，缩放时会出现明显卡顿\n'
      }, {
        name: 'RoundPointLayer',
        desc: '散点图层',
        scale: '配置支持鼠标事件时',
        good: '可定义每个点的半径颜色',
        bad: '适合2D模式，在3D模式下是个贴着地图的平面\n数量上万，支持鼠标事件，缩放时会出现明显卡顿\n'
      }, {
        name: 'labalLayer',
        desc: '文字图层',
        scale: '2D模式建议在3000以内\nD模式建议在30000以内',
        good: '渲染一次后可任务缩放拖拽地图无卡顿\n',
        bad: '每次渲染时间过久，且无法监听何时完成渲染\n'
      }]
    }
  },
  methods: {

  }
}
</script>
