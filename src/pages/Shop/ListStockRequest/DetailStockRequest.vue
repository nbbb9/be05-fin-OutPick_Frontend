<template>
  <div class="container fixed-height">
    <ShopSidebar @ShopSidebar="selectMenu" />
    <div class="row mt-5 full-height">
      <div class="col-6 full-height">
        <div class="detail full-height">
          <div class="mt-3">
            <h5>재고 요청서 상세</h5>
          </div>
          <div v-if="loading">
            <p>재고요청서를 불러오지 못했습니다.</p>
          </div>
          <div v-else>
            <div class="atr row pt-3 align-items-center">
              <strong class="col-4 text-center">지점</strong>
              <div class="col-8 text-center">{{ sr_detail.shop_name }}</div>
            </div>
            <div class="atr row pt-3 align-items-center">
              <strong class="col-4 text-center">요청 날짜</strong>
              <div class="col-8 text-center">{{ formattedDate(sr_detail.request_date) }}</div>
            </div>
            <div class="row center">
              <div class="atr pt-3 col-5 row align-items-center">
                <strong class="col-6 text-left" v-if="loginUserRole === '사원'">매장 매니저</strong>
                <strong class="col-6 text-left" v-if="loginUserRole === '관리자'">매장 담당자</strong>
                <div class="col-6 text-right" v-if="loginUserRole === '사원'">{{ sr_detail.manager }}</div>
                <div class="col-6 text-right" v-if="loginUserRole === '관리자'">{{ sr_detail.employee_name }}</div>
              </div>
              <div class="atr pt-3 col-5 row align-items-center">
                <strong class="col-6 text-left"> 결재 상태</strong>
                <div class="col-6 text-right" v-if="loginUserRole === '사원'">{{ sr_detail.approval }}</div>
                <div class="col-6 text-right" v-if="loginUserRole === '관리자'">{{ sr_detail.admin_approval }}</div>
              </div>
            </div>
            <div class="mt-5">
              <table class="table table-hover border-gray">
                <thead>
                <tr>
                  <th>상품 ID</th>
                  <th>상품명</th>
                  <th>주문 수량</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{ sr_detail.product_id }}</td>
                  <td>{{ sr_detail.product_name }}</td>
                  <td>{{ sr_detail.amount }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <br/><br/><br/>
            <div v-if="sr_detail.approval !== '승인' && sr_detail.approval !== '반려' && loginUserRole === '사원'">
              <button class="btn btn-success font-weight-bold" @click="sr_approval">승인</button>
              &emsp;&emsp;&emsp;
              <button class="btn btn-outline-secondary font-weight-bold" @click="openFeedbackModal">반려작성</button>
            </div>
            <button class="btn btn-primary" @click="toBack" >뒤로가기</button>
            <br/><br/>
          </div>
        </div>
      </div>
      <div class="col-6 full-height">
        <div class="empty-content ">
          <canvas id="chart_1" width="200" height="250"></canvas>
        </div>
      </div>
    </div>

    <!-- 피드백 작성 모달 -->
    <div v-if="showFeedbackModal" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">피드백 작성</h5>
            <button type="button" class="btn-close" @click="closeFeedbackModal"></button>
          </div>
          <div class="modal-body">
            <textarea v-model="feedbackText" class="form-control" rows="5" placeholder="피드백을 입력하세요"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeFeedbackModal">닫기</button>
            <button type="button" class="btn btn-primary" @click="sr_reject">저장</button>
          </div>
        </div>
      </div>
    </div><!-- 피드백 작성 모달 끝 -->

  </div>
</template>

<script>
import ShopSidebar from '@/components/ShopSidebar.vue';
import { useStore } from 'vuex';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Chart , registerables} from 'chart.js';
import {
  stock_request_detail,
  stock_request_approval,
  stock_request_reject,
  stock_request_chart
} from '@/shop_axios';

