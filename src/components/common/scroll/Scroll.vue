<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"
  export default {
    name: "Scroll",
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      // console.log(this.$refs.wrapper);
      // 创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      if (this.pullUpLoad) {
        // 监听下拉底部
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
      if(this.probeType == 2 || this.probeType == 3) {
        // 监听滚动位置
        this.scroll.on('scroll',(position) => {
          this.$emit('scroll',position)
        })
      }
    },
    methods: {
      scrollTo(x, y, time = 50){
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh && this.scroll.refresh()
        // console.log('--');
      },
      saveY() {
        // 判断存在scroll输出Y值
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
