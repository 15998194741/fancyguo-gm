<template>
  <div id="app">
    <h1>扫雷游戏</h1>
    <div class="container">
      <div class="main">
        <table class="min-table">
          <tr v-for="(ritem,rindex) of row" :key="'row'+rindex">
            <!-- <td v-for="(citem,cindex) of col" :key="'col'+cindex" :style="{width:cellWidth+'px',height:cellHeight+'px'}"></td> -->
            <Cell v-for="(citem,cindex) of col" :key="'col_'+rindex+'_'+cindex" :size="{w:cellWidth,h:cellHeight}" :cell-data="cellArray[rindex*col + cindex]" @clearboom="clearBoom"></Cell>
          </tr>
        </table>
      </div>

      <div class="aside">
        <el-radio-group v-model="level" @change="changeLevel">
          <el-radio-button :label="0.2">简单</el-radio-button>
          <el-radio-button :label="0.4">中级</el-radio-button>
          <el-radio-button :label="0.6">困难</el-radio-button>
        </el-radio-group>

        <div class="block">
          <span class="demonstration">列数:{{col}}</span>
          <el-slider v-model="col" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">行数:{{row}}</span>
          <el-slider v-model="row" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <el-switch
            v-model="isCell"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是否同步"
          ></el-switch>
        </div>

        <div class="block">
          <span class="demonstration">列高:{{cellWidth}}</span>
          <el-slider v-model="cellWidth" :min="5" :max="100"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">行高:{{cellHeight}}</span>
          <el-slider v-model="cellHeight" :min="5" :max="100"></el-slider>
        </div>
        
        <div class="block">
          <el-button type="primary" @click="initCellData">重置</el-button>
        </div>
        
        <Play srcSound="/a.mp3"></Play>
        
        <div class="block">
          <Timer></Timer>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

import Cell from './components/Cell';
import Play from './components/Play';
import Timer from './components/Timer';
import eventBus from './eventBus';

export default {
  name: 'app',
  data: function() {
    return {
      level: 0.2,
      col: 10,
      row: 10,
      isCell: true,
      cellWidth: 30,
      cellHeight: 30,
      // isboom  data  ismarked  isclear
      cellArray: [],
      isReset: true,

      cellAtr: [this.row][this.col]
    };
  },
  created() {
    this.initCellData();
    document.oncontextmenu = () =>{
      return false;
    };
    eventBus.$on('clickCell', () => {
      this.isReset && (eventBus.$emit('start-timer'));
      this.isReset = false;
    });
    eventBus.$on('boom-end', () => {
      this.boomend();
    });
  },
  methods: {
    boomend() {
      this.cellArray.forEach((item, index) => {
        if (item.isBoom) {
          this.$set(item, 'isShowBoom', true);
        } else {
          this.$set(item, 'isClear', true);
        }
      });
    },
    getBoomNumber: function(index, randomIndexSet) {
      //当前的数字
      let count = 0;
      for (let i = -1; i <= 1; i++) {       
        let startIndex = index - i * this.col - 1;
        if (index % this.col > 0) {
          count += randomIndexSet.has(startIndex);
        }      
        count += randomIndexSet.has(startIndex + 1);
        if (index % this.col < this.col - 1) {
          count += randomIndexSet.has(startIndex + 2);
        } 
        
      }
      return count;
    },
    changeLevel() {
      this.initCellData();//改变行高
    },
    initCellData() {
      this.isReset = true;

      let sum = this.row * this.col;
      // 设置地雷
      // if(this.level==)
      let randomBooms = ~~(sum * this.level);
      let randomIndexSet = new Set();
      while (randomIndexSet.size <= randomBooms) {
        randomIndexSet.add((Math.random() * sum) | 0);
      }
      //console.log(randomIndexSet)
      this.cellArray = []; // 清空数组中的数据
      for (let i = 0; i < sum; i++) {
        let isBoom = randomIndexSet.has(i);
        //console.log(i)
        let data = this.getBoomNumber(i, randomIndexSet);
        
        this.cellArray.push({ isBoom, data, isShowBoom: false, isMarked: false, isClear: false, cellIndex: i });
      }
    },
    clearBoom(index) {
      const innerClearBoom = cIndex => {
        //console.log(cIndex)
        if (cIndex >= 0 && cIndex < this.cellArray.length) {
          let cell = this.cellArray[cIndex];
          if (cell.isMarked || cell.isBoom || cell.isClear) {
            return;
          }
          this.$set(this.cellArray[cIndex], 'isClear', true);
          if (cell.data == 0) {
            this.clearBoom(cIndex);
          }
        }
      };

      //清理
      let cell = this.cellArray[index];
      if (cell.data != 0) {
        this.$set(cell, 'isClear', true);
        //console.log('!!!!!')
        return;
      }
      for (let i = -1; i <= 1; i++) {
        let startIndex = index + this.col * i - 1;
        // console.log(startIndex)
        if (index % this.col > 0) {
          innerClearBoom(startIndex);
        }       
        innerClearBoom(startIndex + 1);
        if (index % this.col < this.col - 1) {
          innerClearBoom(startIndex + 2);
        }
      }
    }

  },
  watch: {
    cellWidth(newval) {
      // console.log(newval)
      this.isCell && (this.cellHeight = newval);
    },
    cellHeight(newval) {
      this.isCell && (this.cellWidth = newval);
    },
    row() {
      this.initCellData();
    },
    col() {
      this.initCellData();
    }
  },
  components: {
    // HelloWorld
    Cell,
    Play,
    Timer
  }
};
</script>

<style lang="stylus" scoped>
h1{
  text-align: center;
}
.block {
  border-top: 1px pink solid;
  margin-top: 9px;
}

#app {
  .container {
    display: flex;

    & > div {
      border: 1px solid #ccc;
    }
  }

  .main {
    flex: 5 0 500px;
    min-height: 300px;
  }

  .aside {
    flex: 2 0 200px;
    min-height: 300px;
  }

  .min-table {
    border-collapse: collapse;

    td {
      width: 30px;
      height: 30px;
      border: 1px solid #c09;
      background-color: snow;
    }
  }
}
</style>

