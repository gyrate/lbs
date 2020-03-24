export default function (value) {
  if (!value) {
    return '0'
  }
  // 取整
  let intPart = Number(value) - Number(value) % 1
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  let value2Array = value.toString().split('.')

  // 有小数
  if (value2Array.length >= 2) {
    return intPartFormat + '.' + value2Array[1]
  } else {
    return intPartFormat
  }
}
