<template>
  <div class="chat">
    <a-card class="chatCard" :body-style='{padding:0}'>
      <template #title>
       <div class="title">
         <a-input-search
             v-model:value="searchValue"
             placeholder="输入搜索好友"
             style="width: 200px"
             @search="searchFriend"
         />
         <div class="addFriend" id="components-badge-demo-dot" @click="applyVisible=true">
           <a-badge :count="isHasFriendApply" dot>
             <UserAddOutlined :style="{fontSize:'18px',marginLeft:'5px'}" />
           </a-badge>
         </div>
         <UsergroupAddOutlined @click="creatGroupVisible=true" :style="{fontSize:'18px',marginLeft:'5px'}" />
       </div>
      </template>
      <div class="mainList">
        <div style="height:500px;overflow-y:auto">
          <div class="friendList" @click="changeChatObject(item.id,item.name)" v-for="item in friend.friendList" :key="item.id">
            <img class="userIMG" :src="item.imgurl" alt="">
            <div class="countain">
              <div class="username">
                {{ item.name }}
                <span class="chatTime" v-format-date>
                  {{ item.lastTime }}
                </span>
              </div>
              <div class="chatMessage">{{parseInt(item.types)===1 ? '【图片】':item.lastMsg}}</div>
            </div>
          </div>

          <div class="friendList" @click="changeChatObject(item.id,item.name)" v-for="item in friend.groupList" :key="item.gid">
            <img class="userIMG" :src="item.imgurl" alt="">
            <div class="countain">
              <div class="username">
                {{ item.name }}
                <span class="chatTime" v-format-date>
                  {{ item.time }}
                </span>
              </div>
              <div class="chatMessage">{{parseInt(item.types)===1 ? '【图片】':item.lastMsg}}</div>
            </div>
          </div>
        </div>
      </div>
    </a-card>

<!-- 聊天消息区  title名为好友名  .userMessage里面的头像为好友头像    当前为模拟页面-->
    <router-view v-if="isRouteAlive"></router-view>
  </div>

<!--  好友申请表模态框-->
  <a-modal v-model:visible="applyVisible" title="好友申请">
    <div class="applyList">
    <div class="applyFrienditem"  v-for="item in friend.applyFriendList" :key="item.id">
     <div class="mainCon">
       <img class="userIMG" :src="item.imgurl" alt="">
       <div class="countain">
         <div class="username">
           {{ item.name }}
         </div>
         <div class="chatMessage">{{item.lastMsg}}</div>
       </div>
     </div>
      <div class="apply">
        <a-button type="primary" size="small" :style="{marginBottom:'15px'}" @click="agreeApply(item.id)">同意</a-button>
        <a-button size="small" danger @click="disagreeApply(item._id)">拒绝</a-button>
      </div>
    </div>
    </div>
  </a-modal>

<!--  建群模态框-->
  <a-modal v-model:visible="creatGroupVisible" title="创建群聊" @ok="handleOk">
    <div class="applyList">
        <div class="mainCon">
          <a-form :model="formState" :label-col="{span:4}" :wrapper-col="{span:19}">
            <a-form-item label="群头像">
              <a-upload
                  v-model:file-list="fileList"
                  name="groupImgUrl"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  @change="uploadFileChange"
                  :multiple="false"
                  :disabled="isDisabled"

              >
                <img v-if="formState.imageUrl" :src="formState.imageUrl"  :style="{width: '90px',height: '90px'}" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="群名称">
              <a-input v-model:value="formState.groupName" placeholder="请输入群昵称"/>
            </a-form-item>
            <a-form-item label="选人创建">
              <a-checkbox-group v-model:value="formState.groupMumber" >
                <a-checkbox v-for="(item, index) in friend.friendList" :value="item" :key="index" style="margin-left: 0;">
                  <img :style="{height:'40px',width:'40px'}" :src="item.imgurl" alt="">
                  {{ item.name }}
                </a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-form>

      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {getCurrentInstance, onBeforeMount, onMounted, ref, reactive, nextTick, provide, watch} from "vue";
import {user} from "../../store/login.js";
import myDate from '../../utils/date.js'
import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";

const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

const {ctx,proxy} = getCurrentInstance()

const router = useRouter()
const route = useRoute()

//刷新路由
let isRouteAlive = ref(true)

let searchValue = ref('')

watch(searchValue, (newValue,oldValue)=>{
        if(newValue === ''){
          getFriendsList({uid:userInfo.value.id},0,'allFriend')
        }
    }
)

let friend = reactive({
  friendList:[],
  groupList:[],
  applyFriendList:[]
})
// 好友申请数==》用来控制小红点
let isHasFriendApply = ref(0)
let creatGroupVisible = ref(false)  //建群的模态框
let applyVisible = ref(false)   //好友申请模态框

//创建群的表单数据
const fileList = ref([])
let formState = reactive({
  uid:userInfo.value.id,
  groupName:'',
  imageUrl:'',
  groupMumber:[],
})
//群头像上传时的loading
let loading = ref(false)
//是否禁用上传框
let isDisabled = ref(false)
let inputMessage = ref('')

let updateTime = ref('')
//socket
const sockets = {
  chatOneToOneMsg(data) {
    console.log(data);
    //根据 查找对应好友
    // updateTime.value = data.time
    friend.friendList.forEach((item)=>{
      if(item.id === data.fromid){
        console.log(11)
        if(data.type){
          item.lastMsg = '【图片】'
        }else{
          item.lastMsg = data.msg
        }
        // item.lastMsg = data.msg
        item.lastTime = data.time
      }else if(item.id === data.toid){
        console.log(22)
        if(data.type){
          item.lastMsg = '【图片】'
        }else{
          item.lastMsg = data.msg
        }
        // item.lastMsg = data.msg
        item.lastTime = data.time
      }
    })
  }
};



