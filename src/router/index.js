import Vue from 'vue'
import Router from 'vue-router'
import Upload from '@/components/Upload'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import HikUpload from '@/components/HikUpload'
import '@/font-icon/css/font-awesome.css'

import Directory from '@/components/Directory'
import Image from '@/components/Image'
import Breadcrumb from '@/components/Breadcrumb'
import BreadcrumbItem from '@/components/BreadcrumbItem'

Vue.use(Router)
Vue.use(ElementUI)
Vue.component(HikUpload.name, HikUpload)
Vue.component(Directory.name, Directory)
Vue.component(Image.name, Image)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Upload',
      component: Upload
    }
  ]
})
