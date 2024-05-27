import {createRouter, createWebHistory} from "vue-router";

import Login from "@/pages/LoginPage.vue"

const router = createRouter({
    history : createWebHistory(),
    routes : [
        {
            path : "/",
            name : "Login",
            component : Login
        }
    ]
});

export default router;