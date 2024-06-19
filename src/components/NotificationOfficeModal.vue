<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>알림 내용</h2>
      <ul>
        <li v-for="(notification, index) in notifications" :key="index">
          {{ notification }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notifications: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
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
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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
