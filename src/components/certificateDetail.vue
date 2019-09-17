<template>
    <div class="certificateDetail">
        <div class="head">
            <img src="../assets/detail.png" alt="" class="head-img">
            <div class="head-right">
                <p class="head-title">HRTech科技达人</p>
                <p class="head-status">未获得</p>
            </div>
        </div>
        <div>
            <h4>获得规则</h4>
            <ul class="rulesList">
                <li v-for="(item,index) in rulesList" :key="index">
                    <div class="rulesList-left">
                        <img :src="item.imgUrl" alt="">
                        <div>
                            <span class="rulesList-title">{{item.title}}</span>
                            <span class="rulesList-status">(<span class="rulesList-num">{{item.isTrue ? 1 : 0}}</span>/1)</span>
                        </div>
                    </div>
                    <div>
                        <div v-if="item.isTrue" class="rulesList-true">已完成</div>
                        <div v-else class="rulesList-false" @click="goForm(index)">去完成</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="share-btn" @click="shareDetail" v-if="shareBtnShow">
            我要分享
        </div>
    </div>
</template>

<script>
export default {
    name: 'certificateDetail',
    data () {
        return {
            rulesList: [
                {
                    imgUrl: require('../assets/detail-list1.png'),
                    title: '出席HRTech峰会',
                    isTrue: true
                },
                {
                    imgUrl: require('../assets/detail-list2.png'),
                    title: '与同行交流互动',
                    isTrue: true
                },
                {
                    imgUrl: require('../assets/detail-list3.png'),
                    title: '获取最新科技动态',
                    isTrue: true
                },
                {
                    imgUrl: require('../assets/detail-list4.png'),
                    title: '体验新的产品和技术',
                    isTrue: false
                },
            ]
        }
    },
    computed: {
        shareBtnShow() {
            return !this.rulesList.some(item => item.isTrue == false)
        }
    },
    created() {
        if (localStorage.getItem('isTrue')) {
            this.rulesList[3].isTrue = true
        }
    },
    methods: {
        shareDetail() {
            this.$router.push({path:'share'});
        },
        goForm(index) {
            this.rulesList[index].isTrue = true
            localStorage.setItem('isTrue',1)
        }
    }
}
</script>

<style scoped>
    .certificateDetail {
        margin: 14px;
    }
    .head {
        display: flex;
    }
    .head-img {
        width: 126px;
        height: 126px;
    }
    .head-right {
        margin-left: 16px;
        text-align: left;
    }
    .head-title {
        font-size:18px;
        font-family:PingFangSC;
        font-weight:500;
        color:#0A1735FF;
        line-height:26px;
    }
    .head-status {
        margin-top: 80px;
        font-size:13px;
        font-family:PingFangSC;
        font-weight:400;
        color:#B2B9C8FF;
        line-height:18px;
    }
    p {
        margin: 0;
    }
    h4 {
        display: flex;
        align-items: center;
        text-align: left;
        font-size: 15px;
        font-family: "PingFangSC-Medium", "Microsoft Yahei";
        font-weight: 800;
        color: rgba(10, 23, 53, 1);
      }
      h4::before {
        content: "";
        display: inline-block;
        width: 3px;
        height: 14px;
        background: rgba(85, 133, 240, 1);
        border-radius: 1px;
        vertical-align: middle;
        margin-right:6px;
    }
    .rulesList {
        padding: 0;
    }
    .rulesList li {
        align-items: center;
        margin: 32px 0;
        list-style: none;
        display: flex;
        justify-content: space-between
    }
    .rulesList-left {
        display: flex;
        align-items: center;
    }
    .rulesList li img {
        width: 32px;
        height: 32px;
    }
    .rulesList-title {
        margin-left: 8px;
        font-size:14px;
        color:#0A1735FF;
    }
    .rulesList-status {
        margin-left: 6px;
        font-size:13px;
        font-weight:500;
        color:#85868FFF;
    }
    .rulesList-num {
        color: #5585F0FF;
    }
    .rulesList-true {
        width:72px;
        height:26px;
        line-height: 26px;
        background:#F7F8FAFF;
        color: #1AC468FF;
        font-size:12px;
        font-weight:500;
        border-radius:13px;
        cursor: pointer;
    }
    .rulesList-false {
        width:72px;
        height:26px;
        line-height: 26px;
        background:#5585F0FF;
        color: #FFF;
        font-size:12px;
        font-weight:500;
        border-radius:13px;
        cursor: pointer;
    }
    .share-btn {
        position: absolute;
        bottom: 10px;
        width: 93%;
        background:#5585F0FF;
        color: #FFF;
        border-radius: 4px;
        font-size:14px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
    }
</style>