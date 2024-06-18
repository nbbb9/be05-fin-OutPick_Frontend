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

    restoreEventListeners() {
        console.log(EventSourceServiceOffice.instance.#store);
        if (EventSourceServiceOffice.instance.#store && EventSourceServiceOffice.instance.#store.state.eventListener.length > 0) {
            EventSourceServiceOffice.instance.#store.state.eventListener.forEach(listener => {

                console.log("복구 작업 전 : ",EventSourceServiceOffice.instance.#listener)

                if (!EventSourceServiceOffice.instance.#listener.includes("proposal_solution") && listener.event == "proposal_solution") {
                    EventSourceServiceOffice.instance.#eventSource.addEventListener('proposal_solution', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceServiceOffice.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect proposal_solution:', receivedConnectData);
                            EventSourceServiceOffice.instance.handleProposalNotification(e);
                        }
                    });
                }else if(!EventSourceServiceOffice.instance.#listener.includes("product_discount") && listener.event == "product_discount"){
                    EventSourceServiceOffice.instance.#eventSource.addEventListener('product_discount', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceServiceOffice.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect product_discount:', receivedConnectData);
                            EventSourceServiceOffice.instance.handleProductDiscountNotification(e);
                        }
                    });
                }
            });
        }
        console.log(`복구 완료했습니다^^ : ${EventSourceServiceOffice.instance.#eventSource}`);
    }

}

export default EventSourceServiceOffice;
