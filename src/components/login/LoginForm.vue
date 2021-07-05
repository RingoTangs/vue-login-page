<template>
  <div>
    <!----------------------------------------- 头像 ----------------------------------------->
    <div class="avatar">
      <el-avatar :src="formFields.avatarSrc" :size="90"></el-avatar>
    </div>


    <!----------------------------------------- 表单 ----------------------------------------->
    <el-form class="login-form" :rules="rules" :model="formFields" ref="LoginForm">
      <!-- 1：用户名 -->
      <el-form-item prop="username" class="form-item">
        <el-input class="username" type="text" placeholder="你的用户名/手机号" v-model="formFields.username"
                  prefix-icon="el-icon-user" @blur="getAvatar()">
        </el-input>
      </el-form-item>

      <!-- 2：密码 -->
      <el-form-item prop="password" class="form-item">
        <el-input class="password" type="password" placeholder="密码" v-model="formFields.password"
                  prefix-icon="el-icon-lock"
                  @keyup.enter.native="loginBtnClick('LoginForm')">
        </el-input>
      </el-form-item>


      <el-form-item>
        <!--  3: 记住密码 -->
        <el-checkbox v-model="formFields.rememberPass" class="remember-pass" @change="rememberPassListener">
          记住密码
        </el-checkbox>

        <!-- 4:自动登录 -->
        <el-checkbox v-model="formFields.autoLogin" class="remember-me" @change="autoLoginListener">
          7日内自动登录
        </el-checkbox>
      </el-form-item>

      <!-- 5: 登录按钮 -->
      <el-form-item class="button-item">
        <el-button type="success" class="login-btn" @click="loginBtnClick('LoginForm')">
          登录
        </el-button>
      </el-form-item>
    </el-form>


    <!----------------------------------------- 验证码 ----------------------------------------->
    <div class="v-code">
      <v-code :show="isShow" :canvasWidth="300" :canvasHeight="180" @close="closeCallback"
              @success="vCodeSuccessListener" @fail="vCodeFailListener">
      </v-code>
    </div>
  </div>
</template>

<script>
import {getCookie, objectTrim} from '@/util/utils';
import {getRequest} from "@/network/api";
import VCode from 'vue-puzzle-vcode';

export default {
  name: "LoginForm",
  components: {
    VCode
  },

  // ==================================================================
  // 生命周期函数
  beforeMount() {
    const rememberPassCookie = getCookie('vue-remember-username-password');
    // console.log('rememberPassCookie: ', rememberPassCookie);
    if (rememberPassCookie) {
      const fields = JSON.parse(rememberPassCookie);
      this.formFields = fields;
    }
  },

  // ==================================================================
  // watch
  watch: {
    getUsername(newVal, oldVal) {
      if (this.isAuthenticated)
        this.isAuthenticated = false;
    },
    getPassword(newVal, oldVal) {
      if (this.isAuthenticated)
        this.isAuthenticated = false;
    }
  },

  // ==================================================================
  // computed
  computed: {
    getUsername() {
      return this.formFields.username;
    },
    getPassword() {
      return this.formFields.password;
    }
  },

  // ==================================================================
  // data
  data() {
    // 检查用户名
    let checkUsername = (rule, value, callback) => {
      if (!value || value.trim() == '')
        return callback(new Error('用户名/手机号不能为空'));
      if (value.trim().length > 11)
        return callback(new Error('用户名/手机号长度不能超过11位'));
      callback();
    };

    // 检查密码
    let checkPassword = (rule, value, callback) => {
      if (!value || value.trim() == '') {
        return callback(new Error('密码不能为空'));
      }
      callback();
    };

    return {
      // 表单属性
      formFields: {
        avatarSrc: '/images/avatar.jpg',          // 头像
        username: '',
        password: '',
        rememberPass: false,                      // 记住密码, 保存在cookie中
        autoLogin: false,                         // 自动登录
      },

      // 表单校验规则
      rules: {
        username: [{validator: checkUsername, trigger: onblur}],
        password: [{validator: checkPassword, trigger: onblur}]
      },

      // 拼图验证码相关
      isShow: false,          // 是否显示拼图验证码
      vCodeFailCount: 0,      // 校验失败次数
      isAuthenticated: false  // 拼图验证码是否校验成功
    }
  },

  // ==================================================================
  // methods
  methods: {
    /**
     * 1: 监听"登录"点击事件
     * @param formName 表单的名字和 ref 中的值要相同
     */
    loginBtnClick(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid)
          return;
        // 表单用户名、密码 校验成功~

        // ====================================
        // 显示拼图验证码进行校验
        if (!this.isAuthenticated) {
          this.isShow = true;
          return;
        }
        // ====================================

        // 拼图验证码校验成功
        objectTrim(this.formFields);
        this.$emit('login', this.formFields);
      });
    },

    /**
     * 2: 监听 "7日自动登录" checkbox 点击事件
     * @param val checkbox 绑定的值。选中：true; 未选中: false。
     */
    autoLoginListener(val) {
      if (val === true)
        this.formFields.rememberPass = true;
    },

    /**
     * 3: 监听 "记住密码" checkbox 点击事件
     * @param val checkbox 绑定的值。选中：true; 未选中: false。
     */
    rememberPassListener(val) {
      if (val === false)
        this.formFields.autoLogin = false;
    },

    /**
     * 4: 获取用户头像
     */
    getAvatar() {
      const username = this.formFields.username.trim();
      // console.log(username);
      if (username === '')
        return;
      getRequest('/awardAvatar', {username}).then(res => {
        if (res)
          this.formFields.avatarSrc = res.content;
      });
    },

    /**
     * 5: 拼图验证码 ==> 点击遮罩层的回调
     */
    closeCallback() {
      setTimeout(() => {
        this.vCodeFailCount = 0;
        this.isShow = false;
      }, 300);
    },

    /**
     * 6: 拼图验证码 ==> 验证成功的监听器
     */
    vCodeSuccessListener() {
      setTimeout(() => {
        this.isShow = false;
        this.isAuthenticated = true;
      }, 300);
    },

    /**
     * 7: 拼图验证码 ==> 验证失败的监听器
     */
    vCodeFailListener() {
      ++this.vCodeFailCount;
      if (this.vCodeFailCount > 3) {
        this.isShow = false;
        this.vCodeFailCount = 0;
        alert('验证码失败次数过多, 请重试');
      }
    }
  },
}
</script>

<style scoped>

/* 头像 */
.avatar {
  text-align: center;
  padding: 15px 0 30px 0;
  /*border: 1px solid red;*/
}

/* 表单 */
.login-form {
  width: 350px;
  padding-right: 25px;
  padding-left: 25px;
}

.username >>> .el-input__inner,
.password >>> .el-input__inner {
  border: none;
}

.form-item >>> .el-form-item__error {
  color: pink;
}

.remember-me, .remember-pass {
  color: #ffffff;
}

.login-btn {
  width: 100%;
  margin-bottom: 0px;
  transition: background-color 0.3s;
  -moz-transition: background-color 0.3s; /* Firefox 4 */
  -webkit-transition: background-color 0.3s; /* Safari 和 Chrome */
  -o-transition: background-color 0.3s; /* Opera */
}

.button-item {
  margin-bottom: 18px;
}

.login-btn:hover {
  background-color: #f47983;
  border: 1px solid #f47983;
}

</style>