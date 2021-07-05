<template>
  <div>
    <div class="login-page">
      <!-- 1: 头部 -->
      <div class="head w">
        <h1 class="title">人事管理系统</h1>
      </div>

      <!-- 2: 主体 -->
      <div class="main w">
        <login-form class="login-form" @login="loginEventListener($event)">
        </login-form>
      </div>

      <!-- 3: 尾部 -->
      <div class="foot w">
        <div class="copy-right">
          <p>Copyright © 2021 RingoTangs .All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/login/LoginForm';
import {postKVRequest} from '@/network/api';
import {removeCookie, setCookie} from "@/util/utils";

export default {
  name: "Login",
  components: {
    LoginForm,
  },

  // ================================================================================================
  // methods
  methods: {
    /**
     * 监听表单 "登录" 事件
     * @param fields 表单内容(JSON对象)
     */
    loginEventListener(fields) {
      postKVRequest('/doLogin', fields).then(res => {
        if (res) {
          // 登录成功~
          console.log(res);
          this.cookieOps(fields);
          sessionStorage.setItem("user", JSON.stringify(res.content));
          // 设置session和路由跳转不要放反
          this.$router.replace('/home');
        }
      })
    },

    /**
     * cookie的操作
     * @param fields 表单内容(JSON对象)
     */
    cookieOps(fields) {
      if (fields.rememberPass)             // "记住密码"选中状态 ==> 当登录成功的时候保存
        setCookie('vue-remember-username-password', JSON.stringify(fields), {expires: 7, path: '/'});
      else                                 // 记住密码未选中 ===> 登录成功的时候移除cookie
        removeCookie('vue-remember-username-password', {path: '/'});
    }
  },
}
</script>

<style scoped>
/* 登录页 */
.login-page {
  height: 100vh;
  background: url("/images/bgc.jpg") no-repeat;
  background-size: cover;
}

/* 版心 */
.w {
  width: 1300px;
  max-width: 100%;
  margin: 0 auto;
  /*border: 1px solid red;*/
}

/* 登录页——头部 */
.login-page .head {
  display: flex;
  display: -webkit-flex;

  height: 30%;
}

.login-page .head .title {
  margin: auto;

  color: white;
  text-align: center;
  font-size: 60px;
  font-weight: bold;
  text-shadow: 5px 5px 5px black, 0 0 2px black;
  font-family: 'Times New Roman', 'sans-serif', 宋体, 楷体;
}

/* 登录页——主体 */
.login-page .main {
  display: flex;
  display: -webkit-flex;

  height: 50%;
  /*border: 1px solid red;*/
}

.login-page .main .login-form {
  min-width: 400px;
  text-align: center;
  background-color: rgba(255, 255, 255, .1);
  border-radius: 15px;
  box-shadow: 0 0 8px 2px rgba(255, 255, 255, .4);
}

.login-page .main .login-form {
  /* 弹性盒子居中显示 */
  margin: auto;
}

/* 登录页——尾部 */
.login-page .foot {
  display: flex;
  display: -webkit-flex;

  height: 20%;
  /*border: 1px solid red;*/
}

.login-page .foot .copy-right {
  margin: auto;
  font-size: 10px;
  color: #ffffff;
}
</style>