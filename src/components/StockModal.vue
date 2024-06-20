<template>
  <div v-if="is_visible" class="modal-overlay"  @click.self="close">
    <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <p>{{ modal_message }}</p>
        <input  @input="validateInput" v-model="discount_rate" placeholder="입력" />
        <button @click="submit" class="btn btn-dark">확인</button>
        <p v-if="error_message" class="error_message">{{ error_message }}</p>
        <P v-if="success_message" class="success_message">{{ success_message }}</P>
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

  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const discount_rate = ref('');
    const error_message = ref('');
    const success_message = ref('');

    const close = () => {
      emit('close');
    };

    const validateInput = () => {
      if (!/^\d*$/.test(discount_rate.value)) {
        discount_rate.value = '숫자만 입력할 수 있습니다.'
        discount_rate.value = discount_rate.value.replace(/\D/g, '');
        } else if (discount_rate.value < 1) {
          error_message.value = '0보다 큰 수를 입력해 주세요.'
          discount_rate.value = '';
        } else if (discount_rate.value > 100) {
          error_message.value = '100까지만 입력할 수 있습니다.'
          discount_rate.value = '';
        } 
    };

    const submit = () => {
        if (discount_rate.value === '') {
          error_message.value = '할인율을 입력해주세요.';
          return;
        }
        emit('submit', discount_rate.value);
        success_message.value = '할인율 수정 완료!';
        setTimeout(() => {
          success_message.value = '';
          close();
        }, 1000);
      };

    return {
      discount_rate,
      close,
      submit,
      validateInput,
      error_message,
      success_message
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
    height: 30%;
    padding: 5px;
    border-radius: 5px;
    text-align: center;
}

.btn {
  margin-top: 3%;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

</style>