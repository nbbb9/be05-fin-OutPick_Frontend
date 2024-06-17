import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [
    createPersistedState()
  ],
  state: {
    showNav: true,
    loginToken: "",
    loginUserName: "여경원",
    loginUserId: 1,
    loginUserRole: "",
    loginStoreId: 1,
    loginStoreUser: "여경원 매니저님",
    loginStoreName: "신대방삼거리역",
    eventListener: [],
    hasNotifications: false, // 알림 상태
    notifications: [] // 알림 데이터 배열 추가
  },
  mutations: {
    SHOW(state, payload) {
      state.showNav = payload;
    },
    LoginToken(state, payload) {
      state.loginToken = payload;
    },
    LoginUserName(state, payload) {
      state.loginUserName = payload;
    },
    LoginUserId(state, payload) {
      state.loginUserId = payload;
    },
    LoginUserRole(state, payload) {
      state.loginUserRole = payload;
    },
    LoginStoreId(state, payload) {
      state.loginStoreId = payload;
    },
    LoginStoreUser(state, payload) {
      state.loginStoreUser = payload;
    },
    LoginStoreName(state, payload) {
      state.loginStoreName = payload;
    },
    EventListener(state, listener) {
      state.eventListener.push(listener);
    },
    ClearEventListener(state) {
      state.eventListener = [];
    },
    setNotifications(state, status) {
      state.hasNotifications = status;
    },
    addNotification(state, notification) {
      state.notifications.push(notification);
      state.hasNotifications = true;
    },
    clearNotifications(state) {
      state.hasNotifications = false;
      state.notifications = [];
    },
    markNotificationsAsRead(state) {
      state.hasNotifications = false;
    }
  },
  actions: {
    triggerShow({ commit }, payload) {
      commit('SHOW', payload);
    },
    triggerLoginToken({ commit }, payload) {
      commit('LoginToken', payload);
    },
    triggerLoginUserName({ commit }, payload) {
      commit('LoginUserName', payload);
    },
    triggerLoginUserId({ commit }, payload) {
      commit('LoginUserId', payload);
    },
    triggerLoginUserRole({ commit }, payload) {
      commit('LoginUserRole', payload);
    },
    triggerLoginStoreId({ commit }, payload) {
      commit('LoginStoreId', payload);
    },
    triggerLoginStoreUser({ commit }, payload) {
      commit('LoginStoreUser', payload);
    },
    triggerLoginStoreName({ commit }, payload) {
      commit('LoginStoreName', payload);
    },
    triggerEventListener({ commit }, payload) {
      commit('EventListener', payload);
    },
    triggerClearEL({ commit }) {
      commit('ClearEventListener');
    },
    triggerNotification({ commit }, status) {
      commit('setNotifications', status);
    },
    addNotification({ commit }, notification) {
      commit('addNotification', notification);
    },
    clearNotifications({ commit }) {
      commit('clearNotifications');
    },
    markNotificationsAsRead({ commit }) {
      commit('markNotificationsAsRead');
    }
  }
});
