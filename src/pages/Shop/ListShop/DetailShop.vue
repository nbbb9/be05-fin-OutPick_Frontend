<template>
  <div class="container">
    <!-- sidebar -->
    <ShopSidebar @ShopSidebar="selectMenu"/>

    <!--매장이름 & 사진-->
    <div class="title-image">
      <div>
        <h1 class="shop-name">@@점</h1>
      </div>
      <div class="image-container">
        <img src="@/assets/로고_슬로건.png" alt="" class=" mt-3" >
      </div>
    </div><!--매장이름 & 사진 끝-->

    <!-- 매장 상세정보 -->
    <div class="shop_detail_form">
      <div class="form-group">
        <label for="manager">매장 관리자</label>
        <input type="text" id="manager" value="백승호">
      </div>

      <div class="form-group">
        <label for="salesperson">매장 영업사원</label>
        <input type="text" id="salesperson" value="이영원">
      </div>

      <div class="form-group">
        <label for="phone">매장 전화번호</label>
        <input type="text" id="phone" value="010-3015-3826">
      </div>

      <div class="form-group">
        <label for="size">매장 규모</label>
        <input type="text" id="size" value="?">
      </div>

      <div class="form-group">
        <label for="location">매장 위치</label>
        <input type="text" id="location" value="서울시 양천구 신목로 43">
      </div>

      <div class="form-group">
        <label for="description">매장 설명</label>
        <input type="text" id="description" value="이 매장은 아주 고급스럽습니다.">
      </div>
    </div><!-- 매장 상세정보 끝-->

    <!-- 매장 재고 조회 -->
    <div class="shop_detail_stock">
      <h5 class="row-right">재고</h5>
    </div><!-- 매장 재고 조회 끝-->
      
  </div>
</template>
  
<script>
  import ShopSidebar from '@/components/ShopSidebar.vue';
  
  export default {
    components :{
      ShopSidebar
    },
    setup() {

      const tableData = [
        {
          product_name: '2016-05-03',
          stock: 'Tom'
        },
        {
          product_name: '2016-05-02',
          stock: 'Tom'
        }
      ]

    return {
      tableData

    }
  }
  
  }
</script>
  
<style>

  /* 폰트 */
  @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');

  .title-image{
    display: flex;
    flex-direction: column;
    justify-content: center; /* 세로 중앙 정렬 */
    text-align: left;
    width:80vw;
  }

  /* 매장 이름*/
  .shop-name{
    text-align: left;
    padding-left: 5%;
    font-weight: bold; /* 글씨를 볼드체로 설정 */
  }

  .image-container {
    width: 100%;
    /* height: auto; /* 부모 요소에 맞게 설정, 필요시 고정 높이 추가 */
    overflow: hidden; /* 이미지가 부모 요소를 벗어나지 않도록 함 */
  }
  /*매장 사진*/
  .shop-image{
    width: 100%;
    height: auto; /* 비율을 유지하면서 부모 요소에 맞게 설정 */
    display: block;
    border: 2px solid #000; /* 이미지 테두리 설정 */
    border-radius: 5px; /* 테두리 모서리 둥글게 설정 (선택 사항) */
  }
  /*매장 상세정보 영역 */
  .shop_detail_form{
    max-height : 75vh;
    width: 60vh;
    overflow-y: auto;
    vertical-align: middle;
    box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  }
  /*매장 상세에서 재고량 */
  .shop_detail_stock{
    max-height : 50vh;
    width: 43vh;
    float: right;
    overflow-y: auto;
    vertical-align: middle;
    box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
  }
    
</style>