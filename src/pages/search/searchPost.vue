<template>
  <div class="home">
    <a-card style="width: 1000px" :body-style='{padding:0}' class="homeCard">


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
            <p class="contentMessage" @click="enterPostDetail">
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

const like = (data) => {
  data.like = 1;
  data.dislike = 0;
  data.action = 'liked';
  //修改贴子状态

};

const dislike = (data) => {
  data.like = 0;
  data.dislike = 1;
  data.action = 'liked';
};

//获取贴子列表
const getPostList = async (type,data)=>{
  let res = await proxy.https.getPost({type,querys:data})
  console.log(res)
  post.postList = [...res.data]
}
//进入贴子详情页
const enterPostDetail = ()=>{

}
onMounted(()=>{
  getPostList('keyWord',route.query.keyWord)
  // getPostList('keyWord','神')
  // getPostList('id',userInfo.value.id)
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
</style>
