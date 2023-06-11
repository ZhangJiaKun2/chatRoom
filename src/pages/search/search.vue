<template>
  <div class="search">
    <a-card  style="width: 1000px" :body-style='{padding:0}'>
      <a-menu v-model:selectedKeys="currentKey" mode="horizontal" class="menu">
        <a-menu-item v-for="item in navData" :key="item.key" class="myItem" @click="toRouterAndChangeKey(item.router,item.key)">
          <span class="menuTitle">{{item.title}}</span>
          <!--        {{item.title}}-->
        </a-menu-item>
      </a-menu>
      <router-view></router-view>
    </a-card>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import { storeToRefs } from 'pinia'
import { user } from '../../store/login.js'
const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

let router = useRouter()
let route = useRoute()
const navData = [
  {
    key:'1',
    title:'用户',
    icon:'homeFilled',
    router:'/searchUser'
  },
  {
    key:'2',
    title:'贴子',
    icon:'messageFilled',
    router:'/searchPost'
  },

]


let currentKey = ref([])

const toRouterAndChangeKey = (path,key)=>{
  router.push({path,query:{uid:userInfo.value.id,keyWord:route.query.keyWord}})
  if(key) {
    console.log(key)
    currentKey.value[0] = key
    sessionStorage.setItem('keys',key)
  }
}

</script>

<style lang="less" scoped>
.search{
  display: flex;
  align-items: center;
  justify-content: center;

  .menu{
    margin-bottom: 10px;
  }
}
</style>
