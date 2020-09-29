 <template>
    <div class="wscn-http404-container">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
          <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
          <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
          <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
        </div>
        <div class="bullshit">
          <div class="bullshit__oops">OOPS!</div>
          <div class="bullshit__info">页面丢失,当前访问页面不存在
          </div>
          <div class="bullshit__headline">{{ message }}</div>
          <div class="bullshit__info">请检查您输入的网址是否正确，或点击下面的按钮返回首页。</div>
          <a :href="'/index'" class="bullshit__return-home">返回首页</a>
          
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return '网站管理员说你不能进入这个页面…';
    }
  }
};
</script>

<style lang="scss" scoped>
  .wscn-http404-container{
    transform: translate(-50%,-50%);
    position: absolute;
    top: 40%;
    left: 50%;
  }
  .wscn-http404 {
    position: relative;
    width: 1200px;
    padding: 0 50px;
    overflow: hidden;
    .pic-404 {
      position: relative;
      float: left;
      width: 600px;
      overflow: hidden;
      &__parent {
        width: 100%;
      }
      &__child {
        position: absolute;
        &.left {
          width: 80px;
          top: 17px;
          left: 220px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        &.mid {
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }
        &.right {
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        @keyframes cloudLeft {
          0% {
            top: 17px;
            left: 220px;
            opacity: 0;
          }
          20% {
            top: 33px;
            left: 188px;
            opacity: 1;
          }
          80% {
            top: 81px;
            left: 92px;
            opacity: 1;
          }
          100% {
            top: 97px;
            left: 60px;
            opacity: 0;
          }
        }
        @keyframes cloudMid {
          0% {
            top: 10px;
            left: 420px;
            opacity: 0;
          }
          20% {
            top: 40px;
            left: 360px;
            opacity: 1;
          }
          70% {
            top: 130px;
          left: 180px;
           opacity: 1;
         }
         100% {
           top: 160px;
           left: 120px;
           opacity: 0;
        }
       }
       @keyframes cloudRight {
         0% {
           top: 100px;
           left: 500px;
           opacity: 0;
         }
         20% {
           top: 120px;
           left: 460px;
           opacity: 1;
         }
         80% {
           top: 180px;
           left: 340px;
           opacity: 1;
         }
         100% {
           top: 200px;
           left: 300px;
           opacity: 0;
         }
       }
     }
   }
   .bullshit {
     position: relative;
     float: left;
     width: 300px;
     padding: 30px 0;
     overflow: hidden;
     &__oops {
       font-size: 32px;
       font-weight: bold;
       line-height: 40px;
       color: #1482f0;
       opacity: 0;
       margin-bottom: 20px;
       animation-name: slideUp;
       animation-duration: 0.5s;
       animation-fill-mode: forwards;
     }
     &__headline {
       font-size: 20px;
       line-height: 24px;
       color: #222;
       font-weight: bold;
       opacity: 0;
       margin-bottom: 10px;
       animation-name: slideUp;
       animation-duration: 0.5s;
       animation-delay: 0.1s;
       animation-fill-mode: forwards;
     }
     &__info {
       font-size: 13px;
       line-height: 21px;
      color: grey;
       opacity: 0;
       margin-bottom: 30px;
       animation-name: slideUp;
       animation-duration: 0.5s;
       animation-delay: 0.2s;
       animation-fill-mode: forwards;
     }
     &__return-home {
       display: block;
       float: left;
      width: 110px;
       height: 36px;
       background: #1482f0;
       border-radius: 100px;
       text-align: center;
       color: #ffffff;
       opacity: 0;
       font-size: 14px;
      line-height: 36px;
      cursor: pointer;
       animation-name: slideUp;
       animation-duration: 0.5s;
      animation-delay: 0.3s;
       animation-fill-mode: forwards;
     }
     @keyframes slideUp {
       0% {
         transform: translateY(60px);
         opacity: 0;
       }
       100% {
         transform: translateY(0);
         opacity: 1;
       }
     }
   }
 }
 </style>




<!-- 
<template>
  <div class="starry-sky">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    props: {
      point: {
        type: Number,
        default: 25 // 生成的星星（点）的个数, 默认25个
      },
      lineColor: {
        type: String,
        default: 'rgba(45,140,210,0.2)' // 线的颜色
      },
      roundColor: {
        type: String,
        default: 'rgba(45,140,210,0.1)' // 星星的颜色
      },
    },
    data() {
      return {
        docWidth: 0, // 画布宽
        docHeight: 0, // 画布高
        context: null, // canvasDom的执行上下文
        circleArr: [], // 圆点数组
        timer: null, // 定时器对象
      }
    },
    mounted() {
      const canvasDom = this.$refs.canvas

      // 取画布的高宽来设置显示分辨率
      this.docWidth = canvasDom.offsetWidth
      this.docHeight = canvasDom.offsetHeight

      // 设置画布分辨率
      canvasDom.width = canvasDom.offsetWidth
      canvasDom.height = canvasDom.offsetHeight

      // 初始化canvas上下文
      this.context = canvasDom.getContext('2d')

      // 设置线条和星星颜色
      this.context.strokeStyle = this.lineColor;
      this.context.lineWidth = 1;
      this.context.fillStyle = this.roundColor;

      // 初始化
      this.createCircleArr()       // 设置星星数组
      this.draw() // 首屏绘制
      this.cycleDraw() // 循环绘制
    },
    methods: {
      /**
       * 生成min和max之间随机数
       */
      rangeRadom(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      },
      /**
       * 绘制原点
       */
      drawCircle(context, x, y, r, moveX, moveY) {
        let circle = {
          x,
          y,
          r,
          moveX,
          moveY,
        }
        context.beginPath()
        context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
        context.closePath()
        context.fill()
        return circle
      },
      /**
       * 绘制线条
       */
      drawLine(context, beginX, beginY, closeX, closeY, opacity) {
        context.beginPath()
        context.strokeStyle = `rgba(0, 0, 0, ${opacity})`
        context.moveTo(beginX, beginY)
        context.lineTo(closeX, closeY)
        context.closePath()
        context.stroke()
      },
      /**
       * 生成圆点数组
       */
      createCircleArr() {
        for (let i = 0; i < this.point; i++) {
          this.circleArr.push(this.drawCircle(
            this.context,
            this.rangeRadom(this.docWidth, 0),
            this.rangeRadom(this.docHeight, 0),
            this.rangeRadom(15, 2),
            this.rangeRadom(10, -10)/40,
            this.rangeRadom(10, -10)/40
          ))
        }
      },
      /**
       * 每一帧绘制
       */
      draw() {
        const circleArr = this.circleArr
        this.context.clearRect(0, 0, this.docWidth, this.docHeight)
        // 循环绘制点
        for (let i = 0; i < this.point; i++) {
          this.drawCircle(this.context, circleArr[i].x, circleArr[i].y, circleArr[i].r)
        }
        // 循环绘制线
        for (let i = 0; i < this.point; i++) {
          for (let j = 0; j < this.point; j++) {
            if (i + j < this.point) {
              let A = Math.abs(circleArr[i + j].x - circleArr[i].x)
              let B = Math.abs(circleArr[i + j].y - circleArr[i].y)
              let lineLength = Math.sqrt(A * A + B * B)
              let C = 1 / lineLength * 7 - 0.009
              let lineOpacity = C > 0.03 ? 0.03 : C;
              if (lineOpacity > 0) {
                this.drawLine(
                  this.context,
                  circleArr[i].x,
                  circleArr[i].y,
                  circleArr[i + j].x,
                  circleArr[i + j].y,
                  lineOpacity,
                )
              }
            }
          }
        }
      },
      /**
       * 循环绘制
       */
      cycleDraw() {
        this.timer = setInterval(() => {
          for(let i = 0; i < this.point; i++) {
            let cir = this.circleArr[i]
            cir.x += cir.moveX
            cir.y += cir.moveY
            if (cir.x > this.docWidth) {
              cir.x = 0
            } else if (cir.x < 0) {
              cir.x = this.docWidth
            }
            if (cir.y > this.docHeight) {
              cir.y = 0
            } else if (cir.y < 0) {
              cir.y = this.docHeight
            }
          }
          this.draw()
        }, 10)
      },
    },
    beforeDestory() {
      // 记得摧毁定时器
      clearInterval(this.timer)
    }
  }
</script>

<style lang="stylus" scoped>
  .starry-sky {
    width 100%
    height 100%
    > canvas {
      width 100%
      height 100%
    }
  }
</style> -->
