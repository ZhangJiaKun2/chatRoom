<template>
  <a-card class="chatContent" :head-style='{textAlign:"center"}' :body-style='{padding:0}'>
  <template #title>
    {{ route.query.fname }}
  </template>
  <div class="chatwithfriend">
    <div class="chatBody" ref="chatBody">
      <div :style="[item.from===route.query.uid ? {flexDirection:'row-reverse'}:{flexDirection: 'row'}]" class="userMessage" v-for="(item,index) in messageInfo" :key="item.time">
        <img class="userAvatar" :src="item.imgurl" alt="">
        <div class="textMessage" v-if="!parseInt(item.types)">
          {{item.message}}
        </div>
        <div class="my-img" v-else>
<!--          <img class="sendImg"  :src="" alt="">-->
          <chat-image class="sendImg" :ref="(el)=>chatImageArray[index]=el"  :imgSrc="item.message"></chat-image>
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


// console.log(proxy.emoji,'emoji')

const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

// const reload = inject('reload')

let messageInfo = ref([])

let sendMessage = ref('')

let routeQueryFid = ref(route.query.fid)

let chatImageArray = ref([])

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
    proxy.$socket.io.emit('OneToOneMsg',data.msg,data.uid,data.fid,data.types,data.time,data.imgurl)
  }else if(route.query.chatType === 'group'){
    proxy.$socket.io.emit('groupMsg',data.msg,data.uid,data.fid,data.types,data.time,data.imgurl)
  }

}

//消息发送
const sendMsgSockets = async ()=>{
  let newData = {
    from:sessionStorage.getItem('uid'),  //发送方
    types:0,                                 //消息类型  0文字消息  1图片消息
    message:sendMessage.value,               //消息内容
    imgurl:userInfo.value.imgurl,            //发送方的头像
    time:new Date()
  }
  //添加到渲染数据中
  messageInfo.value.push(newData)
  positionScroll()     //滚动条移动
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
  console.log(chatImageArray.value,chatImageArray.value.length)
  // console.log(e.target.files)
  let fileList = e.target.files
  //前端读取图片
  const fileReader = new FileReader();
  fileReader.readAsDataURL(fileList[0]);
  fileReader.onload = async (event) => {   //读取文件完成后的回调
      const {result} = event.target;
      console.log(result)
      let newData = {
        from:sessionStorage.getItem('uid'),
        types:1,
        message:result,
        imgurl:userInfo.value.imgurl,
        time:new Date()
      }
      positionScroll()
      console.log(newData)
      messageInfo.value.push(newData)
      console.log(chatImageArray.value,chatImageArray.value.length)

      //在页面更新以后 才能获取到组件，，调用子组件方法 上传图片
      nextTick(async ()=>{
        console.log(chatImageArray.value,chatImageArray.value.length)
        let url = await chatImageArray.value[chatImageArray.value.length-1].onLoad(fileList)
        console.log(url)
        sendMsgSocket({
          msg:url,
          uid:sessionStorage.getItem('uid'),
          fid:sessionStorage.getItem('fid'),
          types:1,
          time:newData.time,
          imgurl:userInfo.value.imgurl
        })
      })
    // console.log(res)

  };

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
