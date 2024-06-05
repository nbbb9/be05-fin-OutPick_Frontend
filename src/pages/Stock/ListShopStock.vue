<template>
    <div class="container">

      <!-- sidebar -->

      <!-- 제목, 검색창 -->
      <div>
        <form v-on:submit.prevent="search" class="flex top-space-4">
          <div class="block-1">
            <h6>매장별 재고 조회</h6>
            
            <select class="form-control">
              <option v-for="(sl) in shop_list" :key=sl.shop_id>{{ sl.name }}</option>
            </select>
          </div>
          <div class="flex block-3 top-space-2">
            <div class="block-3">
              <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control">
            </div>
            <div class="block-1 row-right">
              <button @click="searchItemList" class="btn btn-outline-light text-black">검색</button>
            </div>
            <div class="block-1">
              <select class="form-select" v-model="category" >
                <option @click="searchItemList" value="기본" selected>기본</option>
                <option @click="searchFamous" value="인기순">인기순</option>
                <option @click="searchNotFamous" value="비인기순">비인기순</option>
                <option @click="searchABC" value="가나다순">가나다순</option>
                <option @click="searchSeason" value="계절별">계절</option>
              </select>
            </div>
            <div class="block-2">
              <button @click="stockRequestList" class="btn btn-outline-light text-black">재고요청서</button>
            </div>
          </div>
          
        </form>
      </div>
      
      <!-- 조회 -->
      <div>
      <div>
        <table class="table table-hover border-gray top-space-4">
          <thead>
            <tr class="flex">
              <th class="block-3">상품명</th>
              <th class="block-1">재고</th>
              <th class="block-2">입고일</th>
              <th class="block-2">할인율</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s) in copy_stock_list" :key="s.product_id">
              <td>{{ s.product_name }}</td>
              <td>{{ s.stock }}</td>
              <td>{{ s.stock_date }}</td>
              <td>{{ s.discount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="search-result" class="alert alert-info">
        검색 결과가 존재하지 않습니다.
      </div>

    </div>
    <div class="chooseItem">
      <div class=flex>
      <div>
        <h5 class="top-space-4 block-2">선택 상품 조회</h5>
      </div>
    </div>
      <div>
        <table class="table table-hover border-gray top-space-2">
          <thead>
            <tr class="flex">
              <th class="block-1">상품ID</th>
              <th class="block-3">상품명</th>
              <th class="block-1">사이즈</th>
              <th class="block-1">색상</th>
              <th class="block-2">입고일</th>
              <th class="block-1">할인율</th>
            </tr>
          </thead>
        </table> 
      </div>
    </div>
    <div class="container">

    </div>  <!-- sidebar -->
</div>

</template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { user_shop_list } from '@/stock_axios';
  export default {

    setup() {
      const shop_list = ref([]);

      const store = useStore();
      const get_user_shop_list = async () => {
        await user_shop_list(store.state.loginToken)
          .then((response) => {
            shop_list.value = response.data;
            console.log(shop_list);
          })
          .catch(e => {
            console.log(e.message);
          })
      }

      get_user_shop_list();
      
      return{
      shop_list
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

/* alert 설정 */
.alert{
  font-weight: bold;
  box-shadow: 0 3px 7px rgba(139, 139, 139, 0.403); 
}

/* 플렉스 설정*/
.flex {
  display: flex;
}

/* 한 칸 */
.block-1 {
  flex: 1
}

/* 두 칸 */
.block-2 {
  flex: 2;
}

/* 세 칸 */
.block-3 {
  flex: 3;
}
/* 위 공간 */
.top-space-4 {
  margin-top: 4%;
}

.top-space-2 {
  margin-top: 2%;
}

</style>