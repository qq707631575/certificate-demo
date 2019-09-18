<template>
    <div class="my-certificate">
        <div>
            <div class="blueLayer" />
            <div class="userInfo">
                <div class="userInfo-img">
                <img
                    class="userInfo-headimg"
                    src="../assets/123.png"
                    alt=""
                >
                </div>
                <div class="userInfo-info">
                <div class="name ellipsis">
                    <span class="name-span">叶晋源</span>
                    <i class="level"/>
                </div>
                <p class="dept ellipsis">
                    产品研发一部
                </p>
                </div>
                <div class="userInfo-certificateNum">
                <div class="num">12</div>
                <div class="desc">获得证书</div>
                </div>
            </div>
        </div>
        <div class="contentWrap">
            <h4 class="contentWrap-h4">
            成就证书
            <span class="contentWrap-span">(1/8)</span>
            </h4>

            <ul class="contentWrap-ul">
                <li v-for="(item,index) in imgArr" :key="index" class="contentWrap-li" @click="toDetail(index)">
                    <img :src="item.imgUrl" alt="">
                    <p class="contentWrap-title">{{item.title}}</p>
                    <div class="contentWrap-status">
                        <p class="contentWrap-date">{{item.date}}</p><img v-if="item.isTure" src="../assets/isTrue.png" class="is-true"/>
                    </div>
                </li>
            </ul>
        </div>
        <div class="toast" v-show="toastShow">
            {{toastText}}
        </div>
    </div>
</template>

<script>
import { getWxUrl, getOpenInfo} from '@/api/getData'
export default {
    name: 'myCertificate',
    data () {
        return {
            toastText: '',
            toastShow: false,
            imgArr: [
                {
                    imgUrl: require('../assets/zhengshu1.png'),
                    title: '道一云金牌面试官证书',
                    date: '2019.07.01',
                    isTure: true
                },
                {
                    imgUrl: require('../assets/zhengshu2.png'),
                    title: 'HRTech科技达人',
                    date: '未获得',
                },
                {
                    imgUrl: require('../assets/zhengshu3.png'),
                    title: '最佳新员工',
                    date: '未获得',
                },
                {
                    imgUrl: require('../assets/zhengshu4.png'),
                    title: '年度优秀员工',
                    date: '未获得',
                },
                {
                    imgUrl: require('../assets/zhengshu5.png'),
                    title: '7月优秀新员工',
                    date: '未获得',
                },
                {
                    imgUrl: require('../assets/zhengshu6.png'),
                    title: '年度勤劳员工',
                    date: '未获得',
                },
                {
                    imgUrl: require('../assets/zhengshu7.png'),
                    title: '最佳培训师',
                    date: '未获得',
                },
                {
                    imgUrl: require('../assets/zhengshu8.png'),
                    title: '月度金牌销售',
                    date: '未获得',
                }
            ]
        }
    },
    created() {
        getWxUrl({}, data => {
          window.location.href = data.url
          this._getOpenInfo()
        })

    },
    methods: {
        toDetail(index) {
            if (index != 1) {
                if (index > 1) {
                    this.toast('暂未开放')
                    return
                }
            }
            this.$router.push({path:'certificateDetail'});
        },
        _getOpenInfo() {
            getOpenInfo({ code: code, courseId: this.$route.query.id }, data => {
            sessionStorage.setItem(`${this.$route.query.id}_courseName`, data.courseName)
            if (!data.openUser.mobile) {
                this.$router.push({ name: 'infoCollection', query: { courseId: this.$route.query.id } })
            } else {
                sessionStorage.setItem(`${this.$route.query.id}_openUser`, JSON.stringify({ mobile: data.openUser.mobile, personName: data.openUser.personName }))
                this.init()
            }
            }, errData => {
            if (errData.code == '440217' || errData.code == '10001') {
                this.checkInfo('')
            } else {
                this.$alert(errData.desc)
            }
            }, false)
        },
        // toast弹窗
        toast (str) {
            this.toastText = str
            this.toastShow = true
            setTimeout(() => {
                this.toastShow = false
            }, 1500)
        }
    }
}
</script>

