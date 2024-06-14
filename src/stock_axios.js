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

// 매장의 전체 재고
export function shop_item_list(shopId, token) {
    return user_axios.get(`/shopstock/${shopId}`, {
        headers: {
            login_token: token
        }
    })
}

// 할인율 수정
export function update_discount(product_id, discount) {
    return user_axios.put(`/product/discount?discount=${discount}`, {"product_id" : product_id})
}


// 회사 재고
export function company_stock() {
    return user_axios.get(`/officestock`)
}

// 전체 상품 불러오기
export function all_product() {
    return user_axios.get(`/product/list`)
}
            'login_token': token
        }
    })
}

