import { Loading } from 'element-ui'

export function getLoading () {
  return Loading.service({
    lock: false,
    text: '正在加载测试数据...',
    background: 'rgba(0, 0, 0, 0.2)'
  })
}
