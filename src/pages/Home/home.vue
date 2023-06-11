<template>
  <div class="home">
    <a-card style="width: 1000px" :body-style='{padding:0}' class="homeCard">
      <template #title>
        <div class="my-title">
          <div class="titleText" @click="getPostList('all')">
            贴子
          </div>
          <a-button type="link" @click="showPostModel">
            <HighlightOutlined />
            我要发帖
          </a-button>
        </div>
      </template>

      <div class="postList">
        <a-comment class="postItem" v-for="item in post.postList" :key="item.postID">
          <template #actions>
            <span key="comment-basic-like">
              <a-tooltip title="赞">
                <template v-if="item.action === 'liked'">
                  <LikeFilled @click="like(item.postID)" />
                </template>
                <template v-else>
                  <LikeOutlined @click="like(item.postID)" />
                </template>
              </a-tooltip>
              <span style="padding-left: 8px; cursor: auto">
                {{ item.like.length }}
              </span>
            </span>
                  <span key="comment-basic-dislike">
              <a-tooltip title="踩">
                <template v-if="item.action === 'disliked'">
                  <DislikeFilled @click="dislike(item.postID)" />
                </template>
                <template v-else>
                  <DislikeOutlined @click="dislike(item.postID)" />
                </template>
              </a-tooltip>
              <span style="padding-left: 8px; cursor: auto">
                {{ item.display }}
              </span>
            </span>
            <span key="comment-basic-reply-to">回复</span>
          </template>
          <template #author><a>{{ item.name }}</a></template>
          <template #avatar>
            <a-avatar
                :src="item.imgurl"
                :alt="item.name"
            />
          </template>
          <template #content>
            <p class="contentMessage" @click="enterPostDetail(item.postID)">
              {{item.message}}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="moment(item.time).format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ moment(item.time).fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </div>

    </a-card>
  </div>

<!--  添加贴子的模态框 -->
  <a-modal v-model:visible="isShowPostModel" title="发帖内容" @ok="addPost">
    <template #okText>
      发送
    </template>
    <template #cancelText>
      取消
    </template>
    <a-textarea v-model:value="postTextMessage" placeholder="请输入发帖内容" :rows="4" />
  </a-modal>
</template>

<script setup>
import {ref, onMounted, onBeforeMount, onBeforeUnmount, reactive} from "vue";
import {getCurrentInstance} from "vue";
import moment from 'moment';
import { storeToRefs } from 'pinia'
import { user } from '../../store/login.js'
import {useRoute, useRouter} from "vue-router";
const userStore = user();
let { token,userInfo} = storeToRefs(userStore);

const {ctx,proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()

let postTextMessage = ref('')    //模态框文本域内容
let isShowPostModel = ref(false)   //模态框显示和隐藏

const showPostModel = ()=>{
  isShowPostModel.value = true
}

let post = reactive({
    postList:[]
})


//获取贴子列表
const getPostList = async (type,data)=>{
  let res = await proxy.https.getPost({type,querys:data,uid:userInfo.value.id})
  console.log(res)
  post.postList = [...res.data]
}
//添加贴子
const addPost = async ()=>{
  const res = await proxy.https.addPost({uid:userInfo.value.id,message:postTextMessage.value})
  console.log(res)
  isShowPostModel.value = false
}
//进入贴子详情页
const enterPostDetail = (postID)=>{
  router.push({path:'/postDetail',query:{postID}})
}

//点赞
const like = (pid)=>{
  console.log(pid,'pid')
  const postIndex = post.postList.findIndex(item=>{
    console.log(item.postID,pid)
    return item.postID === pid
  })
  console.log(postIndex,'index')
  //如果没有action
  if (post.postList[postIndex].action){
    post.postList[postIndex].action = ''
    //删除第一个
    post.postList[postIndex].like.splice(0,1)
    // delete post.postList[postIndex].like[0]
    //
    proxy.https.cancelLike({uid:userInfo.value.id,pid}).then(
        res=>{
          console.log(res)
        },
        rej=>{
          console.log(rej)
        }
    )
  }else if(post.postList[postIndex].action==='disliked' || post.postList[postIndex].action===''){     //有action 但是是disliked
    post.postList[postIndex].action = 'liked'
    //本地添加信息
    let likeData = {
      postID:pid,
      userID:userInfo.value.id,
      time:new Date()
    }
    post.postList[postIndex].like.unshift(likeData)
    //在数据库中添加点赞信息
    proxy.https.likePost({uid:userInfo.value.id,pid}).then(
        res=>{
          console.log(res)
        },
        rej=>{
          console.log(rej)
        }
    )
  }
}

//踩
const dislike = (pid)=>{
  console.log(pid)
  const postIndex = post.postList.findIndex(item=>{
    console.log(item.postID,pid)
    return item.postID === pid
  })
  //如果有action
  if (post.postList[postIndex].action){
    post.postList[postIndex].action = ''
    //删除第一个
    post.postList[postIndex].dislike.splice(0,1)
    // delete post.postList[postIndex].like[0]
    //
    proxy.https.cancelDislike({uid:userInfo.value.id,pid}).then(
        res=>{
          console.log(res)
        },
        rej=>{
          console.log(rej)
        }
    )
  }else if(post.postList[postIndex].action==='liked' || post.postList[postIndex].action===''){     //没有action 或者action为liked
    post.postList[postIndex].action = 'disliked'
    //本地添加信息
    let dislikeData = {
      postID:pid,
      userID:userInfo.value.id,
      time:new Date()
    }
    post.postList[postIndex].dislike.unshift(dislikeData)
    //在数据库中添加点踩信息
    proxy.https.dislikePost({uid:userInfo.value.id,pid}).then(
        res=>{
          console.log(res)
        },
        rej=>{
          console.log(rej)
        }
    )
  }

}
onMounted(()=>{
  getPostList('all')
  // getPostList('keyWord','神')
  // getPostList('id',userInfo.value.id)
})
</script>

<style lang="less" scoped>
.home{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
  .homeCard{
    .my-title{
      display: flex;
      justify-content: space-between;
      align-items: center;

      .titleText{
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}

.postList{
  margin: 10px 20px;

  .postItem{
    margin: 5px;
    cursor: pointer;
  }
}
</style>
