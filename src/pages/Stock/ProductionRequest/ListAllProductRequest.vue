<template>
  <div class="container">
    <StockSidebar @StockSidebar="selectMenu" :showMenu_p="show"/>

    <div class="row mt-5 flex-container">
      <div class="col-6 flex-item">
        <div class="headerDiv">
          <h2 class="headerTitle">생산 요청서</h2>
          <div class="filterDiv">
            <label for="approvalFilter">결재 상태:</label>
            <select id="approvalFilter" v-model="selectedFilter" @change="filterPrList">
              <option value="all">전체</option>
              <option value="approved">승인</option>
              <option value="notApproved">미승인</option>
            </select>
          </div>
        </div>

        <div class="listDiv mt-4">
          <table class="table table-hover border-gray">
            <thead>
            <tr>
              <th>요청서 ID</th>
              <th>요청자</th>
              <th>요청일</th>
              <th>관리자 결재</th>
            </tr>
            </thead>
            <tbody>
            <tr @click="selectPr(pr.production_request_id)" v-for="(pr) in filteredPrList" :key="pr.production_request_id">
              <td>{{ pr.production_request_id }}</td>
              <td>{{ pr.employee_name }}</td>
              <td>{{ pr.request_date }}</td>
              <td :class="pr.approval === 'n' ? 'red-text' : 'blue-text'">{{ pr.approval === 'n' ? '미승인' : '승인' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-6 flex-item detail">
        <div class="mt-3">
          <h5>생산 요청서 상세</h5>
        </div>

        <div v-if="pr_detail">
          <div class="atr row pt-3">
            <div class="col-4 row-left">날짜</div>
            <div class="col-8">{{ pr_detail.request_date }}</div>
          </div>

          <div class="atr row pt-3">
            <div class="col-4 row-left">요청자</div>
            <div class="col-8">{{ pr_detail.employee_name }}</div>
          </div>

          <div class="atr row pt-3">
            <div class="col-4 row-left">관리자 결재</div>
            <div class="col-8">{{ pr_detail.approval === 'n' ? '미승인' : '승인' }}</div>
          </div>

          <div class="mt-5">
            <table class="table table-hover border-gray">
              <thead>
              <tr>
                <th>상품 ID</th>
                <th>상품명</th>
                <th>주문 수량</th>
                <th>원가</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td v-if="!editMode">{{ pr_detail.product_id }}</td>
                <td v-else><input v-model="pr_update.product_id" type="text" class="form-control" readonly></td>
                <td v-if="!editMode">{{ pr_detail.product_name }}</td>
                <td v-else><input v-model="pr_update.product_name" type="text" class="form-control" readonly></td>
                <td v-if="!editMode">{{ pr_detail.amount }}</td>
                <td v-else><input v-model="pr_update.amount" type="number" class="form-control" @input="updateAmount"></td>
                <td>{{ pr_detail.product_first_cost }}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-3" v-if="pr_detail.approval === 'n' && isEmployee">
            <button v-if="!editMode" @click="editMode = true" class="btn btn-primary">수정</button>
            <div v-else>
              <button @click="saveChanges" class="btn btn-success">저장</button>
              <button @click="cancelEdit" class="btn btn-secondary">취소</button>
            </div>
          </div>

          <div v-if="showModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">상품 선택</h5>
                  <button type="button" class="close" @click="closeModal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <input type="text" class="form-control" v-model="searchQuery" @input="filterProducts" placeholder="상품명 검색">
                  </div>
                  <div class="table-wrapper">
                    <table class="table table-hover border-gray">
                      <thead>
                      <tr>
                        <th>상품 ID</th>
                        <th>상품명</th>
                        <th>사이즈</th>
                        <th>성별</th>
                        <th>색상</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="product in filteredProducts" :key="product.product_id">
                        <td>{{ product.product_id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.size }}</td>
                        <td>{{ product.gender }}</td>
                        <td>{{ product.color }}</td>
                        <td><button @click="selectProduct(product)" class="btn btn-primary">선택</button></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeModal">닫기</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {ref, watch, computed} from 'vue';
import {production_request_list, production_request_detail, update_pr_detail, product_list} from "@/stock_axios";
import StockSidebar from "@/components/StockSidebar.vue";

export default {
  components: {
    StockSidebar
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const pr_list = ref([]);
    const copy_pr_list = ref([]);
    const pr_detail = ref(null);
    const pr_update = ref({});
    const show = ref(false);
    const selectedFilter = ref('all');
    const filteredPrList = ref([]);
    const editMode = ref(false);
    const productList = ref([]);
    const filteredProducts = ref([]);
    const showModal = ref(false);
    const searchQuery = ref('');

    const isEmployee = computed(() => store.state.loginUserRole === '사원');

    const prList = async () => {
      const response = await production_request_list(store.state.loginToken);
      pr_list.value = response.data;

      pr_list.value.forEach((item) => {
        const fullDate = item.request_date;
        const year = fullDate.slice(0, 4);
        const month = fullDate.slice(5, 7);
        const day = fullDate.slice(8, 10);
        item.request_date = `${year}-${month}-${day}`;
      });

      copy_pr_list.value = [...pr_list.value];
      filterPrList();
    };

    const selectPr = async (prId) => {
      const response = await production_request_detail(prId, store.state.loginToken);
      const fullDate = response.data.request_date;
      const year = fullDate.slice(0, 4);
      const month = fullDate.slice(5, 7);
      const day = fullDate.slice(8, 10);
      response.data.request_date = `${year}-${month}-${day}`;
      pr_detail.value = response.data;

      pr_update.value = {
        production_request_id: response.data.production_request_id,
        employee_number: response.data.employee_number,
        product_id: response.data.product_id,
        product_name: response.data.product_name,
        amount: response.data.amount
      };

      if (editMode.value) {
        await getProductList();
      }
    };

    const saveChanges = async () => {
      const updateData = {
        production_request_id: pr_update.value.production_request_id,
        employee_number: pr_update.value.employee_number,
        product_id: pr_update.value.product_id,
        amount: pr_update.value.amount
      };
      await update_pr_detail(updateData, store.state.loginToken);
      pr_detail.value.amount = pr_update.value.amount;
      pr_detail.value.product_name = pr_update.value.product_name;
      pr_detail.value.product_id = pr_update.value.product_id;
      editMode.value = false;
      prList();
      alert(`요청서 ID : ${pr_update.value.production_request_id}가 수정되었습니다.`);
    };

    const cancelEdit = () => {
      pr_update.value = {
        production_request_id: pr_detail.value.production_request_id,
        employee_number: pr_detail.value.employee_number,
        product_id: pr_detail.value.product_id,
        product_name: pr_detail.value.product_name,
        amount: pr_detail.value.amount
      };
      editMode.value = false;
    };

    const updateAmount = () => {
      pr_detail.value.amount = pr_update.value.amount;
    };

    const getProductList = async () => {
      const response = await product_list();
      productList.value = response.data;
      filteredProducts.value = productList.value;

    };

    const selectProduct = (product) => {
      pr_update.value.product_id = product.product_id;
      pr_update.value.product_name = product.name;

      pr_detail.value.product_id = product.product_id;
      pr_detail.value.product_name = product.name;

      showModal.value = false;
    };

    const filterProducts = () => {
      const query = searchQuery.value.toLowerCase();
      filteredProducts.value = productList.value.filter(product => product.name && product.name.toLowerCase().includes(query));
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav);
    };
    triggerShow();

    const selectMenu = (selectId) => {
      console.log("select Id:", selectId);
      switch (selectId) {
        case 1:
          router.push({name: "ListShopStock"});
          break;
        case 2:
          router.push({name: "ListCompanyStock"});
          break;
        case 3:
          router.push({name: "ListAllProductRequest"});
          break;
        case 4:
          router.push({name: "ListProduct"});
          break;
        case 5:
          router.push({name: "ListWarehouse"});
          break;
        default:
          break;
      }
    };

    const filterPrList = () => {
      if (selectedFilter.value === 'all') {
        filteredPrList.value = copy_pr_list.value;
      } else if (selectedFilter.value === 'approved') {
        filteredPrList.value = copy_pr_list.value.filter(pr => pr.approval === 'y');
      } else if (selectedFilter.value === 'notApproved') {
        filteredPrList.value = copy_pr_list.value.filter(pr => pr.approval === 'n');
      }
    };

    watch(selectedFilter, filterPrList);

    watch(editMode, async (newValue) => {
      if (newValue) {
        await getProductList();
        showModal.value = true;
      }
    });

    // 초기 데이터 로드
    prList();

    return {
      show,
      selectMenu,
      pr_list,
      copy_pr_list,
      pr_detail,
      pr_update,
      selectedFilter,
      filteredPrList,
      editMode,
      saveChanges,
      cancelEdit,
      updateAmount,
      productList,
      filteredProducts,
      searchQuery,
      selectPr,
      selectProduct,
      filterProducts,
      closeModal,
      showModal,
      isEmployee
    };
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1;
  min-width: 300px;
}

td {
  vertical-align: middle;
}

.pl-2 {
  padding-left: 2%;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-left {
  text-align: left;
  padding-left: 5%;
}

.headerDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.headerTitle {
  margin: 0;
}

.filterDiv {
  display: flex;
  align-items: center;
}

.filterDiv label {
  margin-right: 0.5rem;
}

.listDiv {
  height: 70vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  /*//height: calc(100vh - 200px);  화면 크기에 맞게 동적으로 높이 설정 */
}

.detail {
  height: 78vh;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  /*//height: calc(100vh - 200px);  화면 크기에 맞게 동적으로 높이 설정 */
}

.atr {
  height: 7vh;
  max-width: 40vw;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 2%;
  display: flex;
  align-items: center;
}

.red-text {
  color: red;
}

.blue-text {
  color: blue;
}

.btn {
  margin-top: 1rem;
}

.modal {
  display: block;
  position: fixed;
  top: 50%; /* 모달 창을 중앙에 위치 */
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
  width: 50%;
  height: auto;
  background-color: white;
  box-shadow: 0 6px 7px rgba(0, 0, 0, 0.2);
  max-height: 80%;
  overflow-y: hidden; /* 바깥쪽 스크롤 숨김 */
  border-radius: 10px;
  padding: 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.close {
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1rem;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.table {
  margin-bottom: 0;
}

.table-wrapper {
  max-height: 50vh; /* 원하는 높이로 설정 */
  overflow-y: auto; /* 안쪽 스크롤 */
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>
