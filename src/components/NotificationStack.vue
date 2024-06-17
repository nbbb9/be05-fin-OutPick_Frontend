<template>
    <div class="notification-stack">
      <div v-for="(notification, index) in notifications" :key="index" class="notification" @click="removeNotification(index)">
        <p>{{ notification }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    setup() {
      const store = useStore();
      const notifications = computed(() => store.state.notifications);
  
      const removeNotification = (index) => {
        store.dispatch('removeNotification', index);
      };
  
      return {
        notifications,
        removeNotification
      };
    }
  };
  </script>
  
  <style scoped>
  .notification-stack {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .notification {
    background-color: #444;
    color: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  .notification:hover {
    transform: translateY(-5px);
    opacity: 0.9;
  }
  </style>
  