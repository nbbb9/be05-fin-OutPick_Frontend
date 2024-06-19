<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <div class="mt-4" >
      <h5>건의사항 작성</h5>
    </div>

    <hr>

    <div v-if="ifSuccess" class="alert alert-info mt-4">
      정상적으로 등록 되었습니다!
    </div>

    <div v-if="ifFalse" class="alert alert-danger mt-4">
      등록에 실패 하였습니다!
    </div>

    <div class="mt-1 pt-2 pb-2 listDiv">

      <div class="row margin" >
        <div class="col-2" >
          제목
        </div>
        <div class="col-4" >
          <input type="text" class="form-control" v-model="title" >
        </div>
        <div class="col-2">
          카테고리
        </div>
        <div class="col-4" >
          <select class="form-select" v-model="category" >
            <option value="상품">상품</option>
            <option value="인력">인력</option>
            <option value="운영방식">운영방식</option>
          </select>
        </div>

          <textarea
            class="form-control listDiv-content content"
            rows="14"
            v-model="content"
            placeholder="내용을 입력해 주세요"
          ></textarea>

        <button class="btn btn-dark" @click="addProposal" >추가</button>
      </div>

    </div>

    
  
  </div>
</template>

<script>
import {useStore} from "vuex"
import { ref } from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import {store_proposal_add} from '@/axios.js'
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

    const title = ref();
    const category = ref();
    const content = ref();

    // 건의사항 작성
    const ifSuccess = ref(false);
    const ifFalse = ref(false);
    const addProposal = async () => {
      const data = {
        shop_id : store.state.loginStoreId,
        title : title.value,
        category : category.value,
        content : content.value
      }

      // axios - 건의사항 추가 구현
      await store_proposal_add(data)
        .then(() => {
          ifSuccess.value = true;
        })
        .catch(() => {
          ifFalse.value = true;
        })
    }

    
    const store = useStore();   // store 변수
    let sse = new EventSourceService(store.state.loginStoreId, store)
    sse.restoreEventListeners();
  
    // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
    const triggerShow = () => {
      store.dispatch('triggerShow', false);
      console.log(store.state.showNav)
    }
    triggerShow();

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
      title,
      category,
      content,
      addProposal,
      ifSuccess,
      ifFalse
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

/* list scroll, list 그림자 */
.listDiv{
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  height: 90vh;
  margin: 3%;
  padding: 3%;
}

.listDiv-content{
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