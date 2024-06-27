npm <template>
    <div class="container" >

      <!-- sidebar -->
      <StoreSidebar @StoreSidebar="selectMenu" />

      <!-- 검색창 -->
      <div class="search_div">
        <form v-on:submit.prevent="search" class="row mt-4" >
          <div class="col-3" >
            <h5>상품이름</h5>
          </div>
          <div class="col-7" >
            <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control" >
          </div>
          <div class="col-2" >
            <button @click="search" class="btn btn-outline-light text-black" >검색</button>
          </div>
        </form>
      </div>

      <hr>

      <!-- 재고 조회 -->
      <div class="row row-right mt-4" >
        <div class="col">
          <h5 class="seeList" @click="initial" >재고 조회</h5>
        </div>
      </div>

      <div class="row mt-1 listDiv" >

        <table class="table table-hover border-gray" >
          <thead>
            <tr>
              <th>상품ID</th>
              <th>상품 이름</th>
              <th>재고</th>
              <th>색상</th>
              <th>사이즈</th>
            </tr>
          </thead>
          <tbody  >
            <!--  -->
            <tr v-on:click="select(st.shop_stock_id)" v-for="(st) in copy_st_list" :key="st.shop_stock_id" >
              <td>{{ st.product_id }}</td>
              <td>{{ st.product_name }}</td>
              <td>{{ st.stock }}개</td>
              <td>{{ st.color }}</td>
              <td>{{ st.size }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="search_result" class="alert alert-info mt-3" >
        검색 결과가 존재하지 않습니다.
      </div>

      <div class="row row-right mt-5">
        <h5>상품 상세</h5>
      </div>

      <div class="row listDiv" >
        <table class="table border-gray">
          <thead>
            <th>입고일</th>
            <th>계절</th>
            <th>성별</th>
            <th>핏</th>
            <th>할인율</th>
            <th>소비자 판매가</th>
            <th>원가</th>
          </thead>
          <tbody>
          <tr>
            <td>{{stock_view.date}}</td>
            <td>{{stock_view.season}}</td>
            <td>{{stock_view.gender}}</td>
            <td>{{stock_view.fit}}</td>
            <td>{{stock_view.discount}}</td>
            <td>{{stock_view.consumer_price}}</td>
            <td>{{stock_view.first_cost}}</td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
</template>
  
<script>
import {useStore} from "vuex"
import {onMounted, ref} from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import { store_stock_list, product_detail } from "@/axios.js";
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

    const store = useStore();   // store 변수

    const searchText = ref(''); // search text
    let search_result = ref(false); // search 결과

    const stock_list = ref([]); // 최초 list정보만을 담을 배열
    const copy_st_list = ref([{}]); // search를 위한 배열
    const stock_view = ref({}); // 상세정보를 위한 변수

    // 전체 재고 리스트를 얻기 위한 메서드
    const get_stock_list = async () => {
      await store_stock_list(store.state.loginStoreId)
        .then((response) => {
          stock_list.value = response.data;

          copy_st_list.value = [...stock_list.value];
        })
    }

    get_stock_list();
    

    // 클릭시 상세 정보 출력
    const select = async (stockid) => {
      await product_detail(stockid)
        .then( (response) => {

          stock_view.value = response.data;

          // date 형식 맞추기
          const fullDate = stock_view.value.date;

          // 년, 월, 일 부분만 추출
          const year = fullDate.slice(0, 4);
          const month = fullDate.slice(5, 7);
          const day = fullDate.slice(8, 10);

          // 원하는 형식으로 날짜 문자열 만들기
          stock_view.value.date = `${year}-${month}-${day}`;
        })
    }

    // 검색
    const search = () => {
      copy_st_list.value = stock_list.value.filter( (shop_stock) => {
        return shop_stock.product_name.includes(searchText.value);
      });
    }

    // 재고 조회 버튼 누르면 검색 초기화
    const initial = () => {
      copy_st_list.value = [...stock_list.value];
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
      initial,
      search,
      searchText,
      search_result,
      copy_st_list,
      stock_list,
      stock_view,
      selectMenu
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