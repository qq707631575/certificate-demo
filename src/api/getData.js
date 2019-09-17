import axios from 'axios'

// 封装接口方法
// params url: 接口url
// params isLoad：是否需要loading过程
// params agentCode：默认AgentCode
let getData = (() => {
    return (url, isLoad = true, _agentCode) => {
      const SUCCESS_CODE = '0'
      return (data, cb, errCb = null, showErrAlert = true, privateIsLoad = true) => {
        if (isLoad && privateIsLoad) { _.showLoading('') }
  
        if (_agentCode) { data.belongAgent = _agentCode }
  
        axios.post('https://qy.do1.com.cn/wxqyh' + url, { ...data })
          .then(result => {
            isLoad && privateIsLoad && _.hideLoading('')
            // 公共axios拦截错误在报错404时, 此函数依然会跑到result.code报错
            // 如果result为undefined 直接返回
            if (!result) { return }
  
            if (result.code === SUCCESS_CODE) {
              cb && cb(result.data)
            } else {
            // 默认错误信息需要弹窗, 可设置无需弹窗
              if (showErrAlert) {
                _.alert('提示', result.desc, {
                  primaryBtn: {
                    name: 'i18n.confirm',
                    callBack () {
                      if (errCb) { errCb(result) }
                    }
                  }, // 确认按钮
                  defaultBtn: {
                    name: '',
                    callBack: null
                  }// 主操作按钮
                })
              } else {
                if (errCb) { errCb(result) }
              }
            }
          })
      }
    }
  })()

// 获取授权地址
let getWxUrl = getData('/op/hr/learn/getWxUrl.do', false, 'learnonline')

// 获取外部用户信息
let getOpenInfo = getData('/op/hr/learn/getOpenInfo.do', true, 'learnOnline')

export {
    getWxUrl,
    getOpenInfo
}