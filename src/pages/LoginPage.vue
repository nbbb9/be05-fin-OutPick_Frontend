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
              <td> <input v-model="password" type="text" placeholder="비밀번호" class="form-control"></td>
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
import { login, login_info_get } from "@/axios.js"

export default {

setup(){

  // 통신 객체가 담겨짐
  const sse = new EventSource("http://localhost:8080/connect");

  sse.addEventListener('connect', (e) => {
    const {data : receivedConnectData } = e;
    console.log('connect event data : ', receivedConnectData);
  })

  sse.addEventListener('count', e => {  
    const { data: receivedCount } = e;  
    console.log("count event data",receivedCount);  
});

  // 로그인 실패시 팝업을 띄울 변수
  const ifFalse = ref(false);

  // 서버에 보낼 데이터를 담을 변수
  let employee_number = ref("");
  let password = ref("");

  //router
  const router = useRouter();

  // 로그인 요청
  const origin_login =  async () => {
    
    let data = {
      employee_number : employee_number.value,
      password : password.value,
      role : "사원"
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
          })
          .catch((e) => {
            console.log("error : ", e.message);
          })
        
        // 페이지 이동
        router.push({
          name : "ListShop"
        })
      })
      .catch( () => {
        // 로그인 실패시 실패했다는 팝업
        ifFalse.value = true;
      })

  }

  // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
  const store = useStore();   // store 변수
  const triggerShow = () => {
    store.dispatch('triggerShow', false);
    console.log(store.state.showNav)
  }
  triggerShow();

  return{
    origin_login,
    ifFalse,
    employee_number,
    password,
  } 
}
}
</script>

<style scoped >

img{
  width: 500px;
  height: 300px;
}

input{
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

button{
  background-color: #0D2DA2;
  color: white;
}

</style>