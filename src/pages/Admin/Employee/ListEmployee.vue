<template>
  <div class="container">
    <AdminSidebar @AdminSidebar="selectMenu" :showMenu_p = "show" />
  
  
    <div class="mt-4" >
      <h5 style="text-align: left;" >영업 사원</h5>
    </div>

    <hr>

    <div class="row" style="display: flex;">

      <div class="col-6" style="flex: 1;" v-if="!isMidify" >

        <!-- 영업 사원 검색창 -->
        <div class="search_div">
          <form v-on:submit.prevent="searchEmName" class="row mt-4" >
            <div class="col-3" >
              <h5>사원 이름</h5>
            </div>
            <div class="col-6" >
              <input type="text" v-model="search_em_name" placeholder="검색하세요" class="form-control" >
            </div>
            <div class="col-2" >
              <button class="btn btn-dark" >검색</button>
            </div>
          </form>
        </div>

        <!-- 영업 사원 리스트 -->
        <div class="listDiv" >
          <table class="mt-2 table table-hover border-gray listDiv" >
            <thead>
              <tr>
                <th>사원 번호</th>
                <th>사원 이름</th>
                <th>상태</th>
                <th>직책</th>
              </tr>
            </thead>
            <tbody  >
              <!-- 영업 사원 리스트 -->
              <tr v-on:click="selectEm(em.employee_id)" v-for="(em) in copy_e_list" :key="em.employee_id" >
                <td>{{ em.employee_number }}</td>
                <td>{{ em.name }}</td>
                <td>{{ em.state }}</td>
                <td>{{ em.position }}</td>
                <!-- <td>{{  }}</td> -->
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- 영업 사원 상세정보 -->
      <div class="col-5 detail" style="flex: 1;" v-if="!isMidify" >
        <div class="row mt-2" >
          <div class="col-6">
            영업사원 상세정보
          </div>
          <div class="col-6">
            <button class="btn btn-warning mr" @click="toModifyEm">수정</button>
            <button class="btn btn-warning" @click="toAnalysis" >판매량 조회</button>
          </div>
        </div>

        <div v-if="em_detail">

          <div class="row mt-2">
            <div class="row mt-2">
              <div class="col-6" >
                <div class="row atr" >
                  <div class="col-4 row-right" >
                    이름
                  </div>
                  <div class="col-6 row-left">
                    {{ em_detail.name }}
                  </div>
                </div>
              </div>
              <div class="col-6" >
                <div class="row atr">
                  <div class="col-3" >
                    직책
                  </div>
                  <div class="col-9 item-vertical">
                    {{ em_detail.position }}
                    <!-- <button v-if="rq_view.approval === '반려'" @click="toFeedback" class="btn btn-dark" style="margin-left: 10%;" >피드백</button> -->
                  </div>
                </div>
              </div>
          </div>
          <div class="row mt-2">
            <div class="col-6" >
              <div class="row atr" >
                <div class="col-4 row-right" >
                  사번
                </div>
                <div class="col-6 row-left">
                  {{ em_detail.employee_number }}
                </div>
              </div>
            </div>
            <div class="col-6" >
              <div class="row atr">
                <div class="col-4" >
                  입사일
                </div>
                <div class="col-8 item-vertical">
                  {{ em_detail.hired_date }}
                  <!-- <button v-if="rq_view.approval === '반려'" @click="toFeedback" class="btn btn-dark" style="margin-left: 10%;" >피드백</button> -->
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2 atr">
            <div class="col-4" >
              담당 매장ID
            </div>
            <div class="col-8">
              {{ em_detail.shop }}
            </div>
          </div>
          <div class="row mt-2 atr">
            <div class="col-4" >
              연락처
            </div>
            <div class="col-8">
              {{ em_detail.contact }}
            </div>
          </div>
          <div class="row mt-2 atr">
            <div class="col-4" >
              주소
            </div>
            <div class="col-8">
              {{ em_detail.address }}
            </div>
          </div>
          <div class="row mt-2 atr">
            <div class="col-4" >
              생년월일
            </div>
            <div class="col-8">
              {{ em_detail.birthdate }}
            </div>
          </div>
          
        </div>
      </div>
      
    </div>

  </div>

  <!-- 사원 정보 수정 -->
  <div class="detail" style="flex: 1;" v-if="isMidify" >
    <div class="row mt-2" >
      <div class="col-6">
        영업사원 상세정보
      </div>
      <div class="col-6">
        <button class="btn btn-warning" @click="modifyEm" >수정완료</button>
      </div>
    </div>

    <div v-if="em_detail">

        <div class="row mt-2">
          <div class="row mt-2">
            <div class="col-6" >
              <div class="row atr" >
                <div class="col-4 row-right" >
                  이름
                </div>
                <div class="col-6 row-left">
                  {{ em_detail.name }}
                </div>
              </div>
            </div>
            <div class="col-6" >
              <div class="row atr">
                <div class="col-3" >
                  직책
                </div>
                <div class="col-9 item-vertical">
                  <input type="text" v-model="emPosition" class="form-control" >
                  <!-- <button v-if="rq_view.approval === '반려'" @click="toFeedback" class="btn btn-dark" style="margin-left: 10%;" >피드백</button> -->
                </div>
              </div>
            </div>
        </div>
        <div class="row mt-2">
          <div class="col-6" >
            <div class="row atr" >
              <div class="col-4 row-right" >
                사번
              </div>
              <div class="col-6 row-left">
                {{ em_detail.employee_number }}
              </div>
            </div>
          </div>
          <div class="col-6" >
            <div class="row atr">
              <div class="col-4" >
                입사일
              </div>
              <div class="col-8 item-vertical">
                {{ em_detail.hired_date }}
                <!-- <button v-if="rq_view.approval === '반려'" @click="toFeedback" class="btn btn-dark" style="margin-left: 10%;" >피드백</button> -->
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <div class="row col-6 atr atr_shop">
            <div class="col-4" >
              담당 매장ID
            </div>
            <div class="col-8">
              {{ em_detail.shop }}
            </div>
          </div>
          <div class="row col-5">
            <div class="col-5">
              추가 매장 :
              <!-- <input type="text" v-model="addShop" class="form-control"> -->
              <select v-for="(shop) in shop_list" :key="shop.shop_id">
                <option :value="shop.shop_id">{{ shop.shop_id }} : {{ shop.shop_name }}</option>
              </select>
            </div>
            <div class="col-5">
              삭제 매장 : 
              <input type="text" v-model="delShop" class="form-control">
            </div>
          </div>
        </div>
        <div class="row mt-2 atr">
          <div class="col-4" >
            연락처
          </div>
          <div class="col-8">
            <input type="text" v-model="emContact" class="form-control" >
          </div>
        </div>
        <div class="row mt-2 atr">
          <div class="col-4" >
            주소
          </div>
          <div class="col-8">
            <input type="text" v-model="emAddress" class="form-control" >
          </div>
        </div>
        <div class="row mt-2 atr">
          <div class="col-4" >
            현재 상태
          </div>
          <div class="col-8">
            <input type="text" v-model="emState" class="form-control" >
          </div>
        </div>
        
      </div>
    </div>
      
    </div>

  </div>

  
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/AdminSidebar.vue';
import { ref, watch } from 'vue';
import {admin_employee_list, admin_employee_detail,
  admin_employee_modify, admin_employee_shop_list
} from "@/admin_axios.js"

