import { defineStore } from 'pinia'

export const file = defineStore({
    id: 'file',
    state:()=>{
        return {
            countFile:undefined,
            loadFile:0
        }
    },
    getters:{
        percentage(state){
            return state.loadFile/state.countFile
        }
    },
    actions:{
        storeCount(data){
            this.countFile = data
            console.log(this.countFile)
        },

        addLoadFile(data){
            this.loadFile += data
            console.log(this.loadFile,data,'data')
        }
    }
})
