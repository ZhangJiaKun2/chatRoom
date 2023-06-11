import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import https from '../src/request/api.js'
// import 'vue-cropper/dist/index.css'
import VueCropper from "vue-cropper/src/vue-cropper.vue"
import VueSocketIO from "vue-socket.io";
import { registerSockets, destroySockets } from "./socket.js";

import * as emoji from 'node-emoji'

console.log(emoji)

import * as antIcons from '@ant-design/icons-vue'
import { createPinia } from 'pinia'
import {user} from './store/login.js'
const pinia = createPinia()  //创建pinia实例

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn');


const app = createApp(App)
Object.keys(antIcons).forEach(key => {
    app.component(key, antIcons[key])
})
// app.config.globalProperties.$antIcons = antIcons

const socket = new VueSocketIO({
    debug: true,
    connection:'http://localhost:8082',  //后端socket的地址
});

//配置全局路由守卫
router.beforeEach((to,from,next)=>{
    let token = localStorage.getItem('token');   //获取用户的token
    if(token){   //如果token存在
        next();
    }else {   //如果token不存在---->只能在登录页和首页
        if (to.path === '/signUp' || to.path === '/home') {
            next();
        } else {
            next('/signUp');
        }
    }
})


app.use(router)
app.use(pinia)
app.use(VueCropper)
// app.use(
//     new VueSocketIO({
//         debug: true, // debug调试，生产建议关闭
//         connection: "/socket"
//     })
// )
app.mount('#app')
app.config.globalProperties.https = https
app.config.globalProperties.$moment = moment
app.config.globalProperties.$socket = socket;
app.config.globalProperties.emoji = emoji;
// 监听事件
app.config.globalProperties.$addSockets = registerSockets;
// 移除事件
app.config.globalProperties.$removeSockets = destroySockets;


const userStore = user();
userStore.getToken()
sessionStorage.getItem('keys')

