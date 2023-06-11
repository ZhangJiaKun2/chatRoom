<template>
  <div class="bgc">
    <div class="signUpFormBox">
        <div class="signUpForm" v-if="isSuccess">
          <span class="title"><strong>欢迎注册</strong></span>
          <br>
          <p class="hasAccount">已有账号？<span>登录</span></p>
          <a-form
              class="mySignUp"
              layout="vertical"
              :model="formData"
              :hideRequiredMark="true"
          >
            <a-form-item class="item">
              <template v-slot:label>
                <span class="label">用户名</span>
              </template>
              <a-input v-model:value="formData.name" placeholder="请输入用户名"  size="large">
                <template #prefix>
                  <user-outlined type="user" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="item">
              <template v-slot:label>
                <span class="label">邮箱</span>
              </template>
              <a-input v-model:value="formData.mail" placeholder="请输入邮箱" size="large">
                <template #prefix>
                  <mail-outlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="item">
              <template v-slot:label>
                <span class="label">密码</span>
              </template>
              <a-input-password v-model:value="formData.pwd" placeholder="请输入密码" size="large" autocomplete>
                <template #prefix>
                  <key-outlined />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }" class="item">
              <a-button
                  @click="signUp"
                  class="mybtn"
                  type="primary"
                  shape="round"
                  size="large"
                  :block="true"
              >注册</a-button>
            </a-form-item>
          </a-form>
        </div>

        <div class="signUpResult" v-if="!isSuccess">
          <a-result
              status="success"
              title="注册成功!"
              sub-title="将于 5 秒后返回首页，请稍侯..."
          >
            <template #extra>
              <a-button type="primary" @click="quickPush">立即返回</a-button>
            </template>
          </a-result>
        </div>
    </div>
  </div>
</template>

<script setup>
import { UserOutlined,MailOutlined,KeyOutlined } from '@ant-design/icons-vue';
import {useRouter} from "vue-router";
import {ref, reactive, getCurrentInstance} from "vue";

const {ctx,proxy} = getCurrentInstance()
const router = useRouter()

//data
let isSuccess = ref(true)   //注册成功后 显示的
let formData = reactive({
  name:'',   //名字
  mail:'',  //邮箱
  pwd:''   //密码
})
let timer

async function signUp(){
  await proxy.https.judeg({name:formData.name,mail:formData.mail,pwd:formData.pwd,type:'email'}).then(
      res=>{
        console.log('12',res)
        if(res){
          isSuccess.value = false
          timer = setTimeout(()=>{
            router.push('/')
          },5000)
        }
      },
      rej=>{
        console.log('验证失败',rej)
      }
  )
}

function quickPush(){
  clearTimeout('timer')
  router.push('/')
}

</script>

<style lang="less" scoped>
.bgc{
  background: url("sky.jpg") no-repeat;
  height:100%;
  width:100%;
  background-size:cover;
  display: flex;
  align-items: center;
  justify-content: center;
  .signUpFormBox{
    width: 480px;
    height: 550px;
    background: rgba(255,255,255,.7);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 5px 3px #fff;
    transition: transform .3s;

    .signUpForm{
      position: absolute;
      margin: 40px 20px;

      .title{
        font-size: 36px;
        color: #000;
        padding-bottom: 4px
      }
      .hasAccount{
        font-size: 14px;
        color: #9B9B9B;
        span{
          color: #2e58ff;
          cursor: pointer;
        }
      }
      .mySignUp{
        padding-top: 28px;
        width: 440px;
        .item{
          margin-bottom: 20px;
        }

        .label{
          display: inline-block;
          width: 50px;
          height: 25px;
          line-height: 25px;
          margin: 0 0 0 5px;
          font-size: 15px;
          color:#333333;
          text-align: justify;
          text-justify:distribute-all-lines; // 这行必加，兼容ie浏览器
          text-align-last: justify;
        }
        .mybtn{
          left:-73px;
          margin-top: 10px;
        }
      }
    }
    .signUpResult{
      margin: 40px 20px;
    }
  }
  .signUpFormBox:hover {
    transform: scale(1.06);
    box-shadow: 0 0 15px 10px #fff
  }

}
</style>
