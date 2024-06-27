<template>

    <div class="sidebar">
      <!-- 사이드바 내용 -->
      <ul>
        <li @click="select(1)">사원 관리</li>
        <li @click="select(2)">전자 문서</li>
        <li v-if="showMenu_p" class="subMenu" @click="select(3)">재고요청서</li>
        <li v-if="showMenu_p" class="subMenu" @click="select(4)">생산요청서</li>
      </ul>
    </div>
  
</template>

<script>

export default {
    
    emits : ["AdminSidebar"],
    props : {
        showMenu_p : {
            type : Boolean,
            required : false
        }
    },
    setup(props, context){

        const select = (id) => {

            console.log(id);

            context.emit("AdminSidebar", id)
        }


        return{
            select
        }
    }

}
</script>

<style scoped>

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
  margin-top: 20px;
  margin-bottom: 10px;
  border-radius: 1em;
}

/* sidebar 이동과 전체 설정  */
.sidebar {
  width: 250px;
  height : 90vh;
  position: fixed;
  left: 0; top : 11%;
  background-color: #F3F7FA;
  border-radius: 20px;

  transform: translateX(-210px);  
  transition: .5s;
  z-index: 2
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

.subMenu{
    margin-right: 70px;
    background-color: #FFFFDB;
    color: black;
}

</style>