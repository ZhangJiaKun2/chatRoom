<template>

</template>

<script setup>

//message onchangede函数（部分）
let formData = new FormData();
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
</script>

<style scoped>

</style>
