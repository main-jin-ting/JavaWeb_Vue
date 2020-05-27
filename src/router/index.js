import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie';
import Main from '@/views/index/index'
import store from '../vuex'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/views/login/index'], resolve),
    meta: {
      'title': '系统登录'
    }
  },
  {
    path: '/',
    name: 'index',
    redirect: '/index',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'index',
        component: (resolve) => require(['@/views/main/index'], resolve),
        meta: {
          'title': '首页',
          keepAlive:true
        }
      },
      {
        path: '403',
        name: '403',
        component: (resolve) => require(['@/views/error/403'], resolve),
        meta: {
          'title': '无权限'
        }
      },
    ]
  },
  {
    path: '/gentable',
    component: Main,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/gentable/gentable/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  }
]

const router = new Router({
  mode: 'history',
  routes
});

router.onError((error)=>{
  router.push({path:'403'})
})

router.beforeEach(async (to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let token = Cookies.get('token')
  if (!token) {
    if (to.name != 'login') {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    if (!store.state.user.roles) {
      if (!store.state.user.info) {
        await store.dispatch('user/getLoginInfo')
      }
      if (!store.state.user.menuList.length > 0) {
        await store.dispatch('user/getMenuList')
      }
      const {menuList, permission, isAdmin} = store.state.user
      let roles = []
      if (isAdmin) {
        roles = JSON.parse(JSON.stringify(menuList))
      } else {
        let rules = permission ? permission.split(',') : []
        rules.map(id => {
          let item = menuList.find(child => child.id == id)
          if (item) {
            roles.push(item)
          }
        })
      }
      store.dispatch('user/setRole', roles)
      addDynamicMenuAndRoutes(to, from)
      next(to.path)
    }
    if (to.name == 'login' || to.name == 'index' || to.name == '403') {
      if (to.name == 'index' || to.name == '403') {
        let tagList = store.state.user.tagList
        for (let i = 0; i < tagList.length; i++) {
          tagList[i].isSelect = false
        }
        if (to.name == 'index') {
          store.dispatch('user/setIsIndexTag', true)
        }
        if (to.name == '403') {
          store.dispatch('user/setIsIndexTag', false)
        }
      }
      next()
    } else {
      store.dispatch('user/setIsIndexTag', false)
      let roleList = JSON.parse(JSON.stringify(store.state.user.roles))
      let child = roleList.find(item => item.url == ('/' + to.name) && item.type == 2 && item.status == 1)
      if (child) {
        let breadcrumb = []
        let tagList = store.state.user.tagList
        let tagChild = {
          id: child.id,
          title: child.name,
          path: child.url,
        }
        if (child.pid !== 0) {
          let item = roleList.find(item => item.id == child.pid && item.type <= 2 && item.status == 1)
          if (item) {
            breadcrumb.push(item.name)
            tagChild.path = item.url + tagChild.path
          }
        }
        if (tagList.length > 0) {
          if (!tagList.some(item => item.id == child.id)) {
            tagList.push(tagChild)
          }
        } else {
          tagList.push(tagChild)
        }
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i].id == child.id) {
            tagList[i].isSelect = true
          } else {
            tagList[i].isSelect = false
          }
        }
        breadcrumb.push(child.name)
        store.dispatch('user/setBreadcrumb', breadcrumb)
        store.dispatch('user/setTagList', tagList)
        let btnList = roleList.filter(item => item.pid == child.id && item.type == 3 && item.status == 1)
        let btnFunc = []
        btnList.map(item => {
          let permission = item.permission
          if (permission) {
            permission = permission.split(':')
            if (permission.length > 1) {
              btnFunc.push(permission[1])
            }
          }
        })
        store.dispatch('user/setTtnRule', btnFunc)
        next()
      } else if (to.path == '/gentable/edit') {
        store.dispatch('user/setIsIndexTag', false)
        let breadcrumb = []
        breadcrumb.push("测试")
        store.dispatch('user/setBreadcrumb', breadcrumb)
  
        let tagList = store.state.user.tagList
        let tagChild = {
          id: -1,
          title: "代码生成配置",
          path: '/gen/edit',
        }
        if (tagList.length > 0) {
          if (!tagList.some(item => item.id == -1)) {
            tagList.push(tagChild)
          }
        }
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i].id == -1) {
            tagList[i].isSelect = true
          } else {
            tagList[i].isSelect = false
          }
        }
        store.dispatch('user/setTagList', tagList)
        next()
      }
    } 
  }
})

function addDynamicMenuAndRoutes(to, from) {
  const {roles}=store.state.user
  let filterMenuList = roles.filter(item => item.type <= 2 && item.status == 1)
  // 添加动态路由
  let dynamicRoutes = addDynamicRoutes(filterMenuList)
  handleStaticComponent(router, dynamicRoutes)
  router.addRoutes(router.options.routes)
}

/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
  dynamicRoutes.push({path: '*', redirect: '/403', hidden: true})
  router.options.routes = router.options.routes.concat(dynamicRoutes)
}

/**
 * 添加动态路由
 */
function addDynamicRoutes(menuList, routes = []) {
  let rootMenuList = menuList.filter(item => item.pid == 0)
  rootMenuList.map(item => {
    let route = {
      path: item.url,
      component: Main,
      name: item.url.replace('/', ''),
      meta: {
        icon: item.icon ? item.icon : '',
        index: item.sort,
        // title: item.name
      }
    }
    let childMenuList = menuList.filter(child => child.pid == item.id)
    if (childMenuList.length > 0) {
      let children = []
      childMenuList.map(child => {
        console.log(`路由组件：@/views${item.url}${child.url}`)
        let childRoute = {
          path: child.url.replace('/', ''),
          component: (resolve) => require([`@/views${item.url}${child.url}`], resolve),
          name: child.url.replace('/', ''),
          meta: {
            icon: child.icon ? child.icon : '',
            index: child.sort,
            // title: child.name
          }
        }
        children.push(childRoute)
      })
      route.children = children
      routes.push(route)
    }
  })
  return routes
}

export default router;
