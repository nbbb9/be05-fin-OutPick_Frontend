<template>
  <!-- 네비게이션 바 -->
  <nav v-if="showNav" class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- 로고 -->
      <router-link class="navbar-brand text-white" :to="{ name: 'ListShop' }">
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
            <router-link class="nav-link active nav-item-large text-white" aria-current="page" :to="{name: 'ListShop'}">매장</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active nav-item-large text-white" aria-current="page" :to="{name: 'Login'}">재고</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active nav-item-large text-white" aria-current="page" :to="{name: 'Login'}">통계/분석</router-link>
          </li>
          <li class="nav-item" v-if="loginUserRole === '관리자'">
            <router-link class="nav-link active nav-item-large text-white" aria-current="page" :to="{name: 'ListEmployee'}">관리자</router-link>
          </li>
        </ul>
      </div>

      <!-- 사용자 정보 드롭다운 -->
      <div class="dropdown ms-auto">
        <button class="btn btn-link dropdown-toggle text-white dropdown-large" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          {{ loginUserName }} 님
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li class="image-container">
            <img src="@/assets/로고_슬로건.png" alt="" class="shop-image mt-3" />
          </li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-white" href="#">이름 : {{ loginUserName }}</a></li>
          <li><a class="dropdown-item text-white" href="#">직급 : {{ loginUserRole }}</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-white" @click="logout">Logout</a></li>
        </ul>
      </div><!-- 사용자 정보 드롭다운 -->

    </div>
  </nav>

  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter()
    let showNav = computed(() => store.state.showNav);
    let isAdmin = computed(() => store.state.isAdmin);
    let loginUserName = computed(() => store.state.loginUserName);
    let loginUserRole = computed(() => store.state.loginUserRole);

    const logout = () => {
      store.dispatch('triggerLoginUserName', ""); // 로그인 이름 초기화
      store.dispatch('triggerLoginUserId',0);     // 로그인 아이디 초기화
      store.dispatch('triggerLoginToken', "");    // 로그인 토큰 초기화
      store.dispatch('triggerLoginUserRole',"")   // 로그인 직급 초기화

      router.push({
        name : "Login"
      })
    }

    return {
      showNav,
      isAdmin,
      loginUserName,
      loginUserRole,
      logout
    };
  }
};
</script>

<style>
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
  gap: 200px; /* 항목 간 간격 */
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
  padding: 10px 20px; /* 드롭다운 메뉴 아이템의 패딩 조정 */
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
.nav-link.active {
  color: white !important;
  margin-right: 20px;
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
</style>
