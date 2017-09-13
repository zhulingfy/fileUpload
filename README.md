# 基于Vue构建的上传功能

> 2017-9-7 支持图片及文件夹展示; 支持页面刷新。<br>
> 2017-9-7 支持图片上传、删除。<br>
> 2017-9-8 支持根路径下文件夹创建、删除、清空。<br>
> 2017-9-8 支持任意路径下文件夹、图片的创建、删除<br>
> 2017-9-9 支持双击打开文件夹、返回上级。支持文件夹路径的面包屑导航。<br>
> 2017-9-9 支持双击图片放大。<br>
> 2017-9-11 上传功能可支持IE9。<br>
> 2017-9-12 文件、文件夹支持重命名。<br>


## 项目启动

``` bash
# 安装依赖
npm install

# 在localhost:8080启动项目
npm run dev
```

## 项目介绍

该项目使用vue-cli脚手架构建的一个简易的vue演示demo。主要实现图片文件的上传及展示。<br>
项目基于Vue框架，使用了Element-UI的一些组件。<br>
项目接口采用express实现。在本地搭建图片服务器，将server/containers作为上传文件的根目录。

<br><br><br>

### 关于IE9支持上传的一些说明：
&nbsp;&nbsp;&nbsp;&nbsp; 当前可运行的代码中采用了H5中新的API——[FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)，这些仍然是不被IE9支持的。如果要支持IE9，需要将src -> components中的HikUpload.vue组件替换为同级下的HikUpload_IE9.vue(文件名替换下即可)。原代码中是利用axios实现的异步上传效果，性能更优，但下IE9下没法获取form-data格式的数据，所以兼容代码是将内容利用表单submit的方式上传至同级页面的一个iframe中，可能对异常处理得不是那么完美。