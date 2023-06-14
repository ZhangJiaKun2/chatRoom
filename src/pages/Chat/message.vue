<template>
  <a-card class="chatContent" :head-style='{textAlign:"center"}' :body-style='{padding:0}'>
  <template #title>
    {{ route.query.fname }}
  </template>
  <div class="chatwithfriend">
    <div class="chatBody" ref="chatBody">
      <div :style="[item.from===route.query.uid ? {flexDirection:'row-reverse'}:{flexDirection: 'row'}]" class="userMessage" v-for="item in messageInfo" :key="item.time">
        <img class="userAvatar" :src="item.imgurl" alt="">
        <div class="textMessage" v-if="!parseInt(item.types)">
          {{item.message}}
        </div>
        <div class="my-img" v-else>
          <img class="sendImg"  :src="item.message" alt="">
        </div>
      </div>
    </div>
    <div class="inputBox">
      <div class="toolBar">
        <SmileOutlined :style="{color:'#999',fontSize:'20px',paddingRight:'10px'}"/>
        <PictureOutlined :style="{color:'#999',fontSize:'20px'}" @click="selectPic"/>
      </div>
      <div class="inputMessage">
        <a-textarea v-model:value="sendMessage"  :rows="4" />
      </div>
      <div class="sendMessage">
        <a-button type="primary" @click="sendMsgSockets">发送</a-button>
<!--        <div v-for="(item,index) in emoji">-->
<!--          {{item}}-->
<!--        </div>-->
      </div>
    </div>
  </div>
