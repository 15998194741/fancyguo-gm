<template>
  <div>userManagement 用户管理</div>
</template>

<script>
export default {
  name: 'usermanagement',
  computed: {
    grade() {
      return this.$route.meta.grade;       
    }
  }
};
</script>

<style>

</style>
