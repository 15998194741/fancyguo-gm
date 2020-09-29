<template>
    <div class="play">
        <audio ref="sd" :src="{srcSound}"></audio>
    </div>
</template>

<script>
import EventBus from '../eventBus';
export default {
  name: 'play',
  data() {
    return {

    };
  },
  created() {
    EventBus.$on('clickCell', ()=>{
      this.$refs.sd.play();
    });
  },
  props: {
    srcSound: {
      type: String,
      required: false
    }
  }
};
</script>

<style scoped >
.play{
    height: 0;
    width: 0;
    visibility: hidden;
    position: absolute;
}
</style>