export default {
  components: {
    ShopSidebar
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const stock_request_id = ref(null);
    const sr_detail = ref({});
    const loading = ref(true);
    const shop_id = ref();
    let loginUserRole = computed(() => store.state.loginUserRole);

    const showFeedbackModal = ref(false);
    const feedbackText = ref('');

    const toBack = () => {
      router.push({
        name: 'ListStockRequest'
      });
    }

    const get_sr_detail = async (stock_request_id) => {
      try {
        const response = await stock_request_detail(stock_request_id, store.state.loginToken);
        sr_detail.value = response.data;
        chart();
        shop_id.value = response.data.shop_id;
      } catch (error) {
        console.error('Error fetching shop details:', error);
        alert('Failed to load stock request details.');
      } finally {
        loading.value = false;
      }
    };

    const formattedDate = (date) => {
      const year = date.slice(0, 4);
      const month = date.slice(5, 7);
      const day = date.slice(8, 10);
      return `${year}-${month}-${day}`;
    };

    onMounted(() => {
      if (route.params && route.params.stock_request_id) {
        stock_request_id.value = route.params.stock_request_id;
        if (stock_request_id.value) {
          get_sr_detail(stock_request_id.value);
        }
      }
    });

    const sr_approval = async () => {
      try {
        await stock_request_approval(stock_request_id.value, store.state.loginToken, shop_id.value);
        sr_detail.value.approval = '승인';
        alert('승인되었습니다.');
      } catch (error) {
        console.error('Approval failed:', error);
        alert('승인에 실패했습니다.');
      }
    };

    const sr_reject = async () => {
      const data = {
        stock_request_id: sr_detail.value.stock_request_id,
        shop_id: shop_id.value,
        feedback_content: feedbackText.value
      };

      try {
        await stock_request_reject(stock_request_id.value, store.state.loginToken, data);
        sr_detail.value.approval = '반려';
        alert('반려되었습니다.');
        closeFeedbackModal();
      } catch (error) {
        console.error('Rejection failed:', error);
        alert('반려에 실패했습니다.');
      }
    };

    let barChart1;
    const chart_data = ref();
    const chart = async () => {
      await stock_request_chart(sr_detail.value.shop_id, sr_detail.value.product_id)
          .then((response) => {
            chart_data.value = response.data;
          })

      const chart = document.getElementById('chart_1').getContext('2d');

      Chart.register(...registerables);

      if(barChart1){
        barChart1.destroy();
      }

      barChart1 = new Chart(chart, {
        type: 'bar',
        data: {
          labels: chart_data.value.year_list ,
          datasets: [
            {
              label: '매장별 상품 연간 판매량',
              borderWidth: 3,
              data: chart_data.value.quantity_list
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
        }
      });
      barChart1
    }

    const openFeedbackModal = () => {
      showFeedbackModal.value = true;
    };

    const closeFeedbackModal = () => {
      showFeedbackModal.value = false;
    };


    const selectMenu = (selectMenu) => {
      switch (selectMenu) {
        case 1:
          router.push({
            name: 'ListShop'
          });
          break;
        case 2:
          router.push({
            name: 'ListStockRequest'
          });
          break;
        case 3:
          router.push({
            name: 'ListProposal'
          });
          break;
        default:
          break;
      }
    };

    return {
      get_sr_detail,
      selectMenu,
      sr_detail,
      stock_request_id,
      loading,
      formattedDate,
      sr_approval,
      sr_reject,
      loginUserRole,
      shop_id,
      openFeedbackModal,
      showFeedbackModal,
      closeFeedbackModal,
      feedbackText,
      toBack
    };
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'LINESeedKR-Rg';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Rg.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

div {
  font-family: "LINESeedKR-Rg";
}

td {
  vertical-align: middle;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.listDiv {
  max-height: 58vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 1%;
}

.detail {
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  height: 100%;
}

.atr {
  height: 7vh;
  max-width: 40vw;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.red-text {
  color: red;
}
.blue-text {
  color: blue;
}

h5 {
  font-weight: bold;
}

.empty-content {
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder {
  font-size: 1.5rem;
  color: gray;
}

.font-weight-bold {
  font-weight: bold;
}

.fixed-height {
  height: 75vh;
}

.full-height {
  height: 100%;
}
</style>
