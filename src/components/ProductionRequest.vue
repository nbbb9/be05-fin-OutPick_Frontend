<template>
  <div v-if="is_visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
        <h2>생산요청서 작성</h2>
        <hr>
        <table class="table table-border" >
          <thead>
            <tr>
              <th>상품 이름</th>
              <th>색상</th>
              <th>사이즈</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ prod[0].name }}</td>
              <td>{{ prod[0].color }}</td>
              <td>{{ prod[0].size }}</td>
            </tr>
          </tbody>
        </table>
        <p><input v-model="request_amount" @input="validateInput" placeholder="수량 입력"/></p>
        <p v-if="error_message" class="error_message">{{ error_message }}</p>
        <P v-if="success_message" class="success_message">{{ success_message }}</P>
        <button @click="submit" class="button btn btn-dark">확인</button> 
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch} from 'vue';

export default defineComponent({
    name: 'ProductionRequest',
    props: {
        is_visible: {
            type: Boolean,
            required: true
        },
        prod : {
            type: Object,
            required: true,
        },
    },

    emits: ['close','submit'],
    setup(props, {emit}) {
        const request_amount = ref('');
        const error_message = ref('');
        const success_message = ref('');

        const close = () => {
            emit('close');
            success_message.value = '';
        };

        const validateInput = () => {
          if (!/^\d*$/.test(request_amount.value)) {
            error_message.value = '숫자만 입력할 수 있습니다.'
            request_amount.value = request_amount.value.replace(/\D/g, '');
          } else if (request_amount.value < 1) {
            error_message.value = '0보다 큰 수를 입력해 주세요.'
            request_amount.value = '';
          } else if (request_amount.value >=1000) {
            error_message.value = '1000미만의 숫자만 입력할 수 있습니다.'
            request_amount.value = '';
          } 
        };

        const submit = () => {
          if (request_amount.value === '') {
            error_message.value = '수량을 입력해주세요.';
            return;
          }
          emit('submit', request_amount.value);
          success_message.value = '작성 완료!';
          setTimeout(() => {
            success_message.value = '';
            close();
          }, 2500);
        };

        watch(props.prod, (newValue) => {
          console.log("product의 새 값을 받았습니다 : ", newValue)
        })

        // watch(this.is_visible, (newValue) => {
        //   console.log("is_visible의 새 값을 받았습니다 : ", newValue)
        // })

        return {
            close,
            validateInput,
            submit,
            request_amount,
            error_message,
            success_message
        };
    },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 30%;
  height: 60%;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.button {
  margin-top:5%
}

.close {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
  }
</style>