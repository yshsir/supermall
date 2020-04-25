<template>
  <div class="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="container">

      <scroll class="left-scroll">
        <left-control @itemClick=""
                      :title="categories"
                      @itemLeftClick="itemLeftClick"/>
      </scroll>

      <scroll class="right-scroll">
        <div>
          <tab-content-category :subcategories="showCategory"/>
<!--          <tab-control :titles="['综合','新品','销量']" @tabClick="tabClick()" />-->
<!--          <goods-list :goods="showCategoryDetail" />-->
        </div>
      </scroll>

    </div>
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll";
  import NavBar from "components/common/navbar/NavBar";
  import LeftControl from "components/content/leftControl/LeftControl";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import TabContentCategory from "./childComps/TabContentCategory";

  import { getCategory,getSubcategory, getCategoryDetail} from "network/category";
  import { POP,NEW,SELL} from 'common/const'
  import {tabControlMixin} from "@/common/mixin";

  export default {
    name: "Category",
    data() {
      return {
        categories: [],
        categoryData: {},
        currentIndex:-1
      }
    },
    components: {
      TabContentCategory,
      NavBar,
      LeftControl,
      Scroll,
      GoodsList,
      TabControl,
    },
    computed: {
      showCategory(){
        if(this.currentIndex===-1) return {}
        return this.categoryData[this.currentIndex].subCategories
      },
    },
    created() {
      this._getCategory()
    },
    mixins: [tabControlMixin],
    methods: {
      _getCategory() {
        getCategory().then(res => {
          this.categories = res.data.category.list

          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subCategories: {},
              categoryDetail: {
                pop: [],
                new: [],
                sell: []
              }
            };
          }

          this._getSubcategory(0)
        })
      },
      _getSubcategory(index){
        this.currentIndex=index
        const maitKey=this.categories[index].maitKey

        console.log(this.currentIndex);

        console.log(this.categories[index].maitKey);

        getSubcategory(maitKey).then((res) => {
          console.log(res);
          this.categoryData[index].subCategories=res.data

          this.categoryData={...this.categoryData}
          console.log(this.categoryData);
          this._getCategoryDetail('pop')
          this._getCategoryDetail('new')
          this._getCategoryDetail('sell')
        })
      },

      _getCategoryDetail(type) {

        const miniWallkey=this.categories[this.currentIndex].miniWallkey

        // console.log(miniWallkey);

        getCategoryDetail(miniWallkey,type).then((res)=>{

          // console.log(res);
          this.categoryData[this.currentIndex].categoryDetail[type]=res

          this.categoryData={...this.categoryData}
          // console.log(this.categoryData);
        })
      },

      itemLeftClick(index) {
        this._getSubcategory(index)
      }
    }
  }
</script>

<style scoped>
  .category {
    height: 100vh;
    overflow: hidden;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #ffffff;
  }
  .container {
    display: flex;
    height: 100vh;
  }
  .left-scroll {
    width: 100px;
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
  .right-scroll {
    flex: 1;
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>
