<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">알림 내용</h2>
        <span class="close" @click="closeModal">&times;</span>
      </div>
      <div v-if="localNotifications.length === 0" class="no-notifications">
        받은 알림이 없습니다.
      </div>
      <ul v-else class="noti-list">
        <li v-for="notification in localNotifications" :key="notification.id" class="noti-item">
          <span class="notification-text">{{ notification.message }}</span>
          <div class="button-group">
            <button type="button" class="btn btn-outline-success" @click="handleMove(notification)">이동</button>
            <button type="button" class="btn btn-outline-secondary" @click="handleLater(notification)">x</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    notifications: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localNotifications: []
    };
  },
  created() {
    this.localNotifications = this.notifications.map((message, index) => ({ id: index + 1, message }));
  },
  watch: {
    notifications: {
      handler(newNotifications) {
        this.localNotifications = newNotifications.map((message, index) => ({ id: index + 1, message }));
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['removeNotification']),
    
    // 모달 닫기
    closeModal() {
      this.$emit('close');
    },

    // 이동 버튼 눌렀을때 각 페이지로 이동
    handleMove(notification) {
      const routeName = notification.message.includes('재고요청서') ? 'ListStockRequest' :
                        notification.message.includes('건의문') ? 'ListProposal' : null;

      if (routeName) {
        this.$router.push({ name: routeName }).then(() => {
          this.removeNotificationFromLocalAndStore(notification);
        });
      } else {
        this.removeNotificationFromLocalAndStore(notification);
      }
    },
    
    // 나중에 보기 버튼 눌렀을때 알림 항목 삭제
    handleLater(notification) {
      this.removeNotificationFromLocalAndStore(notification);
    },
    
    removeNotificationFromLocalAndStore(notification) {
      const index = this.localNotifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.localNotifications.splice(index, 1);
        this.removeNotification(notification.message);
      }
    }
  },
  mounted() {
    document.querySelector('.modal').addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        event.stopPropagation();
      }
    });
  }
};
</script>

<style scoped>
.modal {
  display: block; /* 기본적으로 숨김 */
  position: fixed; /* 위치 고정 */
  z-index: 1; /* 가장 위에 위치 */
  padding-top: 100px; /* 박스의 위치 */
  left: 0;
  top: 0;
  width: 100%; /* 전체 너비 */
  height: 100%; /* 전체 높이 */
  overflow: auto; /* 필요 시 스크롤 허용 */
  /* background-color: rgb(0,0,0); Fallback 색상 */
  /* background-color: rgba(0,0,0,0.4); 검은색 배경에 불투명도 적용 */
}

.modal-content {
  background-color: #cadaed; /* 모달 배경색 */
  margin-left: auto; /* 왼쪽 마진 자동 설정으로 오른쪽 정렬 */
  margin-right: 20px; /* 오른쪽 여백 추가 */
  padding: 5px; /* 내부 여백 */
  width: 30%; /* 너비 30% */
}

.modal-header {
  display: flex; /* 플렉스 박스 사용 */
  align-items: center; /* 수직 가운데 정렬 */
  position: relative; /* 상대 위치 */
  padding: 5px 5px; /* 패딩을 줄여 높이 감소 */
  border-bottom: 3px solid white; /* 하단에 두꺼운 하얀색 줄 추가 */
}

.modal-title {
  flex-grow: 1; /* 제목이 가운데에 위치할 수 있도록 확장 */
  text-align: center; /* 텍스트 가운데 정렬 */
  margin: 0; /* 기본 마진 제거 */
  font-size: 18px; /* 폰트 크기 조정 */
  font-weight: bold;
}

.close {
  color: #000000; /* 닫기 버튼 색상 */
  font-size: 24px; /* 글자 크기 조정 */
  font-weight: bold; /* 글자 굵기 */
  cursor: pointer; /* 커서 포인터로 변경 */
  position: absolute; /* 절대 위치 */
  right: 10px; /* 오른쪽 정렬 */
  top: 5px; /* 위쪽 정렬 */
}

.close:hover,
.close:focus {
  color: black; /* 마우스를 올리거나 포커스 시 검정색 */
  text-decoration: none; /* 밑줄 제거 */
}

.noti-list {
  margin-top: 10px;
  margin-bottom: 10px;
  list-style-type: none; /* 리스트 아이템의 기본 점 제거 */
  padding: 0; /* 기본 패딩 제거 */
  font-weight: bold;
}

.noti-item {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: space-between; /* 내용과 버튼 그룹 사이에 공간 배분 */
  align-items: center; /* 수직 정렬 */
  padding: 10px 0; /* 리스트 아이템의 패딩 */
  border-bottom: 1px solid white; /* 하단에 하얀색 줄 추가 */
  margin: 0px 30px; 
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.noti-item:last-child {
  border-bottom: none; /* 마지막 아이템에는 줄 제거 */
}

.button-group {
  display: flex; /* 플렉스 박스 사용 */
  gap: 10px; /* 버튼 사이의 간격 조정 */
}

.no-notifications {
  text-align: center; /* 텍스트 가운데 정렬 */
  font-size: 18px; /* 폰트 크기 조정 */
  margin: 20px 0; /* 상하 마진 */
}
</style>
