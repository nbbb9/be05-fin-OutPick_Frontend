<template>
  <div class="container">
    <div class="mt-5">
      <img src="@/assets/로고_아웃픽_forshop.png" alt="">
    </div>

    <div>
      <form v-on:submit.prevent="storeLogin()" class="mt-5">
        <table class="table table-borderless">
          <tbody>
            <tr>
              <td><input v-model="store_name" type="text" placeholder="매장 이름" class="form-control"></td>
            </tr>
            <tr>
              <td><input v-model="store_email" type="text" placeholder="매장 운영자 이메일" class="form-control"></td>
            </tr>
            <tr>
              <td><input v-model="store_admin_name" type="text" placeholder="매장 운영자 이름" class="form-control"></td>
            </tr>
          </tbody>
        </table>
        <div class="flex_item_center">
          <button class="btn mb-3">로그인</button>
        </div>
      </form>
    </div>

    <!-- 로그인 실패 팝업 -->
    <div v-if="ifFalse" class="alert alert-danger mt-4">
      로그인에 실패하셨습니다!
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { store_login } from "@/axios.js";
import EventSourceService from "@/pages/Sse/EventSourceService.js";

export default {
setup() {
  const store = useStore(); // store 변수
  store.dispatch('triggerClearEL');

  // 로그인 실패시 팝업을 띄울 변수
  const ifFalse = ref(false);

  // 서버에 보낼 데이터를 담을 변수
  let store_name = ref("");
  let store_email = ref("");
  let store_admin_name = ref("");

  // router
  const router = useRouter();

  // 매장 로그인 요청
  const storeLogin = async () => {
    let data = {
      name: store_name.value,
      email: store_email.value,
      manager: store_admin_name.value
    };

    console.log(data);

    // axios - post : 매장 로그인
    await store_login(data)
      .then((response) => {
        // 로그인 성공시 vuex에 변수 저장
        store.dispatch('triggerLoginStoreId', response.data.shop_id);
        store.dispatch('triggerLoginStoreUser', data.manager);
        store.dispatch('triggerLoginStoreName', data.name);

        // sse에 listener 추가
        let sse = new EventSourceService(store.state.loginStoreId, store);
        console.log("event source service 받아옴 : ", sse);

        sse.addESEventListener('proposal_solution', (e) => {
          const { data: receivedConnectData } = e;
          const data = JSON.parse(receivedConnectData);

          if (store.state.loginStoreId === data.shop_id) {
            console.log('connect proposal_solution:', receivedConnectData);
            // store.commit('setNotifications', true); // 알림 상태를 true로 설정
            sse.handleProposalNotification(e);
          }
        });

        sse.addESEventListener('product_discount', (e) => {
          const { data: receivedConnectData } = e;
          const data = JSON.parse(receivedConnectData);

          if (store.state.loginStoreId === data.shop_id) {
            console.log('connect product_discount:', receivedConnectData);
            // store.commit('setNotifications', true); // 알림 상태를 true로 설정
            sse.handleProductDiscountNotification(e);
          }
        });

        sse.addESEventListener('stock_request_approval', (e) => {
          const { data: receivedConnectData } = e;
          const data = JSON.parse(receivedConnectData);

          if (store.state.loginStoreId === data.shop_id) {
            console.log('connect stock_request_approval:', receivedConnectData);
            // store.commit('setNotifications', true); // 알림 상태를 true로 설정
            sse.handleStockRequestApprovalNotification(e);
          }
        });

        sse.addESEventListener('stock_request_feedback', (e) => {
          const { data: receivedConnectData } = e;
          const data = JSON.parse(receivedConnectData);

          if (store.state.loginStoreId === data.shop_id) {
            console.log('connect stock_request_feedback:', receivedConnectData);
            // store.commit('setNotifications', true); // 알림 상태를 true로 설정
            sse.handleStockRequestFeedbackNotification(e);
          }
        });

        // 페이지 이동
        router.push({
          name: "ListStoreStock"
        });
      })
      .catch((e) => {
        // 로그인 실패시 실패했다는 팝업
        console.log("store login page error : ", e);
        ifFalse.value = true;
      });
  };

  // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
  const triggerShow = () => {
    store.dispatch('triggerShow', false);
    console.log(store.state.showNav);
  };
  triggerShow();

  return {
    storeLogin,
    ifFalse,
    store_name,
    store_email,
    store_admin_name
  };
}
};
</script>

<style scoped>
img {
width: 500px;
height: 300px;
}

input {
background-color: #FFFFDB;
border-radius: 1em;
box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
width: 470px;
}

td {
display: flex;
justify-content: center;
align-items: center;
}

button {
background-color: #0D2DA2;
color: white;
}
</style>
