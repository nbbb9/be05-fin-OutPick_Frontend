<template>
  <div class="container">
    <div class="row mt-4">
      <h4 class="text-left title">재고요청서</h4>
    </div>
    <!-- sidebar -->
    <ShopSidebar @ShopSidebar="selectMenu"/>
    
    <!-- 검색창 -->
    <div class="search_div row mt-4">
      <div class="col-md-2">
        <select v-model="selectedApproval" @change="filterByApproval" class="form-select">
          <option value="">내 결재상태 선택</option>
          <option value="승인">승인</option>
          <option value="반려">반려</option>
          <option value="대기">대기</option>
        </select>
      </div>
      <div class="col-md-3">
        <input type="text" v-model="searchText" @keyup.enter="search" placeholder="매장 검색" class="form-control">
      </div>
      <div class="col-md-1">
        <button class="btn btn-dark" @click="search">검색</button>
      </div>
      <div class="col-md-1">
        <button class="btn btn-secondary" @click="resetSearch">초기화</button>
      </div>
    </div>

    <hr>

    <!-- 재고요청서 리스트 조회 -->
    <div class="row mt-1 listDiv" >
        <table class="table table-hover border-gray">
          <thead>
            <tr>
              <th>요청서ID</th>
              <th>매장 이름</th>
              <th>요청일</th>
              <th>나의 결재상태</th>
              <th>관리자 결재상태</th>
              <th>상세보기</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sr) in copy_sr_list" :key="sr.stock_request_id">
              <td>{{ sr.stock_request_id }}</td>
              <td>{{ sr.shop_name }}</td>
              <td>{{ sr.request_date }}</td>
              <td :style="{ color: sr.approval === '승인' ? 'blue' : sr.approval === '반려' ? 'red' : 'gray' }">{{ sr.approval }}</td>
              <td :style="{ color: sr.admin_approval === '승인' ? 'blue' : sr.admin_approval === '반려' ? 'red' : 'gray' }">{{ sr.admin_approval }}</td>
              <td>
                <button class="btn btn-outline-secondary" @click="showSrDetails(sr)">
                  상세보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
    </div>

    <div v-if="search_result" class="alert alert-info mt-3">
      검색 결과가 존재하지 않습니다.
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, watch, computed } from 'vue';
import ShopSidebar from '@/components/ShopSidebar.vue';
import { useRouter } from 'vue-router';
import { stock_request_list } from '@/shop_axios';

export default {
  components: {
    ShopSidebar
  },
  setup() {
    const store = useStore(); // store Vuex 변수
    const router = useRouter(); // router 변수

    let all_stock_request = ref([]); // 전체 재고요청서를 위한 배열
    const copy_sr_list = ref([]); // search를 위한 배열
    const searchText = ref(''); // search text
    let search_result = ref(false); // search 결과
    const selectedApproval = ref('');
    const sr_view = ref(null);

    // 페이지 접속 시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav);
    };
    triggerShow();

    // 전체 재고요청서 리스트를 얻기 위한 메서드
    const get_all_sr_list = async () => {
      const response = await stock_request_list(store.state.loginToken);
      all_stock_request.value = response.data;

      // 날짜 형식 정리
      all_stock_request.value.forEach((item) => {
        const fullDate = item.request_date;
        const year = fullDate.slice(0, 4);
        const month = fullDate.slice(5, 7);
        const day = fullDate.slice(8, 10);
        item.request_date = `${year}-${month}-${day}`;
      });

      copy_sr_list.value = [...all_stock_request.value];
    };
    get_all_sr_list();

    const filterAllStockRequest = () => {
      copy_sr_list.value = all_stock_request.value.filter((p) => {
        const matchesApproval = selectedApproval.value ? p.approval === selectedApproval.value : true;
        const matchesSearch = p.shop_name ? p.shop_name.includes(searchText.value) : false;
        return matchesApproval && matchesSearch;
      });
      search_result.value = copy_sr_list.value.length === 0;
    };

    const search = () => {
      filterAllStockRequest();
    };

    // 초기화
    const resetSearch = () => {
      searchText.value = '';
      selectedApproval.value = '';
      filterAllStockRequest();
      sr_view.value = null;
    }

    const filterByApproval = () => {
      filterAllStockRequest();
    };

// 재고요청서 상세 보기
const showSrDetails = (sr) => {
    console.log('Selected SR:', sr);
    router.push({name: 'DetailStockRequest', params: { stock_request_id: sr.stock_request_id }});
};

    // watch 함수를 사용하여 stock_request가 변경될 때 copy_sr_list도 업데이트
    watch(all_stock_request, (newStockReq) => {
      console.log(newStockReq);
      filterAllStockRequest();
    });

    const filteredstock_request = computed(() => copy_sr_list.value);

    // 메뉴 이동
    const selectMenu = (selectMenu) => {
      console.log(selectMenu);

      switch (selectMenu) {
        case 1:
          router.push({
            name: "ListShop" // 매장 리스트
          });
          break;
        case 2:
          router.push({
            name: "ListStockRequest" // 재고요청서
          });
          break;
        case 3:
          router.push({
            name: "ListProposal" // 건의사항
          });
          break;
        default:
          break;
      }
    };

    return {
      selectedApproval,
      filterByApproval,
      all_stock_request,
      filteredstock_request,
      copy_sr_list,
      searchText,
      search_result,
      search,
      selectMenu,
      showSrDetails,
      resetSearch
    };
  }
};
</script>

<style scoped>
/* 폰트 */
@font-face {
    font-family: 'LINESeedKR-Rg';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Rg.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}


div{
font-family: "LINESeedKR-Rg";
}

.title {
  text-align: left; /* 왼쪽 정렬 */
}

.container-fluid {
  display: flex;
  flex-direction: column;
}

.search_div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.listDiv {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 600px; /* 최소 높이를 늘림 */
  overflow-y: auto;
  max-height : 75vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
}

.listDiv-content {
  white-space: pre-wrap;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.border {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.mt-2 {
  margin-top: 0.5rem;
}

.text-left {
  text-align: left;
}

.table tbody tr {
  padding: 10px 0; /* 행 간격을 늘림 */
}

.table tbody tr td {
  padding: 10px ; /* 각 셀에 패딩을 추가 */
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 30px; /* 버튼 사이의 간격을 조절 */
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
}
</style>
