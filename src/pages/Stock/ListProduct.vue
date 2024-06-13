<template>
    <div class="container">

      <!-- sidebar -->

      <!-- 검색창, 제목 -->
      <div>
        <div class="top-space-2">
          <h3>상품 리스트</h3>
        </div>
        <form v-on:submit.prevent="search" class="flex top-space-4">
          <div class="block-3">
            <input type="text" v-model="searchText" placeholder="검색하세요" class="form-control">
          </div>
          <div class="block-1"></div>
          <div class="block-2">
              <select class="form-select" v-model="category">
                <option value="" disabled selected hidden>정렬</option>
                <option @click="searchItemList" value="기본">기본</option>
                <option @click="searchFamous" value="인기순">인기순</option>
                <option @click="searchNotFamous" value="비인기순">비인기순</option>
                <option @click="searchABC" value="가나다순">가나다순</option>
                <option @click="searchSeason" value="계절별">계절</option>
              </select>
            </div>
          <div class="block-3"></div>
          <div class="block-3"></div>
        </form>
      </div>

      <!-- 조회 -->
      <div>
        <div class="listDiv">
          <table class="table table-hover border-gray top-space-4">
            <thead>
              <tr>
                <th>상품명</th>
                <th>카테고리</th>
                <th>핏</th>
                <th>성별</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i) in unique_items" :key="i.product_id"  @click="show_detail(i.product_name)">
                <td>{{ i.product_name }}</td>
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
              <select class="form-select" v-model="category" >
                <option @click="searchItemList" value="기본" selected>기본</option>
                <option @click="searchFamous" value="인기순">인기순</option>
                <option @click="searchNotFamous" value="비인기순">비인기순</option>
                <option @click="searchABC" value="가나다순">가나다순</option>
                <option @click="searchSeason" value="계절별">계절</option>
              </select>
            </div>
            <div class="block-1"></div>
            <div class="block-2">
              <select class="form-select" v-model="category" >
                <option @click="searchItemList" value="기본" selected>기본</option>
                <option @click="searchFamous" value="인기순">인기순</option>
                <option @click="searchNotFamous" value="비인기순">비인기순</option>
                <option @click="searchABC" value="가나다순">가나다순</option>
                <option @click="searchSeason" value="계절별">계절</option>
              </select>
            </div>
            <div class="block-3"></div>
            <div class="block-3"></div>
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
                <th>핏</th>
                <th>생산요청서</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p) in copy_product" :key="p.product_id">
                <th>{{ p.product_id }}</th>
                <th>{{ p.product_name }}</th>
                <th>{{ p.size }}</th>
                <th>{{ p.color }}</th>
                <th>{{ p.stock }}</th>
                <th>{{ p.fit }}</th>
                <th>
                  <button @click="open_modal" class="btn btn-outline-light text-black">작성</button>
                </th>
              </tr>
            </tbody>
          </table> 
        </div>
      </div>
    </div>
</template>
  
<script>
  import { ref, computed } from 'vue';
  import { all_product } from '@/stock_axios';

  export default {
    setup() {

      // const category = ref('');
      
      // 상품 불러오기
      const product = ref([]);
      const copy_product = ref([]);
      const get_all_product = async () => {
        await all_product()
         .then((response) => {
            product.value = response.data;
         })
         .catch(e => {
          console.error(e.message);
         })
      };

      get_all_product();

      // 중복된 상품 제거
      const unique_items = computed(() => {
        const seen = new Set();
        return product.value.filter(product => {
          const duplicate = seen.has(product.product_name);
          seen.add(product.product_name);
          return !duplicate;
        });
      });

      // 상품 디테일
      const show_detail = (product_name) => {
        const products = product.value.filter(product => product.product_name === product_name);
        if (products.length) {
          copy_product.value = products;
         
        }
      };

      return {
        get_all_product,
        unique_items,
        show_detail,
        copy_product
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