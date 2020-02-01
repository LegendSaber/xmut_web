<template>
    <div id="main">
        <el-row>
            <el-button v-if="!isSign" @click="sign" id="signBtn" type="danger" plain circle>签到</el-button>
            <el-button v-else id="signBtn" type="warning" circle plain>今日已签到</el-button>
        </el-row>
        <el-calendar v-model="value">
        </el-calendar>
    </div>
</template>

<script>
export default {
    name: "Sign",
    data() {
        return {
            value: new Date(),
            isSign: false,
        }
    },
    methods: {
        sign() {
            this.$notify.success("签到成功！积分+1");
            this.isSign = !this.isSign;
        }
    }
}
</script>

<style scoped>
#main {
    width: 1000px;
    height: 800px;
    margin: 0 auto;
}
#signBtn {
    width: 280px;
    height: 180px;
    margin-left: 300px; 
    font-size: 25px;
}
</style>