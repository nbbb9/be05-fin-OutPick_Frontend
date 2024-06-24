<template>
  <div class="container">
    <AdminSidebar @AdminSidebar="selectMenu" :showMenu_p = "show"/>
  
    <div class="mt-4" >
      <h5>{{ em_name }}사원의 담당 매장 월 판매량 분석</h5>
    </div>

    <hr>
  
    <div class="row select">
      <div class="col-3">
        <select v-model="select_year" class="form-select" >
          <option value="2022">2022년</option>
          <option value="2023">2023년</option>
          <option value="2024">2024년</option>
        </select>
      </div> <!-- 년 선택 끝 -->
      <div class="col-3" >
        <select v-model="select_month" class="form-select">
          <option value="1">1월</option><option value="2">2월</option><option value="3">3월</option>
          <option value="4">4월</option><option value="5">5월</option><option value="6">6월</option>
          <option value="7">7월</option><option value="8">8월</option><option value="9">9월</option>
          <option value="10">10월</option><option value="11">11월</option><option value="12">12월</option>
        </select>
      </div>
      <div class="col-3" >
        <button @click="selectGet" class="btn btn-dark mr">조회</button>
        <button @click="back" class="btn btn-dark">뒤로가기</button>
      </div>
    </div>  <!-- 년, 월 선택 끝 -->

    <div style="display: flex; justify-content: center;" >
      <div v-if="isSuccess" class="alert alert-danger mt-3"
        style="width: 50%;" >
        올바른 값을 넣어주세요
      </div>
    </div>

    <div class="row" >
      <div class="col-md-12" >
        <canvas id="chart-container" width="400" height="400" ></canvas>
      </div>
    </div> <!-- 차트 부분 끝 -->
  
  </div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { Chart , registerables} from 'chart.js';
import {admin_employee_analyze} from "@/admin_axios"

export default {

  components : {
    AdminSidebar
  },
  setup(){

    // store, router 변수
    const store = useStore();
    const router = useRouter();

    // 전 페이지에서 사원 상세정보를 넘겨받음
    const em_detail = JSON.parse(history.state.data)
    const em_name = ref(em_detail.name);
    const em_id = ref(em_detail.employee_id)

    // 사용자가 선택한 년, 월
    const select_year = ref();
    const select_month = ref();
    const data = ref();
    const isSuccess = ref(false);

    // chart를 담을 변수
    let barChart;
    let elementIndex; // 사용자가 chart에서 선택한 x축 index
    let datasetIndex; // 사용자가 chart에서 선택한 y축 index
    const selLabel = ref();        // 사용자가 chart에서 선택한 x축 값
    const selValue = ref();        // 사용자가 chart에서 선택한 y축 값

    watch(selLabel, () => {
      console.log("label의 값이 달라졌습니다!");
    })

    const selectGet = async () => {

        if (em_id.value && select_month.value && select_year.value) {
            // axios - get : 데이터 받아오기
            await admin_employee_analyze(em_id.value, select_month.value, select_year.value, store.state.loginToken)
                .then((response) => {
                    console.log(response.data);
                    data.value = response.data;
                })
                .catch((e) => {
                    console.log(e.message);
                })

            // chart.js 부분
            if (barChart) {
                barChart.destroy();
                // 재활용을 위한 삭제
            }

            const chart = document.getElementById('chart-container').getContext('2d');

            Chart.register(...registerables);

            barChart = new Chart(chart, {
                type: 'bar',
                data: {
                    labels: data.value.shop_list,
                    datasets: [{
                        label: '판매량',
                        borderWidth: 3,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(199, 199, 199, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(199, 199, 199, 1)'
                        ],
                        data: data.value.sales_list
                    }]
                },
                options: {
                    maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
                    onClick: function (evt, elements) {
                        if (elements.length > 0) {
                            elementIndex = elements[0].index;
                            datasetIndex = elements[0].datasetIndex;
                            selLabel.value = this.data.labels[elementIndex];
                            selValue.value = this.data.datasets[datasetIndex].data[elementIndex];
                            console.log(`Clicked on index: ${elementIndex}, label: ${selLabel.value}, value: ${selValue.value}`);
                        }
                    },
                }
            });
        } else {
            console.log("tq");
            isSuccess.value = true;
        }
    }


    // 뒤로가기
    const back = () => {
      router.push({
        name : "ListEmployee"
      })
    }

    // 페이지 접속시 Nav가 보이게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav)
    }
    triggerShow();


    // 메뉴 이동
    const show = ref(false);
    const selectMenu = (selectId) => {
      console.log("select Id : ", selectId);

      switch (selectId) {
        case 1:
          router.push({
            name : "ListEmployee"
          })
          break;
        case 2:
          show.value = !show.value;
          console.log('show 값 변경')
          break;
        case 3 :
          router.push({
            name : "ListAdminStockRequest"
          })
          break;
        case 4 :
          router.push({
            name : "ListProductionRequest"
          })
          break;
        default:
          break;
    
      }

      watch(show, (newValue) => {
        console.log(`show 값이 변경되었습니다: ${newValue}`);
      });
    }

    return {
      show,
      selectMenu,
      em_name,
      select_month,
      select_year,
      selectGet,
      back,
      isSuccess
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


div{
font-family: "LINESeedKR-Rg";
}

/* select칸 가운데 정렬 */
.select{
  display: flex;
  justify-content: center;
  align-items: center;
}

/* margin-right-2 */
.mr{
  margin-right: 2%;
}

/* 글자 굵기 */
h5{
  font-weight: bold;
}

</style>