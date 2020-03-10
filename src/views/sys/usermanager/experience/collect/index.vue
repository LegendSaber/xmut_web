<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/mydata' }">个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>经验模块</el-breadcrumb-item>
            <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="6">
                <el-input
                    clearable
                    @clear="getExperienceList"
                    v-model="queryInfo.query"
                    placeholder="请输入内容"
                ></el-input>
                </el-col>
                <el-col :span="2">
                <el-button @click="getExperienceList" type="primary" icon="el-icon-search">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="experienceList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="createTime" label="日期"></el-table-column>
                <el-table-column prop="author" label="作者"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="favorNum" label="收藏人数"></el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="查看" placement="right-start" :enterable="false">
                    <a :href="'exdetail?id=' + scope.row.id"><el-button type="primary" icon="el-icon-zoom-in"></el-button></a>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="取消收藏" placement="right-start" :enterable="false">
                        <el-button @click="cancelCollect(scope.row.id)" type="warning" icon="el-icon-star-on"></el-button>
                    </el-tooltip>      
                </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.currentPage"
                :page-sizes="[2, 4, 6, 8]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            experienceList: {},
            queryInfo: {
                query: "",
                currentPage: 1,
                pageSize: 4,
            },
            total: 0,
        }
    },
    created() {
        this.getExperienceList();
    },
    methods: {
        getExperienceList() {
            let params = {};

            params.currentPage = this.$data.queryInfo.currentPage;
            params.pageSize = this.$data.queryInfo.pageSize;
            params.query = this.$data.queryInfo.query;
      
            this.$axios.get("/sysExperience/getFavorExperience", params).then(response => {
                if (response && response.success) {
                this.$data.experienceList = response.data.records;
                this.$data.total = response.data.total;
                let len = response.data.records.length;

                for (let i = 0; i < len; i++) {
                    this.$data.experienceList[i].createTime = this.$data.experienceList[
                    i
                    ].createTime.slice(0, 10);
                }
                }
            });
        },
        handleSizeChange(newSize) {
            this.$data.queryInfo.pageSize = newSize;
            this.getExperienceList();
        },
        handleCurrentChange(newPage) {
            this.$data.queryInfo.currentPage = newPage;
            this.getExperienceList();
        },
        cancelCollect(id) {
          let params = {};
          params.id = id;
          this.$axios.post("/collect/cancelCollectEx", params).then(response => {
            if (response && response.success) {
              this.getExperienceList()
            }
          });
        }
    }
}
</script>

<style scoped>

</style>