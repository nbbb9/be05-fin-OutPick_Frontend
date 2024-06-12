<template>
  <div class="container">
    <AdminSidebar @AdminSidebar="selectMenu" :showMenu_p = "show"/>
  
    <div class="mt-4" >
      {{ em_name }}사원의 담당 매장 월 매출 분석
    </div>

    <hr>
  
    <div class="row select">
      <div class="col-3">
        <select v-model="select_month" class="form-select" >
          <option value="2022">2022년</option>
          <option value="2023">2023년</option>
        </select>
      </div> <!-- 년 선택 끝 -->
      <div class="col-3" >
        <select v-model="select_year" class="form-select" >
          <option value="1">1월</option>
          <option value="2">2월</option>
        </select>
      </div>
      <div class="col-3" >
        <button @click="selectGet" class="btn btn-dark">조회</button>
      </div>
    </div>  <!-- 년, 월 선택 끝 -->

    <div class="row" >
      <div class="col-md-12" >
        <canvas id="chart-container" ></canvas>
      </div>
    </div> <!-- 차트 부분 끝 -->
  
  </div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { Chart } from 'chart.js';
import {admin_employee_analyze} from "@/admin_axios"

export default {

  components : {
    AdminSidebar
  },
  setup(){

    // store 변수
    const store = useStore();

    // 전 페이지에서 사원 상세정보를 넘겨받음
    const em_detail = JSON.parse(history.state.data)
    const em_name = ref(em_detail.name);
    const em_id = ref(em_detail.employee_id)
   
    em_id

    // 사용자가 선택한 년, 월
    const select_year = ref();
    const select_month = ref();

    const selectGet = async () => {

      // axios - get : 데이터 받아오기
      await admin_employee_analyze(em_id, select_year, select_month, store.state.loginToken)
        .then((response) => {
          console.log(response.data);
        })
      // chart.js 부분
      const chart = document.getElementById('chart-container').getContext('2d');
      const barChart = new Chart(chart, {
        type : 'bar',
        data : {
          labels : [],
          datasets : [{
            label : '매출',
            borderWidth : 3,
            data : [

            ]
          }]
        }
      })
      barChart
    }

    

    // 페이지 접속시 Nav가 보이게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav)
    }
    triggerShow();


    // 메뉴 이동
    const router = useRouter();
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
      selectGet
    }

  }

}
</script>

<style scoped>

/* select칸 가운데 정렬 */
.select{
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>