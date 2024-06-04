import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    plugins : [
        createPersistedState()
        // 만약 state 변수가 늘어난다면   
        // paths로 설정해주기
    ],
    state : {
        // 전역 변수
        showNav : true,
        isAdmin : true,
        loginStoreId : 1,
        loginStoreUser : "여경원 매니저님",
        loginStoreName : "신대방삼거리역",
        sseConnect : null
    },
    mutations : {
        // 전역 변수 상태 변경 메소드
        SHOW(state, payload){
            state.showNav = payload;
        },
        IsAdmin(state, payload){
            state.isAdmin = payload;
        },
        LoginStoreId(state, payload){
            state.loginStoreId = payload;
        },
        LoginStoreUser(state, payload){
            state.loginStoreUser = payload
        },
        LoginStoreName(state, payload){
            state.loginStoreName = payload
        },
        SseConnect(state, payload){
            state.sseConnect = payload
        }
    },
    actions : {
        // mutations 실행시키는 외부에서 호출하는 메서드
        triggerShow( {commit}, payload ){
            commit('SHOW', payload);
        },
        triggerIsAdmin({commit}, payload){
            commit('IsAdmin', payload)
        },
        triggerLoginStoreId({commit}, payload){
            commit('LoginStoreId', payload)
        },
        triggerLoginStoreUser({commit}, payload){
            commit('LoginStoreUser', payload)
        },
        triggerLoginStoreName({commit}, payload){
            commit('LoginStoreName', payload)
        },
        triggerSseConnect({commit}, payload){
            commit('SseConnect', payload)
        }
    }   
})