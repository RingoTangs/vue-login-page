# vue-登录页面

## 页面效果展示

![登录页面](https://cdn.jsdelivr.net/gh/RingoTangs/image-hosting@master/vue/login-page1.3evev5nv1e80.png)

------

![登录页面](https://cdn.jsdelivr.net/gh/RingoTangs/image-hosting@master/vue/login-page2.6hs85vx15g40.png)

------

![登录页面](https://cdn.jsdelivr.net/gh/RingoTangs/image-hosting@master/vue/login-page3.4w1ujql5ap00.png)



## Project setup

```shell
npm install       # 安装包
npm run serve     # 运行
```

前端：`vue/cli 3.6.0`。

后端：`spring-security`。

后端跨域请如下配置：

```java
/**
* spring-security跨域配置
*/
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("*"));
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080"));

    // 允许携带cookie
    configuration.setAllowCredentials(true);    

    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

protected void configure(HttpSecurity http) throws Exception {
    http.cors.configurationSource(corsConfigurationSource());
}
```



## 实现的功能

一、用户名、密码字段的校验。

二、拼图验证码校验。

三、记住密码（使用cookie）。

四、7天自动登录（spring-security的rememberMe功能）。

注：访问  `'/'`  默认会重定向到 `'/home'`，路由跳转前会到后端拿用户数据（如果spring-security开启rememberMe功能，即可实现自动登录）。

