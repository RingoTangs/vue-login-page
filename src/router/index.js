import Vue from 'vue'
import VueRouter from 'vue-router'
import {getAuthentication} from "@/util/utils";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        meta: {
            title: '人事管理系统-主页'
        },
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '人事管理系统—登录'
        },
        component: () => import('@/views/Login.vue')
    },

    // 错误页面 ==> 需要写在最后面
    {
        path: '*',
        name: 'Error',
        meta: {
            title: '页面走丢了/(ㄒoㄒ)/~~'
        },
        component: () => import('@/views/Error.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
    let user = sessionStorage.getItem('user');
    document.title = to.meta.title;
    if (user) {                                 // 已经登录了
        if (to.path == '/login')
            next('/home');
        else
            next();
    } else if (to.path == '/login') {           // 未登录, 但是请求的路径是 '/login'
        next();
    } else {                                    // 未登录 ==> 先去服务器查一遍是否有"自动登录"
        getAuthentication().then(res => {
            console.log(res);
            if (res) {
                sessionStorage.setItem('user', JSON.stringify(res.content));
                user = sessionStorage.getItem('user');
                if (user) next();
                else next('/login');
            } else
                next('/login');
        });
    }
});

export default router
