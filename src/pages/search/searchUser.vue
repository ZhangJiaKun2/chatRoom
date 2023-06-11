<template>
  <div class="searchUser">
    <a-card style="width: 430px" :body-style='{padding:0}' v-for="item in searchUser.searchUserList" :key="item._id">
      <div class="userMsg">
        <div class="avatar">
          <img class="userAvatar" :src="item.imgurl" alt="">
        </div>

       <div class="userDetail">
         <div class="username">
           {{ item.name }}
         </div>
         <div class="useremail">
           {{ item.email }}
         </div>
         <div class="userexplain">
           {{item.explain}}
         </div>
         <div class="applyFriend" >
           <a-button type="primary" size="small" v-if="!item.isFriend" @click="applyFriend(item._id)">添加好友</a-button>
           <div v-else :style="{marginRight:'17px',color:'#999'}">已添加</div>
         </div>

       </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, proxyRefs,reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import { storeToRefs } from 'pinia'
import { user } from '../../store/login.js'
const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

let router = useRouter()
let route = useRoute()
let {cxt,proxy} = getCurrentInstance()
let searchUser = reactive({
  searchUserList:[]
})
console.log(route.query.keyWord,'user')

//好友申请
const applyFriend = async (fid)=>{
  let res = await proxy.https.applyFriend({uid:userInfo.value.id,fid,msg:`我是${userInfo.value.name}`})
  console.log(res)
}

const getSearchUser = async ()=>{
  console.log(route.query.keyWord)
  let result = await proxy.https.getUsesrList({data:route.query.keyWord})
  let fliterRes = result.data.filter(item=>{
    return item._id !== userInfo.value.id
  })
  fliterRes.forEach(async item=>{
    let res = await proxy.https.isFriend({uid:userInfo.value.id,fid:item._id})
    console.log(res)
    item.isFriend = res.state
  })
  searchUser.searchUserList = [...searchUser.searchUserList,...fliterRes]
}

onMounted(()=>{
  getSearchUser()
})
</script>

<style lang="less" scoped>
.searchUser{
  padding: 0 40px 20px 40px;
  display: flex;
  align-content: flex-start;
  flex-wrap:wrap;
  justify-content: space-between;
  .userMsg{
    display: flex;
    align-items: center;
    height: 160px;

    .avatar{
      margin:0 10px ;
      .userAvatar{
        width: 130px;
        height: 130px;
      }
    }
    .userDetail{
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 140px;
      width: 280px;
      .username{
        font-size: 20px;
        font-weight: 600;
      }
      .useremail{
        font-size: 13px;
        font-weight: 400;
      }
      .userexplain{
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1; /** 显示的行数 **/
        overflow: hidden;  /** 隐藏超出的内容 **/
      }
      .applyFriend{
        display: flex;
        justify-content: flex-end;
        margin-right: 10px;
      }

    }

  }
}
</style>
