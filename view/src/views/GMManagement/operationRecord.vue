<template>
  <div>operationRecord 操作日志</div>
</template>

<script>
export default {
  name: 'operationrecord',
  computed: {
    grade() {
      return this.$route.meta.grade;       
    }
  }
};
</script>

<style>

</style>
