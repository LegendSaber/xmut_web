<template>
    <div>
        <el-row>
            <el-col :offset="8" :span="6">
                <el-button v-if="!isSign" icon="el-icon-thumb" @click="sign" id="signBtn" type="danger" plain circle>签到</el-button>
                <el-button v-else id="signBtn" icon="el-icon-finished" type="success" circle plain>今日已签到</el-button>
            </el-col>
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
            currentUser: {}
        }
    },
    methods: {
        sign() {
            this.$axios.get("/sysSign/sign", {}).then(response => {
                if (response && response.success){
                    this.$notify.success(response.message);
                    this.$data.isSign = true
                }
            })       
        }
    },
    created() {
        let currentUser = window.sessionStorage.getItem('user')
        if (currentUser) {
            this.$data.currentUser = currentUser
        }

        this.$axios.get("/sysSign/isSign", {}).then(response => {
            if (response && response.success) {
                this.$data.isSign = true
            } else {
                this.$data.isSign = false
            }
        })
    }
}
</script>

<style scoped>
#signBtn {
    width: 280px;
    height: 180px;
    font-size: 25px;
}
</style>