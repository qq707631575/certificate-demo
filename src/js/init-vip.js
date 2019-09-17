
import axios from 'axios'
import baseURL from './baseURL_config'
// 系统的配置信息
var wxqyhConfigReadyFunctionArray = []// 系统配置的ready function数组
var wxqyhConfigReadyFunction = function (fun) {
  if (wxqyhConfig.config_state > 0) {
    fun()
  } else {
    wxqyhConfigReadyFunctionArray.push(fun)
  }
}
window.wxqyhConfig = {
  config_state: 0, // 0表示初始状态，尚未更新数据;1表示使用缓存;5重置
  is_vip: false, // 是否vip
  is_pay_vip: false, // 是不是支付VIP
  is_authen_org: false, // 是不是认证企业
  is_in_vip_black_list: false, // 是否在VIP黑名单
  is_in_vip_white_list: false, // 是否在VIP白名单
  myInterfaceList: { // 金卡接口权限

  },
  vip_grade: 0,
  vip_max_person: 100, // VIP最大人数限制
  follow_user_member: 100, // 当前通讯录人数,
  is_over_vip_max_person: false, // 是否超过VIP人数限制
  upload_image_max: 1, // 上传图片大小控制
  upload_qydisk_image_silver_max: 5, // 云盘银卡VIP图片大小控制
  upload_image_vip_max: 10, // 金卡上传图片大小控制
  upload_voice_max: 2, // 上传声音大小控制
  upload_video_max: 10, // 上传视频大小控制
  upload_file_max: 10, // 上传文件大小控制
  upload_qydisk_file_sliver_max: 20, // 云盘银卡VIP文件大小控制
  upload_file_vip_max: 50, // 金卡用户上传文件大小控制
  is_qiweiyun: true, // 是否企微云平台，false表示私有化
  is_use_yongzhong: false, // 是否使用永中云转换预览
  yongzhong_url: '', // 永中预览url
  orgConfigInfo: {// 机构的一些信息
    orgName: '',
    orgLogo: '',
    isCooperation: false, // 是否合作商
    type: 1, // 合作商类型，1渠道，2金卡
    createTime: ''
  },
  org_config: {}, // 机构配置
  orgSettingInfo: {
    isShowOpenFooter: '1', // 是否显示外部分享底部：1是；0关闭；默认开启
    isShowNotInstallAgent: '1', // 是否显示未安装应用：1是；0关闭；默认开启
    isSendHelpMsg: '1', // 修改发送欢迎消息;1是；1是；0关闭；默认开启
    isShowCompanysrv: '1' // 是否显示企业服务 1是；0关闭；默认开启
  },
  qwHistory: {
    historyData: '',
    historyMonth: '',
    historyExit: '',
    historyTip: '',
    historyAgentCode: ''
  },
  ready: wxqyhConfigReadyFunction
}
/**
 * 金卡接口
 * @type {string}
 */
var interfaceCode = {
  INTERFACE_CODE_NULL: 'null',
  INTERFACE_CODE_NONE: 'none',
  INTERFACE_CODE_ADDRESSBOOK: 'addressbook',
  INTERFACE_CODE_MEET: 'meet',
  INTERFACE_CODE_LEARN: 'learn',
  INTERFACE_CODE_CHECKOUT: 'checkout',
  INTERFACE_CODE_CHECKWORK: 'checkwork',
  INTERFACE_CODE_OUTSIDEWORK: 'outsidework',
  INTERFACE_CODE_FORM: 'form',
  INTERFACE_CODE_PRIME: 'prime',
  INTERFACE_CODE_QYDISK: 'qydisk',
  INTERFACE_CODE_REIMBURSEMENT: 'reimbursement',
  INTERFACE_CODE_SETTING: 'setting',
  INTERFACE_CODE_CAR: 'car',
  INTERFACE_CODE_DYNAMIC: 'dynamic',
  INTERFACE_CODE_TOPIC: 'topic',
  INTERFACE_CODE_PRODUCTINFO: 'productinfo',
  INTERFACE_CODE_TASK: 'task',
  INTERFACE_CODE_SURVEY: 'survey',
  INTERFACE_CODE_ACTIVITY: 'activity',
  INTERFACE_CODE_EXAMINATION: 'examination',
  INTERFACE_CODE_CRM: 'crm',
  INTERFACE_CODE_DIARY: 'diary',
  INTERFACE_CODE_HR: 'hr',
  INTERFACE_CODE_ASK: 'ask',
  INTERFACE_CODE_MOVEAPPROVE: 'moveapprove',
  INTERFACE_CODE_SALE: 'sale',
  INTERFACE_CODE_CRMMINI: 'crmmini',
  INTERFACE_CODE_CRMMINIEXC: 'crmminiexc',
  INTERFACE_CODE_CRMMINIULTIMATE: 'crmminiultimate'
}

function readyWxqyhConfigRun () {
  for (var i = 0; i < wxqyhConfigReadyFunctionArray.length; i++) {
    wxqyhConfigReadyFunctionArray[i]()
  }
}

// 初始化配置信息，isRefresh 是否强制刷新
function initWxqyhConfig () {
  window.wxqyhConfig = wxqyhConfig
  window.interfaceCode = interfaceCode
  axios.post(
    baseURL + '/portal/vipPortalAction!wxqyhConfig.action', {
		  agentCode: _.getRequest([]).agentCode
    }).then(function (result) {
    if (result.code == '0') {
      window.wxqyhConfig = result.data
      window.wxqyhConfig.config_state = 5// 表示已经初始化完成
      window.wxqyhConfig.ready = wxqyhConfigReadyFunction
      readyWxqyhConfigRun()
    } else if (result.code == '-1') {
      _.alert('提示', '系统出现异常，请重试')
      wxqyhConfig.config_state = -1
    }
  })
}
export {
  initWxqyhConfig
}
