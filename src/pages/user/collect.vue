<template>
  <div class="postList">
    <a-comment class="postItem" v-for="item in post.postList" :key="item.postID">

      <template #author><a>{{ item.fromUserID.name }}</a></template>
      <template #avatar>
        <a-avatar
            :src="item.fromUserID.imgurl"
            :alt="item.fromUserID.name"
        />
      </template>
      <template #content>
        <p class="contentMessage" @click="enterPostDetail(item.postID)">
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
</template>

<script setup>
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import moment from 'moment';
import {useRoute, useRouter} from "vue-router";
const {ctx,proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()
let post = reactive({
  postList:[]
})
//获取收藏的贴子
const getCollectPost =async (uid)=>{
 let res = await proxy.https.getCollectPost({uid})
  console.log(res)
  post.postList = [...res.data]
}
//点击 内容跳转到 贴子详情
const enterPostDetail = (pid)=>{
  router.push({path:'/postDetail', query: {postID: pid}})
}
onMounted(()=>{
  getCollectPost(route.query.id)
})
</script>

<style lang="less" scoped>
.postList{
  margin: 10px 20px;

  .postItem{
    margin: 5px;
    cursor: pointer;
  }
}
</style>
