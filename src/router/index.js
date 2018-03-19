import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import NewItem from '@/components/NewItem'
import EditItem from '@/components/EditItem'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/new',
      name: 'newItem',
      component: NewItem
    },
    {
      path: '/edit/:item_id',
      name: 'editItem',
      component: EditItem
    }
  ]
})
