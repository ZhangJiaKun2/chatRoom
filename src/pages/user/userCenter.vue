<template>
  <div class="userCenterMain">
    <a-card  style="width: 1000px" :body-style='{padding:0}'>
     <div class="mainTop">
       <div class="userAvatar">
         <img class="userAvatar-img" :src="uInfo.imgurl" alt="">
       </div>
       <div class="userInfo">
         <span class="userName">{{ uInfo.name }}</span>
         <div class="description">
            <div>{{ uInfo.explain }}</div>
         </div>
         <div class="edit">
           <!-- 个人信息是否可更改根据 用户id和其他人的id进行对比 -->
           <a-button type="primary" @click="toEdit(userStore.userInfo.id)">编辑个人信息</a-button>
         </div>
       </div>
     </div>
    </a-card>
    <hr>

    <a-card  style="width: 1000px" :body-style='{padding:0}'>
      <a-menu v-model:selectedKeys="currentKey" mode="horizontal">
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
import {getCurrentInstance,ref,onMounted} from 'vue'
import {useRouter,useRoute} from "vue-router";
import { storeToRefs } from 'pinia'
import { user } from '../../store/login.js'

const {ctx,proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const userStore = user();
let { token,userInfo} = storeToRefs(userStore);
const uInfo = ref({})
let currentKey = ref([])
const navData = [
  {
    key:'1',
    title:'贴子',
    icon:'homeFilled',
    router:'/userPost'
  },
  {
    key:'2',
    title:'收藏',
    icon:'messageFilled',
    router:'/collect'
  }
]

const toRouterAndChangeKey = (path,key)=>{
  router.push({path,query:{id:userInfo.value.id}})
  if(key) {
    console.log(key)
    currentKey.value[0] = key
    sessionStorage.setItem('keys',key)
  }
}
//
const toEdit = (uid)=>{
  router.push({path:'/edit',query:{uid}})
}

const getUserDetail = ()=>{
  console.log(route.query.uid)
  proxy.https.getUserDetails({id:route.query.id}).then(
      res=>{
        console.log(res)
        uInfo.value = res.data
      }
  )
}

onMounted(()=>{
  getUserDetail()
})
</script>

<style lang="less" scoped>
.userCenterMain{
  display: flex;
  align-items: center;
  flex-direction: column;
  .mainTop{
    display: flex;
    margin: 20px;
    .userAvatar{
      width: 150px;
      height: 150px;
      .userAvatar-img{
        width: 151px;
        height: 151px;
        border: 4px #999 solid;
        border-radius: 4px;

      }
    }
    .userInfo{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 800px;
      padding: 16px 0 0 32px;
      line-height: 30px;
      .userName{
        font-size: 26px;
        font-synthesis: style;
        font-weight: 600;
      }
      .description{
        div{
          width: 300px;
          height: 40px;
          line-height: 20px;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 2; /** 显示的行数 **/
          overflow: hidden;  /** 隐藏超出的内容 **/
        }
      }
      .edit{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
