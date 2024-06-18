import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8081/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 영업 사원 리스트 받아오기
export function admin_employee_list (token) {
    return user_axios.get('/employee/list', {
        headers : {
            login_token : token
        }
    })
}

// 영업 사원 상세정보 받아오기
export function admin_employee_detail(employeeId, token) {
    return user_axios.get(`/employee/${employeeId}`,{
        headers : {
            login_token : token
        }
    })
}

// 영업 사원 정보 수정하기
export function admin_employee_modify(data, token) {
    return user_axios.put('/employee/update', data, {
        headers : {
            login_token : token
        }
    })
}

// 영업 사원 정보 수정을 위한 매장 리스트
export function admin_employee_shop_list() {
    return user_axios.get('/shop/tolist/all')
}

// 영업 사원 분석
export function admin_employee_analyze(em_id, month, year, token) {
    return user_axios.get(`/employee_analyze?employee_id=${em_id}&month=${month}&year=${year}`, {
        headers : {
            login_token : token
        }
    })
}

// 재고 요청서 리스트 받아오기
export function admin_stock_request_list(token) {
    return user_axios.get('/stockrequest/list', {
        headers : {
            login_token : token
        }
    })
}

// 재고 요청서 단일 조회
export function admin_stock_request_detail(streId, token) {
    return user_axios.get(`/stockrequest/${streId}`,{
        headers : {
            login_token : token
        }
    })
}

// 재고 요청서 단일 승인
export function admin_stock_request_confirm(streId, token) {
    return user_axios.put(`/stockrequest/confirm/${streId}`, null, {
        headers : {
            login_token : token
        }
    })
}

// 생산 요청서 리스트 받아오기
export function admin_production_request_list(token) {
    return user_axios.get('/productionrequest/list', {
        headers : {
            login_token : token
        }
    })
}

// 생산 요청서 단일 조회
export function admin_production_request_detail(prId, token) {
    return user_axios.get(`/productionrequest/${prId}`, {
        headers : {
            login_token : token
        }
    })
}

// 생산 요청서 단일 승인
export function admin_production_request_confirm(prId, token) {
    return user_axios.put(`/productionrequest/confirm/${prId}`, null, {
        headers : {
            login_token : token
        }
    })
}   
