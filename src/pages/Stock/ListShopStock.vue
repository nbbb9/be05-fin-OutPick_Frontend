<template>
    <div class="container">

      <!-- sidebar -->

      <!-- 제목, 검색창 -->
      <div>
        <div class="top-space-2">
            <h3>매장별 재고 조회</h3>
        </div>
        <form v-on:submit.prevent="search" class="flex top-space-4">
          <div class="block-1">
            <h6>매장 선택</h6>
            <select v-model="shop_name" class="form-control">
              <option v-for="(sl) in shop_list" :key="sl.shop_id" :value="sl.name">{{ sl.name }}</option>
            </select>
          </div>
          <div class="flex block-3 row-right top-space-4">
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
      <div class="listDiv">
        <table class="table table-hover border-gray top-space-4 ">
          <thead>
            <tr>
              <th>상품명</th>
              <th>입고일</th>
              <th>할인율</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i) in unique_items" :key="i.product_id">
              <td @click="show_detail(i.product_name)">{{ i.product_name }}</td>
              <td @click="show_detail(i.product_name)">{{ i.stock_date }}</td>
              <td @click="show_detail(i.product_name)">{{ i.discount }}</td>
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
        <h5 class="top-space-12 block-2">선택 상품 조회</h5>
      </div>
    </div>
      <div class="listDiv">
        <table class="table table-hover border-gray top-space-2">
          <thead>
            <tr>
              <th>상품ID</th>
              <th>상품명</th>
              <th>사이즈</th>
              <th>색상</th>
              <th>재고</th>
              <th>입고일</th>
              <th>할인율</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(id) in item_detail" :key="id.product_id">
              <th>{{ id.product_id }}</th>
              <th :v-model="product_name">{{ id.product_name }}</th>
              <th>{{ id.size }}</th>
              <th>{{ id.color }}</th>
              <th>{{ id.stock }}</th>
              <th>{{ id.stock_date }}</th>
              <th>{{ id.discount }}
                <button @click="show_modal" class="btn btn-outline-light text-black">수정</button>
                <StockModal
                  v-if="is_modal_visible"
                  :is_visible="is_modal_visible"
                  modal_message="할인율 입력"
                  @close="is_modal_visible = false"
                  @submit="update_discount_rate"
                />
              </th>
            </tr>
          </tbody>
        </table> 
      </div>
    </div>


    <div class="container">



    </div>  <!-- sidebar -->
</div>

</template>
  
  <script>
  import { ref, watchEffect, computed } from 'vue';
  import { useStore } from 'vuex';
  import { user_shop_list, shop_item_list, update_discount } from '@/stock_axios';
  import StockModal from '@/components/StockModal.vue';

  export default {
    components : {
      StockModal
    },
    setup() {

      // 매장 선택
      const shop_list = ref([]); // 매장 리스트를 담는 변수

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
      
      // 매장 재고 전체 리스트
      const shop_name = ref();
      const shop_id = ref();
      const item_list = ref([]);

      // 중복된 상품 제거
      const unique_items = computed(() => {
        const seen = new Set();
        return item_list.value.filter(item => {
          const duplicate = seen.has(item.product_name);
          seen.add(item.product_name);
          return !duplicate;
        });
      });

      // shop_id 찾기
      watchEffect(() => {
        const shop = shop_list.value.find(s => s.name === shop_name.value);
        if (shop) {
          shop_id.value = shop.shop_id;
        }
      });

      // 아이템 리스트 불러오기
      watchEffect(async () => {
        if (shop_id.value) {
          try {
            const response = await shop_item_list(shop_id.value, store.state.loginToken);
            item_list.value = response.data;
          } catch (e) {
            console.error(e.message);
          }
        }
      })

      // 상세정보 불러오기
      const item_detail = ref([]);

      const show_detail = (product_name) => {
        const items = item_list.value.filter(item => item.product_name === product_name);
        if (items.length) {
          item_detail.value = items;
        }
      }

      // 할인율 수정

      const is_modal_visible = ref(false);
      const discount_rate = ref();

      const show_modal = () => {
        try{
          is_modal_visible.value = true;
          console.log("완료!");
          console.log(is_modal_visible.value);
        } catch(e) {
          console.error(e.error);
        }
        
        
      }

      
      const product_name = ref();

      const update_discount_rate = async (discount_rate) => {
        await update_discount(product_name.value, discount_rate)
          .then
      }



      // const update_discount_rate = async () => {
      //   await update_discount(product_name, discount_rate.value)
      //     .then ((response) => {
      //       if(product_name === shop_item_list.product_name) {
      //         shop_item_list.discount = discount_rate.value;
      //       }
      //     })
      //     .catch(e => {
      //       console.log(e.message)
      //     })
      // }
      

      return{
      shop_list,
      shop_name,
      unique_items,
      item_detail,
      show_detail,
      is_modal_visible,
      discount_rate,
      show_modal,
      handleInput,
      update_discount
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

.top-space-12 {
  margin-top: 12%
}

</style>