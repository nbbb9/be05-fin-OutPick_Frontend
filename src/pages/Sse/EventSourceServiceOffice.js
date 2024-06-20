class EventSourceServiceOffice {
    static instance; // 싱글톤 인스턴스를 저장하기 위한 정적 필드
    #eventSource;
    #store;
    #listener;

    constructor(id, store) {
        if (!EventSourceServiceOffice.instance) {
            this.#eventSource = new EventSource(`http://localhost:8080/connect/officesse?employee_id=${id}`);
            this.#store = store;
            this.#listener = [];
            EventSourceServiceOffice.instance = this;
            console.log("새로 생성된 EventSource", EventSourceServiceOffice.instance.#eventSource);
        }else{
            console.log("생성자 : 기존에 생성된 EventSource", EventSourceServiceOffice.instance.#eventSource);
        }
    }

    getEventSource() {
        console.log("기존에 생성된 EventSource", EventSourceServiceOffice.instance.#eventSource);
        return EventSourceServiceOffice.instance.#eventSource;
    }

    addESEventListener(event, callback) {

        if(!EventSourceServiceOffice.instance.#listener.includes(event)){
            EventSourceServiceOffice.instance.#eventSource.addEventListener(event, callback);
            console.log("event source에 add listener 완료");

            // Vuex 추가
            EventSourceServiceOffice.instance.#store.dispatch('triggerEventListener', { event });
            console.log(EventSourceServiceOffice.instance.#store.state.eventListener);

            // listener 배열에 추가
            EventSourceServiceOffice.instance.#listener.push(event);
        }
    }

    handleStockRequestNotification(event) {
        console.log("handleStockRequestNotification 실행");
        const data = JSON.parse(event.data);
        const notificationMessage = `${data.shop_id} 번 매장에서 재고요청서를 작성했습니다.`;
        EventSourceServiceOffice.instance.#store.dispatch('addNotification', notificationMessage);
        // EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    handleAddProposalNotification(event) {
        console.log("handleAddProposalNotification 실행");
        const data = JSON.parse(event.data);
        const notificationMessage = `${data.shop_id} 번 매장에서 건의문을 작성했습니다.`;
        EventSourceServiceOffice.instance.#store.dispatch('addNotification', notificationMessage);
        // EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    restoreEventListeners() {
        console.log(EventSourceServiceOffice.instance.#store);
        if (EventSourceServiceOffice.instance.#store && EventSourceServiceOffice.instance.#store.state.eventListener.length > 0) {
            EventSourceServiceOffice.instance.#store.state.eventListener.forEach(listener => {

                console.log("복구 작업 전 : ",EventSourceServiceOffice.instance.#listener)

                if (!EventSourceServiceOffice.instance.#listener.includes("add_stock_request") && listener.event == "add_stock_request") {
                    EventSourceServiceOffice.instance.#eventSource.addEventListener('add_stock_request', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceServiceOffice.instance.#store.state.loginUserId === data.employee_id) {
                            console.log('connect add_stock_request:', receivedConnectData);
                            EventSourceServiceOffice.instance.handleStockRequestNotification(e);
                        }
                    });
                }else if (!EventSourceServiceOffice.instance.#listener.includes("add_proposal") && listener.event == "add_proposal") {
                    EventSourceServiceOffice.instance.#eventSource.addEventListener('add_proposal', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceServiceOffice.instance.#store.state.loginUserId === data.employee_id) {
                            console.log('connect add_proposal:', receivedConnectData);
                            EventSourceServiceOffice.instance.handleAddProposalNotification(e);
                        }
                    });
                }
            });
        }
        console.log(`복구 완료했습니다^^ : ${EventSourceServiceOffice.instance.#eventSource}`);
    }

}

export default EventSourceServiceOffice;
