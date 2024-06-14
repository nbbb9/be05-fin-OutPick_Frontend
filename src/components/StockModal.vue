<template>
    <div v-if="is_visible" class="modal-overlay">
      <div class="modal-content">
          <span class="close" @click="close">&times;</span>
          <p>{{ modal_message }}</p>
          <input v-model="discount_rate" placeholder="입력" />
          <button @click="submit">확인</button>
      </div>
    </div>
</template>

<script>
  import { ref, defineComponent } from 'vue';

  export default defineComponent({
    name: 'StockModal',
    props: {
      is_visible: {
        type: Boolean,
        required: true
      },
      modal_message: {
        type: String,
        required: true
      }
    },

    setup(props, { emit }) {
      const discount_rate = ref('');

      const close = () => {
        emit('close');
      };

      const submit = () => {
        emit('submit', discount_rate.value);
        close();
      };

      return {
        discount_rate,
        close,
        submit
      };
    }
});
</script>

<style scoped>

  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  .modal-content {
      background-color: white;
      width: 30%;
      height: 20%;
      padding: 5px;
      border-radius: 5px;
      text-align: center;
  }
  
  .close {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
  }
  
</style>