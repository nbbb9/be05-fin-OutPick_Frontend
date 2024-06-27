<template>
    <div class="container">

      <!-- sidebar -->
      <StockSidebar style="z-index: 2;" @stock-sidebar="selectMenu" :showMenu_p="show"/>

      <!-- 제목, 검색창 -->
      <div>
        <div class="top-space-2">
            <h3>매장별 재고 조회</h3>
        </div>
        <form v-on:submit.prevent="search" class="flex top-space-2">
          <div class="block-1 top-space-2">
            <select class="form-select" @change="get_shop_id">
              <option value="" disabled selected>조회할 매장을 선택하세요</option>
              <option v-for="(sl) in shop_list" :key="sl.shop_id" :value="sl.name">{{ sl.name }}</option>
            </select>
          </div>
          <div class="flex block-3 row-right top-space-2">
            <div class="block-3">
              <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control">
            </div>
            <div class="block-1">
              <button @click="filtereditems" class="btn btn-outline-light text-black">검색</button>
            </div>
            <div class="block-1">
              <select class="form-select" v-model="category" >
                <option value="기본" selected>기본</option>
                <option value="가나다순">가나다순</option>
              </select>
            </div>

            <div class="block-1">
          <button @click="filtereditems" class="btn btn-outline-light text-black">정렬</button>
        </div>
            <div class="block-2">
              <button @click="stockRequestList" class="btn btn-light text-black">재고요청서</button>
            </div>
          </div>
          
        </form>
      </div>
      
      <!-- 조회 -->
      <div>
      <div class="listDiv">
        <table class="table table-hover border-gray top-space-4 ">
          <thead style="position: sticky; top:0; z-index: 1;">
            <tr>
              <th>상품명</th>
              <th>입고일</th>
              <th>할인율</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i) in copy_item_list" :key="i.product_id" @click="show_detail(i.product_name)">
              <td>{{ i.product_name }}</td>
              <td>{{ i.stock_date }}</td>
              <td>{{ i.discount }}
                <button @click="show_modal(), send_name(i.product_name)" class="btn btn-outline-light text-black">수정</button>
                <StockModal
                style="z-index: 3;"
                  v-if="is_modal_visible"
                  :is_visible="is_modal_visible"
                  modal_message="할인율 입력"
                  @close="is_modal_visible = false"
                  @submit="handleInput"
                />
              </td>
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
          <thead style="position: sticky; top:0; z-index: 1;">
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
              <th>{{ id.product_name }}</th>
              <th>{{ id.size }}</th>
              <th>{{ id.color }}</th>
              <th>{{ id.stock }}</th>
              <th>{{ id.stock_date }}</th>
              <th>{{ id.discount }}</th>
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { user_shop_list, shop_item_list, update_discount } from '@/stock_axios';
  import { shop_all_list, shop_stock } from '@/shop_axios';
  import StockModal from '@/components/StockModal.vue';
  import StockSidebar from "@/components/StockSidebar.vue";

  export default {
    components : {
      StockSidebar,
      StockModal
    },
    setup() {

      // 매장 선택
      const shop_list = ref([]); // 매장 리스트를 담는 변수
      const copy_shop_list = ref([]); // 매장 카피본

      const store = useStore();
      const get_user_shop_list = async () => {
        if (store.state.loginUserRole === "사원") {
        await user_shop_list(store.state.loginToken)
          .then((response) => {
            shop_list.value = response.data;
            copy_shop_list.value = [...shop_list.value];
          })
          .catch(e => {
            console.error(e.message);
          })
        } else {
          await shop_all_list(store.state.loginToken)
            .then((response) => {
              shop_list.value = response.data;
              copy_shop_list.value = [...shop_list.value];
            })
            .catch(e => {
              console.error(e.message);
            })
        }
      }

      get_user_shop_list();
      
      // 매장 재고 전체 리스트
      const shop_id = ref();
      const item_list = ref([]);
      const copy_item_list = ref([]);

      // 아이템 리스트 불러오기
      const get_item_list = async () => {
        if (store.state.loginUserRole === "사원") {
          if (shop_id.value) {
            try {
              const response = await shop_item_list(shop_id.value, store.state.loginToken);
              item_list.value = response.data;

              item_list.value.forEach((item) => {
                const fullDate = item.stock_date

                const year = fullDate.slice(0, 4);
                const month = fullDate.slice(5, 7);
                const day = fullDate.slice(8, 10);

                item.stock_date = `${year}-${month}-${day}`;
              });

              console.log("item list : ", item_list.value);
              unique_items()
            } catch (e) {
              console.error(e.message);
            }
          }
        } else {
          if (shop_id.value) {
            try {
              const response = await shop_stock(shop_id.value, store.state.loginToken);
              item_list.value = response.data;

              item_list.value.forEach((item) => {
                const fullDate = item.stock_date

                const year = fullDate.slice(0, 4);
                const month = fullDate.slice(5, 7);
                const day = fullDate.slice(8, 10);

                item.stock_date = `${year}-${month}-${day}`;
              });

              console.log("item list :", item_list.value);
              unique_items()
            } catch (e) {
              console.error(e.message);
            }
          }
        }

      }

      // 중복된 상품 제거
      const unique_items = () => {
        const seen = new Set();
        copy_item_list.value = [...item_list.value.filter(item => {
          const duplicate = seen.has(item.product_name);
          seen.add(item.product_name);
          return !duplicate;
        })]
      };

      // shop_id 찾기
      const get_shop_id = (event) => {
        const selectedShopId = event.target.value;
        const shop = shop_list.value.find(s => {
          // return s.shop_id === selectedShopId});
          return s.name.includes(selectedShopId)});
        console.log("shop : ", shop);
        if (shop) {
          shop_id.value = shop.shop_id;
          console.log(shop_id.value);
          get_item_list()
        }
      };

      // 상세정보 불러오기
      const item_detail = ref([]);
      const item_names = ref([]);
      const show_detail = (product_name) => {
        console.log("show_detail method 실행");
        const items = item_list.value.filter(item => item.product_name === product_name);
        console.log(items);
        if (items.length) {
          item_detail.value = items;
          item_names.value.push(product_name);
        }
      }

      // 검색
      const searchText = ref();
      const category = ref();

      const filtereditems = () => {
        if (searchText.value) {
          console.log("검색 단어 :", searchText.value);
          copy_item_list.value = copy_item_list.value.filter(item => {
            console.log(item);
            return item.product_name.includes(searchText.value)
          })
        }
        if (category.value) {
          if (category.value === '가나다순') {
            copy_item_list.value.sort((a,b) => {
              return a.product_name.localeCompare(b.product_name);
            })
          } else if (category.value === '기본') {
            copy_item_list.value = [...item_list.value]; 
          } 
          // else if (category.value === '인기순') {
          //   copy_item_list.value.sort((a,b) => {
          //     return b.quantity - a.quantity;
          //   })
          // } else if (category.value === '비인기순') {
          //   copy_item_list.value.sort((a,b) => {
          //     return a.quantity - b.quantity;
          //   })  
          // }
        }
      }  

      // 재고요청서 페이지 할 수 있어
      const router = useRouter()
      const stockRequestList = () => {
        store.dispatch('setActiveTab', 'ListShop');
        router.push({
          name : "ListStockRequest"
        })
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
      const product_id = ref();
      const send_name = (p_name) => {
        product_name.value = p_name;

        console.log(product_name.value);
        const p_id = item_list.value.find(item => {
          return product_name.value.includes(item.product_name)});
        console.log("p_id : ", p_id.product_id); 
        product_id.value =  p_id.product_id
      };
      
      const handleInput = async (input) => {
        console.log("수정 메서드 컴인!")
        discount_rate.value = input;
        console.log("할인률 : ",discount_rate.value);
        console.log("상품 ID : ",product_id.value);
          try {
            await update_discount(product_id.value, shop_id.value, discount_rate.value)

              get_item_list();

          } catch(e) {
            console.error(e.message);
          }
      };
      
      // const handleInput = async () => {
      //   const discount_rate = input.value;
      // }


      // 페이지 접속시 Nav가 보이지 않게 vuex에서 false로 값을 바꿈
      const triggerShow = () => {
        store.dispatch('triggerShow', true);
        console.log(store.state.showNav)
      }
      triggerShow();


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


      const selectMenu = (selectId) => {
        console.log("select Id:", selectId);
        switch (selectId) {
          case 1:
            router.push({name: "ListShopStock"});
            break;
          case 2:
            router.push({name: "ListCompanyStock"});
            break;
          case 3:
            router.push({name: "ListAllProductRequest"});
            break;
          case 4:
            router.push({name: "ListProduct"});
            break;
          case 5:
            router.push({name: "ListWarehouse"});
            break;
          default:
            break;
        }
      };

      return{
      shop_list,
      unique_items,
      item_list,
      item_detail,
      show_detail,
      is_modal_visible,
      discount_rate,
      show_modal,
      update_discount,
      handleInput,
      send_name,
      searchText,
      copy_shop_list,
      get_shop_id,
      copy_item_list,
      filtereditems,
      category,
      stockRequestList,
      selectMenu,
      shop_all_list,
      shop_stock
      }
        
    
    }
  }
  </script>
  
<style scoped>
/* 폰트 */
@font-face {
    font-family: 'LINESeedKR-Rg';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Rg.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}


div{
font-family: "LINESeedKR-Rg";
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