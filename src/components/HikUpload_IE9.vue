<template>
  <div>
    <form class="hik-upload"  :action="action" method="post" enctype="multipart/form-data" target="__file__iframe__20170904">
      <label for="__file__20170904" class="hik-upload__label"><slot></slot></label>
      <input type="file" name="file" id="__file__20170904" class="hik-upload__input" @change="fileUpload">
    </form>
    <iframe id="__file__iframe__20170904" name="__file__iframe__20170904" style="position:absolute; top:-9999px; left:-9999px" src="/upload/containers/upload"></iframe>
  </div>
</template>

<script>
  // import axios from 'axios'
  export default {
    name: 'hik-upload',
    props: {
      action: String,
      dirname: String
    },
    methods: {
      fileUpload (e) {
        // let formdata = new FormData()
        // formdata.append('file', e.target.files[0])
        // formdata.append('dirName', this.dirname)
        // axios({
        //   url: this.action,
        //   method: 'post',
        //   data: formdata,
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }).then((res) => {
        //   this.$emit('on-success', res)
        //   e.target.value = ''
        // })

        // 以下是兼容IE9的上传功能测试
        try {
          var that = this
          e.target.parentNode.submit()
          let iframe = document.getElementById('__file__iframe__20170904')
          iframe.onload = function () {
            let response = JSON.parse(iframe.contentWindow.document.body.innerText)
            that.$emit('on-success', response)
            e.target.value = ''
          }
        } catch (e) {
          console.log('error' + e)
        }
      }
    }
  }
</script>

<style>
.hik-upload {
  display: inline-block;
}
.hik-upload__label {
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.hik-upload__input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>