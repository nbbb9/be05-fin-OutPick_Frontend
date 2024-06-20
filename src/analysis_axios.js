import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 회사의 월별 총 판매량 & 금액
export function analyze_sales_list (year) {
    return user_axios.get(`/analyze/sales/${year}`)
}

// 매장별 월 판매량
export function analyze_sales_shop_list(year, month) {
    return user_axios.get(`/analyze/sales/${year}/${month}`)
}

// 계절별 카테고리, 색상, 핏 통계
export function analyze_first_list(year, first) {
    return user_axios.post(`/analyze/sales_analyze/fc`, {
        "year": year,
        "first_classification": first
    })
}

// 핏별 카테고리 통계
export function analyze_second_list(year, second) {
    return user_axios.post(`/analyze/sales_analyze/sc`, {
            "year": year,
            "second_classification": second
    })
}

// 가격 대비 판매량
export function analyze_price_list(year, shop_id) {
    return user_axios.post(`/analyze/price_analyze`, {
        "year": year,
        "shop_id": shop_id
    })
}

// 매장별 상품의 판매량 순위
export function analyze_product_list(year, shop_id) {
    return user_axios.post(`/analyze/product_sales_analyze`, {
    
        "year": year,
        "shop_id": shop_id
          
    }) 
}