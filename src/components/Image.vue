<template>
  <div class="image-item">
    <div class="image-item-view" @click="clickImg" @dblclick="dblclickImg">
      <img :src="src" v-if="src">
      <div class="image-item-mask" v-show="isChecked">
        <i class="el-icon-circle-check"></i>
      </div>
    </div>
    <div class="image-item-text" :title="imageName">{{ imageName }}</div>
  </div>
</template>

<script>
  export default {
    name: 'image-item',
    data () {
      return {
        isChecked: false
      }
    },
    props: ['src', 'name'],
    computed: {
      imageName () {
        return this.name.split('.')[0]
      }
    },
    methods: {
      clickImg () {
        this.isChecked = !this.isChecked
        this.$emit('check-image', this.name)
      },
      dblclickImg () {
        this.$emit('dblclick-img', this.src)
      }
    }
  }
</script>

<style>
  .image-item {
    text-align: center;
    display: inline-block;
    padding: 12px;
    vertical-align: top;
    cursor: default;
  }
  .image-item-view {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0,0,0,0.5);
    cursor: pointer;
    position: relative;
  }
  .image-item-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
  }
  .image-item-mask i {
    color: #3e3;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .image-item-view img {
    width: 100%;
    height: 100%;
  }
  .image-item-text {
    width: 80px;
    padding: 8px 0;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>