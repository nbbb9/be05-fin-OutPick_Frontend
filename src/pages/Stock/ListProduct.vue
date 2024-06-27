<template>
    <div class="container">

      <!-- sidebar -->
      <StockSidebar  @StockSidebar="selectMenu" style="z-index: 2;" :showMenu_p="show"/>

      <!-- 검색창, 제목 -->
      <div>
        <div class="top-space-2">
          <h3>상품 리스트</h3>
        </div>
        <form v-on:submit.prevent="search" class="flex top-space-4">
          <div class="block-3">
            <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control">
          </div>
          <div class="block-1">
          <button @click="filtereditems" class="btn btn-outline-light text-black">검색</button>
        </div>
          <div class="block-1"></div>
          <div class="block-2">
              <select class="form-select" v-model="category">
                <option value="" disabled selected hidden>정렬</option>
                <option value="기본">기본</option>
                <option value="인기순">인기순</option>
                <option value="비인기순">비인기순</option>
                <option value="가나다순">가나다순</option>
              </select>
            </div>
            <div class="block-1">
          <button @click="filtereditems" class="btn btn-outline-light text-black">정렬</button>
        </div>
          <div class="block-3"></div>
          <div class="block-3"></div>
        </form>
      </div>

      <!-- 조회 -->
      <div>
        <div class="listDiv">
          <table class="table table-hover border-gray top-space-4">
            <thead style="position: sticky; top:0; z-index: 1;">
              <tr>
                <th>상품명</th>
                <th>카테고리</th>
                <th>핏</th>
                <th>성별</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i) in copy_product" :key="i.product_id"  @click="show_detail(i.name)">
                <td>{{ i.name }}</td>
                <td>{{ i.category }}</td>
                <td>{{ i.fit }}</td>
                <td>{{ i.gender }}</td>
                <td>{{ i.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    <div class="chooseItem">
      <div class="top-space-4 flex">
        <div>
          <h5 class="block-2">선택 상품 조회</h5>
        </div>
        <div class="block-1"></div>
        <div class="block-2">
              <select class="form-select" id="size_select" v-model="size_select" @change="sizeSelect" >
                <option value="기본" selected>기본</option>
                <option v-for="op in sel_size_list" :key="op">
                  {{ op }}
                </option>
              </select>
            </div>
            <div class="block-1"></div>
            <div class="block-2">
              <select class="form-select" id="color_select" v-model="color_select" @change="colorSelect" >
                <option @click="searchItemList" value="기본" selected>기본</option>
                <option v-for="op in sel_color_list" :key="op">
                  {{ op }}
                </option>
              </select>
            </div>
            <div class="block-3"></div>
            <div class="block-3"></div>
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
                <th>핏</th>
                <th>생산요청서</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p) in copy_item_detail" :key="p.product_id">
                <th>{{ p.product_id }}</th>
                <th>{{ p.name }}</th>
                <th>{{ p.size }}</th>
                <th>{{ p.color }}</th>
                <th>{{ p.stock }}</th>
                <th>{{ p.fit }}</th>
                <th>
                  <button v-if="admin_ban" @click="open_modal(p.product_id)" class="btn btn-outline-light text-black">작성</button>
                  <ProductionRequest 
                  style="z-index: 3;"
                    :is_visible="is_modal_open" 
                     :prod="sel_pd" 
                    @close="close_modal" 
                    @submit="handleInput"/>
                </th>
              </tr>
            </tbody>
          </table> 
        </div>
      </div>
    </div>
</template>
  
<script>
  import { ref , watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { all_product, production_request } from '@/stock_axios';
  import ProductionRequest from '@/components/ProductionRequest.vue';
  import StockSidebar from "@/components/StockSidebar.vue";

  export default {
    components: {
      StockSidebar,
      ProductionRequest
    },
    setup() {
      const router = useRouter();
      // const category = ref('');
      
      // 상품 불러오기
      const product = ref([]);
      const copy_product = ref([]);
      const get_all_product = async () => {
        await all_product()
         .then((response) => {
            product.value = response.data;
            console.log(product.value);
            console.log("상품 불러오기");
         })
         .catch(e => {
          console.error(e.message);
         })
      };

      get_all_product();

      // 중복된 상품 제거
      const delete_duplicated = () => {
        const seen = new Set();
        return product.value.filter(item => {
          const duplicate = seen.has(item.name);
          seen.add(item.name);
          return !duplicate;
        });
      };

      const unique_items = ref([]);
      watch(product, (newVal) => {
        console.log("와치구문");
        unique_items.value = delete_duplicated(newVal);
        console.log(unique_items.value)
        copy_product.value = [...unique_items.value];
        console.log("copyproduct");
      }, {immediate: true});
      

      // 상품 디테일
      const item_detail = ref([]);
      const copy_item_detail = ref([]);
      const show_detail = (name) => {
        const items = product.value.filter(item => {
          return item.name === name
        })
        console.log("items =", items);
        if (items.length) {
          sel_color_list.value = [];
          sel_size_list.value = [];
          item_detail.value = items;
          copy_item_detail.value = [...item_detail.value];
          console.log(product.value);
          console.log(name);
          console.log("이것도 실행완료!");
          get_sel_list();
        } 
      };

      // 검색
      const searchText = ref();
      const category = ref();

      const filtereditems = () => {
        if (searchText.value) {
          console.log("검색 단어 :", searchText.value);
          copy_product.value = unique_items.value.filter(item => {
            console.log(item);
            return item.name.includes(searchText.value)
          })
        }
        if (category.value) {
          if (category.value === '가나다순') {
            copy_product.value.sort((a,b) => {
              console.log("작동중");
              return a.name.localeCompare(b.name);
            })
          } else if (category.value === '기본') {
            console.log("작동중");
            copy_product.value = [...unique_items.value]; 
          } else if (category.value === '인기순') {
            console.log("작동중");
            copy_product.value.sort((a,b) => {
              return b.quantity - a.quantity;
            })
          } else if (category.value === '비인기순') {
            console.log("작동중");
            copy_product.value.sort((a,b) => {
              return a.quantity - b.quantity;
            })  
          }
        }
      }  

      // 선택상품 검색
      const size_select = ref('');
      const color_select = ref('');

      const sel_size_list = ref([]);
      const sel_color_list = ref([]);

      const get_sel_list = () => {
        item_detail.value.filter((item) => {
          console.log("item: ", item)

          if(!sel_size_list.value.includes(item.size)){
            sel_size_list.value.push(item.size);
          }
          if(!sel_color_list.value.includes(item.color)){
            sel_color_list.value.push(item.color);
          }
      
        })

        console.log("sel_size_list : ", sel_size_list.value);
        console.log("sel_color_list : ", sel_color_list);

      }

      const sizeSelect = (event) => {

        console.log("size : ", size_select.value);
        console.log("color : ", color_select.value);

        console.log("color_select_value : ", color_select.value === '기본')

        if(color_select.value && color_select.value !== '기본'){

          if(size_select.value === '기본'){
            console.log("사이즈만 필터링합니다.");
            copy_item_detail.value = [...item_detail.value.filter((item) => {
              return item.color === color_select.value
            })]
          } else{
            console.log("동시에 필터링합니다.");
            copy_item_detail.value = [...item_detail.value.filter((item) => {
              return item.size === size_select.value && item.color === color_select.value
            })]
          } 
          
        }else{

          if(size_select.value === '기본'){
            console.log("아무것도 필터링 하지 않습니다.");
            copy_item_detail.value = [...item_detail.value];
          }else{
            console.log("사이즈만 필터링합니다.");
            size_select.value = parseInt(event.target.value, 10);

            copy_item_detail.value = [...item_detail.value.filter((item) => {
              return item.size === size_select.value
            })]
            
          }
        }

        event.target.value = "";
      }

      const colorSelect = (event) => {

        console.log("size : ", size_select.value);
        console.log("color : ", color_select.value);

        console.log("size_select_value : ", size_select.value === '기본')

        if(size_select.value  && size_select.value !== '기본'){
          if(color_select.value === '기본'){
            console.log("사이즈만 필터링합니다.");
            copy_item_detail.value = [...item_detail.value.filter((item) => {
              return item.size === size_select.value
            })]
          }else{
            console.log("동시에 필터링합니다.");
            copy_item_detail.value = [...item_detail.value.filter((item) => {
              return item.size === size_select.value && item.color === color_select.value
            })]
          }
          
        }else{

          if(color_select.value === '기본'){
            console.log("아무것도 필터링 하지 않습니다.");
            copy_item_detail.value = [...item_detail.value];
          }else{
            console.log("색깔만 필터링합니다.");
            color_select.value = event.target.value

            copy_item_detail.value = [...item_detail.value.filter((item) => {
              return item.color === color_select.value
            })]
          }
        }
        event.target.value = "";
      }


      // 생산요청서 작성
      const is_modal_open = ref(false);
      const sel_pd = ref([]);
      const request_amount = ref();

      const open_modal = (product_id) => {
          sel_pd.value = item_detail.value.filter((item) => {        
            return item.product_id === product_id
          })
          console.log("sel_pd : ",sel_pd);
          is_modal_open.value = true;
          console.log("모달 열림!", is_modal_open.value);   
      };

      const close_modal = () => {
        is_modal_open.value = false;
      }

      watch(sel_pd, (newValue) => {
        console.log("true로 변경!", newValue);
      })

      watch(is_modal_open, (newValue) => {
        console.log("is_modal_true로 변경!", newValue);
      })

      const store = useStore();
      const handleInput = async (input) => {
        console.log("생산요청서 등록 시작!");
        request_amount.value = input;
        console.log(input);
        console.log("생산요청수량 :", request_amount.value);
        const data = {
          "product_id": sel_pd.value[0].product_id,
          "amount": input
        }
        console.log("product_id :",sel_pd.value[0].product_id)
        try {
          await production_request(data, store.state.loginToken)
          .then (() => {
            location.reload();
          })
        } catch(e) {
          console.error(e.message);
        }

      }

      // 관리자 막음
      const admin_ban = ref(false);
      if (store.state.loginUserRole === "사원") {
        admin_ban.value = true;
      }

      // 사이드바
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


      return {
        get_all_product,
        unique_items,
        show_detail,
        copy_product,
        filtereditems,
        delete_duplicated,
        item_detail,
        searchText,
        category,
        size_select,
        color_select,
        sel_size_list,
        sel_color_list,
        sizeSelect,
        copy_item_detail,
        colorSelect,
        open_modal,
        close_modal,
        is_modal_open,
        sel_pd,
        store,
        handleInput,
        selectMenu,
        admin_ban
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