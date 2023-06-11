<template>
  <div class="home">
    <a-card style="width: 1000px" :body-style='{padding:0}' class="homeCard">
      <template #title>
        <div class="my-title">
          <div class="titleText">
            贴子详情
          </div>
<!--          <a-button type="link" @click="showPostModel">-->
<!--            <HighlightOutlined />-->
<!--            我要发帖-->
<!--          </a-button>-->
        </div>
      </template>

      <div class="postList">
        <a-comment class="postItem" v-for="item in post.postList" :key="item.postID">
          <template #actions>
            <span key="comment-basic-reply-to" @click="collectPost(item.postID,item.userID,item.message)">收藏</span>
          </template>
          <template #author><a>{{ item.name }}</a></template>
          <template #avatar>
            <a-avatar
                :src="item.imgurl"
                :alt="item.name"
            />
          </template>
          <template #content>
            <p class="contentMessage">
              {{item.message}}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="moment().format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ moment().fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </div>


      <div class="commentList">
        <a-list
            v-if="post.comments.length"
            :data-source="post.comments"
            :header="`${post.comments.length} ${post.comments.length > 1 ? '回复' : ''}`"
            item-layout="horizontal"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-comment
                  :author="item.userID.name"
                  :avatar="item.userID.imgurl"
                  :content="item.message"
                  :datetime="item.time"
              />
            </a-list-item>
          </template>
        </a-list>
        <a-comment>
          <template #avatar>
            <a-avatar
                :src="userInfo.imgurl"
                :alt="userInfo.name"
            />
          </template>
          <template #content>
            <a-form-item>
              <a-textarea :rows="4" v-model:value="commentVlaue" />
            </a-form-item>
            <a-form-item>
              <a-button :loading="submitting" type="primary" @click="sendComment">
                评论
              </a-button>
            </a-form-item>
          </template>
        </a-comment>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, reactive,ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import { storeToRefs } from 'pinia'
import { user } from '../../store/login.js'
const userStore = user();
let { token,userInfo} = storeToRefs(userStore);
import moment from 'moment';
const router = useRouter()
const route = useRoute()
const {ctx,proxy} = getCurrentInstance()

let post = reactive({
  postList:[],
  comments:[]
})

let commentVlaue = ref('')
let submitting = ref(false)
const getPost = async (type,data)=>{
  let res = await proxy.https.getPost({type,querys:data})
  console.log(res)
  post.postList = [...res.data]
}

//收藏贴子
const collectPost = async (pid,fromUserID,message)=>{
 let res = await proxy.https.collectPost({uid:userInfo.value.id,fromUserID,pid,message})
  console.log(res)
}

//发送评论
const sendComment = async ()=>{
  submitting.value = true
  let res = await proxy.https.sendComment({uid:userInfo.value.id,pid:route.query.postID,message:commentVlaue.value})
  console.log(res)
  submitting.value = false
  //模拟数据
  let data = {
    userID:{
      name:userInfo.value.name,
      imgurl:userInfo.value.imgurl,
    },
    message:commentVlaue.value,
    time:new Date()
  }
  console.log(post.comments)
  post.comments.push(data)
}
//获取评论
const getComment = async (data)=>{
  let res = await proxy.https.getComment({postID:data})
  console.log(res)
  post.comments = [...res.data]
}
onMounted(()=>{
  getPost('postID',route.query.postID)
  getComment(route.query.postID)
})
</script>

<style lang="less" scoped>
.home{
  display: flex;
  align-items: center;
  justify-content: center;
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

.commentList{
  margin: 10px 30px;
}
</style>
