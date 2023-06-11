<template>
  <div class="editUser">
    <a-card style="width: 1000px">
      <template #title>
        <div class="editTitle">
          编辑个人信息
        </div>
      </template>
      <div class="editContent">
        <div class="editAvatar">
          <img class="avatar" :src="form.formData.imgurl" alt="">

          <a-button :style="{width:'90px'}" type="primary" @click="clickInput()">更改头像</a-button>
        </div>
        <div class="baseMsg">
          <a-form :model="form.formData" :style="{width: '600px'}" labelAlign="left" :label-col="{span:4}" :wrapper-col="{span:14}">
            <a-form-item label="用户名">
              <div v-show="isShowName">
                <span>{{form.formData.name}}</span>
                <a-button  @click="isShowName=false" type="link" ghost>
                  <template #icon><EditOutlined /></template>修改
                </a-button>
              </div>

              <div class="changeName" v-show="!isShowName">
                <a-input v-model:value="form.formData.name" :style="{marginBottom:'15px'}"/>
                <a-button type="primary" :style="{marginRight:'15px'}" @click="changeName('name')">保存</a-button>
                <a-button  @click="isShowName=true">取消</a-button>
              </div>
            </a-form-item>
            <a-form-item label="性别">
              <div v-show="isShowSex">
                <span>{{form.formData.sex}}</span>
                <a-button  @click="isShowSex=false" type="link" ghost>
                  <template #icon><EditOutlined /></template>修改
                </a-button>
              </div>

              <div class="changeSex" v-show="!isShowSex">
                <a-radio-group v-model:value="form.formData.sex">
                  <a-radio value="男">男</a-radio>
                  <a-radio value="女">女</a-radio>
                </a-radio-group>
                <br>
                <a-button type="primary" :style="{marginRight:'15px',marginTop:'15px '}" @click="changeSex('sex')">保存</a-button>
                <a-button  @click="isShowSex=true">取消</a-button>
              </div>
            </a-form-item>
            <a-form-item label="个性签名">
              <div v-show="isShowExplain">
                <span>{{form.formData.explain ? form.formData.explain:'无'}}</span>
                <a-button  @click="isShowExplain=false" type="link" ghost>
                  <template #icon><EditOutlined /></template>修改
                </a-button>
              </div>

              <div class="changeExplain" v-show="!isShowExplain">
                <a-input v-model:value="form.formData.explain" :style="{marginBottom:'15px'}"/>
                <a-button type="primary" :style="{marginRight:'15px'}" @click="changeExplain('explain')">保存</a-button>
                <a-button @click="isShowExplain=true">取消</a-button>
              </div>
            </a-form-item>
<!--            <a-form-item label="生日">-->
<!--              <div v-show="isShowBirth">-->
<!--                <span>{{myData?myData:'无'}}</span>-->
<!--                <a-button  @click="isShowBirth=false" type="link" ghost>-->
<!--                  <template #icon><EditOutlined /></template>修改-->
<!--                </a-button>-->
<!--              </div>-->

<!--              <div class="changeBirth" v-show="!isShowBirth">-->
<!--                <a-date-picker-->
<!--                    v-model:value="myData"-->
<!--                    show-time-->
<!--                    type="date"-->
<!--                    placeholder="请选择日期"-->
<!--                    style="width: 100%"-->
<!--                />-->
<!--                <a-button type="primary" :style="{marginRight:'15px'}" @click="changeBirth('birth')">保存</a-button>-->
<!--                <a-button @click="isShowBirth=true">取消</a-button>-->
<!--              </div>-->
<!--            </a-form-item>-->
            <a-form-item label="联系方式">
              <div v-show="isShowPhone">
                <span>{{form.formData.phone ? form.formData.phone:'无'}}</span>
                <a-button  @click="isShowPhone=false" type="link" ghost>
                  <template #icon><EditOutlined /></template>修改
                </a-button>
              </div>

              <div class="changePhone" v-show="!isShowPhone">
                <a-input v-model:value="form.formData.phone" :style="{marginBottom:'15px'}"/>
                <a-button type="primary" :style="{marginRight:'15px'}" @click="changePhone('phone')">保存</a-button>
                <a-button @click="isShowPhone=true">取消</a-button>
              </div>
            </a-form-item>
            <a-form-item label="邮箱">
              <div v-show="isShowEmail">
                <span>{{form.formData.email}}</span>
                <a-button @click="isShowEmail=false" type="link" ghost>
                  <template #icon><EditOutlined /></template>修改
                </a-button>
              </div>

              <div class="changeEmail" v-show="!isShowEmail">
                <a-input v-model:value="form.formData.email" :style="{marginBottom:'15px'}"/>
                <a-button type="primary" :style="{marginRight:'15px'}"  @click="changeEmail('email')">保存</a-button>
                <a-button @click="isShowEmail=true ">取消</a-button>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-card>
  </div>

  <input class="getFile" type="file" @change="getInputFile">
  <a-modal v-model:visible="isShowAvatar" title="编辑头像" @ok="finish()">
      <div class="cropper">
        <div class="cropper-toast">
          <vueCropper
              ref="cropperRef"
              :img="options.img"
              :info="true"
              :infoTrue="options.infoTrue"
              :auto-crop="options.autoCrop"
              :fixed-box="options.fixedBox"
              :fixedNumber="options.fixedNumber"
              :fixed="options.fixed"
              :centerBox="options.centerBox"
              @realTime="realTime"
          />
        </div>
      </div>
  </a-modal>

</template>

