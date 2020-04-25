<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control :titles="['流行', '新款' ,'爆款']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-content"
                 v-show="isTabFixed"
    />

    <scroll class="content"
            ref="scroll"
            :probeType="3"
            @scroll="ContentScroll"
            :pull-up-load="true"
            @pullingUp="LoadMore">

      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>

      <recommend-view :recommends="recommends"/>

      <feature-view/>

      <tab-control :titles="['流行', '新款' ,'爆款']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>

      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top  @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList"
  import Scroll from "components/common/scroll/Scroll"

  import HomeSwiper from "./childCompos/HomeSwiper";
  import RecommendView from "./childCompos/RecommendView";
  import FeatureView from "./childCompos/FeatureView"

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {itemListMixin,backTopMixin} from 'common/mixin'

  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        tabOffsetTop: 0 ,
        isTabFixed: false,
        saveY: 0,
      }
    },
    mixins: [itemListMixin,backTopMixin],
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      // BackTop,
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      console.log('activated');
      console.log(this.saveY);
      this.$refs.scroll.scrollTo(0, this.saveY, 0),
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存Y值
      console.log('deactivated');
      this.saveY = this.$refs.scroll.saveY()
      this.$bus.$off('itemImageLoad', this.itemImgListener)
      console.log(this.saveY);
    },
    methods: {
      /* 事件监听*/

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
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },

      // 下拉位置,判断位置
      ContentScroll(position) {
        // 回到顶部的下拉位置判断
        this.listenTopBcakShow(position)
        // 选项栏位置判断,显示
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },

      // 下拉加载
      LoadMore() {
        this.getHomeGoods(this.currentType)
      },

      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        // console.log(this.tabOffsetTop);
      },


      /* 数据请求方法 */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends =res.data.recommend.list
          console.log(this.recommends);
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // 完成下来加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .tab-content {
    position: relative;
    z-index: 9;

  }
  /*.content {*/
  /*  height:calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*   }*/
</style>
