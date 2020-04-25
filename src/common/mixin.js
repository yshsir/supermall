import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop"
import {TOP_DISTANCE} from "common/const"
export const itemListMixin = {
  data() {
    return{
      itemImgListener: null
    }
  },
  mounted() {
    //监听item中图片的加载完成事件,加载完成就是它重新计算一次高度
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('---');
  }
}
export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenTopBcakShow(position) {
      this.isShowBackTop = position.y < -TOP_DISTANCE
    }
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: 'pop'
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      // console.log(this.currentType);
    }
  }
}
