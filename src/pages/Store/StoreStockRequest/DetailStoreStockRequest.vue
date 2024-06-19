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
            여경원 대리
            <!-- 나중에 변수로! -->
          </div>
        </div>

        <div class="mt-3 listDiv-content content" >
          {{feedback.feedback_content}}
        </div>

        <button @click="toBack" class="mt-1 btn btn-warning">뒤로가기</button>

      </div>

      <div class="col-5 listDiv" >
        chart.js 부분~
      </div>

    </div>
    
  
  </div>
</template>

<script>
import {useStore} from "vuex"
import {onMounted, ref} from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

    const feedback = ref({
      feedback_content : "집에 가고 싶어서 반려했습니다.",
      first_classification : "1차 분류",
      second_classification : "2차 분류"
    });

    const getFeedback = () => {

    }

    getFeedback();

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
      toBack
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