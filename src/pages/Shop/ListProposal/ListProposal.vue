<template>
  <div class="container">
    <!-- 사이드바 -->
    <ShopSidebar @ShopSidebar="selectMenu" />

    <!-- 헤더 (제목 및 검색창) -->
    <div class="header">
      <div class="row mt-3">
        <h4 class="text-left">건의사항</h4>
      </div>
      <div class="row mt-3 search_div">
        <div class="col-2">
          <select v-model="selectedCategory" @change="filterByCategory" class="form-select">
            <option value="">카테고리 선택</option>
            <option value="상품">상품</option>
            <option value="운영방식">운영방식</option>
            <option value="인력">인력</option>
          </select>
        </div>
        <div class="col-3">
          <input type="text" v-model="searchText" @keyup.enter="search" placeholder="제목 검색" class="form-control">
        </div>
        <div class="col-1 pl-2">
          <button class="btn btn-dark" @click="search">검색</button>
        </div>
        <div class="col-1">
          <button class="btn btn-secondary" @click="resetSearch">초기화</button>
        </div>
      </div>
    </div>

    <!-- 콘텐츠 (리스트 및 상세 내용) -->
    <div class="content">
      <!-- 리스트 -->
      <div class="listDiv">
        <table class="table table-hover border-gray">
          <thead style="position: sticky; top:0; z-index: 1;">
          <tr>
            <th>건의사항 ID</th>
            <th>제목</th>
            <th>요청일</th>
            <th>카테고리</th>
            <th>해결 여부</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(p) in filteredProposals" :key="p.proposal_id" @click="select(p.proposal_id)">
            <td>{{ p.proposal_id }}</td>
            <td>{{ p.title }}</td>
            <td>{{ p.date }}</td>
            <td>{{ p.category }}</td>
            <td :style="{ color: p.completed === 'y' ? 'red' : 'blue' }">{{ p.completed == 'n' ? '미해결' : '해결완료'  }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 상세 내용 -->
      <div class="detail">
        <div v-if="p_view" class="detail-view-content p-3">
          <h5 class="mb-4">건의사항 상세</h5>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between atr">
            <strong>지점</strong>
            <div>{{ p_view.shop_name }}</div>
          </div>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between atr">
            <strong>제목</strong>
            <div>{{ p_view.title }}</div>
          </div>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between atr">
            <strong>날짜</strong>
            <div>{{ p_view.date }}</div>
          </div>
          <div class="d-flex">
            <div class="half mb-3 p-2 border rounded d-flex justify-content-between atr ">
              <strong>담당자</strong>
              <div>{{ p_view.manager }}</div>
            </div>
            <div class="half mb-3 p-2 border rounded d-flex justify-content-between atr ">
              <strong>카테고리</strong>
              <div>{{ p_view.category }}</div>
            </div>
          </div>
          <div class="mb-3 p-2 border rounded atr2">
            <strong class="d-block text-left">내용</strong>
            <div class="mt-2">
              <div class="solution-body mt-2">
                {{ p_view.content }}
              </div>
            </div>
          </div>
          <div class="mb-3 p-2 border rounded atr2">
            <strong class="d-block text-left">해결방안</strong>
            <div class="mt-2">
              <div class="solution-body mt-2">
                {{ p_view.solution }}
              </div>
            </div>
          </div>
          <div class="button-container text-center mt-auto">
            <button class="btn btn-secondary" @click="openSolutionModal">
              {{ p_view.completed === 'y' ? '해결방안 수정' : '해결방안 작성' }}
            </button>
            <button v-if="p_view.completed !== 'y'" class="btn btn-primary" @click="checkComplete">해결 완료</button>
          </div>
        </div>
        <div v-else class="detail-view-content p-3">
          <h5 class="mb-4">건의사항 상세</h5>
          <br><br><br><br><br>
          <p>건의사항을 선택해 주세요.</p>
        </div>
      </div>
    </div>

    <!-- 해결방안 작성 모달 -->
    <div v-if="showSolutionModal" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">해결방안 작성</h5>
            <button type="button" class="btn-close" @click="closeSolutionModal"></button>
          </div>
          <div class="modal-body">
            <textarea v-model="solutionText" class="form-control" rows="5" placeholder="해결방안을 입력하세요"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeSolutionModal">닫기</button>
            <button type="button" class="btn btn-primary" @click="saveSolution">저장</button>
          </div>
        </div>
      </div>
    </div><!--해결방안 작성 모달 끝-->

  </div>
</template>


<script>
import { useStore } from "vuex";
import { ref, watch, computed } from 'vue';
import ShopSidebar from '@/components/ShopSidebar.vue';
import { useRouter } from 'vue-router';
import { proposal_list, proposal_check, proposal_solution } from "@/shop_axios.js";

export default {
  components: {
    ShopSidebar
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const searchText = ref('');
    const selectedCategory = ref('');
    const proposals = ref([]);
    const copy_p_list = ref([]);
    const p_view = ref(null);
    const showSolutionModal = ref(false);
    const solutionText = ref('');

    const select = (proposal_id) => {
      p_view.value = proposals.value.find((p) => p.proposal_id === proposal_id);
      solutionText.value = p_view.value ? p_view.value.solution : '';
    };

    const getProposalList = async () => {
      await proposal_list(store.state.loginToken)
          .then((response) => {
            proposals.value = response.data;

            // 날짜 형식 정리
            proposals.value.forEach((item) => {
              const fullDate = item.date;
              const year = fullDate.slice(0, 4);
              const month = fullDate.slice(5, 7);
              const day = fullDate.slice(8, 10);
              item.date = `${year}-${month}-${day}`;
            });

            copy_p_list.value = [...proposals.value];
          });
    };

    getProposalList();

    const search = () => {
      filterProposals();
    };

    const resetSearch = () => {
      searchText.value = '';
      selectedCategory.value = '';
      filterProposals();
      p_view.value = null; // 상세 내용을 초기화
    };

    const filterByCategory = () => {
      filterProposals();
    };

    const filterProposals = () => {
      copy_p_list.value = proposals.value.filter((p) => {
        const matchesCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
        const matchesSearch = p.title.includes(searchText.value);
        return matchesCategory && matchesSearch;
      });
    };

    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav);
    };
    triggerShow();

    const selectMenu = (selectMenu) => {
      console.log(selectMenu);
      switch (selectMenu) {
        case 1:
          router.push({ name: "ListShop" });
          break;
        case 2:
          router.push({ name: "ListStockRequest" });
          break;
        case 3:
          router.push({ name: "ListProposal" });
          break;
        default:
          break;
      }
    };

    const checkComplete = async () => {
      if (p_view.value) {
        const data = { proposal_id: p_view.value.proposal_id };
        await proposal_check(data, store.state.loginToken)
            .then(() => {
              alert('해결 완료되었습니다.');
              p_view.value.completed = 'y';
              proposals.value = proposals.value.map(p =>
                  p.proposal_id === p_view.value.proposal_id ? { ...p, completed: 'y' } : p
              );
            })
            .catch((error) => {
              console.error('해결 완료 오류:', error);
              alert('해결 완료 중 오류가 발생했습니다.');
            });
      }
    };

    const openSolutionModal = () => {
      showSolutionModal.value = true;
    };

    const closeSolutionModal = () => {
      showSolutionModal.value = false;
    };

    const saveSolution = async () => {
      if (p_view.value) {
        const data = {
          proposal_id: p_view.value.proposal_id,
          solution: solutionText.value,
          shop_id: p_view.value.shop_id
        };
        await proposal_solution(data, store.state.loginToken)
            .then(() => {
              alert('해결방안이 저장되었습니다.');
              p_view.value.solution = solutionText.value;
              proposals.value = proposals.value.map(p =>
                  p.proposal_id === p_view.value.proposal_id ? { ...p, solution: solutionText.value } : p
              );
              copy_p_list.value = [...proposals.value];
              closeSolutionModal();
            })
            .catch((error) => {
              console.error('해결방안 저장 오류:', error);
              alert('해결방안 저장 중 오류가 발생했습니다.');
            });
      }
    };

    // watch 함수를 사용하여 proposals가 변경될 때 copy_p_list도 업데이트
    watch(proposals, (newProposals) => {
      console.log(newProposals)
      filterProposals();
    });

    //검색
    const filteredProposals = computed(() => copy_p_list.value);

    return {
      select,
      searchText,
      selectedCategory,
      copy_p_list,
      proposals,
      selectMenu,
      p_view,
      search,
      resetSearch,
      filterByCategory,
      filteredProposals,
      checkComplete,
      showSolutionModal,
      solutionText,
      openSolutionModal,
      closeSolutionModal,
      saveSolution
    };
  }
};
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

