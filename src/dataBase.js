var dataBase={

	/*必配-start*/
	mask:false,//遮罩层控制
  isShow:true,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"form",
  },
  /*必配-end*/
  loading:{ //加载、提交成功、删除成功
    show:false,
    text:"",
    name:"",
  },
  dialogBottomConfig:{
    show: false, //控制弹窗显示与否
    title: "确认删除该表单？", //头部标题，设置为空的话不显示
    btnConfig:[ //自定义弹框操作,可以设置回调函数
      {title:" 删除", callBack: null, primary:true},//primary为true显示为红色，默认为灰色
      {title:" 取消", callBack: null}
    ]
  },
  showrecord: false,
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:[//中间自定义内容
    ],
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"", callBack:null}, //次操作按钮
    }
  },

};
export default dataBase;
