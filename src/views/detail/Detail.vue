<template>
  <div id="Detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>

    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-images-info :images-info="imageInfo" @imgLoad="imgLoad"/>
      <detail-param-info ref="param" :param-info="ParamsInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top  @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>
<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailImagesInfo from "./childComps/DetailImagesInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {itemListMixin, backTopMixin} from 'common/mixin'
  import {getDetail, getRecommend, Goods, Shop, GoodsParams} from "network/detail";
  import {debounce} from "../../common/utils";
  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailImagesInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        imageInfo: {},
        ParamsInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null
      }
    },
    mixins: [itemListMixin,backTopMixin],
    created() {
      console.log(this.$route);
      this.iid = this.$route.params.iid
      // 请求详情数据
      getDetail(this.iid).then(res  => {
        console.log(res);
        const data = res.result
        // 获取顶部轮播图
        this.topImages = data.itemInfo.topImages
        // 获取商品信息
        this.goods = new Goods (data.itemInfo, data.columns, data.shopInfo.services)

        // 获取店铺信息
        this.shop = new Shop (data.shopInfo)
        //获取图片信息
        this.imageInfo = data.detailInfo

        // 获取参数信息
        this.ParamsInfo = new GoodsParams (data.itemParams.info, data.itemParams.rule)


        //created获取不到元素.mounted也不行获取数据
        //获取到数据的回调中也不行，DOM没有渲染完
        //$nextTick也不行，因为图片的高度没有被计算在内
        // 在图片加载完成后，获取高度才是正确的
        this.getThemeTopY = debounce(() => {
          // getThemeTop赋值（对给this.getThemeTopY赋值的操作进行防抖）
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          //增加一个最大值
          this.themeTopYs.push(Number.MAX_VALUE)
          // console.log(this.themeTopYs);
        },100)

        // 获取评论数据
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      })
      // 获取推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

    },
    methods: {
      ...mapActions(['addCart']),
      imgLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 50)
        // console.log(index);
      },
      contentScroll(position) {
        // 显示置顶位置
        this.listenTopBcakShow(position)

        // 获取y值
        const positionY = -position.y
        // console.log(positionY);
        // positionY与themeTopYs对比
        let length = this.themeTopYs.length
        for(let i = 0; i < length-1; i++) {
          // hack做法
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY <= this.themeTopYs[i+1])) {
            this.currentIndex = i;
            console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          }

          // if(this.currentIndex !== i && ((i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
          //   (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   // console.log(i);
          //   this.currentIndex = i
          //   console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }
      },
      addToCart() {
        //获取购物车信息(1.Actives返回一个Promise 2.mapActions的映射关系)
        const product = {}
        product.topImages = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.lowNowPrice
        product.iid = this.iid
        // 将商品添加到购物车
        // console.log(product);
        //映射mapActions
        this.addCart(product).then(res => {
          console.log(res);
          this.$toast.show(res)
        })
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })
      }
    }
  }
</script>

<style scoped>
  #Detail {
    position: relative;
    height: 100vh;
    z-index: 11;
    background-color: #fff;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>
