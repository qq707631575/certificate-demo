/**
 * Created by linyue on 2017/10/20.
 */
import Vue from 'vue'
import axios from 'axios'
import './config.js'
import wx from 'weixin-js-sdk'
  ;(function (w) {
  function qwy () {}
  qwy.prototype = {
    /**
     * 判断字符串是否为空
     */
    isNull ($value) {
      if (typeof ($value) === 'object')$value = $value.toString()
      if ($value == '' || $value.replace(/\s+/g, '') == '') {
        return true
      } else {
        return false
      }
    },
    /**
     * 检验身份证数据格式
     */
    checkCertID ($certID) {
      $certID = $certID.replace(/(^\s+)|(\s+$)/g, '')
      if ($certID.length != 15 && $certID.length != 18) {
        return '不应为' + $certID.length + '位，请纠正'
      }
      var n = 4
      if ($certID.length == 15) {
        var year = '19' + $certID.substring(6, 2 * n)
      }
      if ($certID.length == 18) {
        var year = $certID.substring(6, 2 * (n + 1))
      }
      var month = $certID.substring(2 * n, 2 * (n + 1))
      var day = $certID.substring(2 * (n + 1), 2 * (n + 2))
      return this.checkDate(year + month + day, 'yyyymmdd') == '' ? '' : '身份证号中的日期错误'
    },
    /**
     * 检查日期的年月日是否正确
     */
    checkDate (sValue, sFormat) {
      var regYyyy_mm_dd_A = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
      var regDateTime = /^(\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/
      var regChineseY_m_d = /^(\d{4})年(\d{1,2})月(\d{1,2})$/
      var regSlashY_m_d = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
      var regSlashYmd = /^(\d{4})(\d{1,2})(\d{1,2})$/
      var sDateFormatA = 'yyyy-mm-dd'
      if (sValue != '') {
        var regUseFormat = null
        /**
         * 默认值为YYYY-mm-dd
         */
        if (sFormat == null) {
          sFormat = sDateFormatA
          regUseFormat = regYyyy_mm_dd_A
        }

        if (sFormat == 'yyyy-mm-dd') {
          regUseFormat = regYyyy_mm_dd_A
          // yyyy-mm-dd
        } else if (sFormat == 'yyyy年mm月dd日') {
          regUseFormat = regChineseY_m_d
          // yyyy年mm月dd日
        } else if (sFormat == 'yyyy/mm/dd') {
          regUseFormat = regSlashY_m_d
          // yyyy/mm/dd
        } else if (sFormat == 'yyyymmdd') {
          regUseFormat = regSlashYmd
          // yyyy/mm/dd
        } else if (sFormat == 'yyyy-MM-dd HH:mm:ss') {
          regUseFormat = regDateTime
          // yyyy/mm/dd
        } else {
          return '正确的格式应为:' + sFormat + '!\n'
        }

        if (!regUseFormat.test(sValue)) {
          return '应为日期类型!'
        }

        /**
         * 检查日期的年月日是否正确
         */
        var aryYmd = sValue.match(regUseFormat)
        var iYear = aryYmd[1]
        var iMonth = aryYmd[2]
        var iDay = aryYmd[3]

        if (iYear < 1 || iYear > 9999 || iMonth < 1 || iMonth > 12 || iDay < 1 || iDay > this.getMonthDay(iMonth - 1, iYear)) {
          return '中的日期有误!'
        }
        return ''
      } else return ''
    },
    getMonthDay (iMonth, iYear) {
      var MONTH_LENGTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      var LEAP_MONTH_LENGTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      return this.isLeapYear(iYear) ? LEAP_MONTH_LENGTH[iMonth] : MONTH_LENGTH[iMonth]
    },
    isLeapYear (iYear) {
      return ((iYear % 4 == 0) && ((iYear % 100 != 0) || (iYear % 400 == 0)))
    },
    /**
     * js获取地址栏参数值
     */	// URL识别
    getUrlParam (name) {
      var url = decodeURIComponent(window.location.search) // 获取url中"?"符后的字串
      var theRequest = new Object()
      if (url.indexOf('?') != -1) {
        var strs = url.substr(1).split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
        }
      }
      // 返回参数值或者整个参数对象
      return name ? theRequest[name] : theRequest
    },
    /**
     * 获取地理位置
     */
    getAddress (callback, item) {
      var isMobile = _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()
      if (!isMobile) {
        callback({
          value: '北京市',
          longitude: 116.397128,
          latitude: 39.916527
        }, item)
      } else {
        // 格式化地址
        function formatAddress (data) {
          var address = data.province + data.city + data.district
          address += data.streetNumber ? data.streetNumber : data.street
          return address
        };
        // 微信定位获取地址
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            var lng = res.longitude // 经度，浮点数，范围为180 ~ -180。
            var lat = res.latitude // 纬度，浮点数，范围为90 ~ -90
            var latLng = new qq.maps.LatLng(lat, lng)
            var geocoder = new qq.maps.Geocoder({
              complete: function (result) {
                var data = {
                  value: formatAddress(result.detail.addressComponents),
                  latitude: result.detail.location.lat,
                  longitude: result.detail.location.lng
                }
                callback(data, item)
              }
            })
            geocoder.getAddress(latLng)
          },
          cancel: function (res) {
            callback({
              value: '用户拒绝授权获取地理位置',
              longitude: null,
              latitude: null
            }, item)
          },
          fail: function (er) {
            callback({
              value: '获取定位失败',
              longitude: null,
              latitude: null
            }, item)
          }
        })
      }
    },
    /**
     * URL识别
     */
    checkURL (obj, replace, replaceLine) {
      if (!obj) {
        return ''
      }
      var str = obj
      if (typeof str !== 'string') {
        str = JSON.stringify(str)
      }
      if (replace) {
        // 替换转义
        str = this.getUrlHtml(str.replace(/&nbsp;/g, '').replace(/<br>/g, ''))// 兼容以前的代码
        // 替换空格
        str = str.replace(/\n/g, '<br>').replace(/\u3000/g, '&emsp;').replace(/\u0020/g, '&nbsp;')
      }
      if (!replaceLine) {
        str = str.replace(/\n/g, '<br>')
      }
      str = str.replace(/([rl("]?[rl(']?[rl(]?[=]?['"]?)(http(s)?\:\/\/[a-zA-Z0-9]+.[a-zA-Z0-9]+[a-zA-Z0-9\$\%\#\&\/\?\-\=\.\_\;\:]+)/gi, function (match, first, second, pos, origin) {
        var pre = str.substr(origin - 5, 5)
        if (first == '="' || first == "='" || first == "rl('" || first == "rl('" || first == 'rl(' ||
          pre.indexOf('="') != -1 || pre.indexOf("='") != -1 || pre.indexOf("rl('") != -1 || pre.indexOf("rl('") != -1 ||
          pre.indexOf('rl(') != -1 || pre.indexOf('t;') != -1 || pre.indexOf('rc') != -1 || pre.indexOf('9;') != -1) { // 判断url是否为元素中的属性值
          return match
        } else {
          if (_.isHefeixin()) {
            return first + "<a class='qwui-icon_URL_link'  href=" + second + '><span>网页链接</span></a>'
          } else {
            return first + "<a class='qwui-icon_URL_link' target='_blank' title=" + second + " href='" + second + "'><span>网页链接</span></a>"
          }
        }
      })
      return str
    },
    /**
     * html转换成纯文本
     */
    checkHtmlURL (obj) {
      if (!obj) {
        return ''
      }
      var str = obj
      if (typeof str !== 'string') {
        str = JSON.stringify(str)
      }
      str = str.replace(/(<a[^>]+?href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>)|([rl("]?[rl(']?[rl(]?[=]?['"]?)(http(s)?\:\/\/[a-zA-Z0-9]+.[a-zA-Z0-9]+[a-zA-Z0-9\$\%\#\&\/\?\-\=\.\_\;\:]+)/g, '【网页链接】')
        .replace(/\&nbsp;/g, ' ')
        .replace(/<img(.*?)>/g, '【图片】')
        .replace(/(<(\/)?(p|ol|em|li|ul|strong)(.*?)>)|<span(.*?)>|<\/span>|<h1(.*?)>|<\/h1>|<br\/>|<!--[\s\S]*?-->/g, '')
        .replace(/<table.*?>[\s\S]*?<\/table>/g, '【表格】')
      return str
    },
    /**
     * 过滤百度编辑器中的script标签及其里面的内容
     * @param str 需要被过滤的字符串
     */
    clearScript (str) {
      if ((/<script.*?>[\s\S]*?<\/script>/ig).test(str)) {
        str = str.replace(/<script.*?>[\s\S]*?<\/script>/ig, '')
      }
      return str
    },
    getUrlHtml (str) {
      var div = document.createElement('div')
      div.appendChild(document.createTextNode(str))
      return div.innerHTML
    },
    /**
     * 判断是否企业微信客户端或者PC端打开
     * @returns {Boolean}
     */
    isQiyeweixin () {
      var ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('wxwork') > 0) {
        return true
      }
      return false
    },
    /**
     * 判断是否企业微信客户端,包括Android和ios
     * @returns {Boolean}
     */
    isQiyeweixinApp () {
      if (this.isQiyeweixin()) {
        if (this.isIOS() || this.isAndroid()) {
          return true
        }
      }
      return false
    },
    /**
     * 是否ios终端
     */
    isIOS: function () {
      var u = navigator.userAgent.toLowerCase()
      return /iphone|ipod|ipad/i.test(u)
    },
    /**
     * 是否android终端
     */
    isAndroid () {
      var u = navigator.userAgent.toLowerCase()
      return u.indexOf('android') > -1
    },
    /**
     * 是否飞信终端
     */
    isHefeixin () {
      var ua = navigator.userAgent.toLowerCase()
      return ua.indexOf('hefeixin') > -1
    },
    /**
     * 是否微信终端（包括PC和app）
     */
    isWeChat () {
      var ua = navigator.userAgent.toLowerCase()
      return ua.match(/MicroMessenger/i) == 'micromessenger'
    },
    /**
     * 是否微信APP终端(包括企业微信)
     */
    isWeChatApp: function () { // 判断是否微信打开,true:是
      var ua = navigator.userAgent.toLowerCase()
      if ((ua.match(/MicroMessenger/i) == 'micromessenger') && ua.indexOf('windowswechat') == -1 && this.isMobileApp()) {
        return true
      } else {
        return false
      }
    },
    /**
     * 是否移动端， true: 移动端，false: pc端
     */
    isMobileApp () {
      var ua = navigator.userAgent.toLowerCase()
      return /android|webos|iphone|ipad|ipod|blackberry/i.test(ua)
    },
    /**
     * 获取微信版本号
     */
    getWeChatVersion () {
      if (this.isWeChatApp()) {
        var u = navigator.userAgent.toLowerCase()
        if (u.match(/micromessenger\/.*nettype/i)) {
          var ver = u.match(/micromessenger\/.*nettype/i)[0]
          return ver.replace('micromessenger/', '').replace('nettype', '').trim()
        }
      }
      return ''
    },
    /**
     * 判断是否校友会或者企业微信用户
     * @param obj
     */
    judgeClient (obj) {
      var url = window.location.href
      if ((this.isWeChatApp() && url.indexOf('wxqyh') >= 0)) {
        return false
      }
      $('#aLink').click()
      return true
    },
    /**
     * 媒体文件预览
     */
    wxqyh_previewFile: function (is, url, fileName, fileExt) {
      let self = this
      var href = _.fileDownURL + _.downFileURL + encodeURIComponent(url) + '&fileFileName=' + encodeURIComponent(fileName)
      if (/DOC|DOCX|PPT|PPTX|XLS|XLSX|TXT|RTF|XML|ZIP|RAR/.test(fileExt) && _.is_use_yongzhong) {
        axios.post(_.baseURL + '/portal/url/encode/getEncodeUrl.do', {
          url: href
        }).then(function (result) {
          if (result.code === '0') {
            const newHref = _.yongzhong_url + result.data.encodeUrl
            self.isWeChatApp() ? window.location.href = newHref : window.open(newHref)
          } else {
            _.alert('i18n.notice', result.desc)
          }
        })
        return
      }

      if (/MP3|AMR|MP4|WMA/.test(fileExt) && this.isWeChatApp()) {
        href = _.baseURL + '/jsp/wap/uploadfile/viewer.jsp?type=' + fileExt + '&url=' + href
      }
      if (fileExt === 'PDF') {
        href = _.baseURL + '/jsp/wap/learnonline/generic/web/viewer.html?url=' + href
      }
      this.isWeChatApp() ? location.href = href : window.open(href)
    },
    /**
     * 下载媒体文件
     */
    wxqyh_downloadFile: function (id, url, fileName, agentCode) {
      var href = _.fileDownURL + _.downFileURL + encodeURIComponent(url) + '&fileFileName=' + encodeURIComponent(fileName)
      if (this.isWeChatApp()) {
        // 外部单无需调取接口
        if (window.location.href.indexOf('/open/') > -1) {
          let msg = this.isIOS() ? 'i18n.downloadDeny' : 'i18n.checkDeny'
          _.alert('i18n.notice', msg)
          return
        } else {
          _.ajax({
            url: _.baseURL + '/portal/imageupload/imageUploadAction!doSendFileToMe.action?mediaId=' + id + '&agent=' + (agentCode || dataBase.wxqyh_uploadfile.agent),
            type: 'GET',
            dataType: 'json',
            success: function (result) {
              if (result.code == '0') {
                _.alert('i18n.warmNotice', 'i18n.applicationMain', {
                  primaryBtn: {name: 'i18n.confirm', callBack: wx.closeWindow}, defaultBtn: {name: 'i18n.cancel', callBack: null}
                })
              } else {
                _.alert('i18n.notice', result.desc)
              }
            }
          })
        }
      } else {
        if (this.isIOS()) {
          _.alert('i18n.notice', 'i18n.downloadDeny')
          return
        }
        window.open(href)
      }
    },
    /**
     * 判断某应用是否托管
     * @param agentCode
     */
    isTrustAgent (agentCode) {
    // 判断考试测评是否有托管， 无托管点击考试内容则进考试引导页， 有的话直接进页面
      _.ajax({
        url: _.baseURL + '/portal/application/application!ajaxIsTrustAgentForPortal.action',
        type: 'POST',
        data: {'agentCode': agentCode},
        success: function (result) {
          if (result.code == '0') {
          // 如果没有托管，进引导页
            return result.data.isTrust
          } else {
            return false
          }
        },
        error: function () {
          return false
        }
      })
    },
    /**
     * 处理图片src,添加compressURL前缀
     */
    filterCompressURL (url) {
      if (!url) {
        return ''
      }
      return url.indexOf('http') != -1 ? url : _.compressURL.split('/compress').join('') + url
    },
    /*
    -----------------------------------------------水印功能----------------------------------------------
    */
    /**
     * 获取用户只允许拍照上传设置
     */
    getUserSetting (agentCode, index) { // index,如果你的应用只配置一个，那么可以传null,如果多个，请传你需要获取的位数
      _.ajax({
        url: _.baseURL + '/portal/intercalateAction!getPhotoSetting.action',
        type: 'GET',
        data: {agentCode: agentCode},
        success: function (result) {
          if (result.code == '0') {
            if (result.data.is_photograph) {
              var isPhotographs = result.data.is_photograph
              if (isPhotographs.indexOf('|') >= 0) {
                var temp = isPhotographs.split('|')
                if (temp[index] == '1') {
                  this.chooseImageTypes = ['camera']
                }
              } else {
                if (isPhotographs == '1') {
                  this.chooseImageTypes = ['camera']
                }
              }
            }
          }
        }
      })
    },
    /*
    -----------------------------------------------数据格式处理----------------------------------------------
    PS:字符串、获取时间等
    */
    /**
     * 去除字符串左右空格
     */
    trimLR (sendComment) {
      sendComment = sendComment.replace(/(^\s*)/g, '')
      // 去除右空格
      sendComment = sendComment.replace(/(\s*$)/g, '')
      return sendComment
    },
    /**
     * 将金额转成万为单位，保留两位小数
     * @param num 金额
     * @returns {string} 转换后的金额
     */
    toTenThousands (num) {
      var intPart = num.toString().split('.')[0]
      if (intPart.length > 1) {
        // 整数去前导0
        intPart = intPart.replace(/(^0+)/, '')
      }

      if (intPart.length < 3) {
        // 小于100块钱，直接忽略
        return 0
      }
      intPart = intPart.substring(0, intPart.length - 2)
      if (intPart.length < 3) {
        intPart = '0.' + intPart
      } else {
        intPart = intPart.substring(0, intPart.length - 2) + '.' + intPart.substring(intPart.length - 2, intPart.length)
      }

      return this.toThousands(intPart)
    },
    /**
     * 将金额格式化为每3位整数一组的形式
     * 如: 12,123,456,789.99
     * @param num 金额
     * @returns {string} 格式化后的金额
     */
    toThousands (num) {
      var list = num.toString().split('.')
      var intPart = list[0]
      var decPart = list[1]

      if (intPart.length > 1) {
      // 整数去前导0
        intPart = intPart.replace(/(^0+)/, '')
      }

      if (intPart > 3) {
      // 整数部分加','
        intPart = intPart.replace(/\B(?=(\d{3})+$)/g, ',')
      }

      var result = intPart
      if (list.length > 1) {
        if (intPart.length == 0) {
        // 小数点前没有0,我们自动加上0
          result = '0'
        }
        // 加上小数点
        result += '.'

        if (decPart != undefined && decPart.length > 0) {
        // 加上小数
          result += decPart
        }
      }
      return result
    },
    /**
     * 过滤掉除数字和小数点以外的字符,小数点保留两位
     * @param str 一条字符串
     * @returns {string} 过滤后的字符串
     */
    moneyFilter (str) {
    // 过滤掉非法字符(也会过滤掉',')
      var items = str.match(/\d+|\.|。/g)
      var num
      if (items == null) {
        return ''
      } else {
        num = items.join('')
      }

      var result = '', dec = ''
      num = num.replace(/。/g, '.')// 兼容中文输入法
      var list = num.split('.')

      if (list[0].length > 10) {
      // double的有效位数是15,小数位分了两位,故整数位限制为13位
        result = list[0].substring(0, 10)
      } else {
        result = list[0]
      }

      if (list.length > 1) {
      // 小数限制为两位
        if (list[1].length > 2) {
          dec = list[1].substring(0, 2)
        } else {
          dec = list[1]
        }

        // 加上小数点
        result = result + '.'

        if (dec.length > 0) {
        // 加上小数
          result = result + dec
        }
      }

      return result
    },
    /**
     * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
     * @param num1被乘数 | num2乘数
     */
    numMulti (num1, num2) {
      var baseNum = 0
      try {
        baseNum += num1.toString().split('.')[1].length
      } catch (e) {
      }
      try {
        baseNum += num2.toString().split('.')[1].length
      } catch (e) {
      }
      return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum)
    },
    /**
     * 减法函数，用来得到精确的减法结果
     * @param arg1
     * @param arg2
     * @returns {number} arg1减去arg2的精确结果
     */
    accSub (arg1, arg2) {
      var r1, r2, m
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(2))
    },

    /**
     * 格式化金钱:Fixed保留的位数：以分为单位，转化为元
     */
    formatMoney (strNumber, Fixed) {
      var returnStr = ''
      var tmpStr = parseFloat(strNumber).toFixed(Fixed)
      var splitIndex = 0
      var beginPoint = false
      for (var i = tmpStr.length - 1; i >= 0; i--) {
        if (beginPoint) {
          if (splitIndex == 3) {
            returnStr = tmpStr[i] + ',' + returnStr
            splitIndex = 1
          } else {
            returnStr = tmpStr[i] + returnStr
            splitIndex = splitIndex + 1
          }
        } else if (tmpStr[i] == '.') {
          beginPoint = true
          returnStr = tmpStr[i] + returnStr
        } else {
          returnStr = tmpStr[i] + returnStr
        }
      }
      return returnStr
    },
    /*
    ------------------------------地理定位\扫码------------------------------------
    PS:字符串、获取时间等
    */
    /**
     * 是否可调用扫码
     * @returns {boolean}
     */
    isGetCode () {
      if (this.isHefeixin()) {
        return true
      }
      return false
    },

    /**
     * 是否可使用定位
     */
    isGetLocation () {
      if (this.isWeChatApp() || this.isHefeixin()) {
        return true
      }
      return false
    },
    /**
     * 调取扫一扫接口
     * @param {Object} backFunc
     */
    getQRContent (backFunc) {
      var d = {}
      d.backFunc = backFunc
      if (isAndroid()) {
        window.WebContainer.getQRContent(JSON.stringify(d))
      } else {
        navigator.WebContainer.getQRContent(JSON.stringify(d))
      }
    },
    // 获取时间:不是今年的返回年月日,当年的返回月和天,当日的返回时和分
    chooseImageTypes: ['album', 'camera'], // 控制图片是拍照还是相册选择，默认两个都有
    /**
     * 不是今年的返回年月日,今年的返回月和天
     */
    getFormatListTime: function (str) {
      if (str) {
        var str = str.replace(/-/g, '/')
        var nowTime = new Date(),
          time = new Date(str),
          nowYear = +nowTime.getFullYear(),
          getFullYear = time.getFullYear() < 10 ? '0' + time.getFullYear() : time.getFullYear(),
          getMonth = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1),
          getDate = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
        if (getFullYear != nowYear) {
          return getFullYear + '-' + getMonth + '-' + getDate
        } else {
          return getMonth + '-' + getDate
        }
      }
    },
    /**
     * 不是今年的返回年月日,当年的返回月和天,当日的返回时和分
     */
    getFormatTime: function (str) {
      if (str) {
        var str = str.replace(/-/g, '/')
        var nowTime = new Date(),
          time = new Date(str),
          nowYear = +nowTime.getFullYear(),
          getFullYear = time.getFullYear() < 10 ? '0' + time.getFullYear() : time.getFullYear(),
          getMonth = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1),
          getDate = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
        if (getFullYear != nowYear) {
          return getFullYear + '-' + getMonth + '-' + getDate
        } else {
          if (nowTime.getMonth() == time.getMonth() && nowTime.getDate() == time.getDate()) {
            var getHours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
            var getMinutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
            return getHours + ':' + getMinutes
          } else {
            return getMonth + '-' + getDate
          }
        }
      }
    },
    /**
     * 不是今年的返回年月日时分,当年的返回月日时分,当日的返回时和分
     */
    getFormatTimeCW: function (str) {
      if (str) {
        var str = str.replace(/-/g, '/')
        var nowTime = new Date(),
          time = new Date(str),
          nowYear = +nowTime.getFullYear(),
          getFullYear = time.getFullYear() < 10 ? '0' + time.getFullYear() : time.getFullYear(),
          getMonth = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1),
          getDate = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(),
          getHours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours(),
          getMinutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
        if (getFullYear != nowYear) {
          return getFullYear + '-' + getMonth + '-' + getDate + ' ' + getHours + ':' + getMinutes
        } else {
          if (nowTime.getMonth() == time.getMonth() && nowTime.getDate() == time.getDate()) {
            return getHours + ':' + getMinutes
          } else {
            return getMonth + '-' + getDate + ' ' + getHours + ':' + getMinutes
          }
        }
      }
    },
    /**
     * 获取当前年月日时分
     */
    getCurrentTime: function () {
      var nowTime = new Date(),
        getFullYear = nowTime.getFullYear() < 10 ? '0' + nowTime.getFullYear() : nowTime.getFullYear(),
        getMonth = (nowTime.getMonth() + 1) < 10 ? '0' + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1),
        getDate = nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate(),
        getHours = nowTime.getHours() < 10 ? '0' + nowTime.getHours() : nowTime.getHours(),
        getMinutes = nowTime.getMinutes() < 10 ? '0' + nowTime.getMinutes() : nowTime.getMinutes()
      return getFullYear + '-' + getMonth + '-' + getDate + ' ' + getHours + ':' + getMinutes
    },
    /**
     * 获取当前年、月、日、时、分、秒、周期的对象（以对象形式返回）
     */
    getCurrentDate () {
      var date = new Date()
      var currentTime = {}
      currentTime.year = date.getFullYear()
      currentTime.month = date.getMonth() + 1
      currentTime.date = date.getDate()
      currentTime.day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]
      currentTime.month = this.month < 10 ? '0' + this.month : this.month
      currentTime.date = this.date < 10 ? '0' + this.date : this.date
      currentTime.hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      currentTime.minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      currentTime.second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

      return currentTime
    },
    /**
     * 格式化日期，传入日期对象Date， 再传入想要转化的日期模板字符串
     * 如 formatDate(new Date(time),'yyyy-MM-dd hh:mm:ss')；分隔符号可以修改，但对应字母一定要正确(月份大写M,分钟小写m)。
     */
    getFormatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          var str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
        }
      }
      return fmt
    },
    // 封装ajax
    ajax: function () {
      var argument = arguments[0]
      axios({
        method: argument.type,
        url: argument.url,
        data: argument.data
      }).then(function (response) {
        if (response) {
          if (argument.success) {
            argument.success(response)
          }
        }
      })
    },

    showLoading: function (text, isShow) { // 加载中
      if (isShow != null && isShow != undefined && typeof (isShow) === 'boolean') {
        dataBase.isShow = isShow
      } else {
        dataBase.isShow = true
      }
      dataBase.loading.show = true
      dataBase.loading.icon = 'icon_loading'
      dataBase.loading.text = text || 'i18n.loading'
    },
    hideLoading: function () {
      dataBase.isShow = true
      dataBase.loading.show = false
      dataBase.loading.icon = ''
      dataBase.loading.text = ''
    },
    /**
     * text: 文本内容，type:true自定义内容和图标、false:默认为勾图标，icon:图标类，time 关闭的过度时间
     */
    tooltips_succeed: function (text, type, icon, time = 1000) { // 提交成功、删除成功
      if (text) {
        dataBase.loading.show = true
        dataBase.loading.text = text
        dataBase.loading.icon = type && icon != null ? icon : 'qwui-loading_icon_ok'
        setTimeout(function () {
          dataBase.loading.show = false
          dataBase.loading.icon = ''
          dataBase.loading.text = ''
        }, time)
      }
    },
    // alert弹框
    /** title参数必传，没有则传空字符串，否则默认为title，btnConfig中的callBack需为匿名函数，不能直接用函数名 */
    alert: function (title, content, btnConfig) {
      dataBase.dialogConfig.show = false
      dataBase.dialogConfig.title = title || ''
      dataBase.dialogConfig.btnConfig = {}
      dataBase.dialogConfig.content = null
      dataBase.dialogConfig.canClose = true
      if (Object.prototype.toString.call(content) === '[object String]') {
        dataBase.dialogConfig.content = content || ''
      }
      if (btnConfig && Object.prototype.toString.call(btnConfig) === '[object Object]') {
        dataBase.dialogConfig.btnConfig = btnConfig
      } else {
        dataBase.dialogConfig.btnConfig = {
          primaryBtn: {name: 'i18n.confirm', callBack: null},
          defaultBtn: {name: '', callBack: null} // 主操作按钮
        }
      }

      dataBase.dialogConfig.type = 'dialog1'
      dataBase.dialogConfig.show = true
    },
    alertError: function (text, index) {
      // 弹窗操作失误提示，text:"提示内容"，canClose："执行回调后是否可自动关闭弹窗，false为进行ajax请求手动关闭，true:自动关闭"
      if (isNaN(Number(index))) {
        return
      }
      if (dataBase.dialogConfig.show && text) {
        dataBase.dialogConfig.canClose = false
        dataBase.dialogConfig.content[index].error = text
      } else {
        dataBase.dialogConfig.content[index].error = ''
        dataBase.dialogConfig.canClose = true
      }
    },
    showMsg: function (title, content, btnConfig) {
      dataBase.dialogConfig.show = false
      dataBase.dialogConfig.title = title || ''
      dataBase.dialogConfig.canClose = true
      dataBase.dialogConfig.content = []
      if (content && Object.prototype.toString.call(content) === '[object Array]') {
        dataBase.dialogConfig.content = content
      }
      if (btnConfig) {
        dataBase.dialogConfig.btnConfig = btnConfig
      } else {
        dataBase.dialogConfig.btnConfig = {
          primaryBtn: {name: '', callBack: null},
          defaultBtn: {name: '', callBack: null} // 主操作按钮
        }
      }
      dataBase.dialogConfig.type = 'dialog2'
      dataBase.dialogConfig.show = true
    },
    /**
     * 隐藏弹窗
     * @returns {Boolean}
     */
    showMsgHide: function () {
      dataBase.dialogConfig.show = false
      dataBase.dialogConfig.title = ''
      dataBase.dialogConfig.type = ''
      dataBase.dialogConfig.errorTip = {}
      dataBase.dialogConfig.content = []
      dataBase.dialogConfig.btnConfig = {}
    },
    /**
     * 判断审批状态方法，返回一个包含class和name对象,active:true 样式高度为20px，false:18px
     * @returns {Boolean}
     */
    append_status: function (name, active) {
      let status = {}
      if (name) {
        var statusObject = [
          {name: '已结束|已关闭|已过期|Over|Closed|Expired', class: 'status_gray'},
          {name: '已审批|已销假|已完成|Approved|Sold out false|Completed', class: 'status_green'},
          {name: '退审|逾期|Retired', class: 'status_red'},
          {name: '审批中|Approving', class: 'status_blue'},
          {name: '已派车|', class: 'status_orange'}
        ]
        active = !!active
        for (var i = 0; i < statusObject.length; i++) {
          if (statusObject[i].name.indexOf(name) != -1) {
            status = {
              name: name,
              class: statusObject[i].class,
              active: active
            }
            break
          }
        }
      }
      return status
    },
    openSelectUser: function (el) { // 显示选人界面
      dataBase.selectConfig.show = true
      dataBase.selectConfig.signIndex = el
    },

    /*
    ---------------页面路由跳转初始化----------------
    PS:页面跳转初始化关闭弹窗、选人数据等公用数据
    */
    initializedData: function () {
      // 初始化弹窗对话框
      dataBase.dialogConfig.show = false
      dataBase.dialogConfig.title = ''
      dataBase.dialogConfig.type = ''
      dataBase.dialogConfig.content = null
      dataBase.dialogConfig.errorTip = ''
      // end

      // 初始化负责人、相关人
      dataBase.selectConfig = {
        show: false,
        signIndex: '',
        selectList: {
          'toPersonList': {
            'title': '',
            'loadLast': {
              'show': false,
              'name': ''
            },
            'isOptional': true,
            'selectType': 'user',
            'userName': 'incharges',
            'userSelected': [],
            'tagSelected': [],
            'deptSelected': [],
            'deptSelectedShow': true,
            'callBack': {
              'confirm': null
            }
          },
          'ccPersonList': {
            'title': '',
            'loadLast': {
              'show': false,
              'name': ''
            },
            'isOptional': true,
            'selectType': 'user',
            'userName': 'relatives',
            'userSelected': [],
            'tagSelected': [],
            'deptSelected': [],
            'deptSelectedShow': true,
            'callBack': {
              'confirm': null
            }
          },
          'users': {
            'title': '',
            'selectType': 'user',
            'userName': 'relatives',
            'userSelected': [],
            'callBack': {
              'confirm': null
            }
          },
          'depts': {
            'title': '',
            'selectType': 'dept',
            'deptSelected': [],
            'isonly': false,
            'callBack': {
              'confirm': null
            }
          }
        }

      }
    },
    /**
     * 显示历史选人数据，重新编辑或复制页面
     */
    historySelectPerson: function (el, data) {
      if ((el == 'toPersonList' || el == 'ccPersonList') && Object.prototype.toString.call(data) === '[object Array]') {
        for (var i = 0; i < data.length; i++) {
          data[i].id = data[i].userId
        }
        dataBase.selectConfig.selectList[el].userSelected = data
      }
    },
    /**
     * /@人后把选择的人添加到相关人中
     */
    appendRelativePerson: function (oldPerson, obj) {
      var newObj = []
      if (oldPerson.userSelected && Object.prototype.toString.call(oldPerson.userSelected) === '[object Array]' && obj.data && Object.prototype.toString.call(obj.data) === '[object Array]') {
        if (oldPerson.userSelected.length == 0) {
          newObj = obj.data
        } else {
          newObj = oldPerson.userSelected
          for (var i = 0; i < obj.data.length; i++) {
            var hasSame = false
            for (var j = 0; j < oldPerson.userSelected.length; j++) {
              if (obj.data[i].userId == oldPerson.userSelected[j].userId) {
                hasSame = true
                break
              }
            }
            if (!hasSame) {
              newObj.splice(0, 0, obj.data[i])
            }
          }
        }
      }
      return newObj
    },

    /**
     * *设置头像，默认头像
     */
    // settingHeadPic(headPic){
    //   if(headPic === '0' || headPic === '' || headPic === 0 || headPic === null){
    //     return require('@/assets/images/touxiang02.png')
    //   }
    //   return headPic
    // }
  }
  w.qwy = qwy
})(window)

