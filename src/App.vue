<template>
  <!-- 네비게이션 바 -->
  <nav v-if="showNav" class="navbar navbar-expand-lg" style="position: sticky; top:0; z-index: 3;">
    <div class="container-fluid">
      <!-- 로고 -->
      <router-link class="navbar-brand text-white" :to="{ name: 'ListShop' }" @click="setActiveTab('ListShop')">
        <img src="./assets/로고_이미지.png" alt="로고">
      </router-link>

      <!-- 누르면 항목들이 나오는 버튼 -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 네비게이션 항목들 -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ 'active': isActive('ListShop') }"
              @click="setActiveTab('ListShop')"
              :to="{ name: 'ListShop' }"
            >매장</router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ 'active': isActive('ListShopStock') }"
              @click="setActiveTab('ListShopStock')"
              :to="{ name: 'ListShopStock' }"
            >재고</router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ 'active': isActive('AnalysisPage') }"
              @click="setActiveTab('AnalysisPage')"
              :to="{ name: 'AnalysisPage' }"
            >통계/분석</router-link>
          </li>
          <li class="nav-item" v-if="loginUserRole === '관리자'">
            <router-link
              class="nav-link"
              :class="{ 'active': isActive('ListEmployee') }"
              @click="setActiveTab('ListEmployee')"
              :to="{ name: 'ListEmployee' }"
            >관리자</router-link>
          </li>
        </ul>
      </div>

      <div class="logininfo-alert">
        <div class="alert-icon" @click="showNotifications">
          <img :src="notificationImage" alt="Notification Image" />
        </div>
        <!-- 사용자 정보 드롭다운 -->
        <div class="dropdown ms-auto">
          <button class="btn btn-link dropdown-toggle text-white dropdown-large" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            {{ loginUserName }} 님
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li class="image-container">
              <img src="@/assets/경원이형.png" alt="사원사진" class="shop-image mt-3" />
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-white" href="#">이름 : {{ loginUserName }}</a></li>
            <li><a class="dropdown-item text-white" href="#">직급 : {{ loginUserRole }}</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-white" @click="logout">Logout</a></li>
          </ul>
        </div><!-- 사용자 정보 드롭다운 -->
      </div>

      <!-- NotificationOffice Modal -->
      <NotificationOfficeModal v-if="showModal" :notifications="notifications" @close="closeModal" />

    </div>
  </nav>

  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed} from 'vue';
import { useRouter } from 'vue-router';
import NotificationOfficeModal from "@/components/NotificationOfficeModal.vue";

export default {
  name: 'App',
  components: { NotificationOfficeModal },
  setup() {
    const store = useStore();
    const router = useRouter();
    let showNav = computed(() => store.state.showNav);
    let loginUserName = computed(() => store.state.loginUserName);
    let loginUserRole = computed(() => store.state.loginUserRole);
    const hasNotifications = computed(() => store.state.hasNotifications);
    const notifications = computed(() => store.state.notifications);
    const showModal = computed(() => store.state.showModal);
    const activeTab = computed(() => store.state.activeTab);

    const logout = () => {
      store.dispatch('triggerLoginUserName', ""); // 로그인 이름 초기화
      store.dispatch('triggerLoginUserId', 0);     // 로그인 아이디 초기화
      store.dispatch('triggerLoginToken', "");    // 로그인 토큰 초기화
      store.dispatch('triggerLoginUserRole', "")   // 로그인 직급 초기화

      router.push({
        name: "Login"
      })
    }

    const notificationImage = computed(() => {
      return hasNotifications.value ? require('@/assets/alert.png') : require('@/assets/noalert.png');
    });

    const showNotifications = () => {
      store.dispatch('triggerShowModal', true); // 모달 표시
    };

    const closeModal = () => {
      store.dispatch('triggerShowModal', false); // 모달만 닫기
    };

    const setActiveTab = (tabName) => {
      store.dispatch('setActiveTab', tabName); // 활성화된 탭 설정
    };

    const isActive = (tabName) => {
      return activeTab.value === tabName; // 현재 탭이 활성화된 탭인지 확인
    };

    return {
      showNav,
      loginUserName,
      loginUserRole,
      logout,
      showModal,
      notificationImage,
      notifications,
      showNotifications,
      closeModal,
      setActiveTab,
      isActive
    };
  }
};
</script>

