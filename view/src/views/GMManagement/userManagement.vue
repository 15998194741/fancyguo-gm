<template>
  <div class="userManagement">
    <div>
       <el-tabs v-model="activeName" type="card" style="padding:0;">
    <el-tab-pane label="用户分组管理" name="userGroup"><userGroup></userGroup></el-tab-pane>
    <el-tab-pane label="外部用户管理" name="userindex"> <userindex> </userindex></el-tab-pane>
  </el-tabs>
    </div>
  </div>

</template>

<script>
import userindex from './user/index';
import userGroup from './user/group';
export default {
  name: 'usermanagement',
  data() {
    return { 
      activeName: 'userGroup'
    };
  },
  components: {
    userindex,
    userGroup
  },
  methods: {
    
  },
  computed: {
    grade() {
      return this.$route.meta.grade;       
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.userManagement{
width: 100%;
height: 100%;
$globlColor: #2BBFBD;
.el-tabs--card>.el-tabs__header{
  padding: 0;
  margin: 0;
}
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: green;
}
.el-tabs__item:hover {
    color: $globlColor;
    cursor: pointer;
}


}
</style>
