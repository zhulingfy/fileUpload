<template>
  <ul class="breadcrumb">
    <slot></slot>
  </ul>
</template>

<script>
  export default {
    name: 'breadcrumb',
    props: ['path']
  }
</script>

<style>
  .breadcrumb {
    padding-left: 0;
    margin: 0;
  }
  .breadcrumb-item {
    display: inline-block;
    font-size: 14px;
  }
  .breadcrumb-item a {
    padding-left: 10px;
    padding-right: 10px;
  }
  .breadcrumb-item + .breadcrumb-item::before {
    content: '/';
    display: inline-block;
    color: #aaa;
  }
  .breadcrumb-item-link {
    color: #20a0ff;
    cursor: pointer
  }
  .breadcrumb-item span {
    color: #aaa;
  }
</style>