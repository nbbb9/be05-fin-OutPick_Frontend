class EventSourceService {
    static instance; // 싱글톤 인스턴스를 저장하기 위한 정적 필드
    #eventSource;
    #store;
    #listener;

    constructor(id, store) {
        if (!EventSourceService.instance) {
            this.#eventSource = new EventSource(`http://localhost:8080/connect?shop_id=${id}`);
            this.#store = store;
            this.#listener = [];
            EventSourceService.instance = this;
            console.log("새로 생성된 EventSource", EventSourceService.instance.#eventSource);
        }else{
            console.log("생성자 : 기존에 생성된 EventSource", EventSourceService.instance.#eventSource);
        }
    }

    getEventSource() {
        console.log("기존에 생성된 EventSource", EventSourceService.instance.#eventSource);
        return EventSourceService.instance.#eventSource;
    }

    addESEventListener(event, callback) {

        if(!EventSourceService.instance.#listener.includes(event)){
            EventSourceService.instance.#eventSource.addEventListener(event, callback);
            console.log("event source에 add listener 완료");

            // Vuex 추가
            EventSourceService.instance.#store.dispatch('triggerEventListener', { event });
            console.log(EventSourceService.instance.#store.state.eventListener);

            // listener 배열에 추가
            EventSourceService.instance.#listener.push(event);
        }
    }

    handleProposalNotification(event) {
        console.log("handleProposalNotification 실행");
        const data = JSON.parse(event.data);
        const notificationMessage = `${data.proposal_id} 건의문의 해결방안이 작성되었습니다.`;
        EventSourceService.instance.#store.dispatch('addNotification', notificationMessage);
        // EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    handleProductDiscountNotification(event) {
        console.log("handleProductDiscountNotification 실행");
        const data = JSON.parse(event.data);
        const notificationMessage = `상품 ${data.product_id}번의 할인율이 수정되었습니다.`;
        EventSourceService.instance.#store.dispatch('addNotification', notificationMessage);
        // EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    handleStockRequestApprovalNotification(event) {
        console.log("handleStockRequestApprovalNotification 실행");
        const data = JSON.parse(event.data);
        const notificationMessage = `${data.stock_request_id}번 재고요청서가 승인되었습니다.`;
        EventSourceService.instance.#store.dispatch('addNotification', notificationMessage);
        // EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    handleStockRequestFeedbackNotification(event) {
        console.log("handleStockRequestFeedbackNotification 실행");
        const data = JSON.parse(event.data);
        const notificationMessage = `${data.stock_request_id}번 재고요청서가 반려되었습니다.`;
        EventSourceService.instance.#store.dispatch('addNotification', notificationMessage);
        // EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    restoreEventListeners() {
        console.log(EventSourceService.instance.#store);
        if (EventSourceService.instance.#store && EventSourceService.instance.#store.state.eventListener.length > 0) {
            EventSourceService.instance.#store.state.eventListener.forEach(listener => {

                console.log("복구 작업 전 : ",EventSourceService.instance.#listener)

                if (!EventSourceService.instance.#listener.includes("proposal_solution") && listener.event == "proposal_solution") {
                    EventSourceService.instance.#eventSource.addEventListener('proposal_solution', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceService.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect proposal_solution:', receivedConnectData);
                            EventSourceService.instance.handleProposalNotification(e);
                        }
                    });
                }else if(!EventSourceService.instance.#listener.includes("product_discount") && listener.event == "product_discount"){
                    EventSourceService.instance.#eventSource.addEventListener('product_discount', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceService.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect product_discount:', receivedConnectData);
                            EventSourceService.instance.handleProductDiscountNotification(e);
                        }
                    });
                }else if(!EventSourceService.instance.#listener.includes("stock_request_approval") && listener.event == "stock_request_approval"){
                    EventSourceService.instance.#eventSource.addEventListener('stock_request_approval', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceService.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect stock_request_approval:', receivedConnectData);
                            EventSourceService.instance.handleStockRequestApprovalNotification(e);
                        }
                    });
                }else if(!EventSourceService.instance.#listener.includes("stock_request_feedback") && listener.event == "stock_request_feedback"){
                    EventSourceService.instance.#eventSource.addEventListener('stock_request_feedback', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceService.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect stock_request_feedback:', receivedConnectData);
                            EventSourceService.instance.handleStockRequestFeedbackNotification(e);
                        }
                    });
                }
            });
        }
        console.log(`복구 완료했습니다^^ : ${EventSourceService.instance.#eventSource}`);
    }

    // removeESEventListener(event, callback) {
    //     EventSourceService.instance.#eventSource.removeEventListener(event, callback);
    // }
    //
    // closeES() {
    //     EventSourceService.instance.#eventSource.close();
    // }
}

export default EventSourceService;
