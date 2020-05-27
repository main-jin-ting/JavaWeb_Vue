import Cookies from 'js-cookie';
import api from '@/api/login'

const state = {
  name: '',
  menuList:[],
  avatar: '',
  introduction: '',
  key: '',
  roles: null,
  info:null,
  breadcrumb:[],
  tagList:[],
  isAdmin:false,
  permission:[],
  isIndexTag:true,
  btnFunc:[],
}

const mutations = {
  SET_MENU: (state, menuList) => {
    state.menuList = menuList
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_BREADCRUMB: (state, breadcrumb) => {
    state.breadcrumb = breadcrumb
  },
  SET_TAG: (state, tagList) => {
    state.tagList = tagList
  },
  SET_ISINDEX: (state, isIndexTag) => {
    state.isIndexTag = isIndexTag
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_ISADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  },
  SET_BTNRULE: (state, btnFunc) => {
    state.btnFunc = btnFunc
  }
}

const actions = {
  setTtnRule({ commit, state },btnFunc){
    commit('SET_BTNRULE',btnFunc)
  },

  setIsIndexTag({ commit, state },isIndexTag){
    commit('SET_ISINDEX',isIndexTag)
  },

  setTagList({ commit, state },tagList){
    commit('SET_TAG',tagList)
  },

  setBreadcrumb({ commit, state },breadcrumb){
    commit('SET_BREADCRUMB',breadcrumb)
  },

  setRole({ commit, state },roleList){
    commit('SET_ROLES',roleList)
  },

  getMenuList({ commit, state }){
    return new Promise((resolve, reject) => {
      api.authList().then(res => {
        commit('SET_MENU', res.data?res.data:[])
        resolve(res.data?res.data:[])
      }).catch(e => {
        reject(error)
      })
    })
  },

  // get user info
  getLoginInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.getLoginInfo({token:Cookies.get('token')}).then(res => {
        commit('SET_INFO', res.data.info?res.data.info:{})
        commit('SET_PERMISSION', res.data.permission?res.data.permission:[])
        if(res.data.permission.length>0){
          if(res.data.permission[0]=='*'){
            commit('SET_ISADMIN', true)
          }else{
            commit('SET_ISADMIN', false)
          }
        }
        resolve(res.data.info)
      }).catch(e => {
        Cookies.set('token','')
        commit('SET_INFO', null)
        commit('SET_MENU', [])
        commit('SET_ROLES', null)
        commit('SET_ISADMIN', false)
        commit('SET_PERMISSION',[])
        location.href='/login'
        reject(e)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.logout(Cookies.get('token')).then(res => {
        Cookies.set('token','')
        commit('SET_INFO', null)
        commit('SET_MENU', [])
        commit('SET_ROLES', null)
        commit('SET_ISADMIN', false)
        commit('SET_PERMISSION',[])
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      Cookies.set('token','')
      commit('SET_INFO', null)
      commit('SET_MENU', [])
      commit('SET_ROLES', null)
      commit('SET_ISADMIN', false)
      commit('SET_PERMISSION',[])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

