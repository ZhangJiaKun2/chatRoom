import request from './reAxios.js'

export default {
    judeg(data){
        return request({
            method:'POST',
            url:'/signup/add',
            data
        })
    },
    login(data){
        return request({
            method:'POST',
            url:'/login/login',
            data
        })
    },
    /**用户*/
    //获取用户详情
    getUserDetails(data){
        return request({
            method:'POST',
            url:'/user/detail',
            data
        })
    },

    updateUserDetails(data){
        return request({
            method:'POST',
            url:'/user/update',
            data
        })
    },
    /**好友 */
    //好友申请
    applyFriend(data){
        return request({
            method:'post',
            url:'/friend/appleFriend',
            data
        })
    },
    //判断是否为好友
    isFriend(data){
        return request({
            method:'post',
            url:'/search/isFriend',
            data
        })
    },
    //好友发送消息
    mySendMessage(data){
        return request({
            method:'post',
            url:'/friend/insertMsg',
            data
        })
    },
    getUsesrList(data){
        return request({
            method:'post',
            url:'/search/user',
            data
        })
    },

    //确定添加好友，后端更改好友状态
    updateFriendStatus(data){
        return request({
            method:'post',
            url:'/friend/updateFriendStatus',
            data
        })
    },
    //拒绝好友/删除好友
    deleteFriend(data){
        return request({
            method:'post',
            url:'/friend/deleteFriend',
            data
        })
    },


    //获取好友列表
    getFriendsList(data){
        return request({
            method:'post',
            url:'/index/getFriendsList',
            data
        })
    },
    //获取最后一条消息
    getOneMsg(data){
        return request({
            method:'post',
            url:'/index/getOneMsg',
            data
        })
    },

    //获取好友聊天记录
    getMsg(data){
      return request({
          method:'post',
          url:'/chat/msg',
          data
      })
    },
    //获取汇总的未读消息
    getUnReadMsg(data){
        return request({
            method:'post',
            url:'/index/getUnReadMsg',
            data
        })
    },

    //创建群
    createGroup(data){
        return request({
            method:'post',
            url:'/group/createGroup',
            data
        })
    },

    //获取群列表
    getGroupList(data){
        return request({
            method:'post',
            url:'index/getGroupList',
            data
        })
    },

    //发送群消息
    sendGroupMsg(data){
        return request({
            method:'post',
            url:'index/sendGroupMsg',
            data
        })
    },
    //创建一个贴子
    addPost(data){
        return request({
            method:'post',
            url:'/post/addPost',
            data
        })
    },

    //获取贴子
    getPost(data){
        return request({
            method:'post',
            url:'/post/searchPost',
            data
        })
    },
    //收藏贴子
    collectPost(data){
        return request({
            method:'post',
            url:'/post/collectPost',
            data
        })
    },
    //获取收藏的贴子
    getCollectPost(data){
        return request({
            method:'post',
            url:'/post/getCollectPost',
            data
        })
    },
    //发送评论
    sendComment(data){
        return request({
            method:'post',
            url:'/post/sendComment',
            data
        })
    },
    //获取评论
    getComment(data){
        return request({
            method:'post',
            url:'/post/getComment',
            data
        })
    },
    //点赞
    likePost(data){
        return request({
            method:'post',
            url:'/post/likePost',
            data
        })
    },
    //取消点赞
    cancelLike(data){
        return request({
            method:'post',
            url:'/post/cancelLike',
            data
        })
    },
    //点踩
    dislikePost(data){
        return request({
            method:'post',
            url:'/post/dislikePost',
            data
        })
    },
    //取消点赞
    cancelDislike(data){
        return request({
            method:'post',
            url:'/post/cancelDislike',
            data
        })
    },
    //上传文件（单文件）
    uploadFiles(data,cb,signal){
        return request({
            method:'post',
            url:'/files/upload',
            data,
            signal,
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                let process = (progressEvent.loaded / progressEvent.total * 100 | 0)
                let progressText = `下载进度：${process}%`
                console.log(progressText);
            }
        })
    },

    //大文件上传
    uploadFiless(data,index,cb){
        return request({
            method:'post',
            url:'/files/upBigFile',
            data,
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                let process = (progressEvent.loaded / progressEvent.total * 100 | 0)
                let progressText = `第${index}下载进度：${process}%`
                console.log(progressText);
                // cb(progressEvent.loaded)
            }
        })
    },


    //请求合并文件
    mergeFiles(data){
        return request({
            method:'post',
            url:'files/mergeFiles',
            data
        })
    }

}
