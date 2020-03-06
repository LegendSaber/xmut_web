<template>
    <div>
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
    margin-left: 300px; 
    font-size: 25px;
}
</style>