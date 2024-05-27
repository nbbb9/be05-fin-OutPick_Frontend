import axios from "axios";

let user_axios = axios.create({
    baseURL : "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// export function getProductByCategoryId(categoryId) {
//     return test_axios.get(`product/category/${categoryId}`);
// }