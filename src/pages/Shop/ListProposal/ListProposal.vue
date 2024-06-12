<template>
  <div class="container">
    <div class="row mt-4">
      <h4 class="text-left">건의사항</h4>
    </div>

    <!-- sidebar -->
    <ShopSidebar @ShopSidebar="selectMenu" />

    <!-- 검색창 -->
    <div class="search_div row mt-4">
      <div class="col-md-2">
        <select v-model="selectedCategory" @change="filterByCategory" class="form-select">
          <option value="">카테고리 선택</option>
          <option value="상품">상품</option>
          <option value="운영방식">운영방식</option>
          <option value="인력">인력</option>
        </select>
      </div>
      <div class="col-md-3">
        <input type="text" v-model="searchText" @keyup.enter="search" placeholder="검색할 내용을 입력해주세요." class="form-control">
      </div>
      <div class="col-md-1">
        <button class="btn btn-dark" @click="search">검색</button>
      </div>
      <div class="col-md-1">
        <button class="btn btn-secondary" @click="resetSearch">초기화</button>
      </div>
    </div>

    <div class="row mt-3">
      <!-- 리스트 -->
      <div class="col-md-7 listDiv">
        <table class="table table-hover border-gray">
          <thead>
            <tr>
              <th>건의사항 ID</th>
              <th>제목</th>
              <th>요청일</th>
              <th>카테고리</th>
              <th>해결 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr v-on:click="select(p.proposal_id)" v-for="(p) in filteredProposals" :key="p.proposal_id">
              <td>{{ p.proposal_id }}</td>
              <td>{{ p.title }}</td>
              <td>{{ p.date }}</td>
              <td>{{ p.category }}</td>
              <td v-bind:style="{ color: p.completed === 'y' ? 'red' : 'blue' }">{{ p.completed }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 상세 내용 -->
      <div class="col-md-5 detail-view">
        <div v-if="p_view" class="detail-view-content p-3">
          <h6 class="mb-4 text-left">건의사항 상세</h6>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between">
            <strong>지점</strong>
            <div>{{ p_view.shop_name }}</div>
          </div>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between">
            <strong>제목</strong>
            <div>{{ p_view.title }}</div>
          </div>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between">
            <strong>날짜</strong>
            <div>{{ p_view.date }}</div>
          </div>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between">
            <strong>담당자</strong>
            <div>{{ p_view.manager }}</div>
          </div>
          <div class="mb-3 p-2 border rounded d-flex justify-content-between">
            <strong>카테고리</strong>
            <div>{{ p_view.category }}</div>
          </div>
          <div class="mb-3 p-2 border rounded">
            <strong class="d-block text-left">내용</strong>
            <div class="mt-2 listDiv-content text-left">
              {{ p_view.content }}
            </div>
          </div>
          <div class="mb-3 p-2 border rounded">
            <strong class="d-block text-left">해결방안</strong>
            <div class="mt-2 listDiv-content text-left">
              {{ p_view.solution }}
            </div>
          </div>
          <div class="button-container text-center mt-auto">
            <button class="btn btn-secondary" @click="openSolutionModal">해결방안 작성</button>
            <button class="btn btn-primary" @click="checkComplete">해결 완료</button>
          </div>
        </div>

        <div v-else class="detail-view-content p-3">
          <h6 class="mb-4 text-left">건의사항 상세</h6>
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
    </div>
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
          solution: solutionText.value
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
@import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');

.gowun-dodum-regular {
  font-family: "Gowun Dodum", sans-serif;
  font-weight: 400;
  font-style: normal;
}

div {
  font-family: "Gowun Dodum", sans-serif;
}

.container-fluid {
  display: flex;
  flex-direction: column;
}

.search_div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.listDiv {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 650px; /* 최소 높이를 늘림 */
  overflow-y: auto;
}

.listDiv-content {
  white-space: pre-wrap;
}

.detail-view {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  height: 650px; /* 고정 높이 설정 */
  overflow-y: auto; /* 스크롤 생성 */
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
  margin-top: 0.5rem;
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

/* 모달 스타일 */
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
</style>
