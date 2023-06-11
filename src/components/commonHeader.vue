<template>
  <div class="logo" />
  <div class="navigator">
    <a-menu
        theme="light"
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
    >
      <a-menu-item v-for="item in navData" :key="item.key" class="myItem" @click="toRouterAndChangeKey(item.router,item.key)">
        <template #icon>
          <component :is="item.icon"></component>
        </template>
        <span class="menuTitle">{{item.title}}</span>
        <!--        {{item.title}}-->
      </a-menu-item>
    </a-menu>
    <div class="searchBox">
      <a-input-search
          v-model:value="searchValue"
          placeholder="请输入内容"
          enter-button
          @search="onSearch"
      />
    </div>
    <div class="UserInfo" v-if="isLogin">
      <a-dropdown
          placement="bottom"
      >
        <span class="UserBox">
          <img class="UserImg" :src="userInfo.imgurl" alt="">
        </span>
        <template #overlay>
          <div class="mymenu">
            <a-menu>
              <a-menu-item @click="toUserCenter('/userCenter')">
                个人中心
              </a-menu-item>
              <hr>
              <a-menu-item @click="mylogOut">
                退出登录
              </a-menu-item>
            </a-menu>
          </div>
        </template>
      </a-dropdown>
    </div>

    <div class="logOut" v-if="!isLogin">
      <a-button type="primary" size="large" @click="login">登录</a-button>
      <a-button size="large" @click="toRouterAndChangeKey('/signUp')" style="margin-left: 5px">注册</a-button>
    </div>
  </div>

<!--  //弹出登录框-->
  <a-modal v-model:visible="loginFormVisible" title="登录" @ok="handleOk" okText="登录" cancelText="取消">
    <a-form>
      <a-form-item class="item">
        <template v-slot:label>
          <span class="label">邮箱</span>
        </template>
        <a-input v-model:value="loginData.mail" placeholder="请输入邮箱" size="large">
          <template #prefix>
            <mail-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item class="item">
        <template v-slot:label>
          <span class="label">密码</span>
        </template>
        <a-input-password v-model:value="loginData.pwd" placeholder="请输入密码" size="large" autocomplete>
          <template #prefix>
            <key-outlined />
          </template>
        </a-input-password>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from "vue-router";
import { storeToRefs } from 'pinia'
import { user } from '../store/login.js'

const {ctx,proxy} = getCurrentInstance()
const router = useRouter()
const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

//data
let isLogin = ref(token.value)
let loginFormVisible = ref(false)
let selectedKeys = ref([])
let searchValue = ref('')
const navData = [
  {
    key:'1',
    title:'首页',
    icon:'homeFilled',
    router:'/home'
  },
  {
    key:'2',
    title:'聊天',
    icon:'messageFilled',
    router:'/chat'
  },

  // {
  //   key:'3',
  //   title:'apiTest',
  //   router:'/test'
  // }
]

const sockets = {
  login(data) {
    console.log(data);
  },
  msg(data){
    console.log(data)
  }
};

let loginData = reactive({
  mail:'',
  pwd:''
})

//methods
function login(){   //登录
  loginFormVisible.value = true
}
function toRouterAndChangeKey(path,key){   //路由跳转
  router.push(path)
  if(key) {
    console.log(key)
    selectedKeys.value[0] = key
    sessionStorage.setItem('keys',key)
  }
}

//前往用户详情页
const toUserCenter = ()=>{
  router.push({path:'/userCenter',query:{id:userInfo.value.id}})
}
function mylogOut(){
  userStore.logOut()
  isLogin.value = false
}

//搜索按钮
const onSearch = ()=>{
  router.push({path:'/search',query:{keyWord:searchValue.value}})
}

async function handleOk(){
  await proxy.https.login({data:loginData.mail,pwd:loginData.pwd}).then(
      res=>{
        console.log(res)
        if(res.data){
          userStore.storeUserInfo(res.data)
          loginFormVisible.value = false
          isLogin.value = true
          socketTset()
        }else{
          alert(res.msg)
        }
      },
      rej=>{
        console.log(rej)
      }
  )
}

//服务器接收消息测试
const socketTset = ()=>{
  proxy.$socket.io.on('msg',(id)=>{
    console.log('后端发送的消息为'+id)
  })
}

onMounted(()=>{
  proxy.$addSockets(sockets, proxy);
  if(userInfo.value){
    console.log(userInfo.value.id)
    proxy.$socket.io.emit('login',userInfo.value.id)
  }
  const keys = sessionStorage.getItem('keys')
  selectedKeys.value[0] ? selectedKeys.value[0] = '1' :selectedKeys.value[0] = keys
})
onBeforeUnmount(()=>{
  proxy.$removeSockets(sockets, proxy);
})
</script>

<style lang="less" scoped>
.myItem{
  span:first-child{
    font-size: 20px;
    margin:0;
  }
  .menuTitle{
    font-size: 20px;
  }
}

.UserBox{
  width: 45px;
  line-height: 40px;
  .myIcon{
    font-size: 20px;

  }
}
.UserImg{
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 5px;
}
.navigator{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  .searchBox{
    margin-top: 35px;
  }
}
.el-dropdown-link{
  span:first-child{
    font-size: 20px;
  }
}

.mymenu{
  margin-top: 20px;
}
</style>