const searchFriend = ()=>{
  getFriendsList({uid:userInfo.value.id,keyWord:searchValue.value},0,'getFriendByName')
}

//获取好友列表
const getFriendsList = async (uid,type)=>{
  console.log(userStore.userInfo,'getFriend')
  await proxy.https.getFriendsList({uid,type}).then(
      res=>{
        console.log(res)

        if (res.type === 'isFriend'){
          console.log(res.data)
          friend.friendList = [...res.data]
        }else{
          friend.applyFriendList = [...res.data]
        }
        console.log(friend.friendList)
      }
  )
}
//获取群列表
const getGroupList = async (uid)=>{
  let result = await proxy.https.getGroupList({uid})
  friend.groupList = [...result.data]
}

//格式化时间
const formatDate = (date)=>{
  return myDate.dateTime(date)
}

//获取总的未读消息
const getUnReadMsg = ()=>{
  proxy.https.getUnReadMsg({uid:userInfo.value.id,fid:'643bc3c8f58b2afd0405f4e1'}).then(
      res=>{

        console.log(res)
      }
  )
}

//同意添加好友
const agreeApply = async (fid)=>{
  console.log(fid)
  let res = await proxy.https.updateFriendStatus({uid:userInfo.value.id,fid})
  await getFriendsList( userInfo.value.id, 'isApplyFriend')
  await getFriendsList( userInfo.value.id, 'isFriend')

  console.log(res,'agree')
}
//拒绝添加好友（删除好友）
const disagreeApply = async (fid)=>{
  let res = await proxy.https.deleteFriend({uid:userInfo.value.id,fid})
  await getFriendsList( userInfo.value.id, 'isApplyFriend')
  await getFriendsList( userInfo.value.id, 'isFriend')
  console.log(res,'disagree')
}

//切换聊天对象  ===> 获取聊天信息
const changeChatObject = (fid,fname)=>{
  //获取与好友对应的聊天信息  uid,fid,nowPage,pageSize
  isRouteAlive.value = false
  console.log(userInfo.value.id)
  //路由大路由跳转以后要删除
  sessionStorage.setItem('fid',fid)
  sessionStorage.setItem('uid',userInfo.value.id)
  router.push({path:'/message',query:{fid,uid:userInfo.value.id,fname}})
  nextTick(()=>{
    isRouteAlive.value = true
  })
}

const beforeUpload = ()=>{
  return false  //阻止组件的默认上传
}
//群头像上传
const uploadFileChange = async info => {
  isDisabled.value = true
  loading.value = true
  let suffix = info.file.type.split('/')[1]
  // 下面是将blob转为formData
  let formData = new FormData();
  formData.append("user", userInfo.value.id);
  formData.append("module", 'groupImgUrl');
  formData.append("type", suffix);
  formData.append("file", info.file);

  let result = await proxy.https.uploadFiles(formData)
  loading.value = false
  isDisabled.value = false
  result.data.forEach(item=>{
    let path = item.path.replace('data',"").replaceAll('\\',"/")
    formState.imageUrl = 'http://localhost:3000'+path
  })
};
//创建群聊模态框点击ok
const handleOk = async (e) => {
  formState.groupMumber.unshift({id:userInfo.value.id})
  proxy.https.createGroup(formState).then(
      res=>{
        console.log(res,'res')
      },
      rej=>{
        console.log(rej)
      }
  )
  // console.log(11,result)

};

//socket 聊天数据接收
const receiveSocketMsg = ()=>{

}

//自定义指令
const vFormatDate = {
  mounted: (el) => {
     el.innerHTML = myDate.dateTime(el.innerHTML)
  },
  // updated:(el)=>{
  //   el.innerHTML = myDate.dateTime(updateTime.value)
  // }
}
onMounted(()=>{
  proxy.$addSockets(sockets, proxy);
  getFriendsList(userInfo.value.id,'isFriend') //获取好友列表
  getFriendsList(userInfo.value.id,'isApplyFriend')   //获取申请中的好友列表
  getGroupList(userInfo.value.id)
  getUnReadMsg()

})

</script>

<style lang="less" scoped>
.chat{
  display: flex;
  justify-content: center;
  .chatCard{
    width:290px;

    .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 5px;
    }
  }

}

#components-badge-demo-dot .anticon-notification {
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 24px;
}

.mainList {
  .friendList {
    cursor:pointer;
    padding: 12px 20px 12px 29px;
    //border: red 1px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .userIMG {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 20%;
    }
    .countain{
      flex: auto;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .username {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        font-weight: bold;

        .chatTime{
          font-size: 10px;
          font-weight: 200;
          color: #999;
        }
      }
      .chatMessage{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}


.applyList{
  .applyFrienditem{
    display: flex;
    justify-content: space-between;
    width: 470px;
    height: 100px;
    margin: 10px 0;
    .mainCon{
      display: flex;
      .userIMG{
        width: 100px;
        height: 100px;
        margin-right: 10px;
      }
      .countain{
        .username{
          font-size: 17px;
          font-weight: 600;
          margin: 10px 0;
        }
      }
    }
    .apply{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

  }
}

</style>
