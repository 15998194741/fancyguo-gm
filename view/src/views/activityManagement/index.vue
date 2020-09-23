<template>
  <div>activityManagement 活动管理</div>
</template>

<script>
export default {
  name: 'activityManagement',
  computed: {
    grade() {
      return this.$route.meta.grade;       
    }
  }
};
</script>

<style>

</style>
