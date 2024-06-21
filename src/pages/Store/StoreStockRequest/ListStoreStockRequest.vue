<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <div class="mt-4" >
      <h5 style="text-align: left;" >재고 요청서</h5>
    </div>

    <hr>

    <div class="row" >

      <div class="col-6 listDiv" >

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
              <button @click="searchRequest" class="btn btn-dark" >검색</button>
            </div>
          </form>
        </div>


        <!-- 추가한 부분: 테이블 컨테이너 div로 감싸기 -->
        <div class="table-container">
          <table class="mt-2 table table-hover border-gray">
            <thead>
            <tr>
              <th>요청서 ID</th>
              <th>요청 상품 이름</th>
              <th>요청일</th>
              <th>결재상태</th>
            </tr>
            </thead>
            <tbody>
            <tr v-on:click="select(rq.stock_request_id)" v-for="(rq) in copy_rq_list" :key="rq.stock_request_id">
              <td>{{ rq.stock_request_id }}</td>
              <td>{{ rq.product_name }}</td>
              <td>{{ rq.request_date }}</td>
              <td>{{ rq.approval }}</td>
              <!-- <td>{{  }}</td> -->
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 추가한 부분 끝 -->

      </div>

      <div class="col-5 listDiv" >
        <div class="mt-2" >
          상세보기
        </div>

        <div v-if="rq_view" class="detail" >

          <div class="row mt-2 atr">
            <div class="col-4" >
              지점
            </div>
            <div class="col-8">
              {{ loginStoreName }}
            </div>
          </div>
          <div class="row mt-2 atr">
            <div class="col-4" >
              날짜
            </div>
            <div class="col-8">
              {{ rq_view.request_date }}
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-6" >
              <div class="row atr" >
                <div class="col-4 row-right" >
                  담당자
                </div>
                <div class="col-6 row-left">
                  {{ rq_view.employee_name }}
                </div>
              </div>
            </div>
            <div class="col-6" >
              <div class="row atr">
                <div class="col-3" >
                  결재
                </div>
                <div class="col-9 item-vertical">
                  {{ rq_view.approval }}
                  <button v-if="rq_view.approval === '반려'" @click="toFeedback(rq_view.stock_request_id, rq_view.product_id, rq_view.shop_id)" class="btn btn-dark" style="margin-left: 10%;" >피드백</button>
                </div>
              </div>
            </div>
          </div>

          <table class="mt-4 table border-gray" >
            <thead>
              <th>요청 상품 ID</th>
              <th>요청 상품</th>
              <th>수량</th>
            </thead>
            <tbody>
              <tr>
                <td>{{ rq_view.product_id }}</td>
                <td>{{ rq_view.product_name }}</td>
                <td>{{  rq_view.amount  }}</td>
              </tr>
            </tbody>
          </table>

        </div>
        
      </div>

    </div>

  </div>
</template>

<script>
import {useStore} from "vuex"
import {onMounted, ref} from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import {store_stock_request_list} from "@/axios.js"
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

    const store = useStore();   // store 변수
    const loginStoreName = ref(store.state.loginStoreName);

    // 재고 리스트 검색
    const searchText = ref(''); // search text
    let search_result = ref(false); // search 결과
    const rq_view = ref(); // 상세정보를 위한 변수

    // 재고 요청서 검색 
    const request_list = ref([]);  // 재고 요청서 리스트를 담을 배열
    const copy_rq_list = ref([]);

    // 재고 요청서 리스트 get
    const get_all_rq = async () => {
      // axios - 재고 요청서 리스트 받아오기
      await store_stock_request_list(store.state.loginStoreId)
        .then( (response) => {
          request_list.value = response.data;
          
          // 날짜 형식 바꾸기
          request_list.value.forEach((item) => {
            const fullDate = item.request_date

            const year = fullDate.slice(0, 4);
            const month = fullDate.slice(5, 7);
            const day = fullDate.slice(8, 10);

            item.request_date = `${year}-${month}-${day}`;
          });

          copy_rq_list.value = [...request_list.value];
        })

    }

    get_all_rq();

    // 검색
    const searchRequest = () => {
      if(searchText.value){
        console.log("searchtext 있음")
        copy_rq_list.value = request_list.value.filter( (rq) => {
          return rq.name.includes(searchText.value);
        } )
      }else{
        console.log("searchtext 없음")
        copy_rq_list.value = request_list.value;
      }

      if(copy_rq_list.value.length === 0){
        console.log("검색 결과가 없습니다.")
      }

      searchText.value = "";
    }

    // 클릭시 상세 정보 출력
    const select = (stock_request_id) => {
      rq_view.value = request_list.value.filter( (rq) => {
        return rq.stock_request_id === stock_request_id;
      } )[0]
    }


    const toFeedback = (stock_request_id, product_id, shop_id) => {
      router.push({ name: 'DetailStoreStockRequest', params: { stock_request_id, product_id , shop_id } });
    }


    // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', false);
      console.log(store.state.showNav)
    }
    triggerShow();

    onMounted(()=> {
      // SSE 복구
      let sse = new EventSourceService(store.state.loginStoreId, store);
      sse.restoreEventListeners();
    });

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
      searchRequest,
      request_list,
      rq_view,
      selectMenu,
      copy_rq_list,
      loginStoreName,
      toFeedback
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
.row-left{
  text-align: left;
  padding-left: 5%;
} 

/* 오른쪽 정렬 */
.row-right{
  text-align: right;
  padding-left: 5%;
} 

/* item-vertical */
.item-vertical{
  display: flex;
    justify-content: center;
    align-items: center;
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
.listDiv, .atr{
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 1%;
}

.atr{
  height: 8vh;
}

.listDiv, .detail{
  height: 80vh;
}

/* 추가한 부분: 테이블 컨테이너와 고정 헤더 스타일 */
.table-container {
  max-height: 73vh;
  overflow-y: auto;
  position: relative;
}

.table-container thead {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

/* alert 설정 */
.alert{
  font-weight: bold;
  box-shadow: 0 3px 7px rgba(139, 139, 139, 0.403); 
}
</style>