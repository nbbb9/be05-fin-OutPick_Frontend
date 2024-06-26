// store/index.js

import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [
    createPersistedState() // vuex-persistedstate 플러그인 사용
  ],
  state: {
    showNav: true,
    loginToken: "",
    loginUserName: "",
    loginUserId: 0,
    loginUserRole: "",
    loginStoreId: 0,
    loginStoreUser: "",
    loginStoreName: "",
    eventListener: [],
    hasNotifications: false, // 알림 상태
    notifications: [], // 알림 데이터 배열 추가
    hasNotificationsOffice: false, // 알림 상태
    notificationsOffice: [], // 알림 데이터 배열 추가
    showModal: false,
    selectedId: null, // 선택된 항목의 ID를 저장
    activeTab: 'ListShop' // 추가된 상태
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
      state.showModal = true; // 모달 표시
    },
    clearNotifications(state) {
      console.log("clearNotifications 뮤테이션 호출됨");
      state.hasNotifications = false;
      state.notifications = [];
    },
    markNotificationsAsRead(state) {
      state.hasNotifications = false;
    },
    SET_NOTIFICATIONS_AS_READ(state) {
      state.hasNotifications = false;
    },
    CLEAR_NOTIFICATIONS(state) {
      state.showModal = false;
      state.hasNotifications = false;
      state.notifications = [];
    },
    SET_SHOW_MODAL(state, payload) {
      state.showModal = payload;
    },
    REMOVE_NOTIFICATION(state, notificationMessage) {
      const index = state.notifications.findIndex(n => n === notificationMessage);
      if (index !== -1) {
        state.notifications.splice(index, 1);
        state.hasNotifications = state.notifications.length > 0;
      }
    },
    SET_SELECTED_ID(state, payload) {
      state.selectedId = payload;
    },
    SET_ACTIVE_TAB(state, tabName) {
      state.activeTab = tabName;
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
    markNotificationsAsRead({ commit }) {
      commit('SET_NOTIFICATIONS_AS_READ');
    },
    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    },
    triggerShowModal({ commit }, payload) {
      commit('SET_SHOW_MODAL', payload);
    },
    removeNotification({ commit }, notification) {
      commit('REMOVE_NOTIFICATION', notification);
    },
    setSelectedId({ commit }, payload) {
      commit('SET_SELECTED_ID', payload);
    },
    setActiveTab({ commit }, tabName) {
      commit('SET_ACTIVE_TAB', tabName);
    }
  }
});
