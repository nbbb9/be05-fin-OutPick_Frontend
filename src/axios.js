import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 매장 로그인
export function store_login(data) {
    return user_axios.post('/store/login', data);
}

// 매장 재고 리스트
export function store_stock_list(shopId){
    return user_axios.get(`/store/stock/list/${shopId}`)
}

// 상품 전체 리스트
export function product_list() {
    return user_axios.get('/product')
}

// 상품 상세 조회
export function product_detail (productId){
    return user_axios.get(`/product/${productId}`)
}

// 매장 판매 리스트
export function store_sales_list(shopId) {
    return user_axios.get(`/stock/list/${shopId}`)
}