<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <div class="mt-4" >
      <h5 style="text-align: left;" >재고 요청서</h5>
    </div>

    <hr>

    <div class="row" >
      <div class="col-3" >
        요청 일자
      </div>
      <div class="col-8 listDiv">
        {{currentDate}}
      </div>
    </div>

    <div class="AddSales">

    <div class="row row-right mt-5">
      <div class="col-2 seeList" @click="initial">
        <h5>요청 상품 검색</h5>
      </div>
      <div class="col-2" >
        <input v-model="searchSalesText" type="text" class="form-control" >
      </div>
      <div class="col-2" >
        <button v-on:click="searchSales()" class="btn btn-dark" >검색</button>
      </div>
      <div class="col-2" >
        <h5>요청 수량</h5>
      </div>
      <div class="col-2" >
        <input v-model="inputAmount" type="text" class="form-control" >
      </div>
      <div class="col-2" >
        <button  v-on:click="addRequest()" class="btn btn-dark">추가</button>
      </div>
    </div>

    <hr>

    <div class="listDiv">  
      <table class="table table-hover border-gray" >
        <thead>
          <th>상품 이름</th>
          <th>계절</th>
          <th>색깔</th>
          <th>성별</th>
          <th>사이즈</th>
          <th>핏</th>
        </thead>
        <tbody>
          <tr v-for="(pd) in copy_pd_list" :key="pd.product_id" :class="{'table-primary' : selectedIndex === pd.product_id }">
            <td>{{ pd.name }}</td>
            <td>{{ pd.season }}</td>
            <td>{{ pd.color }}</td>
            <td>{{ pd.gender }}</td>
            <td>{{ pd.size }}</td>
            <td>{{ pd.fit }}</td>
            <td><button v-on:click.prevent="selectSeles(pd.product_id)" class="btn btn btn-dark selectBtn" >선택</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    </div>

    <div v-if="ifSuccess" class="alert alert-info mt-4">
      정상적으로 등록 되었습니다!
    </div>

    <div v-if="ifFalse" class="alert alert-danger mt-4">
      등록에 실패 하였습니다!
    </div>

  </div>

</template>

<script>
import {useStore} from "vuex"
import {onMounted, ref} from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import { store_stock_request_add, product_list } from "@/axios.js"
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

    // 오늘 일자 
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    // 상품 검색
    const searchSalesText = ref('');  // search sales 
    const production_list = ref([]);  // 상품 정보를 담을 배열
    const copy_pd_list = ref([]);

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
    const initial = () => {
      copy_pd_list.value = [...production_list.value];
    }

    // 재고 요청서 추가
    const inputAmount = ref();
    const selectPdId = ref();

    // 전체 상품 정보 get
    const get_all_pd = async () => {

      await product_list()
        .then((response) => {
          production_list.value = response.data
          copy_pd_list.value = [...production_list.value];
        })
        .catch((e) => {
          console.log("error : ", e.message);
        })
    }

    get_all_pd();

    // 상품 선택
    const selectedIndex = ref();
    const selectSeles = ( select_id ) => {
      console.log("선택된 상품의 아이디 : ", select_id)
      selectedIndex.value = select_id
      selectPdId.value = select_id
    }

    // 재고 요청서 등록
    const ifSuccess = ref(false);
    const ifFalse = ref(false);
    const addRequest = async () => {
      const data = {
        shop_id : store.state.loginStoreId,
        product_id : selectPdId.value,
        amount : inputAmount.value
      }
      // axios - 재고 요청서 추가 건의
      await store_stock_request_add(data)
        .then(() => {
          ifSuccess.value = true;
        })
        .catch( () => {
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
      selectMenu,
      addRequest,
      searchSales,
      production_list,
      copy_pd_list,
      selectSeles,
      searchSalesText,
      inputAmount,
      ifSuccess,
      ifFalse,
      currentDate,
      selectedIndex,
      initial
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

/* hover시 그림자 효과 */
.seeList:hover{
text-shadow: 0 3px 7px rgba(17, 17, 17, 0.403); 
}

/* 아이템 가운데 정렬 */
.row{
  display: flex;
  align-items: center;
  vertical-align: middle;
}

/* list scroll, list 그림자 */
.listDiv{
  max-height : 60vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
}

.listDiv-content{
  margin-top: 3%;
  margin-bottom: 3%;
  border : 1px solid rgb(220, 220, 220);
}

.content{
  height: 60vh;
  text-align: left;
  padding-left: 1%;
}

.margin{
  margin: 2%;
}
</style>