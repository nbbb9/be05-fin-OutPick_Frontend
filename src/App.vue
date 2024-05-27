<template> 
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <router-link class="navbar-brand text-white" :to="{ name : 'Login' }">OutPick</router-link>
  
      <!-- 누르면 항목들이 나오는 버튼 -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- 눌렀을 때 나오는 항목들 -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link active text-white" aria-current="page" :to="{name : 'Login'}">매장</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active text-white" aria-current="page" :to="{name : 'Login'}">재고</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active text-white" aria-current="page" :to="{name : 'Login'}">통계/분석</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active text-white" aria-current="page" :to="{name : 'Login'}">관리자</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    <router-view/>
  </div>

</template>

<script>

export default {
  name: 'App',
  setup(){

    return{
      
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav{
  background-color: #0D2DA2;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 강조된 그림자 효과 */
}

</style>
