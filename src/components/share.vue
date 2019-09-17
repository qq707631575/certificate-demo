<template>
    <div class="share">
        <!-- <img src="../assets/shareBack.svg" alt="" class="share-back"> -->
        <div class="share-content">
            <div class="share-title">
                <div class="share-title-left">
                    <img src="../assets/123.png" alt="" class="share-head">
                    <div class="share-title-text">
                        <p class="share-title-business">道一云</p>
                        <p class="share-title-name">我获得了HRTech达人</p>
                    </div>
                </div>
                <img src="../assets/share.svg" alt="">
            </div>
            <img src="../assets/shareDemo.png" alt="" class="share-demo">
            <div class="share-footer">
                <div class="share-year">2019</div>
                <span class="share-date">09/21</span>
                <span>|</span>
                <span class="share-business">{广东道一信息技术股份有限公司}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'share',
    data () {
        return {
            
        }
    }
}
</script>

<style scoped>
    p {
        margin: 0;
    }
    .share {
        display: flex;
        justify-content: center;
        background: url('../assets/shareBack.svg');
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
    }
    .share-back {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .share-content {
        /* position: absolute;
        top: 23px;
        width:343px;
        height:589px; */
        transform: translate(-50%, -50%);
        position: absolute;
        left: 50%;
        top: 50%;
        /* margin: 23px 16px; */
        width: 90%;
        height: max-content;
        background:#ffffffeb;
        box-shadow:0px 2px 10px 0px rgba(0,0,0,0.06);
        border-radius:8px;
    }
    .share-title {
        margin: 14px;
        display: flex;
        justify-content: space-between
    }
    .share-head {
        width: 46px;
        height: 46px;
        border-radius: 50%;
    }
    .share-title-left {
        display: flex;
        align-items: center;
    }
    .share-title-text {
        margin-left: 10px;
        text-align: left;
    }
    .share-title-business {
        color: #000000FF;
        font-size:16px;
        font-weight:500;
    }
    .share-title-name {
        margin-top: 2px;
        color:#B2B9C8FF;
        font-size:12px;
    }
    .share-demo {
        margin: 10px;
        width: 90%;
        /* height: 458px; */
    }
    .share-footer {
        margin: 16px 10px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 32px;
    }
    .share-year {
        display: inline-block;
        transform:rotate(-90deg);
        color: #0A1735FF;
        font-size:8px;
    }
    .share-date {
        color: #0A1735FF;
        font-size:18px;
        font-weight:500;
        margin-right: 4px;
    }
    .share-business {
        margin-left: 4px;
        font-size: 14px;
    }
</style>