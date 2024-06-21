import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

//전체 매장 리스트
export function shop_all_list(){
    return user_axios.get('/shop/tolist/all');
}

//담당 매장 리스트
export function shop_my_list(token){
    return user_axios.get('/shop/tolist',{
        headers : {
            login_token : token
        }
    });
}

//담당 매장 리스트 상세조회
export function shop_my_detail(shopid, token){
    return user_axios.get(`/shop/detail/${shopid}`,{
        headers : {
            login_token : token
        }
    });
}

//담당 매장 재고 리스트
export function shop_stock(shopid){
    return user_axios.get(`/shopstock/detail/${shopid}`);
}

//담당 매장 재고요청서 리스트
export function shop_stockrequest_list(shopid){
    return user_axios(`/stockrequest/list/${shopid}`);
}

//담당 매장 건의사항 리스트
export function shop_proposal_list(shopid){
    return user_axios(`/proposal/shop/${shopid}`);
}

// 건의사항 리스트
export function proposal_list(token){
    return user_axios.get('/proposal/list',{
        headers : {
            login_token : token
        }
    });
}

// 건의사항 상세보기
export function proposal_detail(propsalId, token){
    return user_axios.get(`/proposal/${propsalId}`,{
        headers : {
            login_token : token
        }
    })
}

// 건의문 해결방안 작성
export function proposal_solution(data, token){
    return user_axios.put('/proposal/solution_write', data, {
        headers: {
            login_token : token
        }
    })
}

// 건의문 해결완료
export function proposal_check(data, token) {
    return user_axios.put('/proposal/checkComplete', data, {
        headers: {
            login_token: token
        }
    });
}

// 재고요청서 리스트 
export function stock_request_list(token) {
    return user_axios.get('/stockrequest/list', {
        headers: {
            login_token : token
        }
    })
}

// 재고요청서 상세조회(사원)
export function stock_request_detail(stock_request_id, token){
    return user_axios.get(`/stockrequest/${stock_request_id}`, {
        headers : {
            login_token : token
        }
    })
}


// 재고 요청서 피드백 차트
export function stock_request_chart(shop_id, product_id) {
    return user_axios.post('/analyze/stock_request_analyze', {
        "shop_id": shop_id,
        "product_id": product_id
    })
}

// 재고요청서 승인(사원)
export function stock_request_approval(stock_request_id, token, shop_id){
    return user_axios.put(`/stockrequest/confirm/${stock_request_id}`, {
        "shop_id" : shop_id
    }, {
        headers : {
            login_token : token
        }
    })
}

// 재고요청서 반려(사원)
export function stock_request_reject(stock_request_id, token, data){
    return user_axios.put(`/stockrequest/refuse/${stock_request_id}`, data, {
        headers : {
            login_token : token
        }
    })
}


// //피드백 내용
// export function stock_request_feedback(stock_request_id, data, token) {
//     return user_axios.put(`/refuse/${stock_request_id}`,{},{
//         headers : {
//             login_token : token
//         }
//     })
// }