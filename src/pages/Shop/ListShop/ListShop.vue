<template>
  <div>
    ListShop
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {

  setup(){

    // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
    const store = useStore();   // store 변수
    const triggerShow = () => {
      store.dispatch('triggerShow', true);
      console.log(store.state.showNav)
    }
    triggerShow();

    return{

    }
  }

}
</script>

<style>

</style>