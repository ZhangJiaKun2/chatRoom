import { createRouter, createWebHistory } from 'vue-router'

import SignUp from '../pages/sign/SignUp.vue'
import home from '../pages/Home/home.vue'
import chat from '../pages/Chat/chat.vue'
import test from '../pages/apiTest/test.vue'
import userCenter from '../pages/user/userCenter.vue'
import userPost from '../pages/user/userPost.vue'
import collect from '../pages/user/collect.vue'
import editUser from '../pages/user/editUser.vue'
import message from '../pages/Chat/message.vue'
import empty from '../pages/Chat/empty.vue'
import search from '../pages/search/search.vue'
import searchUser from '../pages/search/searchUser.vue'
import searchPost from '../pages/search/searchPost.vue'
import postDetail from '../pages/Home/postDetail.vue'

import Index from '../pages/Index.vue'
const options = [
    {
        path:'/',
        name:'index',
        component: Index,
        redirect:'/home',
        children:[
            {
                path:'/home',
                name:'home',
                component: home,
            },
            {
                path:'/postDetail',
                name:'postDetail',
                component: postDetail,
            },
            {
                path:'/search',
                name:'search,',
                redirect: '/searchUser',
                component: search,
                children:[
                    {
                        path:'/searchUser',
                        name:'searchUser',
                        component: searchUser
                    },
                    {
                        path:'/searchPost',
                        name:'searchPost',
                        component: searchPost
                    }
                ]
            },
            {
                path:'/chat',
                name:'chat',
                redirect: '/empty',
                component: chat,
                children: [
                    {
                        path:'/message',
                        name:'message',
                        component: message
                    },
                    {
                        path:'/empty',
                        name:'empty',
                        component: empty
                    }
                ]
            },

            //测试接口页面
            {
                path:'/test',
                name:'test',
                component: test
            },
            {
                path:'/userCenter',
                name:'userCenter',
                redirect:'/userPost',
                component: userCenter,
                children:[
                    {
                        path:'/userPost',
                        name:'userPost',
                        component: userPost,
                    },
                    {
                        path:'/collect',
                        name:'collect',
                        component: collect,
                    }
                ]
            },
            {
                path:'/edit',
                name:'edit',
                component: editUser
            }
        ]
    },

    {
        path:'/signUp',
        // component:()=>import('@/pages/'),
        name:'signUp',
        component: SignUp

    }
]
const router = createRouter({
    history:createWebHistory(),
    routes:options
})

export default router
