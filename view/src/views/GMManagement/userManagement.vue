<template>
  <div class="userManagement">
    <div>
       <el-tabs v-model="activeName" type="card" style="padding:0;">
    <el-tab-pane label="用户分组管理" name="userGroup"><userGroup @ToUserAuth='niuxclass'></userGroup></el-tab-pane>
    <el-tab-pane label="外部用户管理" name="userindex"> <userindex> </userindex></el-tab-pane>
    <el-tab-pane label="用户权限分配" :disabled='paneDisabled' name="userAuthority" > <userAuthority v-bind:id="id"> </userAuthority></el-tab-pane>
  </el-tabs>
    </div>
  </div>

</template>

<script>
import userindex from './user/index';
import userGroup from './user/group';
import userAuthority from './user/Authority';
export default {
  name: 'usermanagement',
  data() {
    return { 
      activeName: 'userGroup',
      id: 0
    };
  },
  components: {
    userindex,
    userGroup,
    userAuthority
  },
  watch: {
    // id(n, o) {
    //   console.log(n, o);
    // }
  },
  methods: {
    async niuxclass(data) {
      this.id = data;
      if (data === 0) {return;}
      let { row: { id }} = data;
      this.niuxclass(0);
      this.id = id;
      this.activeName = 'userAuthority';
    }
  },
  computed: {
    grade() {
      return this.$route.meta.grade;       
    },
    paneDisabled() {
      return this.id === 0; 
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.userManagement{
width: 100%;
height: 100%;
$globlColor: #2BBFBD;
.el-tabs__item.is-active {
    background-color: #DDDDDD;
}
.el-tabs--card>.el-tabs__header .el-tabs__item {
    border-bottom: 0}
.el-tabs--card>.el-tabs__header{
  padding: 0;
  margin: 0;
}
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: green;
}
// .el-tabs__item:hover {
//     color: $globlColor;
//     cursor: pointer;
// }


}
</style>
