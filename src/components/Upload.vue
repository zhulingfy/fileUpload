<template>
  <div class="container">
    <h3>文件夹及文件操作</h3>
    <div class="views">
      <!-- 面包屑导航 -->
      <breadcrumb>
        <breadcrumb-item v-for="(item, index) in pathArr" :key="index" :text="item" :link="index !== pathArr.length - 1" @link-to="dirLink"></breadcrumb-item>
      </breadcrumb>
      <div class="btn-gronp">
        <el-button :plain="true" size="small" type="info" @click="backDir"><i class="icon-reply"></i> 返回上级</el-button>
        <el-button :plain="true" size="small" type="info" @click="createDirClick"><i class="icon-folder-close"></i> 新建文件夹</el-button>
        <el-button :plain="true" size="small" type="info" @click="emptyDir"><i class="el-icon-delete"></i> 清空文件夹</el-button>
        <el-button :plain="true" size="small" type="info" @click="rename"><i class="icon-file-text"></i> 重命名</el-button>
        <el-button :plain="true" size="small" type="info" @click="deleteImg"><i class="el-icon-close"></i> 删除</el-button>
        <el-button :plain="true" size="small" type="info" @click="refreshDir"><i class="icon-refresh"></i> 刷新</el-button>
      </div>
      <div class="directory">
        <!-- 新建的文件夹 -->
        <directory-item :isCreating="true" v-if="isCreating" @creat-end="createDir"></directory-item>
        <!-- 文件夹列表 -->
        <directory-item 
          v-for="item of directories" 
          :key="item.filename" 
          :name="item.filename" 
          @check-image="checkImg" 
          @open-dir="openDir">
        </directory-item>
        <!-- 图片列表 -->
        <image-item 
          v-for="item of images" 
          :key="item.filename" 
          :name="item.filename" 
          :src="item.path" 
          @check-image="checkImg"
          @dblclick-img="showBigImage">
        </image-item>
        <!-- 上传的图片 -->
        <hik-upload 
          title="上传图片"
          class="avatar-uploader"
          :dirname="dirPath"
          action="/upload/containers/upload"
          @on-success="handleAvatarSuccess">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </hik-upload>
        <!-- 图片弹框 -->
        <el-dialog v-model="dialogVisible" size="tiny">
          <el-input :value="dialogImageInput" class="dialog-image-input" @focus="dialogAutoSelect">
            <template slot="prepend">图片路径：</template>
          </el-input>
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        basePath: 'http://localhost:8080/',
        imageUrl: '',
        directories: [], // 文件夹集合
        images: [],      // 图片集合
        checkedImages: [],  // 被选中的图片集合
        dirName: '',    // 文件夹名称
        dirPath: '',    // 文件夹路径
        isCreating: false,  // 是否正在创建
        dialogImageUrl: '',  // 弹框图片路径
        dialogVisible: false // 是否显示弹框图片
      }
    },
    computed: {
      pathArr () {
        let pathArr = this.dirPath ? this.dirPath.split('/') : []
        pathArr.unshift('containers')
        return pathArr
      },
      dialogImageInput () {
        return this.basePath + this.dialogImageUrl
      }
    },
    methods: {
      // 图片上传成功后
      handleAvatarSuccess (res) {
        this.$message.success('图片上传成功！')
        this.refreshDir()
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 返回上级
      backDir () {
        if (this.dirPath.length === 0) return this.$message.error('已经是根目录！')
        let dirArr = this.dirPath.split('/')
        if (dirArr.length > 1) {
          dirArr.splice(dirArr.length - 1, 1)
          this.dirPath = dirArr.join('/')
        } else {
          this.dirPath = ''
        }
        this.refreshDir()
      },
      // 面包屑导航跳转
      dirLink (name) {
        if (name === 'containers') {
          this.dirPath = ''
        } else {
          let path = this.dirPath.split(name)[0] + name
          this.dirPath = path
        }
        this.refreshDir()
      },
      // 打开文件夹
      openDir (name) {
        this.dirName = name
        this.dirPath = this.dirPath ? this.dirPath + '/' + this.dirName : this.dirName
        this.refreshDir()
      },
      // 点击创建文件夹按钮
      createDirClick () {
        this.isCreating = true
      },
      // 创建文件夹
      createDir (dirName) {
        this.isCreating = false
        let onlyName = true
        this.directories.forEach((obj, index) => {
          if (obj.filename === dirName) {
            onlyName = false
          }
        })
        if (!onlyName) return this.$message.error('文件夹名称重复！')
        axios({
          url: '/upload/containers/createDir',
          data: { dirName, path: this.dirPath },
          method: 'post'
        }).then((res) => {
          if (res.data.type === 'success') {
            this.refreshDir()
          }
        })
      },
      // 清空文件夹
      emptyDir () {
        this.$confirm('确认清空当前文件夹？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            url: '/upload/containers/emptyDir',
            data: { dirName: this.dirPath },
            method: 'post'
          }).then((res) => {
            if (res.data.type === 'success') {
              this.$message.success('清除成功！')
              this.refreshDir()
            }
          })
        }).catch(() => {})
      },
      // 刷新文件夹
      refreshDir () {
        axios({
          url: '/upload/containers/getFilesAndDir',
          method: 'post',
          data: {
            dirName: this.dirPath
          }
        }).then((res) => {
          if (res.data.type === 'success') {
            let data = res.data.data
            this.directories = data.directory
            this.images = data.file
            this.checkedImages.length = 0

            // todo: 用来修复每次删除，勾选效果不会消失的问题。目前没有更好的办法。
            this.$children.forEach((item, index) => {
              if (typeof item.isChecked !== undefined) {
                item.isChecked = false
              }
            })
          }
        })
      },
      // 选择图片（或文件夹）
      checkImg (imgName) {
        let index = this.checkedImages.indexOf(imgName)
        if (index === -1) {
          this.checkedImages.push(imgName)
        } else {
          this.checkedImages.splice(index, 1)
        }
      },
      // 删除图片（和文件夹）
      deleteImg () {
        if (this.checkedImages.length === 0) {
          this.$message.error('请选择要删除的文件!')
          return
        }
        axios({
          url: '/upload/containers/delete',
          data: {
            dirName: this.dirPath,
            files: this.checkedImages.join(',')
          },
          method: 'post'
        }).then((res) => {
          if (res.data.type === 'success') {
            this.$message.success('删除成功！')
            this.refreshDir()
          }
        })
      },
      // 重命名
      rename () {
        if (this.checkedImages.length === 0) {
          this.$message.error('请选择要重命名的文件！')
          return
        } else if (this.checkedImages.length > 1) {
          this.$message.error('一次只能重命名一个文件！')
          return
        }

        this.$prompt('请输入新名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (!value) return this.$message.error('名称不能为空！')
          // 判断名称是否重复
          let isPic = Array.isArray(this.checkedImages[0].match(/.jpg|.png|.jpeg|.gif$/i))
          let isOnly = true
          if (isPic) {
            this.images.forEach(function (item, index) {
              if (item.filename.split('.')[0] === value) isOnly = false
            })
          } else {
            this.directories.forEach(function (item, index) {
              if (item.filename === value) isOnly = false
            })
          }
          if (!isOnly) return this.$message.error('名称重复！')

          axios({
            url: '/upload/containers/rename',
            data: {
              newName: value,
              oldName: this.checkedImages[0],
              path: this.dirPath
            },
            method: 'post'
          }).then((res) => {
            if (res.data.type === 'success') {
              this.$message.success('重命名成功！')
              this.refreshDir()
            }
          })
        }).catch(() => {})
      },
      // 双击显示大图
      showBigImage (imageUrl) {
        this.dialogImageUrl = imageUrl
        this.dialogVisible = true
      },
      // 全选
      dialogAutoSelect (e) {
        e.target.select()
        document.execCommand('Copy')
        this.$message('已复制到剪切板')
      }
    },
    // 初始化
    mounted () {
      this.refreshDir()
    }
  }
</script>

<style>
  .container {
    width: 1280px;
    margin: 0 auto;
  }
  .views {
    width: 800px;
    margin: 0 auto;
    text-align: left;
  }
  .directory {
    height: 410px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 20px;
  }
  .btn-gronp {
    padding: 10px;
  }
  .dialog-image-input {
    margin-bottom: 16px;
  }
  .dialog-image-input button.dialog-image-button {
    border-color: #20a0ff;
    background: #20a0ff;
    color: #fff;
  }



  .avatar-uploader {
    display: inline-block;
    padding: 12px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .avatar-uploader .hik-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .hik-upload:hover {
    border-color: #20a0ff;
  }
</style>
