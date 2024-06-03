<template>

    <div class="sidebar">
      <!-- 사이드바 내용 -->

      <div class="loginStoreUser" >
        {{ loginStoreName }} <br>
        {{ loginStoreUser }} 님
      </div>

      <ul>
        <li @click="select(1)">재고 확인</li>
        <li @click="select(2)">재고요청서 작성</li>
        <li @click="select(3)">재고요청서 관리</li>
        <li @click="select(4)">판매 관리</li>
        <li @click="select(5)">건의사항 작성</li>
        <li @click="select(6)">건의사항 관리</li>
      </ul>
    </div>
</template>
  
<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    emits : ["StoreSidebar"],
    setup(props, context){

        const store = useStore();
        const loginStoreUser = computed( () => store.state.loginStoreUser )
        const loginStoreName = computed( () => store.state.loginStoreName )

        const select = (id) => {

          console.log(id);

          context.emit("StoreSidebar", id)
        }

        return {
            select,
            loginStoreUser,
            loginStoreName
        }

    }
  }
</script>
 
<style scoped >
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
  background-color : #0D2DA2;
  color: white;
  font-weight: bold;
  text-align: left;
  padding : 13px;
  margin-left: 5px;
  margin-right: 50px;
  margin-bottom: 20px;
  border-radius: 1em;
}

/* sidebar 이동과 전체 설정  */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0; top : 0; bottom : 0;
  background-color: #F3F7FA;
  border-radius: 20px;


  transform: translateX(-210px);  
  transition: .5s;
}

.sidebar:hover {
  transform: translateX(0);   /* 둥근 모서리의 너비만큼 X축 이동, Y축 고정 */
}

.loginStoreUser{
  margin: 10px;
  margin-bottom: 20px;

  font-weight: bold;
  font-size: large;
  text-align: left;
}
</style>
  