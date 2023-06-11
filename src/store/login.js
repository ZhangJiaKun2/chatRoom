import { defineStore } from 'pinia'

export const user = defineStore({
    id: 'user',
    state:()=>{
        return {
            userInfo:null,
            token:undefined
        }
    },
    getters:{

    },
    actions:{
        storeUserInfo(data){
            this.userInfo = data.userInfo
            console.log(this.userInfo)
            this.token = data.token
            localStorage.setItem('token',this.token)
            localStorage.setItem('userInfo',JSON.stringify(this.userInfo))
        },

        getToken() {
            const token = localStorage.getItem('token')
            token ? this.token = token : this.token = undefined
            const userInfo = JSON.parse(localStorage.getItem('userInfo'))
            userInfo ? this.userInfo = userInfo : this.userInfo = null
        }
        ,

        logOut(){
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
        }
    }
})
