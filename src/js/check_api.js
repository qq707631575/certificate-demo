import wx from 'weixin-js-sdk'
function checkApi () {

}
checkApi.prototype = {
  urls: window.location.href.split('#')[0].split('%23')[0],
  wxqyh_is_debug: false,
  wxqyh_isOpen: false,
  wxqyh_checkjsapi_url: '', // 微信检验URL
  wxqyh_wxjsapi: {
    checkjsapi_config: false, // 验证签名是否成功
    is_check_config_error: false, // 是否验证失败，默认成功
    ready: null,
    error: null
  },
  wxqyh_isUsePublic: '', // jsapi验证方法返回的是否使用公用corpid
  wxJsCheckHasResult: false, // 微信js认证是否有返回
  checkJsApi_image: false, // 验证微信客户端是否可以使用上传图片的jssdk
  dataForWeixin: {
    appId: '',
    MsgImg: '',
    TLImg: '',
    url: '',
    title: '',
    desc: '',
    fakeid: '',
    callback: null
  },
  count: 0,
  init: function (wxqyh_isOpen) {
    if (wxqyh_isOpen == 'open') {
      this.wxqyh_isOpen = true
    }
    if (!_.isWeChat()) {
      if (_.isHefeixin()) {
        var e = this.wxqyh_wxjsapi.ready
        e && e.call(e, null, null)
      }
      return false
    }
    this.wxqyh_is_debug = _.getUrlParam('isDebug')
    if (this.wxqyh_is_debug) {
      alert('wx.ready开始')
    }

    var self = this
    wx.ready(function () { // 不管微信成功失败，都会调用此方法
      self.wxJsCheckHasResult = true
      if (self.wxqyh_is_debug) {
        alert('wx.ready开始执行')
      }
      if (_.isWeChatApp()) {
        wx.checkJsApi({
          jsApiList: ['chooseImage', 'onHistoryBack'],
          success: function (res) {
            if (res.checkResult.chooseImage) {
              self.checkJsApi_image = true
            } else {
              self.checkJsApi_image = false
            }
          }
        })
        // 证明第一次ready
        if (!self.wxqyh_wxjsapi.checkjsapi_config) {
          self.wxqyh_wxjsapi.checkjsapi_config = true
          var e = self.wxqyh_wxjsapi.ready
          e && e.call(e, null, null)
        }
      }
      self.setOnMenuShare()
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
      // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    })
    wx.error(function (res) {
      self.wxJsCheckHasResult = true
      if (_.isWeChatApp()) {
        self.checkJsApi_image = false
        self.wxqyh_wxjsapi.is_check_config_error = true
        if (self.count == 0) {
          var e = self.wxqyh_wxjsapi.error
          e && e.call(e, null, null)
        }
      }
      if (res.errMsg.indexOf('signature') != -1) {
        if (self.count == 0) {
          self.errorFuntion(res.errMsg)
        } else {
          setTimeout(this.errorFuntion, 1000)
        }
      }
    })

    self.wxqyh_checkjsapi_url = _.baseURL + '/portal/weixinjs/weixinjsAction!authorize.action'

    var dataParams = {url: self.urls, isOpen: self.wxqyh_isOpen}
    if(self.urls.indexOf('meetScreen.html') > -1){
      dataParams.isOpen = true
    }
    _.ajax({
      url: self.wxqyh_checkjsapi_url,
      type: 'POST',
      data: dataParams,
      success: function (result) {
        if (result.code == '0') {
          self.wxqyh_isUsePublic = result.data.isUsePublic
          setTimeout(function () { self.gotoWeixinConfigRepeat(result.data.apijs) }, 5000)
          self.gotoWeixinConfig(result.data.apijs)
        } else {
          if (self.wxqyh_is_debug) {
            alert('验证微信js-sdk失败：' + JSON.stringify(result))
          }
          self.checkJsApi_image = false
          if (_.isWeChatApp()) {
            var e = self.wxqyh_wxjsapi.error
            self.wxqyh_wxjsapi.is_check_config_error = true
            if (e != null) {
              e && e.call(e, null, null)
            }
          }
        }
      },
      error: function (err) {
        if (self.wxqyh_is_debug) {
          alert('提示', '验证微信js-sdk网络异常：' + JSON.stringify(err))
        }
        self.checkJsApi_image = false
        if (_.isWeChatApp()) {
          self.wxqyh_wxjsapi.is_check_config_error = true
          var e = self.wxqyh_wxjsapi.error
          if (e != null) {
            e && e.call(e, null, null)
          }
        }
      }
    })
  },
  // 设置分享的属性
  setDataForWeixinValue (title, img, summary, shareUrl, successCallback, cancelCallback) {
    if (img != '' && img != _.compressURL) {
      this.dataForWeixin.MsgImg = img
    } else {
      this.dataForWeixin.MsgImg = window.document.location.origin + _.baseURL + '/vp/static/images/newsmallLogo.png' // 如果图片为空，用默认图片，域名+路径
    }
    this.dataForWeixin.successCallback = successCallback
    this.dataForWeixin.cancelCallback = cancelCallback
    title = title.replace(/(^\s*)|(\s*$)/g, '')
    if (title != '') {
      this.dataForWeixin.title = title
    }
    summary = summary.replace(/(^\s*)|(\s*$)/g, '')
    if (summary != '') {
      this.dataForWeixin.desc = summary
    }
    if (shareUrl.indexOf('corp_id=') == -1) {
      if (shareUrl.indexOf('?') == -1) {
        shareUrl += '?'
      } else {
        shareUrl += '&'
      }
      shareUrl += 'corp_id=' + wxqyhConfig.orgConfigInfo.corpId
      if (shareUrl.indexOf('&agentCode=') == -1) {
        shareUrl += '&agentCode=' + dataBase.wxqyh_uploadfile.agent
      }
    }
    this.dataForWeixin.url = shareUrl.split('#')[0] + '#' + shareUrl.split('#')[1]
    if (_.isWeChat()) { // 手机端
      try {
        this.setOnMenuShare()
      } catch (e) {
      }
    }
  },
  setOnMenuShare: function () {
    if (!this.dataForWeixin.title && !this.dataForWeixin.url) {
      return
    }
    var self = this
    wx.onMenuShareAppMessage({
      title: self.dataForWeixin.title, // 分享标题
      desc: self.dataForWeixin.desc, // 分享描述
      link: self.dataForWeixin.url.split('#')[0] + '#' + self.dataForWeixin.url.split('#')[1], // 分享链接
      imgUrl: self.dataForWeixin.MsgImg, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
        if (self.dataForWeixin.successCallback) {
          self.dataForWeixin.successCallback()
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        if (self.dataForWeixin.cancelCallback) {
          self.dataForWeixin.cancelCallback()
        }
      }
    })
    wx.onMenuShareTimeline({
      title: self.dataForWeixin.title, // 分享标题
      link: self.dataForWeixin.url.split('#')[0] + '#' + self.dataForWeixin.url.split('#')[1], // 分享链接
      imgUrl: self.dataForWeixin.MsgImg, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        if (self.dataForWeixin.successCallback) {
          self.dataForWeixin.successCallback()
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        if (self.dataForWeixin.cancelCallback) {
          self.dataForWeixin.cancelCallback()
        }
      }
    })
    wx.onMenuShareQQ({
      title: self.dataForWeixin.title, // 分享标题
      link: self.dataForWeixin.url.split('#')[0] + '#' + self.dataForWeixin.url.split('#')[1], // 分享链接
      imgUrl: self.dataForWeixin.MsgImg, // 分享图标
      desc: self.dataForWeixin.desc, // 分享描述
      success: function () {
        // 用户确认分享后执行的回调函数
        if (self.dataForWeixin.successCallback) {
          self.dataForWeixin.successCallback()
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        if (self.dataForWeixin.cancelCallback) {
          self.dataForWeixin.cancelCallback()
        }
      }
    })
    wx.onMenuShareWeibo({
      title: self.dataForWeixin.title, // 分享标题
      link: self.dataForWeixin.url.split('#')[0] + '#' + self.dataForWeixin.url.split('#')[1], // 分享链接
      imgUrl: self.dataForWeixin.MsgImg, // 分享图标
      desc: self.dataForWeixin.desc, // 分享描述
      success: function () {
        // 用户确认分享后执行的回调函数
        if (self.dataForWeixin.successCallback) {
          self.dataForWeixin.successCallback()
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
        if (self.dataForWeixin.cancelCallback) {
          self.dataForWeixin.cancelCallback()
        }
      }
    })
  },
  errorFuntion (errMsg) {
    var self = this
    _.ajax({
      url: self.wxqyh_checkjsapi_url,
      type: 'GET',
      data: {url: self.urls, errMsg: errMsg, isOpen: self.wxqyh_isOpen},
      dataType: 'json',
      success: function (result) {
        if (result.code == '0') {
          self.wxqyh_wxjsapi.is_check_config_error = false
          self.wxqyh_isUsePublic = result.data.isUsePublic
          self.gotoWeixinConfig(result.data.apijs)
        } else if (self.count < 2) {
          self.count = self.count + 1
          setTimeout(self.errorFuntion, 1000)
        }
      }
    })
  },
  gotoWeixinConfigRepeat (obj) {
    var self = this
    if (this.count < 4 && !this.wxJsCheckHasResult) {
      // 没有返回，0.5秒后重试，最多重复3次
      if (this.wxqyh_is_debug) {
        alert('wx.config 第' + (this.count + 1))
      }
      setTimeout(function () { self.gotoWeixinConfigRepeat(obj) }, 2000)
      this.gotoWeixinConfig(obj)
    }
  },
  gotoWeixinConfig (obj) {
    this.count = this.count + 1
    var apijs = obj
    if (apijs == null) {
      return
    }
    if (this.wxqyh_is_debug) {
      alert(JSON.stringify(apijs))
    }
    wx.config({
      beta: true,
      debug: this.wxqyh_is_debug,
      appId: apijs.corpId,
      timestamp: apijs.timestamp,
      nonceStr: apijs.noncestr,
      signature: apijs.signature,
      jsApiList: ['chooseInvoice', 'getSupportSoter', 'requireSoterBiometricAuthentication', 'agentConfig',
        'invoke',
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareWechat',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard',
        'openEnterpriseChat',
        'onHistoryBack',
        'startWecast',
        'bioassayAuthentication',
      ]
    })
  }
}
export default new checkApi()
