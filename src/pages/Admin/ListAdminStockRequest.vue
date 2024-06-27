<template>
  <div class="container" >
    <AdminSidebar @AdminSidebar="selectMenu" :showMenu_p = "show"/>
  
    <div class="row mt-5" >

      <div class="col-6">

        <div><h5>재고 요청서</h5></div>

        <!-- 검색창 -->
        <form v-on:submit.prevent="searchStRe">
          <div class="row mt-4" > 
            <div class="col-4">
              <input v-model="search_text" type="text" class="form-control" placeholder="매장 이름">
            </div>
            <div class="col-4">
              <select v-model="filterSelect" class="form-select" >
                <option value="" disabled selected hidden>관리자 결재 여부</option>
                <option value="승인">승인</option>
                <option value="미승인">미승인</option>
              </select>
            </div>
            <div class="col-4 pl-2">
              <button class="btn btn-dark">검색</button>
            </div>
          </div>  <!-- 검색창 끝 -->
        </form>

        <!-- 재고 요청서 리스트 -->
        <div class="listDiv mt-4">
          <table class="table table-hover border-gray">
            <thead style="position: sticky; top:0; z-index: 1;">
              <tr>
                <th>요청서 ID</th>
                <th>매장 이름</th>
                <th>요청일</th>
                <th>사원 결재</th>
                <th>관리자 결재</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr @click="selectStRe(sr.stock_request_id)" v-for="(sr) in copy_sr_list" :key="sr.stock_request_id" >
                <td>{{ sr.stock_request_id }}</td>
                <td>{{ sr.shop_name }}</td>
                <td>{{ sr.request_date }}</td>
                <td>{{ sr.approval }}</td>
                <td :class="sr.admin_approval === '미승인' ? 'red-text' : 'blue-text'" >{{ sr.admin_approval }}</td>
                <td> <input type="checkbox" v-if="sr.admin_approval === '미승인'" v-on:click="checkStRe(sr.stock_request_id)" > </td>
              </tr>
            </tbody>
          </table>
        </div> <!-- 재고 요청서 리스트 끝 -->

        <div v-if="isSuccess" class="alert alert-primary">
          총 {{ check_list.length }}개의 재고 요청서가 승인 되었습니다!
        </div>

        <button @click="confirmStre" type="button" class="btn btn-primary mt-3">승인</button>
      
      </div>  <!-- 왼쪽 영역 끝 -->

      <div class="col-6 detail">
        
        <div class="mt-3">재고 요청서 상세</div>

        <div v-if="stre_detail" >
          <div class="atr row pt-3">
            <div class="col-6 row-left">지점</div>
            <div class="col-6">{{ stre_detail.shop_name }}</div>
          </div>  <!-- 지점 끝 -->

          <div class="atr row pt-3">
            <div class="col-6 row-left">날짜</div>
            <div class="col-6">{{ stre_detail.request_date }}</div>
          </div>  <!-- 지점 끝 -->

          <div class="row center">
            <div class="atr pt-3 col-5 row row-left">
              <div class="col-6">담당자</div>
              <div class="col-6">{{ stre_detail.employee_name }}</div>
            </div>  <!-- 담장자 끝 -->  
            <div class="atr pt-3 col-5 row row-left">
              <div class="col-6">관리자 결재</div>
              <div class="col-6">{{ stre_detail.admin_approval }}</div>
            </div>  <!-- 결재 상태 끝 --> 
          </div>  <!-- 담장자/결재 상태 끝 -->

          <div class="mt-5" >
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
                  <td>{{ stre_detail.product_id }}</td>
                  <td>{{ stre_detail.product_name }}</td>
                  <td>{{ stre_detail.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>   <!-- 요청 상품 상세 -->
        </div>

      </div>  <!-- 오른쪽 영역 끝 -->

    </div>
  
  
  
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/AdminSidebar.vue';
import { ref, watch } from 'vue';
import { admin_stock_request_list, 
  admin_stock_request_detail, admin_stock_request_confirm } from '@/admin_axios';

export default {

  components : {
    AdminSidebar
  },
  setup(){

    // store 변수
    const store = useStore(); 
    
    let stre_list = ref();
    let copy_sr_list = ref();

    // 재고 요청서 리스트 받아오기
    const stReList = async () => {
      await admin_stock_request_list(store.state.loginToken)
        .then( (response) => {
          stre_list.value = response.data.filter((item) => {
            return item.approval == "승인"
          })

          stre_list.value.forEach((item) => {
            const fullDate = item.request_date

            const year = fullDate.slice(0, 4);
            const month = fullDate.slice(5, 7);
            const day = fullDate.slice(8, 10);

            item.request_date = `${year}-${month}-${day}`;
          });

          copy_sr_list.value = [...stre_list.value];
        })
    }
    stReList();

    // 재고 요청서 상세 받아오기
    const stre_detail = ref();
    const selectStRe = async (streId) => {
      await admin_stock_request_detail(streId, store.state.loginToken)
        .then((response) => {

          const fullDate = response.data.request_date

          const year = fullDate.slice(0, 4);
          const month = fullDate.slice(5, 7);
          const day = fullDate.slice(8, 10);

          response.data.request_date = `${year}-${month}-${day}`;

          stre_detail.value = response.data
        })
    }

    // 승인 과정
    // 승인 체크박스 체크
    const check_list = ref([]);  // 체크 리스트
    const checkStRe = (streId) => {
      
      const isExist = check_list.value.indexOf(streId);

      if(isExist === -1){
        check_list.value.push(streId)
      }else{
        check_list.value.splice(isExist, 1);
      }
      console.log(check_list);
    }

    // 승인
    const isSuccess = ref(false);
    const confirmStre = async () => {

      for(const streId of check_list.value){
        console.log(store.state.loginToken)
        await admin_stock_request_confirm(streId,store.state.loginToken)
          .then(() => {
            setTimeout(() => {
              location.reload();
            }, 1500);
            isSuccess.value = true;
          })
          .catch((e) => {
            console.log(e.message);
          })
      }
    }

    // 검색
    let filterSelect = ref(''); // filter 클릭
    let search_text = ref();
    const searchStRe = () => {
      copy_sr_list.value = stre_list.value.filter((item) => {
        let matchesSearchText = true;
        let matchesFilterSelect = true;

        if (search_text.value) {
          matchesSearchText = item.shop_name.includes(search_text.value);
        }

        if (filterSelect.value) {
          matchesFilterSelect = item.admin_approval === filterSelect.value;
        }

        return matchesSearchText && matchesFilterSelect;
      })

      search_text.value = ''
      filterSelect.value = ''

    }


    // 페이지 접속시 Nav가 보이게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav)
    }
    triggerShow();

    // 메뉴 이동
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
      filterSelect,
      stre_list,
      copy_sr_list,
      searchStRe,
      stre_detail,
      selectStRe,
      checkStRe,
      confirmStre,
      isSuccess,
      check_list,
      search_text
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

/* 세로 방향 가운데 정렬 */
td {
  vertical-align: middle; 
}

/* padding-2 */
.pl-2{
  padding-left: 2%;
}

/* 아이템 가운데 정렬 */
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 왼쪽 정렬 */
.row-left{
  text-align: left;
  padding-left: 5%;
} 

/* list scroll, 그림자 */
.listDiv{
  max-height : 58vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 1%;
}

/* 상세 */
.detail{
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
}

/* 상세 옵션들 */
.atr{
  height: 7vh;
  max-width: 40vw;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 2%;
}

/* 색깔 변경 */
.red-text {
  color: red;
}
.blue-text {
  color: blue;
}

/* 글자 굵기 */
h5{
  font-weight: bold;
}

</style>