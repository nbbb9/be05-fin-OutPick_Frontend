import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 사원이 담당하는 매장
export function user_shop_list(token) {
    return user_axios.get(`/shop/tolist`, {
        headers: {
            login_token: token
        }
    })
}

