<template>
  <div class="container">
    <StockSidebar @StockSidebar="selectMenu" :showMenu_p="show"/>

    <div class="row mt-5">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>창고 리스트</h2>
          <div class="filterDiv">
            <input type="text" class="form-control search-input" v-model="searchQuery" @input="filterWarehouseList" placeholder="창고명 검색">
          </div>
        </div>

        <div class="listDiv mt-4">
          <table class="table table-hover border-gray">
            <thead>
            <tr>
              <th>창고명</th>
              <th>주소</th>
              <th>담당자</th>
              <th>연락처</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="warehouse in filteredWarehouseList" :key="warehouse.warehouse_id">
              <td>{{ warehouse.name }}</td>
              <td>{{ warehouse.address }}</td>
              <td>{{ warehouse.manager }}</td>
              <td>{{ warehouse.contact }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { warehouse_list } from "@/stock_axios";
import StockSidebar from "@/components/StockSidebar.vue";

export default {
  components: {
    StockSidebar
  },
  setup() {
    const router = useRouter();
    const warehouseList = ref([]);
    const filteredWarehouseList = ref([]);
    const show = ref(false);
    const searchQuery = ref('');

    const getWarehouseList = async () => {
      try {
        const response = await warehouse_list();
        warehouseList.value = response.data;
        filteredWarehouseList.value = response.data;
      } catch (error) {
        console.error("Error fetching warehouse list:", error);
      }
    };

    const filterWarehouseList = () => {
      const query = searchQuery.value.toLowerCase();
      filteredWarehouseList.value = warehouseList.value.filter(warehouse =>
          warehouse.name.toLowerCase().includes(query)
      );
    };

    const triggerShow = () => {
      // Store와의 상호작용을 통해 사이드바를 토글할 수 있습니다.
    };


    onMounted(() => {
      getWarehouseList();
      triggerShow();
    });

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

    return {
      warehouseList,
      filteredWarehouseList,
      searchQuery,
      show,
      selectMenu,
      filterWarehouseList
    };
  }
};
</script>

<style scoped>
/* styles */
.filterDiv {
  margin-bottom: 1rem;
  float: right;
}

.search-input {
  width: 200px; /* 검색창 크기 조절 */
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

.listDiv {
  max-height: 60vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  height: 700px; /* 고정 높이 */
}

.detail {
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  height: 500px; /* 고정 높이 */
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
  top: 50%; /* 모달 창을 조금 아래로 내림 */
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
  width: 70%; /* 너비를 줄임 */
  height: auto; /* 높이를 자동으로 설정 */
  background-color: white;
  box-shadow: 0 6px 7px rgba(0, 0, 0, 0.2);
  max-height: 80%; /* 최대 높이 설정 (필요 시 조정) */
  overflow-y: auto; /* 콘텐츠가 넘칠 경우 스크롤 */
  border-radius: 10px; /* 모서리를 둥글게 */
  padding: 1rem; /* 내부 패딩 추가 */
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