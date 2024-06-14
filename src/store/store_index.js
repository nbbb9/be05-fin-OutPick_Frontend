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
        loginToken : "",
        loginUserName : "여경원",
        loginUserId : 1,
        loginUserRole : "",
        loginStoreId : 1,
        loginStoreUser : "여경원 매니저님",
        loginStoreName : "신대방삼거리역",
        eventListener : []
    },
    mutations : {
        // 전역 변수 상태 변경 메소드
        SHOW(state, payload){
            state.showNav = payload;
        },
        LoginToken(state, payload){
            state.loginToken = payload;
        },
        LoginUserName(state, payload){
            state.loginUserName = payload;
        },
        LoginUserId(state, payload){
            state.loginUserId = payload;
        },
        LoginUserRole(state, payload){
            state.loginUserRole = payload
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
        EventListener(state, listener){
            state.eventListener.push(listener)
        },
        ClearEventListener(state){
            state.eventListener = []
        }
    },
    actions : {
        // mutations 실행시키는 외부에서 호출하는 메서드
        triggerShow( {commit}, payload ){
            commit('SHOW', payload);
        },
        triggerLoginToken({commit}, payload){
            commit('LoginToken', payload)
        },
        triggerLoginUserName({commit}, payload){
            commit('LoginUserName', payload)
        },
        triggerLoginUserId({commit}, payload){
            commit('LoginUserId',payload)
        },
        triggerLoginUserRole({commit}, payload){
            commit('LoginUserRole',payload)
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
        triggerEventListener({commit}, payload){
            commit('EventListener', payload);
        },
        triggerClearEL({commit}){
            commit('ClearEventListener');
        }
    }   
})
