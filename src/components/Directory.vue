<template>
  <div class="directory-item">
    <div class="directory-item-icon" @click="clickDir" @dblclick="openDir">
      <i class="icon-folder-close" :class="{ 'dir-check': isChecked }"></i>
      <i class="el-icon-circle-check" v-show="isChecked"></i>
    </div>
    <div class="directory-item-text" :title="name" v-if="!isCreating">{{ name }}</div>
    <input class="directory-item-input" type="text" v-else v-model="newName" autofocus @focus="inputFocus" @blur="createEnd">
  </div>
</template>

<script>
  export default {
    name: 'directory-item',
    data () {
      return {
        isChecked: false,
        newName: '新建文件夹'
      }
    },
    props: ['name', 'isCreating'],
    methods: {
      clickDir () {
        this.isChecked = !this.isChecked
        this.$emit('check-image', this.name)
      },
      inputFocus (e) {
        e.target.select()
      },
      createEnd () {
        this.$emit('creat-end', this.newName)
      },
      openDir () {
        this.$emit('open-dir', this.name)
      }
    },
    mounted () {
      // todo: 这是为了让每次创建时名称输入框自动获取焦点。目前没有更好的办法。
      let input = document.getElementsByClassName('directory-item-input')[0]
      if (input) {
        input.select()
      }
    }
  }
</script>

<style>
  .directory-item {
    text-align: center;
    display: inline-block;
    vertical-align: top;
    padding: 12px;
    cursor: default;
    position: relative;
  }
  .directory-item i.icon-folder-close {
    font-size: 80px;
  }
  .dir-check {
    color: #20a0ff;
  }
  .directory-item-icon {
    width: 80px;
    height: 80px;
    cursor: pointer;
  }
  .directory-item i.el-icon-circle-check {
    color: #3e3;
    position: absolute;
    right: 10px;
    bottom: 40px;
  }
  .directory-item-text {
    width: 80px;
    padding: 8px 0;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .directory-item-input {
    box-sizing: border-box;
    width: 80px;
    margin: 4px 0;
    padding: 2px 5px;
    font-size: 12px;
  }
</style>