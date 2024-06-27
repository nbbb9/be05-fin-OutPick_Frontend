<template>
  <div class="container" >

    <!-- sidebar -->
    <StoreSidebar @StoreSidebar="selectMenu" />

    <!-- 검색창 -->
    <div class="search_div">
      <form v-on:submit.prevent="search" class="row mt-4" >
        <div class="col-3" >
          <h5>건의사항</h5>
        </div>
        <div class="col-7" >
          <input type="text" v-model="searchText" placeholder="제목을 검색하세요" class="form-control" >
        </div>
        <div class="col-2" >
          <button class="btn btn-outline-light text-black" >검색</button>
        </div>
      </form>
    </div>

    <hr>

    <!-- 재고 조회 -->
    <div class="row row-right mt-4" >
      <div class="col">
        <h5 class="seeList" @click="initial" >건의사항 관리</h5>
      </div>
    </div>

    <div class="row mt-1 listDiv" >

      <table class="table table-hover border-gray" >
        <thead>
          <tr>
            <th>건의사항 ID</th>
            <th>제목</th>
            <th>작성일</th>
            <th>카테고리</th>
            <th>해결여부</th>
          </tr>
        </thead>
        <tbody  >
          <!-- v-for="(st, index) in copy_st_list" :key="st.stockId" -->
          <tr v-on:click="select(p.proposal_id)" v-for="(p) in copy_p_list" :key="p.proposal_id" >
            <td>{{ p.proposal_id }}</td>
            <td>{{ p.title }}</td>
            <td>{{ p.date }}</td>
            <td>{{ p.category }}</td>
            <td v-bind:style="{ color: p.completed === 'y' ? 'red' : 'blue' }" >{{ p.completed === 'n' ? '미해결' : '해결완료' }}</td>
            <!-- <td>{{  }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="search_result" class="alert alert-info mt-3" >
      검색 결과가 존재하지 않습니다.
    </div>

    <div class="margin text-left" >

      <div class="mt-4 " >
        내용
      </div>
      <div class="listDiv-content mt-2 mb-3 content" >
        {{ p_view ? p_view.content : 내용}}
      </div>

      <div>
        해결방안
      </div>
      <div class="listDiv-content mt-2 mb-3 content" >
        {{ p_view ? p_view.solution : 해결방안}}
      </div>
    </div>

  </div>
</template>

<script>
import {useStore} from "vuex"
import { onMounted } from 'vue';
import { ref } from 'vue';
import StoreSidebar from '@/components/StoreSidebar.vue'
import { useRouter } from 'vue-router';
import {store_proposal_list} from "@/axios.js"
import EventSourceService from "@/pages/Sse/EventSourceService";

export default {
  components : {
    StoreSidebar
  },
  setup(){

    const searchText = ref(''); // search text
    let search_result = ref(false); // search 결과

    const proposal_list = ref([]); // 최초 list정보만을 담을 배열
    const copy_p_list = ref([{}]); // search를 위한 배열

    const p_view = ref(); // 상세 정보를 위한 변수

    // 클릭시 상세 정보 출력
    const select = (proposal_id) => {
      p_view.value = proposal_list.value.filter( (p) => {
        return p.proposal_id === proposal_id;
      })[0]
    }

    // 건의사항 리스트 받아오기
    const store = useStore();   // store 변수
    const getProposalList = async () => {
      // axios - 건의사항 리스트 받아오기 구현
      await store_proposal_list(store.state.loginStoreId)
        .then((response) => {
          proposal_list.value = response.data;

          proposal_list.value.forEach((item) => {
            const fullDate = item.date

            const year = fullDate.slice(0, 4);
            const month = fullDate.slice(5, 7);
            const day = fullDate.slice(8, 10);

            item.date = `${year}-${month}-${day}`;
          });

          copy_p_list.value = [...proposal_list.value];
        })

    }

    getProposalList();

    // 검색
    const search = () => {
      copy_p_list.value = proposal_list.value.filter( (p) => {
        return p.title.includes(searchText.value);
      })
    }

    onMounted(()=> {
      // SSE 복구
      let sse = new EventSourceService(store.state.loginStoreId, store);
      sse.restoreEventListeners();

    });

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
      select,
      searchText,
      search_result,
      copy_p_list,
      proposal_list,
      selectMenu,
      p_view,
      search
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

/* 왼쪽 정렬 */
.row-right{
  text-align: left;
  padding-left: 5%;
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
  max-height : 30vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
}

.listDiv-content{
  border : 1px solid rgb(220, 220, 220);
}

/* alert 설정 */
.alert{
  font-weight: bold;
  box-shadow: 0 3px 7px rgba(139, 139, 139, 0.403);
}

.margin{
  margin-top: 5%;
}

.content{
  height: 15vh;
  text-align: left;
  padding-left: 1%;
}

.text-left{
  text-align: left;
}
</style>