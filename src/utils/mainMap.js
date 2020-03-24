import axios from 'axios'
var mainMap = null
const AMap = window.AMap

/**
 * 获取地图
 */
export function getMap () {
  return mainMap
}

/**
 * 初始化地图
 */
export function initMap ({ viewMode = '3D', zoom = 12, pitch = 60 } = {}) {
  let map = new AMap.Map('container', {
    center: [113.533339, 22.794258],
    resizeEnable: true,
    zooms: [3, 20],
    viewMode,
    defaultCursor: 'default',
    pitch,
    mapStyle: 'amap://styles/grey',
    expandZoomRange: true,
    zoom
  })

  window.AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
    map.addControl(new BasicControl.Zoom({
      position: 'br',
      showZoomNum: true
    }))
  })

  mainMap = map
  // window.mainMap = map
}

export function destoryMap () {
  mainMap.clearMap()
  mainMap.destroy()
  mainMap = null
}

/**
 * 绘制边缘
 */
export function renderBoundary () {
  axios.get('/static/nansha.json').then(res => {
    const boundary = res.data.data
    /* eslint-disable no-new */
    new AMap.Polyline({
      path: boundary,
      strokeColor: '#99ffff',
      strokeWeight: 1,
      map: mainMap
    })
  })
}

export default getMap()
