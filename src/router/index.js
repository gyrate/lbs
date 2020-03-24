import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index'
import Single from '@/layout/single'

Vue.use(VueRouter)

// bugfix:两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const container = /single/.test(location.search) ? Single : Layout

const routes = [
  {
    path: '/',
    redirect: '/index',
    component: container,
    children: [{
      path: 'index',
      name: '首页',
      component: () => import('@/views/Home')
    }]
  },
  {
    path: '/code',
    redirect: '/code/index',
    component: container,
    children: [{
      path: '/code/index',
      name: '测试',
      component: () => import('@/views/Test')
    }]
  },
  {
    path: '/massive',
    redirect: '/massive/index',
    component: container,
    name: '海量点数据可视化',
    children: [{
      path: '/massive/index',
      name: '技术方案对比',
      desc: '各种现有技术方案优缺点对比',
      component: () => import('@/views/massive/Index')
    }, {
      path: '/massive/switchLayer',
      name: '海量点渲染3D',
      desc: '地图缩放级别低使用PointCloudLayer，缩放级别高使用labelLayer;\n首次出现labelLayer较慢',
      component: () => import('@/views/massive/CloudLayerAndLabelLayer')
    }, {
      path: '/massive/iconLayer',
      name: '海量点渲染3D',
      desc: '仅使用iconLayer，根据缩放级别调整图标尺寸',
      component: () => import('@/views/massive/IconLayer')
    }, {
      path: '/massive/iconLayerViaField',
      name: '海量点渲染3D CloudLayer/IconLayer',
      desc: '地图缩放级别低使用PointCloudLayer，缩放级别高使用iconLayer且仅渲染当前视野点标记',
      component: () => import('@/views/massive/IconLayerViaField')
    }, {
      path: '/massive/iconLayerViaField2',
      name: '海量点渲染3D RoundPointLayer/IconLayer',
      desc: '地图缩放级别低使用RoundPointLayer，缩放级别高使用iconLayer且仅渲染当前视野点标记',
      component: () => import('@/views/massive/IconLayerViaField2'),
      meta: { recommend: true }
    }, {
      path: '/massive/roundPointLayerByStep',
      name: '分页加载渲染',
      desc: '分页加载海量点数据，每加载完1页则渲染1次',
      component: () => import('@/views/massive/RoundPointLayerByStep')
    }, {
      path: '/massive/pointSimplifier',
      name: '海量点渲染2D',
      desc: '使用harbor1.0可视化方案，pointSimplifier层',
      component: () => import('@/views/massive/PointSimplifier')
    }]
  },
  {
    path: '/realData',
    redirect: '/realData/highway',
    component: container,
    name: '真实数据接入',
    children: [{
      path: '/realData/highway',
      name: '高速公路摄像头',
      desc: '调用外部摄像头数据接入展示',
      component: () => import('@/views/realData/highway')
    }, {
      path: '/realData/heatmap',
      name: '南沙疫情',
      desc: '南沙疫情人员热力图',
      component: () => import('@/views/realData/heatmap')
    }]
  },
  {
    path: '/tool',
    redirect: '/tool/polygonEditor',
    component: container,
    name: '工具库',
    children: [{
      path: '/tool/polygonEditor',
      name: '行政区域多边形',
      desc: '用于绘制和获取行政区域范围',
      component: () => import('@/views/tool/PolygonEditor')
    }, {
      path: '/tool/screenShot',
      name: 'html5截屏',
      desc: '截取页面部分内容保存为图片',
      component: () => import('@/views/tool/ScreenShot')
    }]
  },
  {
    path: '/mock',
    redirect: '/mock/index',
    component: container,
    name: '模拟数据',
    children: [{
      path: '/mock/index',
      name: '首页',
      component: () => import('@/views/mock/Index')
    }]
  }

]

const router = new VueRouter({
  routes: routes.concat([
    {
      path: '/404',
      component: () => import('@/views/error-page/404')
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ])
})

export default router
