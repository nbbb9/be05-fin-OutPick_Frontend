<template>
  <div class="sidebar">
    <!-- 사이드바 내용 -->
    <div class="logininfo-alert">
      <div class="loginStoreUser">
        {{ loginStoreName }} <br>
        {{ loginStoreUser }} 님
      </div>
      <div class="alert-icon" @click="showNotifications">
        <img :src="notificationImage" alt="Notification Image" />
      </div>
    </div>

    <ul>
      <li @click="select(1)">재고 확인</li>
      <li @click="select(2)">재고요청서 작성</li>
      <li @click="select(3)">재고요청서 관리</li>
      <li @click="select(4)">판매 관리</li>
      <li @click="select(5)">건의사항 작성</li>
      <li @click="select(6)">건의사항 관리</li>
    </ul>

    <!-- Notification Modal -->
    <NotificationModal v-if="showModal" :notifications="notifications" @close="closeModal" />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  components: {
    NotificationModal
  },
  emits: ["StoreSidebar"],
  setup(props, context) {
    const store = useStore();
    const loginStoreUser = computed(() => store.state.loginStoreUser);
    const loginStoreName = computed(() => store.state.loginStoreName);
    const hasNotifications = computed(() => store.state.hasNotifications);
    const notifications = computed(() => store.state.notifications);
    const showModal = computed(() => store.state.showModal);

    const select = (id) => {
      console.log(id);
      context.emit("StoreSidebar", id);
    };

    const notificationImage = computed(() => {
      return hasNotifications.value ? require('@/assets/alert.png') : require('@/assets/noalert.png');
    });

    // const showNotifications = () => {
    //   if (hasNotifications.value) {
    //     showModal.value = true;
    //     store.dispatch('markNotificationsAsRead');
    //   }
    // };
    //
    // const closeModal = () => {
    //   console.log("closeModal 호출됨");
    //   store.commit('setShowModal', false);
    //   store.dispatch('clearNotifications');
    // };

    const showNotifications = () => {

      console.log("모달 켜지려는 중")

      if (hasNotifications.value) {
        // store.commit('SET_SHOW_MODAL', true);
        console.log("모달 켜짐")
        // store.dispatch('markNotificationsAsRead');  // 알림 확인
        // store.dispatch('addNotification')
      }
    };

    const closeModal = () => {
      console.log("closeModal 호출됨");
      // store.commit('SET_SHOW_MODAL', false);
      store.dispatch('clearNotifications');
    };

    return {
      select,
      loginStoreUser,
      loginStoreName,
      notificationImage,
      showNotifications,
      showModal,
      notifications,
      closeModal
    };
  }
}
</script>

<style scoped>
/* 사이드바 스타일 */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #f0f0f0;
}

/* 로그인 정보와 아이콘을 수평으로 유지 */
.logininfo-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.alert-icon {
  flex-shrink: 0; /* 아이콘의 크기가 부모를 넘지 않도록 */
  width: 50px; /* 원하는 너비 */
  height: 50px; /* 원하는 높이 */
  cursor: pointer; /* 클릭 가능한 커서 */
}

.alert-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 이미지 비율 유지 */
  aspect-ratio: 1 / 1; /* 1:1 비율 */
}

/* list 형태 제거 */
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* sidebar 메뉴 설정 */
li {
  background-color: #0D2DA2;
  color: white;
  font-weight: bold;
  text-align: left;
  padding: 13px;
  margin-left: 5px;
  margin-right: 50px;
  margin-bottom: 20px;
  border-radius: 1em;
}

/* sidebar 이동과 전체 설정  */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #F3F7FA;
  border-radius: 20px;
  transform: translateX(-210px);
  transition: 0.5s;
  z-index: 2
}

.sidebar:hover {
  transform: translateX(0); /* 둥근 모서리의 너비만큼 X축 이동, Y축 고정 */
}

.loginStoreUser {
  margin: 10px;
  font-weight: bold;
  font-size: large;
  text-align: left;
}
</style>
