import {createRouter, createWebHistory} from "vue-router";

import Login from "@/pages/LoginPage.vue"
import StoreLogin from "@/pages/Store/StoreLoginPage.vue"

// 본 프로그램
import ListShopStock from "@/pages/Stock/ListShopStock.vue";
import ListEmployee from "@/pages/Admin/Employee/ListEmployee.vue";

// 매장
import ListStoreStock from "@/pages/Store/ListStoreStock.vue"
import AddStoreStockRequest from "@/pages/Store/StoreStockRequest/AddStoreStockRequest.vue"
import ListStoreStockRequest from "@/pages/Store/StoreStockRequest/ListStoreStockRequest.vue"
import DetailStoreStockRequest from "@/pages/Store/StoreStockRequest/DetailStoreStockRequest.vue"
import ListStoreSales from "@/pages/Store/ListStoreSales.vue"
import AddStoreProposal from "@/pages/Store/StoreProposal/AddStoreProposal.vue"
import ListStoreProposal from "@/pages/Store/StoreProposal/ListStoreProposal.vue"
import ListShop from "@/pages/Shop/ListShop/ListShop.vue";




const router = createRouter({
    history : createWebHistory(),
    routes : [
        {
            path : "/",
            name : "Login",
            component : Login
        },
        {
            path : "/shop_list",
            name : "ListShop",
            component : ListShop
        },
        {
            path : "/employee_list",
            name : "ListEmployee",
            component : ListEmployee
        },
        // 매장
        {
            path : "/store_login",
            name : "StoreLogin",
            component : StoreLogin

        },
        {
            path : "/store_stock",
            name : "ListStoreStock",
            component : ListStoreStock
        },
        {
            path : "/store_stock_request_add",
            name : "AddStoreStockRequest",
            component : AddStoreStockRequest
        },
        {
            path : "/store_stock_request_detail",
            name : "DetailStoreStockRequest",
            component : DetailStoreStockRequest
        },
        {
            path : "/store_stock_request_list",
            name : "ListStoreStockRequest",
            component : ListStoreStockRequest
        },
        {
            path : "/store_sales",
            name : "ListStoreSales",
            component : ListStoreSales
        },
        {
            path : "/store_proposal_list",
            name : "ListStoreProposal",
            component : ListStoreProposal
        },
        {
            path : "/store_proposal_add",
            name : "AddStoreProposal",
            component : AddStoreProposal
        },
        // 매장 재고
        {
            path : "/shopstock",
            name : "ListShopStock",
            component : ListShopStock
        }
    ]
});

export default router;