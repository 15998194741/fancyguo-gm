<template>
    <div class="timer">
        {{hour}}:{{minute}}:{{second}}
    </div>
</template>

<script>
import eventBus from '../eventBus';
import { setInterval, clearInterval } from 'timers';

export default {
  name: 'timer',
  data() {
    return {
      hour: '00',
      minute: '00',
      second: '00',
      startTime: 0,
      endTime: 0,
      timer: 0
    };
  },
  created() {
    eventBus.$on('boom-end', ()=>{
      this.endTime = Date.now();
      // this.showTimer(this.endTime-this.startTime)
      clearInterval(this.timer);
    });
    eventBus.$on('start-timer', ()=>{
      this.startTime = Date.now();
      this.timer = setInterval(()=>{
        let s = Date.now() - this.startTime;
        this.showTimer(s);
      }, 500);
    });
  },
  methods: {
    showTimer(ss) {
      this.second = String(~~(ss / 1000) % 60).padStart(2, '0');
      this.minute = String(~~(ss / (1000 * 60)) % 60).padStart(2, '0');
      this.hour = String(~~(ss / (1000 * 60 * 60)) % 60).padStart(2, '0');
    }
  }
};
</script>

<style scoped>

</style>
