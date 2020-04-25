<template>
  <div class="category-item">
    <div v-for="(item, index) in title"
                :key="index"
                class="left-control-item"
                @click="itemClick(index)"
                :class="{active: index === currentIndex}">
      <span>{{item.title}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LeftControl",
    data() {
      return {
        currentIndex: 0
      }
    },
    props: {
      title: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index
        this.$emit('itemLeftClick',index)
      }
    }
  }
</script>

<style scoped>
  .active {
    background-color: var(--color-tint);
    color: #f6f6f6;
  }
  .category-item{
    text-align: center;
    color: var(--color-high-text);
    font-size: 15px;
    line-height: 60px;
  }
  span {
    display: block;
    height: 60px;
  }
</style>
