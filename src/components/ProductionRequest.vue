<template>
  <div v-if="is_visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
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
              <td>{{ prod[0].product_name }}</td>
              <td>{{ prod[0].color }}</td>
              <td>{{ prod[0].size }}</td>
            </tr>
          </tbody>
        </table>
        <p><input v-model="request_amount" placeholder="수량 입력" /></p>
        <button @click="submit" class="btn btn-dark" >확인</button> 
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

        const close = () => {
            emit('close');
        };

        const submit = () => {
          emit('submit', request_amount.value);
          close();
        };

        watch(props.prod, (newValue) => {
          console.log("product의 새 값을 받았습니다 : ", newValue)
        })

        // watch(this.is_visible, (newValue) => {
        //   console.log("is_visible의 새 값을 받았습니다 : ", newValue)
        // })

        return {
            close,
            submit,
            request_amount
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
  height: 50%;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>