</a-card>

  <input type="file" class="inputFile" @change="onchangede">
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance, onMounted, ref, watch, inject, nextTick, onBeforeMount} from "vue";
const {ctx,proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()
import {user} from "../../store/login.js";
import {storeToRefs} from "pinia";

console.log(proxy.emoji,'emoji')

const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

// const reload = inject('reload')

let messageInfo = ref([])

let sendMessage = ref('')

let routeQueryFid = ref(route.query.fid)

const sockets = {
  OneToOneMsg(data) {
    console.log(data);
    let newData = {
      from:data.fromid,
      types:data.type,
      message:data.msg,
      imgurl:data.imgurl,
      time:data.time
    }
    messageInfo.value.push(newData)
  },
  getOneToOneMsg(data){
    console.log(data)
  },

  groupMsg(data){
    console.log(data)
  },
  groupmsg(data){
    console.log(data,'groupmsg')
    let newData = {
      from:data.fromid,
      types:data.type,
      message:data.msg,
      imgurl:data.imgurl,
      time:data.time
    }
    messageInfo.value.push(newData)
  }
};



const sendMsgSocket = (data)=>{
  // 判断是群聊 还是 一对一
  if(route.query.chatType === 'oneUser'){
    console.log(12)
    proxy.$socket.io.emit('OneToOneMsg',data.msg,data.uid,data.fid,data.types,data.time,data.imgurl)
  }else if(route.query.chatType === 'group'){
    console.log(11)
    proxy.$socket.io.emit('groupMsg',data.msg,data.uid,data.fid,data.types,data.time,data.imgurl)
  }

}

//消息发送 测试
const sendMsgSockets = async ()=>{
  let newData = {
    from:sessionStorage.getItem('uid'),
    types:0,
    message:sendMessage.value,
    imgurl:userInfo.value.imgurl,
    time:new Date()
  }
  //添加到渲染数据中
  messageInfo.value.push(newData)
  positionScroll()
  //将数据保存到数据库
  if(route.query.chatType === 'oneUser'){
    await proxy.https.mySendMessage({uid:sessionStorage.getItem('uid'),fid:sessionStorage.getItem('fid'),msg:sendMessage.value,type:0}).then(
        res=>{
          //成功以后  通过websocket发送消息
          sendMsgSocket({
            msg:sendMessage.value,uid:sessionStorage.getItem('uid'),
            fid:sessionStorage.getItem('fid'),
            type:0,
            time:new Date(),
            imgurl:userInfo.value.imgurl,
          })
          //消息发送框清空
          sendMessage.value = ''
          positionScroll()
        }
    )
  }else if(route.query.chatType === 'group'){
    console.log(1111111)
    await proxy.https.sendGroupMsg({uid:sessionStorage.getItem('uid'),gid:sessionStorage.getItem('fid'),msg:sendMessage.value,type:0}).then(
        res=>{
          //成功以后  通过websocket发送消息
          sendMsgSocket({
            msg:sendMessage.value,uid:sessionStorage.getItem('uid'),
            fid:sessionStorage.getItem('fid'),
            type:0,
            time:new Date(),
            imgurl:userInfo.value.imgurl,
          })
          //消息发送框清空
          sendMessage.value = ''
          positionScroll()
        }
    )

  }
}

//获取聊天记录
const getRecord = (nowPage,pageSize)=>{
  if(sessionStorage.getItem('chatType') === 'oneUser'){
    //查询该好友的消息
    console.log(sessionStorage.getItem('uid'),sessionStorage.getItem('fid'))
    proxy.https.getMsg({uid:sessionStorage.getItem('uid'),fid:sessionStorage.getItem('fid'),nowPage,pageSize}).then(
        res=>{
          console.log(res)
          messageInfo.value = res.data.reverse();
        }
    )
  }else if(sessionStorage.getItem('chatType') === 'group'){
    //查询群消息
    console.log(sessionStorage.getItem('fid'))
    proxy.https.getGroupMsg({gid:sessionStorage.getItem('fid'),nowPage,pageSize}).then(
        res=>{
          console.log(res)
          messageInfo.value = res.data.reverse();
        }
    )
  }
}
//socket聊天数据接收
// const getOneToOneMsgSocket = ()=>{
//   proxy.$socket.io.on('OneToOneMsg',(msg,fromid)=>{
//     console.log('后端发送的消息为'+fromid+'和'+msg)
//   })
//
//   proxy.$socket.io.on('groupmsg',(a,b,c,d)=>{
//     console.log(a,b,c,d,'groupmsg接收的消息')
//   })
// }

//选择图片上传
const selectPic = ()=>{
  document.querySelector('.inputFile').click()
}

// let controller
// controller = new AbortController();
// // let signal = controller.signal
const onchangede = (e)=>{
  let formData = new FormData();
  // console.log(e.target.files)
  let fileList = e.target.files
  //前端读取图片
  const fileReader = new FileReader();
  fileReader.readAsDataURL(fileList[0]);
  fileReader.onload = (event) => {   //读取文件完成后的回调
      const {result} = event.target;
      let newData = {
        from:sessionStorage.getItem('uid'),
        types:1,
        message:result,
        imgurl:userInfo.value.imgurl,
        time:new Date()
      }
      console.log(newData)
      messageInfo.value.push(newData)
  };
  formData.append("user", sessionStorage.getItem('uid'));
  formData.append("module", 'friend/'+sessionStorage.getItem('fid'));
  for (let i = 0; i < fileList.length; i++) {
    console.log(fileList[i])
    let suffix = fileList[i].type.split('/')[1]
    formData.append("type", suffix);
    formData.append('file', fileList[i])
  }
  proxy.https.uploadFiles(formData).then(
      res=>{
        console.log(res)
        res.data.forEach(async item=>{
          let path = item.path.replace('data',"").replaceAll('\\',"/")
          let url = 'http://localhost:3000'+path   //整合url
          //先存进数据库
          if(sessionStorage.getItem('chatType') === 'oneUser'){
            await proxy.https.mySendMessage({uid:sessionStorage.getItem('uid'),fid:sessionStorage.getItem('fid'),msg:url,type:1})
          }else {
            await proxy.https.sendGroupMsg({uid:sessionStorage.getItem('uid'),gid:sessionStorage.getItem('fid'),msg:url,type:1})
          }
          //通过socket发送消息
          sendMsgSocket({
            msg:url,
            uid:sessionStorage.getItem('uid'),
            fid:sessionStorage.getItem('fid'),
            types:1,
            time:new Date,
            imgurl:userInfo.value.imgurl
          })
        })
        // console.log(img.img)
        positionScroll()
      },
      rej=>{
        console.log(rej)
      }
  )
}


//将滚动条定位到最低部
const positionScroll = ()=>{
  nextTick(()=>{
    const chatBody = document.querySelector('.chatBody')
    console.log(chatBody.scrollHeight,111)
    // chatBody.scrollTop = chatBody.scrollHeight;
    chatBody.scrollTo({
      top: chatBody.scrollHeight ,
      behavior: "smooth"
    })
  })
}

//当图片加载完成后
// const isOnload = ()=>{
//   const chatBody = document.querySelector('.chatBody')
//   console.log(chatBody.scrollHeight,111)
//   // chatBody.scrollTop = chatBody.scrollHeight;
//   chatBody.scrollTo({
//     top: chatBody.scrollHeight ,
//     behavior: "smooth"
//   })
// }

onBeforeMount(()=>{
  proxy.$addSockets(sockets, proxy);
  console.log(route.query)
  getRecord(0,10)
  // getOneToOneMsgSocket()
})

onMounted(()=>{
  setTimeout(()=>{
    const chatBody = document.querySelector('.chatBody')
    console.log(chatBody.scrollHeight,111)
    chatBody.scrollTop = chatBody.scrollHeight;
    chatBody.scrollTo({
      top: chatBody.scrollHeight ,

    })
  },1000)

})


</script>

<style lang="less" scoped>
.chatContent{
  width: 500px;

  .chatwithfriend{
    display: flex;
    height: 510px;
    flex-direction: column;
    justify-content: space-between;
    .chatBody{
      overflow-y: auto;
      margin: 10px 10px;
      //聊天消息
      .userMessage{
        display: flex;
        margin: 10px 3px;
        //头像部分
        .userAvatar{
          width: 50px;
          height: 50px;
          margin-right: 7px;
          margin-left: 7px;
          border-radius: 20%;
        }
        .textMessage{
          color: #444;
          background-color: #f6f6f6;
          word-wrap: break-word;
          border-radius: 8px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          font-size: 14px;
          letter-spacing: .4px;
          line-height: 26px;
          max-width: 388px;
          min-height: 40px;
          padding: 10px 10px;
          position: relative;
          text-align: left;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .my-img{
          max-width: 400px;
          .sendImg{
            border-radius: 8px;
            max-width: 240px;
          }
        }
      }
    }

    .inputBox{
      .toolBar{
        padding:3px 10px ;
      }
      .inputMessage{

      }
      .sendMessage{
        float: right;
        padding: 5px 10px 5px;
      }
    }
  }
}
.inputFile{
  display: none;
}
</style>
