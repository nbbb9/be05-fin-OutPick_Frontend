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

// 매장 판매 리스트
export function store_sales_list(shopId) {
    return user_axios.get(`/store/sales/list/${shopId}`)
}

// 매장 상품 전체 리스트
export function product_list() {
    return user_axios.get('/store/stockrequest/productlist')
}

// 매장 상품 상세 조회
export function product_detail (stockid){
    return user_axios.get(`/store/stock/product/${stockid}`)
}

// 매장 재고 요청서 리스트
export function store_stock_request_list(shopId) {
    return user_axios.get(`/store/stockrequest/list/${shopId}`)
}

// 매장 재고 요청서 등록
export function store_stock_request_add(data) {
    return user_axios.post('/store/stockrequest/add', data)
}

// 매장 건의사항 등록
export function store_proposal_add(data) {
    return user_axios.post('/store/proposal/add', data)
}

// 매장 건의사항 리스트
export function store_proposal_list(shopId) {
    return user_axios.get(`/store/proposal/list/${shopId}`)
}