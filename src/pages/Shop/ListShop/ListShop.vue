<template>
  <div class="container">
    <!-- sidebar -->
    <ShopSidebar @ShopSidebar="selectMenu"/>

    <!-- 검색창 -->
    <div class="search_div">
      <form v-on:submit.prevent="search" class="row mt-4">
        <div class="col-3">
          <h4>매장리스트</h4>
        </div>
        <div class="col-2">
          <input type="text" v-model="searchText" placeholder="매장 검색" class="form-control">
        </div>
        <div class="col-1">
          <button class="btn btn-outline-light text-black">검색</button>
        </div>
        <div v-if="store.state.loginUserRole !== '관리자'" class="col-2">
          <h5 class="seeList" @click="showMyChargeShop">담당매장만 보기</h5>
        </div>
        <div v-if="store.state.loginUserRole !== '관리자'" class="col-2">
          <h5 class="seeList" @click="showAllShop">전체매장 보기</h5>
        </div>
      </form>
    </div>

    <hr>

    <!-- 매장 리스트 조회 -->
    <div class="row mt-1 listDiv">
      <table class="table table-hover border-gray">
        <thead>
        <tr>
          <th>매장ID</th>
          <th>매장 이름</th>
          <th>위치</th>
          <th>상세보기</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(s) in copy_shop_list" :key="s.shop_id">
          <td>{{ s.shop_id }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.address }}</td>
          <td>
            <button class="btn btn-primary btn-sm" @click="showMyShopDetails(s)">
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

    <!-- 접근 불가 모달 -->
    <div class="modal" tabindex="-1" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">접근 불가</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p class="modal-message">{{ modalMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import ShopSidebar from '@/components/ShopSidebar.vue'
import { useRouter } from 'vue-router';
import { shop_my_list, shop_all_list } from '@/shop_axios';

export default {
  components: {
    ShopSidebar
  },
  setup() {
    const store = useStore();   // store Vuex 변수
    const router = useRouter(); //router 변수

    let all_shop_list = ref([]); //전체 매장정보를 위한 배열

    const copy_shop_list = ref([{}]); // search를 위한 배열
    const searchText = ref(''); // search text
    let search_result = ref(false); // search 결과

    const showModal = ref(false); // 모달 표시 여부
    const modalMessage = ref(''); // 모달 메시지

    // 로그인한 employee_id를 computed 속성으로 참조
    const loggedInEmployeeId = computed(() => store.state.loginUserId);

    console.log(loggedInEmployeeId.value);

    // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav)
    }
    triggerShow();

    //전체 매장 리스트를 얻기 위한 메서드
    const get_shop_all_list = async () => {
      const response = await shop_all_list();
      all_shop_list.value = response.data;

      copy_shop_list.value = [...all_shop_list.value];
    }
    get_shop_all_list();

    //검색
    const search = () => {
      copy_shop_list.value = all_shop_list.value.filter((shop_name) => {
        return shop_name.name.includes(searchText.value);
      });
    }

    //내 담당 매장 보기
    const showMyChargeShop = async () => {
      const response = await shop_my_list(store.state.loginToken);
      copy_shop_list.value = response.data;
    }

    //전체 매장 보기 버튼 누르면 전체 매장 보기
    const showAllShop = () => {
      copy_shop_list.value = [...all_shop_list.value];
    }

    //내 담당 매장 상세 보기
    const showMyShopDetails = (shop) => {
      console.log('LoggedInEmployeeId:', loggedInEmployeeId.value);
      console.log('Shop EmployeeId:', shop.employee_id);
      if (shop.employee_id === loggedInEmployeeId.value || store.state.loginUserRole === "관리자") {
        router.push({ name: 'DetailShop', params: { shopId: shop.shop_id } });
      } else {
        modalMessage.value = '담당 매장이 아닙니다.';
        showModal.value = true;
      }
    }

    const closeModal = () => {
      showModal.value = false;
    }

    // 메뉴 이동
    const selectMenu = (selectMenu) => {
      console.log(selectMenu);

      switch (selectMenu) {
        case 1:
          router.push({
            name: "ListShop"//매장 리스트
          })
          break;
        case 2:
          router.push({
            name: "ListStockRequest"//재고요청서
          })
          break;
        case 3:
          router.push({
            name: "ListProposal"//건의사항
          })
          break;
        default:
          break;
      }
    }

    return {
      all_shop_list,
      copy_shop_list,
      searchText,
      search_result,
      search,
      selectMenu,
      showAllShop,
      showMyChargeShop,
      showMyShopDetails,
      showModal,
      modalMessage,
      closeModal,
      store
    }
  }
}
</script>

<style scoped>

/* 폰트 */
@font-face {
  font-family: 'LINESeedKR-Rg';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Rg.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

div {
  font-family: "LINESeedKR-Rg";
}

/* 검색 div 정렬 */
form > .col-3 {
  text-align: right;
}

form > .col-2 {
  display: flex;
  align-items: flex-start;
}

/* 아이템 가운데 정렬 */
.row {
  display: flex;
  align-items: center;
}

/* 왼쪽 정렬 */
.row-right {
  text-align: left;
  padding-left: 5%;
}

/* hover시 그림자 효과 */
.seeList:hover {
  text-shadow: 0 3px 7px rgba(17, 17, 17, 0.403);
}

/* 세로 방향 가운데 정렬 */
td {
  vertical-align: middle;
}

/* list scroll, list 그림자 */
.listDiv {
  max-height: 75vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
}

/* alert 설정 */
.alert {
  font-weight: bold;
  box-shadow: 0 3px 7px rgba(139, 139, 139, 0.403);
}

/* 모달 스타일 */
.modal {
  display: block; /* 항상 모달을 보이도록 설정 */
  background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
}

.modal-dialog {
  margin: 10% auto; /* 상단 여백 설정 */
}

/* 모달 메시지 스타일 */
.modal-message {
  font-weight: bold;
  font-size: 1.2em;
  color: red;
}

</style>