<style>
/* 폰트 */
@font-face {
  font-family: 'LINESeedKR-Rg';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Rg.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

div {
  font-family: "LINESeedKR-Rg";
}

/* 로그인 정보와 아이콘을 수평으로 유지 */
.logininfo-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.alert-icon {
  flex-shrink: 0; /* 아이콘의 크기가 부모를 넘지 않도록 */
  width: 50px; /* 원하는 너비 */
  height: 50px; /* 원하는 높이 */
  cursor: pointer; /* 클릭 가능한 커서 */
}

.alert-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 이미지 비율 유지 */
  aspect-ratio: 1 / 1; /* 1:1 비율 */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 네비게이션 바 스타일 */
nav {
  background-color: #0D2DA2;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 강조된 그림자 효과 */
}

/* 네비게이션 아이템들 */
.navbar-nav {
  display: flex;
  align-items: center;
  justify-content: center; /* 항목을 중앙에 배치 */
}

@media (min-width: 991px) {
  .navbar-nav {
    gap: 200px; /* 항목 간 간격 */
  }
}

/* 로고 이미지 크기 */
img {
  width: 100px;
  height: 50px;
}

/* 드롭다운 메뉴 스타일 */
.dropdown-menu {
  min-width: 300px; /* 드롭다운 메뉴의 최소 너비 조정 */
  min-height: auto;
  font-size: 18px; /* 드롭다운 메뉴의 폰트 크기 조정 */
}

/* 드롭다운 메뉴 아이템 스타일 */
.dropdown-item {
  padding: 3% 6%; 
  /* 드롭다운 메뉴 아이템의 패딩 조정 */
}

/* 드롭다운 메뉴 아이템 텍스트 색상 변경 */
.dropdown-item.text-white {
  color: white !important;
}

/* 드롭다운 메뉴 위치 조정 */
.dropdown-menu-end {
  right: 0;
  left: auto;
  background-color: #0D2DA2;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.87); /* 강조된 그림자 효과 */
}

/* 네비게이션 링크 스타일 */
.nav-link {
  color: white;
  font-size: 24px; /* 폰트 크기 크게 조정 */
}

/* 네비게이션 링크의 크기를 크게 조정 */
.nav-item-large {
  padding: 0 20px; /* 구역을 넓히기 위해 패딩 조정 */
  margin: 0 15px; /* 항목 간 간격 추가 */
}

/* 드롭다운 토글 스타일 */
.dropdown-toggle::after {
  display: none;
}

/* 사원 사진 Container */
.image-container {
  width: 100%;
  height: auto; /* 부모 요소에 맞게 설정, 필요시 고정 높이 추가 */
  overflow: hidden; /* 이미지가 부모 요소를 벗어나지 않도록 함 */
}

/* 사원 사진 */
.shop-image {
  width: 100%;
  height: auto; /* 비율을 유지하면서 부모 요소에 맞게 설정 */
  display: block;
  border: 2px solid #000; /* 이미지 테두리 설정 */
  border-radius: 5px; /* 테두리 모서리 둥글게 설정 (선택 사항) */
}

/* 드롭다운 버튼 크기 조정 */
.dropdown-large {
  font-size: 24px;
  margin-left: 20px; /* 왼쪽으로 이동 */
}

/* 링크 버튼 스타일 */
.btn-link {
  font-size: 24px;
}

/* 컨테이너 정렬 */
.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 관리자 전용 아이템 숨기기 */
.nav-item[v-if="isAdmin"] {
  display: none;
}

/* 추가: 드롭다운 항목 호버 스타일 */
.dropdown-item:hover {
  background-color: #0D2DA2 !important; /* 호버 시 배경색 유지 */
  color: white !important; /* 호버 시 글자색 유지 */
}

.link{
  text-decoration: none;
  padding : 0.5rem 0.75rem;
  font-size: 18px;
  font-weight: 600;
  color: #fefefe;
  position: relative;
  transition: color 0.25s;
}

/* 네비게이션 선택 항목 스타일 */
.nav-link.active {
  color: rgb(228, 228, 148) !important;
  text-decoration: underline; /* 밑줄 추가 */
  font-size: 35px; /* 폰트 크기 조정 */
  padding: 10px 40px; /* 패딩 조정 */
  transition: font-size 0.3s, padding 0.3s, text-decoration 0.3s; /* 부드러운 전환 효과 */
}
</style>
