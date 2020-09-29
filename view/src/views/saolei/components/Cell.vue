<template>
    <td class="cell" :class="{'boom':cellData.isShowBoom,'mine-clear':cellData.isClear,'marked':cellData.isMarked}" :style="{width:size.w+'px',height:size.h+'px'}" @mousedown="cellClick">
    <span v-if="cellData.data!=0 && cellData.isClear" :style="{color:getNumberColor(cellData.data)}">{{cellData.data}}</span>

    </td>
</template>

<script>
import EventBus from '../eventBus';

export default {
  name: 'cell',
  data() {
    return {

    };
  },
  methods: {
    getNumberColor(num) {
      switch (num) {
        case 1: return '#fff';
        case 2: return '#c6a';
        case 3: return '#08a';
        case 4: return '#0a2';
        case 5: return '#f90';
        default: return '#a21';
      }
    },
    cellClick(e) {
      //console.log(e.button)
      if (this.cellData.isClear) {
        return;
      }

      EventBus.$emit('clickCell');
      //左键
      if (e.button === 0) {
        if (this.cellData.isMarked) {
          return;
        }
        if (this.cellData.isBoom) {
          console.log('BOOM');
          EventBus.$emit('boom-end');

        } else {    
          // this.$set(this.cellData,"isClear",true);
          //console.log('clear')
          this.$emit('clearboom', this.cellData.cellIndex);
        }
      } else if (e.button === 2) {
        // console.log("11")
        // this.cellData.isMarked = !this.cellData.isMarked
        this.$set(this.cellData, 'isMarked', !this.cellData.isMarked);
        console.log(this.cellData.isMarked);
      }
            
    }
  },
  props: {
    size: {
      type: Object,
      required: false,
      default: () => {
        return {
          w: 30,
          h: 30  
        };
      }
    },
    cellData: {
      type: Object,
      required: false
      // default: ()=>{
      //     return {
      //         isBoom: false,
      //         data: 0,
            
      //     }
      // }
    }
        
  }
};
</script>

<style scoped lang="stylus">
td{
    text-align :center;
    vertical-align:middle;
}
.mine-clear{
    background-color: #555!important;
}
.marked{
    background-image: url(/flag.png)!important;
    background-size :contain;
}
.boom{
    position:relative;
    &:before{
        content:"";
        position:absolute;
        left :0;
        top:0;
        width:100%;
        height:100%;
        background-image: url('/bz.png')!important;
        background-size :cover;

    }
}
</style>
