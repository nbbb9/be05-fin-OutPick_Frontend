<template>
  <div class="container">

    <div class="row mt-3">

      <!-- 회사, 매장별 판매량 -->
      <div class="col-6">
        
        <!-- 회사 판매량 -->
        <div>
          
          <h5>회사 전체 판매량</h5>

          <select v-model="select_year" @change="set_1" class="form-select">
            <option value="2022">2022년</option>
            <option value="2023">2023년</option>
            <option value="2024">2024년</option>
          </select>

          <div v-if="isChart1" class="text-center">
            <div class="spinner-grow text-primary mb-5" role="status">
              <!-- <span class="visually-hidden">Loading...</span> -->
            </div>
          </div>

          <!-- chart 1부분 -->
          <div v-if="!isChart1" class="row m-2" >
            <div class="col-md-12" >
              <canvas id="chart_1" width="200" height="250" ></canvas>
            </div>
          </div> <!-- 차트 부분 끝 -->
        </div> 

        <hr>

        <!-- 매장 판매량 -->
        <div>

          <h5>매장 판매량</h5>

          <div v-if="isChart2" class="text-center" >
            <div class="spinner-grow text-primary" role="status">
              <!-- <span class="visually-hidden">Loading...</span> -->
            </div>
          </div>

          <div v-if="!isChart2" class="row m-2" >
            <div class="col-md-12" >
              <canvas id="chart_2" width="200" height="250" ></canvas>
            </div>
          </div> <!-- 차트 부분 끝 -->

        </div>


      </div> <!-- 회사, 매장별 판매량 끝 -->

      <!-- 카테고리 선택 -->
      <div class="col-6" >


        <!-- 2차 분류 -->
        <div class="row" m-2>
          <div class="col-md-4" v-if="show_change">
            <button class="btn btn-dark" @click="changeTab" >{{ isTab1 ? '가격별 판매량' : '매장 판매상품 순위' }}</button>
          </div>
          <div class="col-md-8" v-if="show_shop">
            <h3>선택한 매장 : {{ sel_2_shop_name }}</h3>
          </div>
        </div>

        <!-- 차트 4 시작 -->
        <div class="row">
          <div v-if="isTab1" class="col-md-12">
            <canvas id="chart_4_1" width="400" height="250"></canvas>
          </div>
          <div v-if="!isTab1" class="col-md-12">
            <canvas id="chart_4_2" width="400" height="250"></canvas>
          </div>
        </div>
        <!-- 차트 4 끝! -->

        <hr>

        <h5>1차 분류 별 2차분류에 따른 판매량</h5>
        
        <!-- 1차 분류 -->
        <div class="row m-2" v-if="show_classification">
          <div class="col-md-4">
            <select v-model="sel_3_first" class="form-select">
              <option value="계절">계절</option>
              <option value="맵시">핏</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="sel_3_second" class="form-select">
              <option v-for="sel in sel_3_second_list" :key="sel" >
                {{ sel }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <button v-if="show_button" class="btn btn-outline-light text-black" @click="set_3">적용</button>
          </div>
        </div>

        <div v-if="isChart3" class="text-center" >
          <div class="spinner-grow text-primary" role="status">
          </div>
        </div>
        
        <!-- 차트 3 시작 -->
        <div class="row">
          <div class="col-3">
            <canvas id="chart_3_1" width="40" height="200" ></canvas>  
          </div> 
          <div class="col-3">
            <canvas id="chart_3_2" width="40" height="200" ></canvas>
          </div> 
          <div class="col-3">
            <canvas id="chart_3_3" width="40" height="200" ></canvas>
          </div> 
          <div class="col-3">
            <canvas id="chart_3_4" width="40" height="200" ></canvas>
          </div> 
        </div>
        <!-- 차트 3 끝! -->
        
      </div>

    </div>

  </div>
</template>

<script>
import {ref, watch} from "vue"
import { Chart , registerables} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import {analyze_sales_list, analyze_sales_shop_list, 
  analyze_first_list, analyze_second_list, analyze_price_list,
  analyze_product_list} from "@/analysis_axios"
import { useStore } from "vuex";

export default {

  setup(){

    //store 변수
    let store = useStore();
    store

    // chart.js를 담을 변수
    let barChart1;
    let barChart2;
    let barChart3_1;
    let barChart3_2;
    let barChart3_3;
    let barChart3_4;
    let barChart4;

    const show_change = ref(false);
    const show_shop = ref(false);
    const show_classification = ref(false);
    const show_button = ref(false);

    const select_year = ref();  // 사용자가 선택한 년
    const data_1 = ref();       // 회사 판매량과 금액을 담을 변수

    // chart 1
    const isChart1 = ref(false);
    const sel_1_month = ref();     // 사용자가 chart_1에서 선택한 x축 값 
    const set_1 =  async () => {
      if(select_year.value){

        isChart1.value = true;
        // axios - get : 회사 판매량 불러오기
        await analyze_sales_list(select_year.value)
          .then((response) => {
            data_1.value = response.data;
            console.log(data_1.value);
            isChart1.value = false;
          })

        const chart = document.getElementById('chart_1').getContext('2d');

        Chart.register(...registerables);

        if(barChart1){
          barChart1.destroy();
        }

        barChart1 = new Chart(chart, {
            type: 'line',
            data: {
                labels: data_1.value.month ,
                datasets: [
                  {
                    type: 'line',
                    label: '판매량',
                    borderWidth: 3,
                    yAxisID: 'y-axis-sales',
                    data: data_1.value.entireQuantity
                  },
                  {
                    type: 'bar',
                    label: '금액',
                    borderWidth: 3,
                    yAxisID: 'y-axis-money',
                    data: data_1.value.wholeMoney
                  }
              ]
            },
            options: {
                maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
                scales: {
                    'y-axis-sales': {
                        type: 'linear',
                        position: 'left',
                        ticks: { beginAtZero: true },
                        title: { display: true, text: '판매량' }
                    },
                    'y-axis-money': {
                        type: 'linear',
                        position: 'right',
                        ticks: { beginAtZero: true },
                        title: { display: true, text: '금액' },
                        grid: { drawOnChartArea: false } // 금액 y축의 그리드 라인을 숨깁니다.
                    }
                },
                onClick: function (evt, elements) {
                    if (elements.length > 0) {
                        const elementIndex = elements[0].index;
                        sel_1_month.value = this.data.labels[elementIndex];
                        console.log(`Clicked on index: ${elementIndex}, label: ${sel_1_month.value}`);
                    }
                },
            }
        });
        barChart1
      }
    }

    // chart 2
    const isChart2 = ref(false);
    const data_2 = ref();
    const sel_2_shop_id = ref();
    const sel_2_shop_name = ref();
    
    const set_2 = async () => {

      isChart2.value = true;
      // axios - get 매장별 판매량
      await analyze_sales_shop_list(select_year.value, sel_1_month.value)
        .then((response) => {
          data_2.value = response.data;
          isChart2.value = false;
        })

      const chart = document.getElementById('chart_2').getContext('2d');

      Chart.register(...registerables, zoomPlugin);

      if(barChart2){
        barChart2.destroy();
      }

      barChart2 = new Chart(chart, {
          type: 'bar',
          data: {
              labels: data_2.value.shop_name,
              datasets: [
                {
                  label: '판매량',
                  borderWidth: 3,
                  yAxisID: 'y-axis-sales',
                  data: data_2.value.quantity
                },
                {
                  label: '금액',
                  borderWidth: 3,
                  yAxisID: 'y-axis-money',
                  data : data_2.value.whole_money
                }
              ]
          },
          options: {
              maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
              scales: {
                    'y-axis-sales': {
                        type: 'linear',
                        position: 'left',
                        ticks: { beginAtZero: true },
                        title: { display: true, text: '판매량' }
                    },
                    'y-axis-money': {
                        type: 'linear',
                        position: 'right',
                        ticks: { beginAtZero: true },
                        title: { display: true, text: '금액' },
                        grid: { drawOnChartArea: false } // 금액 y축의 그리드 라인을 숨깁니다.
                    }
              },
              onClick: function (evt, elements) {
                  if (elements.length > 0) {
                      const elementIndex = elements[0].index;
                      sel_2_shop_id.value = data_2.value.shop_id[elementIndex];
                      sel_2_shop_name.value = data_2.value.shop_name[elementIndex];
                      console.log(`Clicked on index: ${sel_2_shop_id.value}, label: ${sel_2_shop_name.value}`);
                      show_change.value = true;
                      show_shop.value = true;
                  }
              },
              plugins: {zoom: {pan: { enabled: true, mode: 'x'},
                        zoom: {wheel: {enabled: true}, pinch:{ enabled: true},mode: 'x'}}
              }
          }
      });
      barChart2
    }

    watch(sel_1_month, () => {
      set_2()
    })


    // chart4
    const isTab1 = ref(true);
    const data_4 = ref();
    // const data_4_2 = ref();
    const changeTab = ()=> {
      isTab1.value = !isTab1.value;
      set_4()
    }

    const set_4 = async() => {
      
      if(isTab1.value){
        await analyze_price_list(select_year.value, sel_2_shop_id.value)
        .then ((response) => {
          data_4.value = response.data;
          show_classification.value = true;
          show_button.value = true;
        })

      // chart 부분
      const chart = document.getElementById('chart_4_1').getContext('2d');

      Chart.register(...registerables, zoomPlugin);
      
      if(barChart4){
        barChart4.destroy();
      }

      barChart4 = new Chart(chart, {
          type: 'scatter',
          data: {
              labels: data_4.value.price,
              datasets: [{
                  label: '판매량', borderWidth: 3,
                  data: data_4.value.quantity
                }]
          },
          options: {
              maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
              plugins: { legend: {display: false},
                          zoom: {pan: {enabled: true,mode: 'x'},
                          zoom: {wheel: {enabled: true},pinch: {enabled: true},mode: 'x'}}
              }
          }
        });
      
      } else {
        await analyze_product_list(select_year.value, sel_2_shop_id.value)
          .then ((response) => {
          data_4.value = response.data;
          })

          const chart = document.getElementById('chart_4_2').getContext('2d');

          Chart.register(...registerables, zoomPlugin);
          
          if(barChart4){
            barChart4.destroy();
          }

          barChart4 = new Chart(chart, {
              type: 'bar',
              data: {
                  labels: data_4.value.product_name,
                  datasets: [{
                      label: '판매량', borderWidth: 3,
                      data: data_4.value.quantity
                    }]
              },
              options: {
                  maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
                  plugins: { legend: {display: false},
                              zoom: {pan: {enabled: true,mode: 'x'},
                              zoom: {wheel: {enabled: true},pinch: {enabled: true},mode: 'x'}}
                  }
              }
            });
      }

    }

    watch(sel_2_shop_id, () => {
      set_4()
    })





    // chart3
    const isChart3 = ref(false);
    const data_3 = ref();
    const sel_3_first = ref();
    const sel_3_second= ref();
    const sel_3_second_list = ref();

    watch(sel_3_first, () => {
      if(sel_3_first.value === "계절"){
        sel_3_second_list.value = ['카테고리', '색상', '맵시']
      } else {
        sel_3_second_list.value = ['계절', '카테고리']
      }
    })

    const set_3 = async() => {

      isChart3.value = true;

      if(sel_3_first.value === "계절" ) {
        // 1차분류 api 호출
        await analyze_first_list(select_year.value, sel_3_second.value)
        .then((response) => {
          data_3.value = response.data;
          console.log(data_3.value);
        })
      }else{
        // 2차분류 api 호출
        await analyze_second_list(select_year.value, sel_3_second.value)
        .then((response) => {
          data_3.value = response.data;
          console.log(data_3.value);
        })
      }
      
      isChart3.value = false;

      // chart 부분
      const chart_1 = document.getElementById('chart_3_1').getContext('2d');

      Chart.register(...registerables, zoomPlugin);
      
      if(barChart3_1){
        barChart3_1.destroy();
      }

      barChart3_1 = new Chart(chart_1, {
          type: 'doughnut',
          data: {
              labels: data_3.value.spring_2c ? data_3.value.spring_2c :  data_3.value.standard_c ,
              datasets: [{
                  label: '판매량', borderWidth: 3,
                  data: data_3.value.spring_q ? data_3.value.spring_q : data_3.value.standard_q
                }]
          },
          options: {
              maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
              plugins: { legend: {display: false},
                          title: {display: true, text: data_3.value.spring_2c ? '봄' : '기본핏'},
                          zoom: {pan: {enabled: true,mode: 'x'},
                          zoom: {wheel: {enabled: true},pinch: {enabled: true},mode: 'x'}}
              }
          }
      });

      // chart 3_2
      const chart_2 = document.getElementById('chart_3_2').getContext('2d');

      Chart.register(...registerables, zoomPlugin);
      
      if(barChart3_2){
        barChart3_2.destroy();
      }

      barChart3_2 = new Chart(chart_2, {
          type: 'doughnut',
          data: {
              labels: data_3.value.summer_2c ? data_3.value.summer_2c : data_3.value.over_c ,
              datasets: [{
                  label: '판매량', borderWidth: 3,
                  data: data_3.value.summer_q ? data_3.value.summer_q : data_3.value.over_q
                }]
          },
          options: {
              maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
              plugins: {legend: {display: false},
                title: {display: true, text: data_3.value.summer_2c ? '여름' : '오버핏'},
                zoom: {pan: {enabled: true,mode: 'x'},
                zoom: {wheel: {enabled: true},pinch: {enabled: true},mode: 'x'}}
              }
          }
      });


      // chart 3_3
      const chart_3 = document.getElementById('chart_3_3').getContext('2d');

      Chart.register(...registerables, zoomPlugin);
  
      if(barChart3_3){
        barChart3_3.destroy();
      }

      barChart3_3 = new Chart(chart_3, {
          type: 'doughnut',
          data: {
              labels: data_3.value.fall_2c ? data_3.value.fall_2c : data_3.value.slim_c ,
              datasets: [{
                  label: '판매량', borderWidth: 3,
                  data: data_3.value.fall_q ? data_3.value.fall_q : data_3.value.slim_q
                }]
          },
          options: {
              maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
              plugins: {legend: {display: false},
                title: {display: true, text: data_3.value.fall_2c ? '가을' : '슬림핏'},
                zoom: {pan: {enabled: true,mode: 'x'},
                zoom: {wheel: {enabled: true},pinch: {enabled: true},mode: 'x'}}
              }
          }
      });

      // chart 3_4
      const chart_4 = document.getElementById('chart_3_4').getContext('2d');

      Chart.register(...registerables, zoomPlugin);
      
      if(barChart3_4){
        barChart3_4.destroy();
      }

      barChart3_4 = new Chart(chart_4, {
          type: 'doughnut',
          data: {
              labels: data_3.value.winter_2c,
              datasets: [{
                  label: '판매량', borderWidth: 3,
                  data: data_3.value.winter_q
                }]
          },
          options: {
              maintainAspectRatio: false, // 이 옵션은 캔버스의 크기를 조정할 수 있게 합니다.
              plugins: {legend: {display: false},
                title: {display: true, text: data_3.value.winter_2c ? '겨울' : ''},
                zoom: {pan: {enabled: true,mode: 'x'},
                zoom: {wheel: {enabled: true},pinch: {enabled: true},mode: 'x'}}
              }
          }
      });
    }

      // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
      const triggerShow = () => {
        store.dispatch('triggerShow', true);
        console.log(store.state.showNav)
      }
      triggerShow();
    
    return{
      select_year,
      isChart1,
      set_1,
      isChart2,
      sel_2_shop_name,
      isChart3,
      isTab1,
      changeTab,
      sel_3_first,
      set_3,
      sel_3_second,
      sel_3_second_list,
      show_change,
      show_shop,
      show_button,
      show_classification
    }
  }

}
</script>

<style scoped>

.text-center{
  margin-top: 22%;
}

</style> >
   