import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 일반 로그인
export function login(data) {
    return user_axios.post('/user/login', data);
}

// 로그인 정보 얻어오기
export function login_info_get(token) {
    return user_axios.get('/user/getInfo', {
        headers : {
            login_token : token
        }
    })
}


////////////////////////////////////////////////////

// 매장프로그램 로그인
export function store_login(data) {
    return user_axios.post('/store/login', data);
}

// 매장프로그램 재고 리스트
export function store_stock_list(shopId){
    return user_axios.get(`/store/stock/list/${shopId}`)
}

// 매장프로그램 판매 추가
export function store_sales_add(data) {
    return user_axios.post('/store/sales/add', data)
}

// 매장프로그램 판매 리스트
export function store_sales_list(shopId) {
    return user_axios.get(`/store/sales/list/${shopId}`)
}

// 매장프로그램 상품 전체 리스트
export function product_list() {
    return user_axios.get('/store/stockrequest/productlist')
}

// 매장프로그램 상품 상세 조회
export function product_detail (stockid){
    return user_axios.get(`/store/stock/product/${stockid}`)
}

// 매장프로그램 재고 요청서 리스트
export function store_stock_request_list(shopId) {
    return user_axios.get(`/store/stockrequest/list/${shopId}`)
}

// 매장프로그램 피드백 내용 보기
export function store_stock_request_feedback(stockRequestId){
    return user_axios.get(`/store/stockrequest/feedback/${stockRequestId}`)
}

// 매장프로그램 재고 요청서 등록
export function store_stock_request_add(data) {
    return user_axios.post('/store/stockrequest/add', data)
}

// 매장프로그램 건의사항 등록
export function store_proposal_add(data) {
    return user_axios.post('/store/proposal/add', data)
}

// 매장프로그램 건의사항 리스트
export function store_proposal_list(shopId) {
    return user_axios.get(`/store/proposal/list/${shopId}`)
}