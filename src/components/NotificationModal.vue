<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['showModal', 'notifications']),
    notificationMessage() {
      return this.notifications.length > 0 ? this.notifications[this.notifications.length - 1] : '';
    }
  },
  watch: {
    showModal(val) {
      console.log('showModal 상태 변경:', val);
    }
  },
  methods: {
    ...mapMutations(['setShowModal', 'markNotificationsAsRead']),
    closeModal() {
      this.setShowModal(false);
      this.markNotificationsAsRead(); // 알림 읽음 처리
    }
  }
}
</script>

<style>
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
