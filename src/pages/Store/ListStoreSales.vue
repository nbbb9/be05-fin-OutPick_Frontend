<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <!-- 검색창 -->
    <div class="search_div">
      <form v-on:submit.prevent="search" class="row mt-4" >
        <div class="col-3" >
          <h5>판매 상품 이름</h5>
        </div>
        <div class="col-7" >
          <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control" >
        </div>
        <div class="col-2" >
          <button @click="searchSalesList" class="btn btn-outline-light text-black" >검색</button>
        </div>
      </form>
    </div>

    <hr>

    <!-- 판매 조회 -->
    <div class="row row-right mt-4" >
      <div class="col">
        <h5 class="seeList" @click="initial" >판매 내역</h5>
      </div>
    </div>

    <div class="row mt-1 listDiv" >

      <table class="table table-hover border-gray" >
        <thead>
          <tr>
            <th>판매 ID</th>
            <th>재고 이름</th>
            <th>판매량</th>
            <th>판매일</th>
          </tr>
        </thead>
        <tbody  >
          <!--  -->
          <tr v-for="(s) in copy_s_list" :key="s.shop_sales_id" >
            <td>{{ s.shop_sales_id }}</td>
            <td>{{ s.product_name }}</td>
            <td>{{ s.quantity }}</td>
            <td>{{ s.date }}</td>
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
      <div class="col-2 seeList" @click="initialProduct" >
        <h5>판매 상품 검색</h5>
      </div>
      <div class="col-2" >
        <input v-model="searchSalesText" type="text" class="form-control" >
      </div>
      <div class="col-2" >
        <button v-on:click="searchSales()" class="btn btn-outline-light text-black" >검색</button>
      </div>
      <div class="col-2" >
        <h5>판매 수량</h5>
      </div>
      <div class="col-2" >
        <input v-model="inputAmount" type="text" class="form-control" >
      </div>
      <div class="col-2" >
        <button  v-on:click="addSales()" class="btn btn-outline-light text-black">추가</button>
      </div>
    </div>

    <div v-if="ifSuccess" class="alert alert-info mt-4">
      정상적으로 등록 되었습니다!
    </div>

    <div v-if="ifFalse" class="alert alert-danger mt-4">
      등록에 실패 하였습니다!
    </div>

    <hr>

    <div class="listDiv">
      <table class="table table-hover border-gray" >
        <thead>
          <th>상품 ID</th>
          <th>상품 이름</th>
          <th>계절</th>
          <th>색상</th>
          <th>성별</th>
          <th>사이즈</th>
          <th>핏</th>
        </thead>
        <tbody>
          <tr v-for="(pd) in copy_pd_list" :key="pd.product_id" :class="{'table-primary' : selectedIndex === pd.product_id }">
            <td>{{ pd.product_id }}</td>
            <td>{{ pd.name }}</td>
            <td>{{ pd.season }}</td>
            <td>{{ pd.color }}</td>
            <td>{{ pd.gender }}</td>
            <td>{{ pd.size }}</td>
            <td>{{ pd.fit }}</td>
            <td><button v-on:click.prevent="selectSeles(pd.product_id)" class="btn btn-dark">선택</button></td>
          </tr>
        </tbody>

      </table>
    </div>
    

  </div>

  </div>
</template>

<script>
import {useStore} from "vuex"
import {onMounted, ref} from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import {product_list, store_sales_list, store_sales_add} from "@/axios.js"
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

  // 판매 내역 검색
  const searchText = ref(''); // search text
  let search_result = ref(false); // search 결과
  const sales_list = ref([]); // 최초 list정보만을 담을 배열
  const copy_s_list = ref([{}]); // search를 위한 배열

  const searchSalesList = () => {
    copy_s_list.value = sales_list.value.filter( (s) => {
      return s.product_name.includes(searchText.value);
    })
  }

  // 판매 전체 리스트
  const store = useStore();   // store 변수
  const get_sales_list = async () => {
    await store_sales_list(store.state.loginStoreId)
      .then((response) => {
        sales_list.value = response.data;

        // 날짜 형식 바꾸기
        sales_list.value.forEach((item) => {
          const fullDate = item.date

          const year = fullDate.slice(0, 4);
          const month = fullDate.slice(5, 7);
          const day = fullDate.slice(8, 10);

          item.date = `${year}-${month}-${day}`;
        });

        copy_s_list.value = [...sales_list.value];
      })
      .catch((e) => {
        console.log(e.message);
      })
  }

  get_sales_list();

  // 검색 초기화
  const initial = () => {
    copy_s_list.value = [...sales_list.value];
  }

  // 판매 추가
  const inputAmount = ref();
  const selectPdId = ref();

  // 상품 판매 추가
  const ifSuccess = ref(false);
  const ifFalse = ref(false);
  const addSales = async () => {

    let data = {
      shop_id : store.state.loginStoreId,
      product_id : selectPdId.value,
      quantity : inputAmount.value
    }

    await store_sales_add(data)
      .then(() => {
        ifSuccess.value = true;
      })
      .catch(()=> {
        ifFalse.value = true;
      })
  }

  // 전체 상품 정보 get
  const get_all_pd = async () => {

    await product_list()
      .then((response) => {

        production_list.value = response.data;

        copy_pd_list.value = [...production_list.value];
      })
      .catch((e) => {
        console.log("error : ", e.message);
      })

  }

  get_all_pd();

  // 상품 검색
  const searchSalesText = ref('');  // search sales 
  const production_list = ref([]);  // 상품 정보를 담을 배열
  const copy_pd_list = ref([]);

  // 상품 선택
  const selectedIndex = ref();
  const selectSeles = ( select_id ) => {
    console.log("선택된 상품의 아이디 : ", select_id)
    selectedIndex.value = select_id
    selectPdId.value = select_id
  }

  // 검색
  const searchSales = () => {
    if(searchSalesText.value){
      console.log("searchtext 있음")
      copy_pd_list.value = production_list.value.filter( (s_pd) => {
        return s_pd.name.includes(searchSalesText.value);
      } )
    }else{
      console.log("searchtext 없음")
      copy_pd_list.value = production_list.value;
    }

    if(copy_pd_list.value.length === 0){
      console.log("검색 결과가 없습니다.")
    }

    searchSalesText.value = "";
  }

  // 상품 검색 초기화
  const initialProduct = () => {
    copy_pd_list.value = [...production_list.value];
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
    searchText,
    search_result,
    copy_s_list,
    sales_list,
    selectMenu,
    searchSales,
    production_list,
    copy_pd_list,
    selectSeles,
    searchSalesText,
    addSales,
    inputAmount,
    searchSalesList,
    ifSuccess,
    ifFalse,
    selectedIndex,
    initial,
    initialProduct
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