<style scoped>
    .my-certificate {
        display: flex;
    }
    .blueLayer{
      position:absolute;
      top:0;
      left:0;
      height:88px;
      width: 100%;
      background: url('../assets/bg_blue.png') no-repeat left center;
      background-size:100% 100%;
    }
    .userInfo{
      position:absolute;
      top:6px;
      left: 0;
      width: -webkit-fill-available;
      margin:0 14px;
      height:46px;
      background: url('../assets/bg.png') no-repeat;
      background-repeat: no-repeat;
      background-size:cover;
      padding:22px 18px;
      box-sizing: content-box;
      display: flex;
      text-align: left;
    }
    .userInfo-img{
        width:46px;
        height:46px;
        border-radius: 50%;
    }
    .userInfo-headimg{
        width:100%;
        height:100%;
        border-radius: 50%;
    }
    .userInfo-info{
        flex:1;
        margin-left:15px;
        min-width: 0;
    }
    .name{
        font-size:16px;
        font-family:'PingFangSC-Medium','Microsoft Yahei';
        font-weight:800;
        color:rgba(10,23,53,1);
        line-height:22px;
    }
    .name-span {
        vertical-align: middle;
    }
    .level{
        height:16px;
        width:50px;
        display: inline-block;
        background: url('../assets/xueba.svg') no-repeat;
        background-repeat: no-repeat;
        background-size:cover;
        vertical-align: middle;
    }
    .dept{
        font-size:12px;
        margin-top: 4px;
        font-family:'PingFangSC-Regular','Microsoft Yahei';
        color:rgba(132,139,154,1);
    }
    .userInfo-certificateNum{
        width:77px;
        text-align: center;
    }
    .num{
        font-size:24px;
        line-height: 27px;
        font-family:'DINAlternate-Bold','Microsoft Yahei';
        font-weight:900;
        color:rgba(10,23,53,1);
    }
    .desc{
        font-size:12px;
        font-family:'PingFangSC-Regular','Microsoft Yahei';
        color:rgba(132,139,154,1);
    }
    .ellipsis {
        white-space: nowrap;
        word-wrap: normal;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .contentWrap {
        margin-top: 70px;
    }
    .contentWrap-ul{
        padding:0 14px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .contentWrap-li{
        margin-bottom: 19px;
        list-style: none;
        width: 48%;
    }
    .contentWrap-li img {
        width: 166px;
        height: 114px;
    }
    .contentWrap-h4{
        text-align: left;
        padding:23px 14px 19px 14px;
        font-size:15px;
        font-family:'PingFangSC-Medium','Microsoft Yahei';
        font-weight:800;
        color:rgba(10,23,53,1);
    }
    .contentWrap-span{
        font-size:12px;
        font-weight:400;
        font-family:'PingFangSC-Regular','Microsoft Yahei';
        color:rgba(132,139,154,1);
    }
    .contentWrap-title {
        margin: 8px 0 0;
        font-size:13px;
        color:#0A1735FF;
        line-height:18px;
        text-align: center;
    }
    .contentWrap-date {
        margin: 0;
        font-size:12px;
        color:#B5B8C2FF;
        line-height:17px;
        text-align: center;
    }
    .contentWrap-status {
        display: flex;
        justify-content: center;
    }
    .contentWrap-li .is-true {
        margin-left: 3px;
        width: 14px;
        height: 14px;
    }
    .toast {
        position: fixed;
        z-index: 2000;
        left: 50%;
        top:45%;
        transition:all .5s;
        -webkit-transform: translateX(-50%) translateY(-51%);
            -moz-transform: translateX(-50%) translateY(-51%);
            -ms-transform: translateX(-50%) translateY(-51%);
                -o-transform: translateX(-50%) translateY(-51%);
                transform: translateX(-50%) translateY(-51%);
        text-align: center;
        border-radius: 5px;
        color:#FFF;
        background: rgba(17, 17, 17, 0.7);
        height: 45px;
        line-height: 45px;
        padding: 0 15px;
        max-width: 150px;
    }
</style>