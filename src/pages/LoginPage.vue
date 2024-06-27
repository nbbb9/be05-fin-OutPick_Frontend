<template>
  <div class="container" >
    <div class="mt-5" >
      <img src="@/assets/로고_슬로건.png" alt="">
    </div>

    <div>
      <form v-on:submit.prevent="origin_login()" class="mt-5" >
        <table class="table table-borderless ">
          <tbody>
            <tr>
              <td> <input v-model="employee_number" type="text" placeholder="사원번호" class="form-control"></td>
            </tr>
            <tr>
              <td> <input v-model="password" type="password" placeholder="비밀번호" class="form-control"></td>
            </tr>
          </tbody>
        </table>
        <div class="flex_item_center">
          <button class="btn mb-3">로그인</button>
        </div>
      </form>
    </div>

    <!-- 로그인 실패 팝업 -->
    <div class="alert_class">
      <div v-if="ifFalse" class="alert alert-danger mt-4 flex_item_center" style="width: 50%;" >
        로그인에 실패하셨습니다!
      </div>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { login, login_info_get } from "@/axios.js"
import EventSourceServiceOffice from "@/pages/Sse/EventSourceServiceOffice.js";

export default {

setup(){

  const store = useStore();   // store 변수
  const router = useRouter(); //router

  store.dispatch('triggerClearEL');

  if(store.state.loginToken.length > 0 && store.state.loginUserName.length > 0
      && store.state.loginUserId !== 0
  ){
    console.log("tlq")
    router.push({
      name : "ListShop"
    })
  }

  // 로그인 실패시 팝업을 띄울 변수
  const ifFalse = ref(false);

  // 서버에 보낼 데이터를 담을 변수
  let employee_number = ref("");
  let password = ref("");

  // 로그인 요청
  const origin_login =  async () => {
    
    let data = {
      employee_number : employee_number.value,
      password : password.value,
    };

    // axios - post : 매장 로그인
    await login(data) 
      .then( (response) => {
        // 로그인 성공시 vuex에 변수 저장
        store.dispatch('triggerLoginToken', response.data);
        
        // 토큰을 이용한 사용자 정보 받아오기
        login_info_get(store.state.loginToken)
          .then( (response) => {
            store.dispatch('triggerLoginUserName', response.data.name);
            store.dispatch('triggerLoginUserId', response.data.id);
            store.dispatch('triggerLoginUserRole',response.data.role);
            store.dispatch('setActiveTab', 'ListShop');

            // sse에 listener 추가
            console.log( "야호!" ,store.state.loginUserId);
            let sse = new EventSourceServiceOffice(store.state.loginUserId, store);
            console.log("event source service office 받아옴 : ", sse);

            sse.addESEventListener('add_stock_request', (e) => {
              const { data: receivedConnectData } = e;
              const data = JSON.parse(receivedConnectData);

              if (store.state.loginUserId === data.employee_id) {
                console.log('connect add_stock_request:', receivedConnectData);
                // store.commit('setNotifications', true); // 알림 상태를 true로 설정
                sse.handleStockRequestNotification(e);
              }
            });

            sse.addESEventListener('add_proposal', (e) => {
              const { data: receivedConnectData } = e;
              const data = JSON.parse(receivedConnectData);

              if (store.state.loginUserId === data.employee_id) {
                console.log('connect add_proposal:', receivedConnectData);
                // store.commit('setNotifications', true); // 알림 상태를 true로 설정
                sse.handleAddProposalNotification(e);
              }
            });

            // 페이지 이동
            router.push({
              name : "ListShop"
            })
          })
          .catch((e) => {
            console.log("error : ", e.message);
            // 로그인 실패시 실패했다는 팝업
            ifFalse.value = true;
          })
      })
      .catch( () => {
        // 로그인 실패시 실패했다는 팝업
        ifFalse.value = true;
      })

  }

  // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
  const triggerShow = () => {
    store.dispatch('triggerShow', false);
    console.log(store.state.showNav)
  }
  triggerShow();

  return{
    origin_login,
    ifFalse,
    employee_number,
    password
  } 
}
}
</script>


<style scoped >
img{
  width: 500px;
  height: 300px;
}

input, select{
  background-color: #FFFFDB;
  border-radius: 1em;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2); 

  width: 470px;
}

td, .alert_class {
  display: flex;
  justify-content: center;
  align-items: center;
}

button{
  background-color: #0D2DA2;
  color: white;
}

</style>