.container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto;
  height: 90vh;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 1rem;
}

.search_div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
}

.listDiv {
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 1%;
  flex: 1.2; /* 리스트 부분이 가변적으로 공간을 차지하게 함 */
  height: 600px;
}

.listDiv-content {
  white-space: pre-wrap;
}

.detail {
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  padding: 1%;
  height: 70vh;
  overflow-y: auto;
  margin: 1%;
  flex: 0.8; /* 상세 내용 부분이 가변적으로 공간을 차지하게 함 */
}

.atr {
  width: 100%;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  word-wrap: break-word;
}

.atr2 {
  width: 100%;
  box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  margin: 2%;
  text-align: left;
  align-items: left;
  padding: 10px;
  word-wrap: break-word;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.border {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.mt-2 {
  margin-top: 5rem;
}

.text-left {
  text-align: left;
}

.table tbody tr {
  padding: 10px 0; /* 행 간격을 늘림 */
}

.table tbody tr td {
  padding: 15px 10px; /* 각 셀에 패딩을 추가 */
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 30px; /* 버튼 사이의 간격을 조절 */
}

.half {
  width: 30vh;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  max-width: 500px;
  margin: auto;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
}

.detail-view h6 {
  font-size: 1.25rem; /* 글씨 크기 조정 */
}

/* 미디어 쿼리 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .listDiv,
  .detail {
    width: 100%;
  }

  .content {
    flex-direction: column;
  }
}


</style>
