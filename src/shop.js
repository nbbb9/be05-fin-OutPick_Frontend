import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});



// 건의사항 리스트
export function proposal_list(data){
    return user_axios.get('/proposal/list', data)
}

// 건의사항 상세보기
export function proposal_detail(propsalId, data){
    return user_axios.get(`/proposal/${propsalId}`, data)
}

// 건의문 해결방안 작성
export function proposal_solution(data){
    return user_axios.get('/proposal/solution_write', data)
}

// 건의문 해결완료
export function propsal_check(data){
    return user_axios.get('/proposal/checkComplete', data)
}