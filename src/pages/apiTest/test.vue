<template>
  <a-card class="testCard">
   <h1>apitest</h1>
    <button @click="addF">add friend</button>
    <button @click="add">add </button>
    <button @click="deletef">delete </button>
    <input type="file" @change="onchangede" multiple>
<!--    <input type="file" @change="manyFile" placeholder="选取多个文件" multiple name="user">-->
    <img width="100" height="100" v-for="(item,index) in img.img" :src="item" :key="index ">
    <button @click="cancel">取消传输</button>
    <br>
    <h1>大文件分片上传</h1>
    <input type="file" @change="bigFileUpload">
  </a-card>
</template>

<script setup>
import SparkMD5 from 'spark-md5'
import {getCurrentInstance, reactive} from "vue";
import {user} from "../../store/login.js";
import {file} from "../../store/file.js";
import {storeToRefs} from "pinia";

const {ctx,proxy} = getCurrentInstance()
const userStore = user();
const fileStore = file()
let { token } = storeToRefs(userStore);


let img = reactive({img:[]})
const data = JSON.stringify({uid:"640c5e7710721e424443b969",fid:"64443bc3c8f58b2afd0405f4e1",msg:"我是ikun"})

let controller

const addF = async ()=>{
  console.log(token.value)
  await proxy.https.applyFriend({uid:"643e529e486fbafad3012d22",fid:"640c5e7710721e424443b969",msg:"我是蔡徐坤"}).then(
      res=>{
        console.log(res)
      },
      rej=>{
        console.log(rej)
      }
  )
}
const add = async ()=>{
  await proxy.https.updateFriendStatus({uid:"643e529e486fbafad3012d22",fid:"640c5e7710721e424443b969"}).then(
      res=>{
        console.log(res)
      },
      rej=>{
        console.log(rej)
      }
  )
}
const deletef = async ()=>{
  await proxy.https.deleteFriend({uid:"643e529e486fbafad3012d22",fid:"640c5e7710721e424443b969"}).then(
      res=>{
        console.log(res)
      },
      rej=>{
        console.log(rej)
      }
  )
}


const cancel = function () {
  if (controller) {
    controller.abort()
  }
}

const onchangede = (e)=>{
  controller = new AbortController();
  let signal = controller.signal
  let formData = new FormData();
  console.log(e.target.files)
  let fileList = e.target.files
  formData.append('url', '张三')
  for (let i = 0; i < fileList.length; i++) {
    console.log(fileList[i])
    formData.append('file', fileList[i])
  }
  proxy.https.uploadFiles(formData,updone,signal).then(
      res=>{
        res.data.forEach(item=>{
          let path = item.path.replace('data',"").replaceAll('\\',"/")
          console.log(path)
          let url = 'http://localhost:3000'+path
          img.img.push(url)
        })
        console.log(img.img)
      },
      rej=>{
        console.log(rej)
      }
  )
}

const bigFileUpload = async (e)=>{
  //获取文件
  let file = e.target.files[0]
  let filename=file.name.replace(/(.*\/)*([^.]+).*/ig,"$2");
  console.log(file)
  let suffix=/\.([\d\D]+$)/.exec(file.name)[1]//获取文件后缀名
  if(!file){
    return
  }
  //文件分片  [blob,blob...]
  const {res,Hash} = await createFileChunk(file,1*1024*1024)
  console.log(res,Hash)
  const requestList = res.map((item,index)=>{
      return proxy.https.uploadFiless(item,index,fileStore.addLoadFile)
  })
  await Promise.all(requestList).then(
      res=>{
        console.log('已完成',res)
        proxy.https.mergeFiles({filename,suffix,Hash,url:'李四'}).then(
            res=>{
              console.log(res)
            }
        )
      }
  )
}

//生成文件切片,
async function createFileChunk(file, chunkSize) {
  const fileChunkList = []
  for (let a = 0;a<file.size;a+=chunkSize){
    fileChunkList.push(file.slice(a,a+chunkSize))
  }
  let suffix=/\.([\d\D]+$)/.exec(file.name)[1]//获取文件后缀名
  let Hash = await fileHash(fileChunkList)
  console.log(2)   //2
  let res = []
  fileChunkList.forEach((item,index)=>{
    let formData = new FormData()
    formData.append('Hash',Hash)
    formData.append('suffix',suffix)
    formData.append('url','李四')
    formData.append('fileName',file.name)
    formData.append('index',index)
    formData.append('file',item)
    res.push(formData)
  })
  return {res,Hash}
}

//生成文件hash
function fileHash(chunk){
  // const spark = new SparkMD5()
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()

    function _read(i) {
      console.log(chunk[i],'这是第'+i+'个chunk')
      if (i === chunk.length) {
        let hash = spark.end()
        console.log(hash)
        resolve(hash)
      }else {
        //第 i 个分片的blob
        const fileChunkBlob = chunk[i]
        console.log(fileChunkBlob, '这是第' + i + '个chunk')
        const reader = new FileReader()
        reader.onload = (e) => {
          const bytes = e.target.result   //读取到的字节数组
          console.log(bytes)
          //根据字节数组计算hash
          spark.append(bytes)   //把一组字节加入到运算当中
          _read(i + 1)
        }
        reader.readAsArrayBuffer(fileChunkBlob)
      }
    }

    _read(0)
  })
}

const updone = ()=>{
  console.log('已完成ok')
}
</script>
<style lang="less" scoped>
.testCard{
  width: 100%;
}
</style>
