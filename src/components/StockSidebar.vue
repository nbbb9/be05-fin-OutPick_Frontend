<template>
  <div class="sidebar">
    <!-- 사이드바 내용 -->
    <ul>
      <li :class="{ selected: selectedId === 1 }" @click="select(1)">매장 재고</li>
      <li :class="{ selected: selectedId === 2 }" @click="select(2)">회사 재고</li>
      <li :class="{ selected: selectedId === 3 }" @click="select(3)">생산 요청서</li>
      <li :class="{ selected: selectedId === 4 }" @click="select(4)">상품 리스트</li>
      <li :class="{ selected: selectedId === 5 }" @click="select(5)">물류센터</li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  emits: ["StockSidebar"],
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const selectedId = computed(() => store.state.selectedId);

    const select = (id) => {
      store.dispatch('setSelectedId', id);
      context.emit("StockSidebar", id);
      switch (id) {
        case 1:
          router.push({ name: 'ListShopStock' });
          break;
        case 2:
          router.push({ name: 'ListCompanyStock' });
          break;
        case 3:
          router.push({ name: 'ListAllProductRequest' });
          break;
        case 4:
          router.push({ name: 'ListProduct' });
          break;
        case 5:
          router.push({ name: 'ListWarehouse' });
          break;
        default:
          break;
      }
    };

    // 라우트 변화 감지 및 selectedId 업데이트
    const updateSelectedId = (routeName) => {
      switch (routeName) {
        case 'ListShopStock':
          store.dispatch('setSelectedId', 1);
          break;
        case 'ListCompanyStock':
          store.dispatch('setSelectedId', 2);
          break;
        case 'ListAllStockRequest':
          store.dispatch('setSelectedId', 3);
          break;
        case 'ListProduct':
          store.dispatch('setSelectedId', 4);
          break;
        case 'ListWarehouse':
          store.dispatch('setSelectedId', 5);
          break;
        default:
          store.dispatch('setSelectedId', null);
          break;
      }
    };

    watch(
      () => route.name,
      (newRouteName) => {
        updateSelectedId(newRouteName);
      },
      { immediate: true }
    );

    return {
      select,
      selectedId
    }
  }
}
</script>

<style scoped>
/* 사이드바 스타일 */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #f0f0f0;
}

/* list 형태 제거 */
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* sidebar 메뉴 설정 */
li {
  background-color: #0D2DA2;
  color: white;
  font-weight: bold;
  text-align: left;
  padding: 13px;
  margin-left: 5px;
  margin-right: 50px;
  margin-top: 20px;
  border-radius: 1em;
  cursor: pointer;
}

/* 선택된 항목 스타일 */
.selected {
  background-color: #f3d86b; /* 선택된 항목의 배경색 */
  color: rgb(62, 85, 211); /* 선택된 항목의 글자색 */
}

/* sidebar 이동과 전체 설정 */
.sidebar {
  width: 250px;
  height: 90vh;
  position: fixed;
  left: 0;
  top: 11%;
  background-color: #F3F7FA;
  border-radius: 20px;
  transform: translateX(-210px);
  transition: .5s;
}

.sidebar:hover {
  transform: translateX(0); /* 둥근 모서리의 너비만큼 X축 이동, Y축 고정 */
}

.loginStoreUser {
  margin: 10px;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: large;
  text-align: left;
}
</style>
