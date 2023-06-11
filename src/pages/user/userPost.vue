<template>
  <!--  公共的 用户详情页  根据传递进来的id进行 显示   所以进入详情页的时候一定要带上 用户的id-->
  <div class="postList">
    <a-comment class="postItem" v-for="item in post.postList" :key="item.postID">

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
        <a-tooltip :title="moment().format('YYYY-MM-DD HH:mm:ss')">
          <span>{{ moment().fromNow() }}</span>
        </a-tooltip>
      </template>
    </a-comment>
  </div>
</template>

<script setup>
import {useRouter,useRoute} from "vue-router";
import moment from 'moment';
import {ref, getCurrentInstance, onMounted, reactive} from 'vue'

const {ctx,proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const post = reactive({
  postList : []
})
console.log('userPost',route.query)

const getMyPost = async (type,data)=>{
 let res = await proxy.https.getPost({type,querys:data})
  console.log(res)
  post.postList = [...res.data]
}
//点击 内容跳转到 贴子详情
const enterPostDetail = (pid)=>{
  router.push({path:'/postDetail', query: {postID: pid}})
}
onMounted(()=>{
  getMyPost('id',route.query.id)
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
