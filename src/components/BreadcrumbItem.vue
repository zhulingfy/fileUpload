<template>
  <li class="breadcrumb-item">
    <a :class="{ 'breadcrumb-item-link': link }" @click="linkTo(text)">{{ text }}</a>
  </li>
</template>

<script>
  export default {
    name: 'breadcrumb-item',
    props: {
      text: String,
      link: Boolean
    },
    methods: {
      linkTo (text) {
        if (this.link) {
          this.$emit('link-to', text)
        }
      }
    }
  }
</script>