<script setup>
import {getCurrentInstance, onMounted, reactive,ref,watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import VueCropper from "vue-cropper/src/vue-cropper.vue";
const {ctx,proxy} = getCurrentInstance()

const router = useRouter()
const route = useRoute()

/*控制每个更改的显现与隐藏 */
let isShowName = ref(true)
let isShowSex = ref(true)
let isShowExplain = ref(true)
let isShowBirth = ref(true)
let isShowPhone= ref(true)
let isShowEmail= ref(true)

let isShowAvatar = ref(false)
let myData = ref(undefined)

let form = reactive({
  formData:{}
})

const getUserDetail = ()=>{
  console.log(route.query.uid)
  proxy.https.getUserDetails({id:route.query.uid}).then(
      res=>{
        console.log(res)
        form.formData = res.data
        myData = form.formData.birth
      }
  )
}


/* 点击保存键后 */
const changeName = (type)=>{
  updateUserDetail(type)
  isShowName.value = true
}
const changeSex = (type)=>{
  updateUserDetail(type)
  isShowSex.value = true
}
const changeExplain = (type)=>{
  updateUserDetail(type)
  isShowExplain.value = true
}
const changeBirth = (type)=>{
  updateUserDetail(type)
  isShowBirth.value = true
}
const changePhone = (type)=>{
  updateUserDetail(type)
  isShowPhone.value = true
}
const changeEmail = (type)=>{
  updateUserDetail(type)
  isShowEmail.value = true
}

//通知后端更新
const updateUserDetail = (type)=>{
  proxy.https.updateUserDetails({id:route.query.uid,type,data:form.formData[type]}).then(
      res=>{
        console.log(res)
        //重新获取数据
        getUserDetail()
      }
  )
}


onMounted(()=>{
  //发送请求去获取用户详细数据
  getUserDetail()
})



//裁剪相关
let cFile = ref('')
const options= reactive({
  img: cFile, // 需要剪裁的图片
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 335, // 默认生成截图框的宽度
  autoCropHeight: 335, // 默认生成截图框的长度
  fixedBox: true, // 是否固定截图框的大小 不允许改变
  info: true, // 裁剪框的大小信息
  outputSize: 0.5, // 裁剪生成图片的质量 [1至0.1]
  outputType: "jpeg", // 裁剪生成图片的格式
  canScale: false, // 图片是否允许滚轮缩放
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: [1, 1], // 截图框的宽高比例 需要配合centerBox一起使用才能生效
  full: true, // 是否输出原图比例的截图
  canMoveBox: false, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
})

const previews= ref({});
let fileItem = reactive({});
const cropperRef = ref({});
const dialogVisible = ref(false);
// 触发点击事件
//点击 更换头像 ===》点击input框
const clickInput = ()=>{
  let myInput = document.querySelector('.getFile')
  myInput.click()
}
//点了图片以后
const getInputFile = (e) => {
  const file = e.target.files[0];
  fileItem = file;
  console.log("file:", file);
  const URL = window.URL || window.webkitURL;
  options.img = URL.createObjectURL(file);
  console.log("options.img:", options.img);
  isShowAvatar.value = true;
};
const refreshCrop = () => {
  cropperRef.value.refresh();
};
// 上传图片（点击保存按钮）  点击模态框的保存
const finish = () => {
  // cropperRef.value.getCropData((data: any) => {
  //   // console.log("获取截图的 base64 数据:", data);
  //   // data为base64图片，供接口使用
  // });
  cropperRef.value.getCropBlob((data) => {
    console.log("获取截图的 blob 数据:", data);
    let suffix = data.type.split('/')[1]
    // 下面是将blob转为formData
    let formData = new FormData();
    formData.append("user", form.formData._id);
    formData.append("module", 'Avatar');
    formData.append("type", suffix);
    formData.append("file", data);

    console.log("formData:", formData);
    // 下面是将blob转换为file
    data.lastModifiedDate = new Date(); // 文件最后的修改日期
    let file = new File([data], fileItem?.name, {
      type: data.type,
      lastModified: Date.now(),
    });
    console.log("file:", file);
    console.log("fileItem:", JSON.parse(JSON.stringify(fileItem)));

    proxy.https.uploadFiles(formData).then(
        res=>{
          res.data.forEach(item=>{
            let path = item.path.replace('data',"").replaceAll('\\',"/")
            console.log(path)
            let url = 'http://localhost:3000'+path
            proxy.https.updateUserDetails({id:route.query.uid,type:'imgurl',data:url}).then(
                res=>{
                  console.log(res)
                  getUserDetail()
                  isShowAvatar.value = false;
                }
            )
          })
        },
        rej=>{
          console.log(rej)
        }
    )
  });

};
// 裁剪之后的数据
const realTime = (data) => {
  // console.log("realTime:", data);
  previews.value = data;

}
</script>

<style lang="less" scoped>
.editUser{
  display: flex;
  justify-content: center;
  align-items: center;
  .editTitle{
    font-size: 30px;
    font-weight: 600;
  }
  .editContent{
    display: flex;
    .editAvatar{
      display: flex;
      flex-direction: column;
      width: 160px;
      align-items: center;
      margin-right: 20px;
      .avatar{
        width: 151px;
        height: 151px;
        border: 4px #999 solid;
        border-radius: 4px;
        margin-bottom: 30px;
      }
    }
  }
}

.cropper{
  display: flex;
  justify-content: center;
  align-items: center;
  .cropper-toast{
    width: 300px;
    height: 300px;
  }
}


.getFile{
  display: none;
}
</style>
