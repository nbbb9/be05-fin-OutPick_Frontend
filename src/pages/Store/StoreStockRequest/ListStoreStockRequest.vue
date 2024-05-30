<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <!-- 검색창 -->
    <div class="search_div">
      <form v-on:submit.prevent="search" class="row mt-4" >
        <div class="col-3" >
          <h5>상품 이름</h5>
        </div>
        <div class="col-7" >
          <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control" >
        </div>
        <div class="col-2" >
          <button class="btn btn-outline-light text-black" >검색</button>
        </div>
      </form>
    </div>

    <hr>

    <!-- 판매 조회 -->
    <div class="row row-right mt-4" >
      <div class="col">
        <h5 class="seeList" @click="initial" >재고 요청서 목록</h5>
      </div>
    </div>

    <div class="row mt-1 listDiv" >

      <table class="table table-hover border-gray" >
        <thead>
          <tr>
            <th>요청서 ID</th>
            <th>상품 이름</th>
            <th>개수</th>
            <th>요청일</th>
            <th>결재상태</th>
          </tr>
        </thead>
        <tbody  >
          <!-- v-for="(st, index) in copy_st_list" :key="st.stockId" -->
          <tr v-on:click="select()" >
            <td>1</td>
            <td>검정 반팔티</td>
            <td>2벌</td>
            <td>2023.03.23</td>
            <!-- <td>{{  }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="search_result" class="alert alert-info mt-3" >
      검색 결과가 존재하지 않습니다.
    </div>

  <div class="AddSales">

    <div class="row row-right mt-5">
      <div class="col-2" >
        <h5>상세 보기</h5>
      </div>
    </div>

    <hr>

    <table class="table table-hover border-gray" >
      <thead>
        <th>요청서ID</th>
        <th>상품 이름</th>
        <th>개수</th>
        <th>요청일</th>
        <th>결재상태</th>
      </thead>
      <tbody>
        <tr v-for="(rq) in stock_request_list" :key="rq.stock_request_id" >
          <td>{{ rq.stock_request_id }}</td>
          <td>{{ rq.name }}</td>
          <td>{{ rq.amount }}</td>
          <td>{{ rq.request_date }}</td>
          <td>{{ rq.approval }}</td>
          <td><button v-on:click.prevent="selectSeles(rq.stock_request_id)" class="btn">선택</button></td>
        </tr>
      </tbody>

    </table>

  </div>

  </div>
</template>

<script>
import {useStore} from "vuex"
import { ref } from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';

export default {
  components : {
    StoreSidebar
  },
  setup(){

  // 판매 내역 검색
  const searchText = ref(''); // search text
  let search_result = ref(false); // search 결과
  const stock_list = ref([]); // 최초 list정보만을 담을 배열
  const copy_st_list = ref([{}]); // search를 위한 배열
  const stock_view = ref(); // 상세정보를 위한 변수

  // 판매 추가
  const inputAmount = ref();
  const selectPdId = ref();

  // 전체 상품 정보 get
  const get_all_rq = () => {
    copy_rq_list.value = [...stock_request_list.value];
  }

  // 상품 검색
  const searchSalesText = ref('');  // search sales 
  const stock_request_list = ref([{
    stock_request_id : 1,
    name : "검정 반팔티",
    amount : "2",
    request_date : "2024-05-29",
    approval : "반려"
  }, {
    stock_request_id : 2,
    name : "남색 반팔티",
    amount : "99",
    request_date : "2024-05-29",
    approval : "승인"
  }]);  // 상품 정보를 담을 배열
  const copy_rq_list = ref([]);

  get_all_rq();

  // 상품 선택
  const selectSeles = ( select_id ) => {
    console.log("선택된 상품의 아이디 : ", select_id)
    selectPdId.value = select_id
  }

  const addSales = () => {

    let data = {
      product_id : selectPdId.value,
      quantity : inputAmount.value
    }

    console.log("debug >> " , data);
  }


  // 검색
  const searchSales = () => {
    if(searchSalesText.value){
      console.log("searchtext 있음")
      copy_rq_list.value = stock_request_list.value.filter( (s_pd) => {
        return s_pd.name.includes(searchSalesText.value);
      } )
    }else{
      console.log("searchtext 없음")
      copy_rq_list.value = stock_request_list.value;
    }

    if(copy_rq_list.value.length === 0){
      console.log("검색 결과가 없습니다.")
    }

    searchSalesText.value = "";
  }

  

  // 클릭시 상세 정보 출력
  const select = () => {
    console.log("not happy!!");
  }

  // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
  const store = useStore();   // store 변수
  const triggerShow = () => {
    store.dispatch('triggerShow', false);
    console.log(store.state.showNav)
  }
  triggerShow();

  // 메뉴 이동
  const router = useRouter();
  const selectMenu = (selectMenu) => {
    console.log(selectMenu);

    switch (selectMenu) {
      case 1:
        router.push({
          name : "ListStoreStock"
        })
        break;
      case 2:
        router.push({
          name : "AddStoreStockRequest"
        })
        break;
      case 3 :
        router.push({
          name : "ListStoreStockRequest"
        })
        break;
      case 4 :
        router.push({
          name : "ListStoreSales"
        })
        break;
      case 5 :
        router.push({
          name : "AddStoreProposal"
        })
        break;
      case 6 :
        router.push({
          name : "ListStoreProposal"
        })
        break;
      default:
        break;
    }
    
  }

  return{
    select,
    searchText,
    search_result,
    copy_st_list,
    stock_list,
    stock_view,
    selectMenu,
    searchSales,
    stock_request_list,
    copy_rq_list,
    selectSeles,
    searchSalesText,
    addSales,
    inputAmount
  }
}

}
</script>

<style scoped>
/* 폰트 */
@import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');

.gowun-dodum-regular {
font-family: "Gowun Dodum", sans-serif;
font-weight: 400;
font-style: normal;
}

div{
font-family: "Gowun Dodum", sans-serif;
}

/* 검색 div 정렬 */
form > .col-3{
text-align: right;
}

form > .col-2{
display: flex;
align-items: flex-start;
}

/* 아이템 가운데 정렬 */
.row{
display: flex;
align-items: center;
}

/* 왼쪽 정렬 */
.row-right{
text-align: left;
padding-left: 5%;
} 

/* hover시 그림자 효과 */
.seeList:hover{
text-shadow: 0 3px 7px rgba(17, 17, 17, 0.403); 
}

/* 세로 방향 가운데 정렬 */
td {
vertical-align: middle; 
}

/* list scroll, list 그림자 */
.listDiv{
  max-height : 30vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
}

/* alert 설정 */
.alert{
  font-weight: bold;
  box-shadow: 0 3px 7px rgba(139, 139, 139, 0.403); 
}
</style>