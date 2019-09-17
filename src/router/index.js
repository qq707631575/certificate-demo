import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import share from '@/components/share'
import certificateDetail from '@/components/certificateDetail'
import myCertificate from '@/components/myCertificate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'myCertificate',
      component: myCertificate
    },
    {
      path: '/share',
      name: 'share',
      component: share
    },
    {
      path: '/certificateDetail',
      name: 'certificateDetail',
      component: certificateDetail
    },
    {
      path: '/myCertificate',
      name: 'myCertificate',
      component: myCertificate
    }
  ]
})
