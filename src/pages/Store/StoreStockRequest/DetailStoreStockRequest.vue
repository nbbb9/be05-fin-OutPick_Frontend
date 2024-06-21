<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <div class="mt-4" >
      <h5>재고요청서 피드백</h5>
    </div>

    <hr>

    <div class="row">

      <div class="col-5 listDiv" >

        <div class="row" >
          <div class="col-4">
            담당자
          </div>
          <div class="col-8">
            {{feedback.employee_name}}
          </div>
        </div>

        <div class="mt-3 listDiv-content content">
          {{feedback.feedback_content}}
        </div>

        <button @click="toBack" class="mt-1 btn btn-warning">뒤로가기</button>

      </div>

      <div class="col-6 full-height">
        <div class="empty-content full-height">
          <!-- 여기에 다른 내용을 추가할 수 있습니다 -->
          <canvas id="chart_1" width="200" height="600" ></canvas>
        </div>
      </div> <!-- 오른쪽 영역 끝 -->

    </div>


  </div>
</template>

<script>
import {useStore} from "vuex"
import {onMounted, ref} from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter, useRoute } from 'vue-router';
import EventSourceService from "@/pages/Sse/EventSourceService";
import {store_stock_request_feedback} from "@/axios.js"
import {stock_request_chart} from "@/shop_axios";
import {Chart, registerables} from "chart.js";

export default {
  components : {
    StoreSidebar
  },
  setup(){
    const route = useRoute();
    const feedback = ref({
      employee_name : '',
      feedback_content : ''
    });
    const stock_request_id = route.params.stock_request_id;
    const product_id = route.params.product_id;
    const shop_id = route.params.shop_id;



    const getFeedback = async(stock_request_id) => {
      try {
        await store_stock_request_feedback(stock_request_id)
            .then((response) => {
              feedback.value = response.data;
              // console.log(stock_request_id);
              // console.log(product_id);
              // console.log(shop_id);

            });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error("잘못된 요청입니다!", error.response.data);
          console.log(stock_request_id);
        } else {
          console.error("피드백을 가져오는 중 오류가 발생했습니다!", error);
        }
      }

    };

    onMounted(() => {
      getFeedback(stock_request_id);
      chart(shop_id, product_id);


    });


    const toBack = () => {
      router.push({
        name : "ListStoreStockRequest"
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

    // 차트 부분
    let barChart1;
    const chart_data = ref();
    const chart = async () => {
      await stock_request_chart(shop_id, product_id)
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
              label: '판매량',
              borderWidth: 3,
              data: chart_data.value.quantity_list
            }
          ]
        },
        options: {
          maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
        }
      });
      barChart1
    }

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
      feedback,
      toBack,
      chart
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

/* 아이템 가운데 정렬 */
.row{
  display: flex;
  align-items: center;
}

/* list scroll, list 그림자 */
.listDiv{
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  /* height: 90vh; */
  margin: 3%;
  padding: 3%;
}

.listDiv-content{
  height: 55vh;
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