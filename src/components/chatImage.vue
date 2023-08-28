<template>
 <div class="img_container">
   <div class="mask" v-if="isShowMark">
     <a-progress type="circle" :percent="progress" size="small" >
       <template #format="percent">
         <span style="color: #cccccc">{{ percent }}%</span>
       </template>
     </a-progress>
   </div>
   <a-image
       :width="200"
       :src="imgSrc"
       :preview="isPreview"
   />
 </div>
</template>

<script setup>
import {ref,onMounted,getCurrentInstance} from "vue";
import request from '../request/reAxios.js'
const props = defineProps({
  imgSrc:{
    required: true,
    type:String,
    default:''
  },
})
// const emits = defineEmits(['onLoad'])

const {proxy} = getCurrentInstance()
let isPreview = ref(true)
let progress = ref(0)
let isShowMark = ref(false)
const onLoad = async (fileList)=>{
  isPreview.value = false
  isShowMark.value = true
  console.log('start',fileList)
  let formData = new FormData();
  formData.append("user", sessionStorage.getItem('uid'));
  formData.append("module", 'friend/'+sessionStorage.getItem('fid'));
  for (let i = 0; i < fileList.length; i++) {
    console.log(fileList[i])
    let suffix = fileList[i].type.split('/')[1]
    formData.append("type", suffix);
    formData.append('file', fileList[i])
  }
  //发送请求上传 图片
  let res = await uploadFiles(formData)
  console.log(res)
  //因为只有一个图片，所以选择第0个
  let resImgMessage = res.data[0]
  //获取路径
  let path = resImgMessage.path.replace('data',"").replaceAll('\\',"/")
  let url = 'http://localhost:3000'+path   //整合url
  //先存进数据库
  if(sessionStorage.getItem('chatType') === 'oneUser'){
    await proxy.https.mySendMessage({uid:sessionStorage.getItem('uid'),fid:sessionStorage.getItem('fid'),msg:url,type:1})
  }else {
    await proxy.https.sendGroupMsg({uid:sessionStorage.getItem('uid'),gid:sessionStorage.getItem('fid'),msg:url,type:1})
  }

  isPreview.value = true
  isShowMark.value = false
  return url
}

const uploadFiles = (data,cb,signal)=>{
  return request({
    method:'post',
    url:'/files/upload',
    data,
    signal,
    onUploadProgress: function (progressEvent) {
      progress.value = (progressEvent.loaded / progressEvent.total * 100 | 0)
    }
  })
}
defineExpose({onLoad})
</script>

<style scoped>
.img_container{
  position: relative;
}
.mask{
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.60);
}

</style>
