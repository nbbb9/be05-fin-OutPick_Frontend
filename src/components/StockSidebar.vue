<template>

  <div class="sidebar">
    <!-- 사이드바 내용 -->

    <ul>
      <li @click="select(1)">매장 재고</li>
      <li @click="select(2)">회사 재고</li>
      <li @click="select(3)">생산 요청서</li>
      <li @click="select(4)">상품 리스트</li>
      <li @click="select(5)">물류센터</li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue'; // , onBeforeUnmount -> sse할때 다시 추가

export default {
  emits : ["StockSidebar"],
  setup(props, context){

    const store = useStore();
    const loginEmployeeNum = computed( () => store.state.loginEmployeeNum );
    const loginUserName = computed( () => store.state.loginUserName );

    const select = (id) => {

      console.log(id);

      context.emit("StockSidebar", id)
    }

    // let sseconnect;

    // onBeforeUnmount( () => {

    //   console.log("dsfsd");

    //     try {
    //         sseconnect = new EventSource('http://localhost:8080/connect');
    //         console.log(sseconnect);
    //         sseconnect.addEventListener('proposal_solution', (e) => {
    //             if (sseconnect) {
    //               sseconnect.close();
    //             }
    //             const { data: receivedConnectData } = e;

    //             console.log("shop id 비교 전 데이터 검증 : ", receivedConnectData)
    //             const data = JSON.parse(receivedConnectData);
    //             console.log("shop_id : " ,data.shop_id);

    //             if(store.state.loginStoreId === data.shop_id){
    //               console.log('connect proposal_solution:', receivedConnectData);
    //             }

    //         });
    //     } catch (error) {
    //         console.error('Failed to initialize EventSource:', error);
    //     }
    // });

    return {
      select,
      loginEmployeeNum,
      loginUserName
    }

  }
}
</script>

<style scoped >
/* 사이드바 스타일 */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #f0f0f0;

}

/* list 형태 제거 */
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* sidebar 메뉴 설정 */
li {
  background-color : #0D2DA2;
  color: white;
  font-weight: bold;
  text-align: left;
  padding : 13px;
  margin-left: 5px;
  margin-right: 50px;
  margin-bottom: 20px;
  border-radius: 1em;
}

/* sidebar 이동과 전체 설정  */
.sidebar {
  width: 250px;
  height : 90vh;
  position: fixed;
  left: 0; top : 11%;
  background-color: #F3F7FA;
  border-radius: 20px;

  transform: translateX(-210px);
  transition: .5s;
}

.sidebar:hover {
  transform: translateX(0);   /* 둥근 모서리의 너비만큼 X축 이동, Y축 고정 */
}

.loginStoreUser{
  margin: 10px;
  margin-bottom: 20px;

  font-weight: bold;
  font-size: large;
  text-align: left;
}
</style>