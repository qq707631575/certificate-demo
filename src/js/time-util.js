export function timeStampToDate (timestamp) {
  var newDate = new Date()
  newDate.setTime(timestamp * 1000)
  return newDate.toLocaleString()
}

export function dateToUnix (strings) { // 日期转换成时间戳
  let f = strings.split(' ', 2)
  let d = (f[0] ? f[0] : '').split('-', 3)
  let t = (f[1] ? f[1] : '').split(':', 3)
  return (new Date(
    parseInt(d[0], 10) || null,
    (parseInt(d[1], 10) || 1) - 1,
    parseInt(d[2], 10) || null,
    parseInt(t[0], 10) || null,
    parseInt(t[1], 10) || null,
    parseInt(t[2], 10) || null
  )).getTime() / 1000
}

export function unixToDate (unixTime, isFull, timeZone) {
  if (typeof (timeZone) === 'number') {
    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60
  }
  let time = new Date(unixTime * 1000)
  let ymdhis = ''
  ymdhis += time.getUTCFullYear() + '-'
  ymdhis += (time.getUTCMonth() + 1) + '-'
  ymdhis += time.getUTCDate()
  if (isFull === true) {
    ymdhis += ' ' + time.getUTCHours() + ':'
    ymdhis += time.getUTCMinutes() + ':'
    ymdhis += time.getUTCSeconds()
  }
  return ymdhis
}

export function changeFormat (time, format) { // 标准时间转化成标准格式
  let t = new Date(time)
  let tf = function (i) { return (i < 10 ? '0' : '') + i }
  return format.replace(/yyyy|MM|dd|hh|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'hh':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}

export function moreDateInfo () { // 获得当前年月日天等相关信息
  let times = new Date()
  let year = times.getFullYear()
  let month = times.getMonth() + 1
  let curDay = times.getDate()
  let hour = times.getHours()
  let minute = times.getMinutes()
  let days = (new Date(year, month, 0)).getDate() // 这个月天数
  if (curDay < 10) {
    curDay = '0' + curDay
  }
  if (month < 10) {
    month = '0' + month
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  let xingqi = '星期' + '日一二三四五六'.charAt(new Date().getDay())
  return year + '' + month + '' + curDay + '' + hour + '' + minute + '' + xingqi
}

export function DateDiff (start, end) { // sDate1和sDate2是yyyy-MM-dd格式
  let aDate, oStart, oEnd, iDays
  aDate = start.split('-')
  oStart = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) // 转换为yyyy-MM-dd格式
  aDate = end.split('-')
  oEnd = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oStart - oEnd) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数
  return iDays // 返回相差天数
}

export function getBeforeDate (num) { // 当前日期的最近几天的最开始的那个日期
  let myDate = new Date()
  let before = (myDate.setDate(myDate.getDate() - num)) / 1000
  let temp = unixToDate(before, false)
  let tempArr = temp.split('-')
  if (tempArr[1] < 10) {
    tempArr[1] = '0' + tempArr[1]
  }
  if (tempArr[2] < 10) {
    tempArr[2] = '0' + tempArr[2]
  }
  return tempArr.join('-')
}

// 兼容ios的时间对象
export function newDateObj (date) {
  let dateStr = typeof date === 'string' ? date.replace(/-/g, '/') : date
  return new Date(dateStr)
}

// 格式化时间，传入日期对象date，一个时间模版字符串（如'yyyy-MM-dd hh:mm:ss'）月份大写M,分钟小写m
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : addZero(str))
    }
  }
  return fmt
};

// 返回标准的月份日期小时分钟和秒 (补0)
export function addZero (str) {
  return ('00' + str).substr(str.length)
}
