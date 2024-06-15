<template>
    <div class="container">
        <ShopSidebar @ShopSidebar="selectMenu" />
        <div class="row mt-5">
            <div class="col-6">
                <div class="detail">
                    <div class="mt-3">
                        <h5>재고 요청서 상세</h5>
                    </div>
                    <div v-if="loading">
                        <p>재고요청서를 불러오지 못했습니다.</p>
                    </div>
                    <div v-else>
                        <div class="atr row pt-3 align-items-center">
                            <strong class="col-4 text-center">지점</strong>
                            <div class="col-8 text-center">{{ sr_detail.shop_name }}</div>
                        </div> <!-- 지점 끝 -->
                        <div class="atr row pt-3 align-items-center">
                            <strong class="col-4 text-center">요청 날짜</strong>
                            <div class="col-8 text-center">{{ formattedDate(sr_detail.request_date) }}</div>
                        </div> <!-- 날짜 끝 -->
                        <div class="row center">
                            <div class="atr pt-3 col-5 row align-items-center">
                                <strong class="col-6 text-left">매장 담당자</strong>
                                <div class="col-6 text-right">{{ sr_detail.manager }}</div>
                            </div> <!-- 담당자 끝 -->
                            <div class="atr pt-3 col-5 row align-items-center">
                                <strong class="col-6 text-left"> 결재 상태</strong>
                                <div class="col-6 text-right">{{ sr_detail.approval }}</div>
                            </div> <!-- 결재 상태 끝 -->
                        </div> <!-- 담당자/결재 상태 끝 -->
                        <div class="mt-5">
                            <table class="table table-hover border-gray">
                                <thead>
                                    <tr>
                                        <th>상품 ID</th>
                                        <th>상품명</th>
                                        <th>주문 수량</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ sr_detail.product_id }}</td>
                                        <td>{{ sr_detail.product_name }}</td>
                                        <td>{{ sr_detail.amount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> <!-- 요청 상품 상세 끝 -->
                        <br/><br/><br/>
                        <div v-if="sr_detail.approval !== '승인' && sr_detail.approval !== '반려'">
                            <button class="btn btn-outline-success font-weight-bold" @click="sr_approval">승인</button> &emsp;&emsp;&emsp;
                            <button class="btn btn-outline-secondary font-weight-bold" @click="sr_reject">반려</button>
                        </div>
                        <br/><br/>
                    </div>
                </div>
            </div> <!-- 왼쪽 영역 끝 -->
            <div class="col-6">
                <div class="empty-content">
                    <!-- 여기에 다른 내용을 추가할 수 있습니다 -->
                    <div class="placeholder">오른쪽 빈 내용</div>
                </div>
            </div> <!-- 오른쪽 영역 끝 -->
        </div>
    </div>
</template>

<script>
import ShopSidebar from '@/components/ShopSidebar.vue';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { stock_request_detail, stock_request_approval, stock_request_reject } from '@/shop_axios';

export default {
    components: {
        ShopSidebar
    },
    setup() {
        const store = useStore(); // store Vuex 변수
        const router = useRouter();
        const route = useRoute();

        const stock_request_id = ref(null);
        const sr_detail = ref({});
        const loading = ref(true);

        const get_sr_detail = async (stock_request_id) => {
            try {
                console.log(`Fetching sr details for sr ID: ${stock_request_id}`);
                console.log(`Using token: ${store.state.loginToken}`);
                const response = await stock_request_detail(stock_request_id, store.state.loginToken);
                console.log('Detail Response:', response);
                sr_detail.value = response.data;
                
            } catch (error) {
                console.error('Error fetching shop details:', error);
                alert('Failed to load stock request details.');
            } finally {
                loading.value = false;
            }
        };

        const formattedDate = (date) => {
            const year = date.slice(0, 4);
            const month = date.slice(5, 7);
            const day = date.slice(8, 10);
            return `${year}-${month}-${day}`;
        };

        onMounted(() => {
            console.log('Route object:', route);
            console.log('Route params:', route.params);

            if (route.params && route.params.stock_request_id) {
                stock_request_id.value = route.params.stock_request_id;
                if (stock_request_id.value) {
                    get_sr_detail(stock_request_id.value);
                } else {
                    console.error('stock_request_id is null');
                }
            } else {
                console.error('route params stock_request_id is undefined');
            }
        });

        const sr_approval = async () => {
            try {
                await stock_request_approval(stock_request_id.value, store.state.loginToken);
                sr_detail.value.approval = '승인'; // 결재상태 승인으로 변경
                alert('승인되었습니다.');
            } catch (error) {
                console.error('Approval failed:', error);
                alert('승인에 실패했습니다.');
            }
        };

        const sr_reject = async () => {
            try {
                await stock_request_reject(stock_request_id.value, store.state.loginToken);
                sr_detail.value.approval = '반려'; // 결재상태를 "반려"로 업데이트
                alert('반려되었습니다.');
                // 필요한 경우 추가 작업 수행
            } catch (error) {
                console.error('Rejection failed:', error);
                alert('반려에 실패했습니다.');
            }
        };

        // 메뉴 이동
        const selectMenu = (selectMenu) => {
            console.log(selectMenu);
            switch (selectMenu) {
                case 1:
                    router.push({
                        name: 'ListShop' // 매장 리스트
                    });
                    break;
                case 2:
                    router.push({
                        name: 'ListStockRequest' // 재고요청서
                    });
                    break;
                case 3:
                    router.push({
                        name: 'ListProposal' // 건의사항
                    });
                    break;
                default:
                    break;
            }
        };

        return {
            get_sr_detail,
            selectMenu,
            sr_detail,
            stock_request_id,
            loading,
            formattedDate,
            sr_approval,
            sr_reject
        };
    }
};
</script>

<style scoped>
    /* 폰트 */
    @font-face {
    font-family: 'LINESeedKR-Bd';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/LINESeedKR-Bd.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}

div{
  font-family: 'LINESeedKR-Bd';
}
    
    /* 세로 방향 가운데 정렬 */
    td {
        vertical-align: middle;
    }
    
    /* 아이템 가운데 정렬 */
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    /* 왼쪽 정렬 */
    .text-left {
        text-align: left;
    }
    
    /* 오른쪽 정렬 */
    .text-right {
        text-align: right;
    }
    
    /* list scroll, 그림자 */
    .listDiv {
        max-height: 58vh;
        overflow-y: auto;
        box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
        margin: 1%;
    }
    
    /* 상세 */
    .detail {
        box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
        padding: 1%;
    }
    
    /* 상세 옵션들 */
    .atr {
        height: 7vh;
        max-width: 40vw;
        box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
        margin: 2%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    /* 색깔 변경 */
    .red-text {
        color: red;
    }
    .blue-text {
        color: blue;
    }
    
    /* 글자 굵기 */
    h5 {
        font-weight: bold;
    }
    
    .empty-content {
        box-shadow: 0 6px 7px rgba(79, 79, 79, 0.2);
        padding: 1%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .placeholder {
        font-size: 1.5rem;
        color: gray;
    }

    .font-weight-bold {
        font-weight: bold;
    }
</style>
