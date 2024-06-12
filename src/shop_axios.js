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