export default {
  
  components : {
    AdminSidebar
  },
  setup(){

    // store 변수
    const store = useStore();   

    // 영업 사원 리스트
    const employee_list = ref();  // 영업 사원 리스트를 담을 변수
    const copy_e_list = ref();    // 검색을 위한 복제본
    
    const employeeList = async () => {
      // axios - get : 영업 사원 리스트 받아오기
      await admin_employee_list(store.state.loginToken)
        .then((response) => {
          employee_list.value = response.data;
          copy_e_list.value = [...employee_list.value];
        })
    }

    employeeList();

    // 영업 사원 검색
    const search_em_name = ref();
    const searchEmName = () => {
      console.log(search_em_name.value);
      copy_e_list.value = employee_list.value.filter( (e) => {
        return e.name.includes(search_em_name.value);
      })
      
    }

    // 영업 사원 상세정보
    const em_detail = ref();
    const selectEm = async (employee_id) => {
      console.log(employee_id);

      // axios - get : 사원 상세정보 조회
      await admin_employee_detail(employee_id, store.state.loginToken)
        .then((response) => {
          em_detail.value = response.data;
        })
        .catch((e) => {
          console.log(e.message);
        })
    }

    // 영업 사원 정보 수정
    let emContact = ref();
    let emPosition = ref();
    let emAddress = ref();
    let emState = ref();
    let addShop = ref();
    let delShop = ref();

    const isMidify = ref(false);

    // 영업 사원 정보 수정 틀로 변경
    const toModifyEm = () => {
      isMidify.value = true;
      emContact.value = em_detail.value.contact
      emPosition.value = em_detail.value.position
      emAddress.value = em_detail.value.address
      emState.value = em_detail.value.state
    }

    // 영업 사원 정보 수정을 위한 매장 리스트
    const shop_list = ref();
    const shopList = async () => {
      await admin_employee_shop_list()
        .then((response) => {
          shop_list.value = response.data;
        })
    }
    shopList();

    // 사용자가 선택한 매장
    const select_add_shop = ref();
    const select_del_shop = ref();

    // 영업 사원 정보 수정
    const modifyEm = async () => {

      const data = {
        "employee_id": em_detail.value.employee_id,
        "position": emPosition.value,
        "address": emAddress.value,
        "contact" : emContact.value
      }

      if (addShop.value) {
        data["add_shop"] = addShop.value.split(',').map(Number);
      }
      if (delShop.value) {
        data["delete_shop"] = delShop.value.split(',').map(Number);
      }

      await admin_employee_modify(data, store.state.loginToken)
        .then((response) => {
          console.log(response.status)
        })
        .catch((e) => {
          console.log(e.message)
        })
      
      location.reload();
      isMidify.value = false;
    }
    
    // 판매량 조회 페이지 이동
    const toAnalysis = () => {
      router.push({
        name : "AnalysisEmployee",
        state : {
          data : JSON.stringify(em_detail.value)
        }
      })
    }

    // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
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

  return{
    show,
    selectMenu,
    employee_list,
    copy_e_list,
    search_em_name,
    searchEmName,
    selectEm,
    em_detail,
    isMidify,
    toModifyEm,
    toAnalysis,
    modifyEm,
    emContact,
    emPosition,
    emAddress,
    emState,
    addShop,
    delShop,
    shop_list,
    select_add_shop,
    select_del_shop
  }

  }
}
</script>

<style scoped>

/* 검색 div 정렬 */
form > .col-3{
  text-align: right;
}

form > .col-2{
  display: flex;
  align-items: flex-start;
}

/* 아이템 가운데 정렬 */
.row{
  display: flex;
  align-items: center;
}

/* 왼쪽 정렬 */
.row-left{
  text-align: left;
  padding-left: 5%;
} 

/* 오른쪽 정렬 */
.row-right{
  text-align: right;
  padding-left: 5%;
} 

/* item-vertical */
.item-vertical{
  display: flex;
  justify-content: center;
  align-items: center;
}

/* hover시 그림자 효과 */
.seeList:hover{
  text-shadow: 0 3px 7px rgba(17, 17, 17, 0.403); 
}

/* 세로 방향 가운데 정렬 */
td {
  vertical-align: middle; 
}

/* list scroll, list 그림자 */
.listDiv{
  max-height : 60vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 1%;
}

.atr{
  height: 6vh;
  max-width: 40vw;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 2%;
}

.mr{
  margin-right: 2%;
}

.detail{
  height: 70vh;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 1%;
}

/* alert 설정 */
.alert{
  font-weight: bold;
  box-shadow: 0 3px 7px rgba(139, 139, 139, 0.403); 
}

</style>