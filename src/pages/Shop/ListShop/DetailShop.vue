<template>
  <div class="container">
    <!-- 사이드바 -->
    <ShopSidebar @ShopSidebar="selectMenu" />

    <div class="set-content-row mt-5">
      <!-- 매장이름 & 사진 -->
      <div class="title-image" style="text-align: center;">
        <div>
          <h1 class="shop-name" style="display: flex; white-space: nowrap; justify-content: center; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">{{ name }}</h1>
        </div>
        <div class="image-container" style="display: flex; justify-content: center;">
          <img src="@/assets/로고_슬로건.png" alt="" class="shop-image mt-3" style="max-width: 100%; height: auto; display: block;" />
        </div>
      </div>
      <!-- 매장이름 & 사진 끝 -->

      <!-- 매장 상세정보 & 재고 -->
      <div class="shop-detail-and-stock">
        <!-- 매장 상세정보 -->
        <div class="shop-detail-form m-1">
          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label for="manager">매장 관리자</label>
                <input type="text" id="manager" v-model="manager" class="form-control" />
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label for="employee_name">매장 영업사원</label>
                <input type="text" id="employee_name" v-model="employee_name" class="form-control" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label for="contact">매장 전화번호</label>
                <input type="text" id="contact" v-model="contact" class="form-control" />
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label for="address">매장 위치</label>
                <input type="text" id="address" v-model="address" class="form-control" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="form-group-content">
              <label for="content">매장 설명</label>
              <input type="text" id="content" v-model="content" class="form-control-content" />
            </div>
          </div>
        </div>
        <!-- 매장 상세정보 끝 -->

        <!-- 매장 재고 조회 -->
        <div class="m-1 shop-stock">
          <h5 class="mt-1 stock-header">재고</h5>
          <div class="table-container" style="overflow-y: auto;">
            <table class="table stock-table">
              <thead>
              <tr>
                <th>상품 이름</th>
                <th>재고량</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(s) in shop_stock_list" :key="s.shop_stock_id">
                <td>{{ s.product_name }}</td>
                <td>{{ s.stock }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 매장 재고 조회 끝 -->
      </div>
      <!-- 매장 상세정보 & 재고 끝 -->
    </div>

    <div class="mt-5 set-content-row vertical-space">
      <!-- 재고요청서 -->
      <div class="shop-detail-stock">
        <h5 class="mt-1 stock-header">재고요청서</h5>
        <div class="table-container">
          <table class="table stock-table">
            <thead>
            <tr>
              <th>요청일</th>
              <th>사원승인</th>
              <th>관리자승인</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(sr) in shop_stock_request_list" :key="sr.stock_request_id">
              <td>{{ sr.request_date }}</td>
              <td>{{ sr.approval }}</td>
              <td>{{ sr.admin_approval }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 재고요청서 끝 -->

      <!-- 건의사항 -->
      <div class="shop-detail-stock">
        <h5 class="mt-1 stock-header">건의사항</h5>
        <div class="table-container">
          <table class="table stock-table">
            <thead>
            <tr>
              <th>내용</th>
              <th>카테고리</th>
              <th>해결여부</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(sp) in proposal_list" :key="sp.proposal_id">
              <td>{{ sp.content }}</td>
              <td>{{ sp.category }}</td>
              <td>{{ sp.completed }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 건의사항 끝 -->
    </div>
    <button class="btn btn-primary" @click="toBack" >뒤로 가기</button>
  </div>
</template>


<script>
import ShopSidebar from '@/components/ShopSidebar.vue';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { shop_stock, shop_my_detail, shop_stockrequest_list, shop_proposal_list } from '@/shop_axios';

export default {
  components: {
    ShopSidebar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const shopID = ref(null);
    const name = ref('');
    const manager = ref('');
    const employee_name = ref('');
    const contact = ref('');
    const address = ref('');
    const content = ref('');
    let shop_stock_list = ref([]);
    let shop_stock_request_list = ref([]);
    let proposal_list = ref([]);

    const toBack = () => {
      router.push({ name: 'ListShop' });
    }

    const get_shop_detail = async (shopId) => {
      try {
        const response = await shop_my_detail(shopId, store.state.loginToken);
        name.value = response.data.name;
        manager.value = response.data.manager;
        employee_name.value = response.data.employee_name;
        contact.value = response.data.contact;
        address.value = response.data.address;
        content.value = response.data.content;
      } catch (error) {
        console.error('Error fetching shop details:', error);
      }
    };

    const get_shop_stock = async (shopId) => {
      try {
        const response = await shop_stock(shopId);
        shop_stock_list.value = response.data.map(item => ({
          product_name: item.product_name,
          stock: item.stock
        }));
      } catch (error) {
        console.error('Error fetching shop stock:', error);
      }
    };

    const get_shop_stock_request = async (shopId) => {
      try {
        const response = await shop_stockrequest_list(shopId);
        shop_stock_request_list.value = response.data.map(item => ({
          request_date: item.request_date,
          approval: item.approval,
          admin_approval: item.admin_approval
        }));
      } catch (error) {
        console.error('Error fetching shop stock:', error);
      }
    };

    const get_shop_proposal = async (shopId) => {
      try {
        const response = await shop_proposal_list(shopId);
        proposal_list.value = response.data.map(item => ({
          content: item.content,
          category: item.category,
          completed: item.completed
        }));
      } catch (error) {
        console.error('Error fetching shop stock:', error);
      }
    };

    onMounted(() => {
      const currentRoute = router.currentRoute.value;
      if (currentRoute && currentRoute.params && currentRoute.params.shopId) {
        shopID.value = currentRoute.params.shopId;
        if (shopID.value) {
          get_shop_detail(shopID.value);
          get_shop_stock(shopID.value);
          get_shop_stock_request(shopID.value);
          get_shop_proposal(shopID.value);
        } else {
          console.error('shopID is null');
        }
      } else {
        console.error('route params shopId is undefined');
      }
    });

    const Goto_AnalysisPage = () => {
      router.push({ name : 'AnalysisPage' })
    }

    const selectMenu = (selectMenu) => {
      switch (selectMenu) {
        case 1:
          router.push({ name: 'ListShop' });
          break;
        case 2:
          router.push({ name: 'ListStockRequest' });
          break;
        case 3:
          router.push({ name: 'ListProposal' });
          break;
        default:
          break;
      }
    };

    return {
      shop_stock_list,
      shop_stock_request_list,
      proposal_list,
      get_shop_stock,
      get_shop_detail,
      get_shop_stock_request,
      get_shop_proposal,
      name,
      manager,
      employee_name,
      contact,
      address,
      content,
      selectMenu,
      Goto_AnalysisPage,
      toBack
    };
  },
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

div {
  font-family: 'LINESeedKR-Rg';
}

/* 요소들 우측 나열 */
.set-content-row {
  display: flex;
  flex-direction: row;
  gap: 10px; /* 요소들 간의 간격을 설정합니다 */
  max-height: 30vh; /* 최대 높이를 설정하여 세로 길이 제한 */
}

/* 요소들 사이 간격 추가 */
.vertical-space {
  padding-top: 2%; /* 요소들 사이 간격 설정 */
}

.title-image {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 중앙 정렬 */
  text-align: left;
  width: 30%;
  height: 100%;
  max-height: fit-content;
}

/* 매장 이름 */
.shop-name {
  text-align: left;
  font-weight: bold; /* 글씨를 볼드체로 설정 */
}

/* 매장 사진 Container */
.image-container {
  width: 85%;
  height: 85%; /* 부모 요소에 맞게 설정, 필요시 고정 높이 추가 */
  overflow: auto; /*이미지가 부모 요소를 벗어나지 않도록 함 */
  margin-left: 10%;
}

/* 매장 사진 */
.shop-image {
  width: 100%;
  height: auto; /* 비율을 유지하면서 부모 요소에 맞게 설정 */
  display: block;
  border: 2px solid #000; /* 이미지 테두리 설정 */
  border-radius: 5px; /* 테두리 모서리 둥글게 설정 (선택 사항) */
}

/* 매장 상세정보 & 재고 영역 */
.shop-detail-and-stock {
  display: flex;
  flex-direction: row;
  /* gap: 10px; */
  /* width: 100%; 부모 요소에 맞게 설정 */
}

/* 매장 상세정보 영역 */
.shop-detail-form {
  /* display: flex; */
  /* flex-wrap: wrap; 요소를 줄 바꿈하여 배치 */
  /* gap: 10px; 요소들 간의 간격을 설정합니다 */
  /* justify-content: space-between; 요소 간의 공간을 균등하게 배치 */
  max-height: 75vh;
  width: 65%; /* 전체 영역의 60%를 차지 */
  vertical-align: middle;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  border: 1px solid #a5a5a5; /* 이미지 테두리 설정 */
  border-radius: 5px; /* 테두리 모서리 둥글게 설정 (선택 사항) */
}

.form-group {
  /* width: 48%; 각 입력 그룹의 너비를 48%로 설정하여 두 개의 그룹이 한 줄에 배치되도록 함 */
  /* margin-bottom: 1rem; 입력 그룹 간의 간격 설정 */
}

.form-group-content {
  width: 99%; /* 각 입력 그룹의 너비를 90%로 설정하여 중앙에 배치되도록 함 */
  margin-bottom: 1rem; /*입력 그룹 간의 간격 설정 */
  margin-left: auto;  /*왼쪽 여백을 자동으로 설정*/
  margin-right: auto; /*오른쪽 여백을 자동으로 설정 */
}

.form-group label {
  font-weight: bold; /* 레이블을 볼드체로 설정 */
}

.form-group-content label {
  font-weight: bold; /* 레이블을 볼드체로 설정 */
}

.form-control {
  width: 100%; /* 입력 필드의 너비를 100%로 설정 */
  padding: 0.5rem; /* 입력 필드의 패딩 설정 */
  border: 1px solid #ccc; /* 입력 필드의 테두리 설정 */
  border-radius: 4px; /* 입력 필드의 테두리 모서리 둥글게 설정 */
}

.form-control-content {
  width: 100%; /* 입력 필드의 너비를 100%로 설정 */
  padding: 0.5rem; /* 입력 필드의 패딩 설정 */
  border: 1px solid #ccc; /* 입력 필드의 테두리 설정 */
  border-radius: 4px; /* 입력 필드의 테두리 모서리 둥글게 설정 */
}

/* 매장 재고 조회 */
.shop-stock {
  max-height: 75vh;
  width: 35%; /* 전체 영역의 35%를 차지 */
  overflow-y: hidden; 
  /* 내부 요소 스크롤을 위해 숨김 */
  vertical-align: middle;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin-bottom: 1rem; /* 하단 여백 추가 */
  border: 1px solid #a5a5a5; /* 이미지 테두리 설정 */
  border-radius: 5px; /* 테두리 모서리 둥글게 설정 (선택 사항) */
}

.table-container {
  max-height: 50vh;
  /* overflow-y: auto; */
}

.stock-header {
  font-weight: bold; /* 제목을 볼드체로 설정 */
  margin-bottom: 0.5rem; /* 제목 하단 여백 설정 */
  position: sticky;
  top: 0;
  background-color: white; /* 배경색을 지정하여 스크롤 시 배경과 겹치지 않게 함 */
  z-index: 1; /* 다른 요소보다 앞에 배치 */
}

.table th {
  font-weight: bold; /* 헤더 텍스트 볼드체 설정 */
  position: sticky;
  top: 0;
  background-color: white; /* 배경색을 지정하여 스크롤 시 배경과 겹치지 않게 함 */
  z-index: 1; /* 다른 요소보다 앞에 배치 */
}

.table {
  width: 100%; /* 테이블 너비를 부모 요소에 맞춤 */
  border-collapse: collapse; /* 테이블 셀 간격 제거 */
}

.table th,
.table td {
  padding: 0.5rem; /* 테이블 셀 패딩 설정 */
  text-align: left; /* 텍스트 좌측 정렬 */
  border: none; /* 테두리 제거 */
}

.table td {
  border-top: 1px solid #ddd; /* 상단 테두리 설정 */
}

.stock-table th,
.stock-table td {
  padding: 8px 12px; /* 패딩 설정 */
}

.stock-table thead th {
  border-bottom: 2px solid #000; /* 헤더 하단 테두리 설정 */
}

.stock-table tbody tr + tr {
  border-top: 1px solid #ddd; /* 행 사이에 테두리 설정 */
}

/* 재고요청서와 건의사항 */
.shop-detail-stock {
  max-height: 50vh;
  overflow-y: auto;
  width: 50%; /* 전체 영역의 50%를 차지 */
  vertical-align: middle;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin-bottom: 1rem; /* 하단 여백 추가 */
  border: 1px solid #a5a5a5; /* 테두리 설정 */
  border-radius: 5px; /* 테두리 모서리 둥글게 설정 (선택 사항) */
}

.shop-detail-stock .table-container {
  max-height: calc(50vh - 40px); /* 헤더 높이를 뺀 나머지 높이를 설정 */
}

.approved {
  color: red; /* 승인된 항목의 텍스트 색상 설정 */
}

.denied {
  color: blue; /* 거절된 항목의 텍스트 색상 설정 */
}

.completed {
  color: red; /* 해결된 항목의 텍스트 색상 설정 */
}

.notCompleted {
  color: blue; /* 미해결된 항목의 텍스트 색상 설정 */
}
</style>
