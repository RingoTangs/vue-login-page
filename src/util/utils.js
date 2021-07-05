import cookies from 'js-cookie';
import {postRequest} from "@/network/api";

/**
 * JSON对象中的字符串去除空格
 * @param obj JSON对象
 * @return 属性去除空格的 JSON 对象
 */
export function objectTrim(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string')
            obj[key] = obj[key].trim();
    }
}

// =======================================================================================
// Cookie操作：httpOnly的cookie, js拿不到。spring-security返回的"自动登录"cookie, js无法拿到。
export function setCookie(key, value, args) {
    cookies.set(key, value, args);
}

export function getCookie(key) {
    return cookies.get(key);
}

export function removeCookie(key, args) {
    cookies.remove(key, args);
}

// =======================================================================================
// 网络操作

/**
 * 判断该用户是否登录了（自动登录）, 需要携带自动登录的cookie
 */
export function getAuthentication() {
    return postRequest('/authentication', null);
}