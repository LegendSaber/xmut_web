<template>
  <div>
    <el-button icon="el-icon-s-flag" type="primary">经验贴如下:</el-button>
    <el-divider>
      <i class="el-icon-s-grid"></i>
    </el-divider>
    <div style="height:140px;" v-for="(table, index) in experienceList" :key="index">
      <el-row :gutter="2">
        <el-col style="margin-top: 40px;" :offset="1" :span="2">
          <el-avatar v-if="table.img == null" shape="square" :size="60" :src="squareUrl"></el-avatar>
          <el-avatar v-else shape="square" :size="60" :src="table.img"></el-avatar>
        </el-col>
        <el-col style="margin-top: 28px;" :span="16">
          <el-row>
            <a :href="'exdetail?id=' + table.id">{{table.title}}</a>
          </el-row>
          <el-row
            style="margin-top:5px;fontSize: 14px;color:#767676;"
          >{{table.content.slice(0, 48)}}...</el-row>
          <el-row style="margin-top:5px;">
            <span
              style="fontSize: 14px;color:#3b5998;cursor: pointer;"
              type="primary"
            >{{table.author}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="fontSize: 14px;color: #767676;">发表于: {{table.createTime}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="fontSize: 14px;color: #767676;">收藏人数: {{table.favorNum}}</span>
          </el-row>
        </el-col>
        <el-col :offset="1" :span="1">
          <a :href="'exdetail?id=' + table.id">
            <el-button
              round
              style="margin-top: 24px;height:100px;"
              icon="el-icon-zoom-in"
              type="primary"
            >查看</el-button>
          </a>
        </el-col>
      </el-row>
      <el-row>
        <el-divider>
          <i class="el-icon-s-data"></i>
        </el-divider>
      </el-row>
    </div>
    <br />
    <br />
    <el-button icon="el-icon-s-promotion" type="warning">知识贴如下:</el-button>
    <el-divider>
      <i class="el-icon-s-grid"></i>
    </el-divider>
    <div style="height:140px;" v-for="(table, index) in knowledgeList" :key="index">
      <el-row :gutter="2">
        <el-col style="margin-top: 40px;" :offset="1" :span="2">
          <el-avatar v-if="table.img == null" shape="square" :size="60" :src="squareUrl"></el-avatar>
          <el-avatar v-else shape="square" :size="60" :src="table.img"></el-avatar>
        </el-col>
        <el-col style="margin-top: 28px;" :span="16">
          <el-row>
            <a :href="'kndetail?id=' + table.id">{{table.title}}</a>
          </el-row>
          <el-row style="fontSize: 14px;color:#767676;">{{table.content.slice(0, 48)}}...</el-row>
          <el-row>
            <span
              style="fontSize: 14px;color:#3b5998;cursor: pointer;"
              type="primary"
            >{{table.author}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="fontSize: 14px;color: #767676;">发表于: {{table.createTime}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="fontSize: 14px;color: #767676;">收藏人数: {{table.favorNum}}</span>
            <el-divider direction="vertical"></el-divider>
            <el-button style="margin-top:5px;" size="mini" type="danger">{{table.category}}</el-button>
          </el-row>
        </el-col>
        <el-col :offset="1" :span="1">
          <a :href="'kndetail?id=' + table.id">
            <el-button
              round
              style="margin-top: 24px;height:100px;"
              icon="el-icon-zoom-in"
              type="primary"
            >查看</el-button>
          </a>
        </el-col>
      </el-row>
      <el-row>
        <el-divider>
          <i class="el-icon-s-data"></i>
        </el-divider>
      </el-row>
    </div>
    <br />
    <br />
    <el-button icon="el-icon-document-copy" type="success">知识贴如下:</el-button>
    <el-divider>
      <i class="el-icon-s-grid"></i>
    </el-divider>
    <div style="height:120px;" v-for="(table, index) in fileList" :key="index">
      <el-row v-loading="loading" :gutter="2">
          <el-col style="margin-top: 40px;" :offset="1" :span="2">
            <el-avatar v-if="table.img == null" shape="square" :size="60" :src="squareUrl"></el-avatar>
            <el-avatar v-else shape="square" :size="60" :src="table.img"></el-avatar>
          </el-col>
          <el-col style="margin-top: 32px;" :span="16">
            <el-row><a @click="download(table.id)">{{table.fileName}}</a></el-row>
            <el-row style="margin-top:8px;">
              <span style="fontSize: 14px;color:#3b5998;cursor: pointer;" type="primary">{{table.author}}</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">于{{table.createTime}}上传</span>
              <el-divider direction="vertical"></el-divider>
              <span style="fontSize: 14px;color: #767676;">收藏人数: {{table.favorNum}}</span>
            </el-row>
          </el-col>
          <el-col :offset="1" :span="1">
            <el-button @click="download(table.id)" round style="margin-top: 24px;height:80px;" icon="el-icon-download" type="primary">下载</el-button>
          </el-col>
          <el-col :offset="1" :span="1">
            <el-button @click="collect(table.id)" round style="margin-top: 24px;height:80px;" icon="el-icon-folder-add" type="warning">收藏</el-button>
          </el-col>
      </el-row>
      <el-row>
         <el-divider><i class="el-icon-s-data"></i></el-divider>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      experienceList: [],
      knowledgeList: [],
      fileList: []
    };
  },
  created() {
    if (this.$route.query.value == "") {
        this.$notify.error("请输入搜索内容")
        this.$router.push("/dashbord")
    }
    let params = {};
    params.value = this.$route.query.value;
    this.$axios
      .get("/sysExperience/getSearchExperience", params)
      .then(response => {
        if (response && response.success && response.data != null) {
          this.$data.experienceList = response.data;
          let len = this.$data.experienceList.length;

          for (let i = 0; i < len; i++) {
            this.$data.experienceList[i].createTime = this.$data.experienceList[
              i
            ].createTime.slice(0, 10);
          }
        }
      });
    this.$axios
      .get("/sysKnowledge/getSearchKnowledge", params)
      .then(response => {
        if (response && response.success && response.data != null) {
          this.$data.knowledgeList = response.data;
          let len = this.$data.knowledgeList.length;

          for (let i = 0; i < len; i++) {
            this.$data.knowledgeList[i].createTime = this.$data.knowledgeList[
              i
            ].createTime.slice(0, 10);
          }
        }
      });
    this.$axios.get("/sysFile/getSearchFile", params).then(response => {
      if (response && response.success && response.data != null) {
        this.$data.fileList = response.data;
        let len = this.$data.fileList.length;

        for (let i = 0; i < len; i++) {
          this.$data.fileList[i].createTime = this.$data.fileList[
            i
          ].createTime.slice(0, 10);
        }
      }
    });
  },
  methods:{
    download(id) {
      window.open("http://localhost:8888/xmut/sysFile/download?id=" + id)
    },
    collect(id) {
      let params = {};
      params.id = id;
      this.$axios.post("/sysFile/collect", params).then(response => {
        if (response && response.success) {
          this.$notify.success(response.message);
          this.getInitData();
        } else {
          this.$notify.error(response.message);
        }
      });
    },
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  color: #3b5998;
  background-color: transparent;
  font-family: PingFang SC, Verdana, Helvetica Neue, Microsoft Yahei,
    Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
}

a:hover {
  color: #da8d28e8;
}
</style>