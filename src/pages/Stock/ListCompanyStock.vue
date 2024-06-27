<template>

  <div class="container">

    <!-- sidebar -->
    <StockSidebar style="z-index: 2;" @StockSidebar="selectMenu" :showMenu_p="show"/>

    <!-- 제목, 검색창 -->
    <div>
      <div class="top-space-2">
        <h3>회사 재고 조회</h3>
      </div>
      <form v-on:submit.prevent="search" class="flex top-space-4">
        <div class="block-3">
          <input type="text" @click="initial" v-model="searchText" placeholder="상품을 검색하세요" class="form-control">
        </div>
        <div class="block-1">
          <button @click="filtereditems" class="btn btn-outline-light text-black">검색</button>
        </div>
        <div class="block-2">
          <select class="form-select" v-model="category">
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
              <th>입고일</th>
              <th>창고</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i) in copy_st_list" :key="i.stock_id" @click="show_detail(i.product_name)">
              <td>{{ i.product_name }}</td> 
              <td>{{ i.stock_date }}</td>
              <td>{{ i.warehouse_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="search-result" class="alert alert-info">
        검색 결과가 존재하지 않습니다.
      </div>
    </div>
    <div>
      <div class="chooseItem">
        <div class="flex">
          <div>
            <h5 class="top-space-12 block-2">선택 상품 조회</h5>
          </div>
        </div>
        <div>
          <div class="listDiv">
            <table class="table table-hover border-gray top-space-2">
              <thead style="position: sticky; top:0; z-index: 1;">
                <tr>
                  <th>상품명</th>
                  <th>사이즈</th>
                  <th>색상</th>
                  <th>재고</th>
                  <th>입고일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(id) in item_detail" :key="id.stock_id">
                  <th>{{ id.product_name }}</th>
                  <th>{{ id.size }}</th>
                  <th>{{ id.color }}</th>
                  <th>{{ id.stock }}</th>
                  <th>{{ id.stock_date }}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</div>

</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { company_stock } from '@/stock_axios';
import StockSidebar from "@/components/StockSidebar.vue";

export default {
  components: {
    StockSidebar
  },

  setup() {
    
    // 회사 재고 리스트
    const company_stock_list = ref([]);
    const copy_st_list = ref([]);
    const get_company_stock_list = async () => {
      await company_stock()
        .then((response) => {
          company_stock_list.value = response.data;
          console.log(company_stock_list.value);
          
          company_stock_list.value.forEach((item) => {
            const fullDate = item.stock_date

            const year = fullDate.slice(0, 4);
            const month = fullDate.slice(5, 7);
            const day = fullDate.slice(8, 10);

            item.stock_date = `${year}-${month}-${day}`;
            
          });

          copy_st_list.value = [...company_stock_list.value];
        })
        .catch (e => {
          console.error(e.message);
        })
    }

    get_company_stock_list();

    // 중복된 상품 제거
    const delete_duplicated = (stock_list) => {
      const seen = new Set();
      return stock_list.filter(stock => {
        const duplicate = seen.has(stock.product_name);
        seen.add(stock.product_name);
        return !duplicate;
      });
    };

    const unique_items = ref([]);
    watch(company_stock_list, (newVal) => {
      unique_items.value = delete_duplicated(newVal);

      copy_st_list.value = [...unique_items.value];
    }, {immediate: true});



    // 상세보기
    const item_detail = ref([]);
    const show_detail = (product_name) => {
      console.log("실행완료!");
      const stocks = company_stock_list.value.filter(stock => stock.product_name === product_name);
      if (stocks.length) {
        item_detail.value = stocks;
        console.log("이것도 실행완료!");
      }
    }
    
  
    // 검색
    const searchText = ref();
    const category = ref();

    // 검색 초기화
    const initial = () => {
    copy_st_list.value = [...unique_items.value];
    }

    const filtereditems = () => {
      if (searchText.value) {
        console.log("검색 단어 :", searchText.value);
        copy_st_list.value = unique_items.value.filter(item => {
          console.log(item);
          return item.product_name.includes(searchText.value)
        })
      }
      if (category.value) {
        if (category.value === '가나다순') {
          copy_st_list.value.sort((a,b) => {
            return a.product_name.localeCompare(b.product_name);
          })
        } else if (category.value === '기본') {
          copy_st_list.value = [...unique_items.value]; 
        } else if (category.value === '인기순') {
          copy_st_list.value.sort((a,b) => {
            return b.quantity - a.quantity;
          })
        } else if (category.value === '비인기순') {
          copy_st_list.value.sort((a,b) => {
            return a.quantity - b.quantity;
          })  
        }
      }
    }  

    // 사이드바
    const router = useRouter();
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
      unique_items,
      show_detail,
      item_detail,
      searchText,
      filtereditems,
      delete_duplicated,
      category,
      copy_st_list,
      selectMenu,
      initial,
      useRouter
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