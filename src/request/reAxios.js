import axios from 'axios'

const service = axios.create({
    baseURL:'http://localhost:3000',
});

service.interceptors.request.use(function (config) {
    // config.headers['Authorization'] = token
    config.headers.Authorization = localStorage.getItem('token')
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    const {status,data} = response     //data 里面包含的是 后端 res.send() 的内容
    // if(data.status === 200){
    //     return data.data;
    // }
    return data.data
}, function (error) {
    return Promise.reject(error);
});

function request(options){
    options.method = options.method || 'get'
    if(options.method.toLowerCase() === 'get'){
        options.params = options.data
    }
    return service(options)
}

export default request