// 局部滚动事件指令
Vue.directive('scroll', {
  bind: function (el, binding) {
    var ele = el
    ele.addEventListener('scroll', function () {
      var fun = binding.value
      fun(ele)
    })
  }
})

// window滚动事件指令
Vue.directive('windowscroll', {
  bind: function (el, binding) {
    var ele = el
    window.addEventListener('scroll', function () {
      var fun = binding.value
      fun(ele)
    })
  }
})

// 定义获得了焦点指令
Vue.directive('focus', {
  update: function (el, binding) {
    if (binding.value) {
      el.focus()
    }
  }
})
Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[ k ]) : (('00' + o[ k ]).substr(('' + o[ k ]).length))) }
  }
  return fmt
}
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[ i ] == val) return i
  }
  return -1
}
Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
// 数组去重
Array.prototype.unique = function () {
  var n = {}, r = [] // n为hash表，r为临时数组
  for (var i = 0; i < this.length; i++) // 遍历当前数组
  {
    if (!n[ this[ i ] ]) // 如果hash表中没有当前项
    {
      n[ this[ i ] ] = true // 存入hash表
      r.push(this[ i ]) // 把当前数组的当前项push到临时数组里面
    }
  }
  return r
}
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return this.replace(new RegExp(reallyDo, (ignoreCase ? 'gi' : 'g')), replaceWith)
  } else {
    return this.replace(reallyDo, replaceWith)
  }
}

// 数组的计算最大值和平均，最小值，和
function cacl (arr, callback) {
  var ret
  for (var index = 0; index < arr.length; index++) {
    ret = callback(arr[ index ], ret)
  }
  return ret
}

Array.prototype.max = function () {
  return cacl(this, function (item, max) {
    if (!(max > item)) {
      return item
    } else {
      return max
    }
  })
}
Array.prototype.min = function () {
  return cacl(this, function (item, min) {
    if (!(min < item)) {
      return item
    } else {
      return min
    }
  })
}
Array.prototype.sum = function () {
  return cacl(this, function (item, sum) {
    if (typeof (sum) === 'undefined') {
      return item
    } else {
      return sum += item
    }
  })
}
Array.prototype.avg = function () {
  if (this.length == 0) {
    return 0
  }
  return this.sum(this) / this.length
}
//
// var theArray=[1,-2,4,9,15];
// console.log(theArray.max());
// console.log(theArray.min());
// console.log(theArray.sum());
// console.log(theArray.avg());
