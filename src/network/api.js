import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9001/';
axios.defaults.timeout = 5000;
axios.defaults.timeoutErrorMessage = '请求超时稍后再试';

// 携带cookie ==> 后端spring-security 需要设置 setAllowCredentials(true)
axios.defaults.withCredentials = true;

// axios响应拦截器
axios.interceptors.response.use(response => {
    if (response.status && response.status == 200 && response.data.code == 500) {
        alert(response.data.content);
        return;
    }
    return response.data;
}, error => {
    if (!error.response) {
        alert('服务器找不到了 /(ㄒoㄒ)/~~');
        return;
    }

    let status = error.response.status;
    if (status == 401)
        alert(error.response.data.message);
    else if (status == 404 || status == 504)
        alert("服务器被吃了/(ㄒoㄒ)/~~");
    else
        alert("请求错误, 稍后请重试/(ㄒoㄒ)/~~");
});

// post k-v请求 spring-security 登录需要
export function postKVRequest(url, params) {
    return axios({
        method: 'post',
        url,
        data: params,
        transformRequest: [function (data) {
            let ans = '';
            for (const key in data) {
                ans += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
            }
            return ans;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
}

// post请求传的是json
export function postRequest(url, data) {
    return axios({
        method: 'post',
        url,
        data
    });
}

// get请求 k-v
export function getRequest(url, params) {
    return axios({
        method: 'get',
        url,
        params
    });
}