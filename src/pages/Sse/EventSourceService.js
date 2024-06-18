class EventSourceService {
    static instance; // 싱글톤 인스턴스를 저장하기 위한 정적 필드
    #eventSource;
    #store;
    #listeners = [];

    constructor(id, store) {
        if (!EventSourceService.instance) {
            this.#eventSource = new EventSource(`http://localhost:8080/connect?shop_id=${id}`);
            this.#store = store;
            EventSourceService.instance = this;
            console.log("새로 생성된 EventSource", EventSourceService.instance.#eventSource);
        }
    }

    getEventSource() {
        console.log("기존에 생성된 EventSource", EventSourceService.instance.#eventSource);
        return EventSourceService.instance.#eventSource;
    }

    addESEventListener(event, callback) {
        if(!EventSourceService.instance.#listeners.includes(event)){
            EventSourceService.instance.#eventSource.addEventListener(event, callback);
            console.log("event source에 add listener 완료");

            // Vuex 추가
            EventSourceService.instance.#store.dispatch('triggerEventListener', { event });
            console.log(EventSourceService.instance.#store.state.eventListener);

            // listener 배열에 추가
            EventSourceService.instance.#listeners.push(event);
        }
    }

    handleNotification(event) {
        const data = JSON.parse(event.data);
        const notificationMessage = `${data.proposal_id} 건의문의 해결방안이 작성되었습니다.`;
        EventSourceService.instance.#store.dispatch('addNotification', notificationMessage);
        EventSourceService.instance.#store.commit('setShowModal', true); // 모달 표시
    }

    restoreEventListeners() {
        console.log(EventSourceService.instance.#store);
        if (EventSourceService.instance.#store && EventSourceService.instance.#store.state.eventListener.length > 0) {
            EventSourceService.instance.#store.state.eventListener.forEach(listener => {
                console.log(EventSourceService.instance.#listeners);

                if (!EventSourceService.instance.#listeners.includes("proposal_solution") && listener.event == "proposal_solution") {
                    EventSourceService.instance.#eventSource.addEventListener('proposal_solution', (e) => {
                        const { data: receivedConnectData } = e;
                        const data = JSON.parse(receivedConnectData);
                        if (EventSourceService.instance.#store.state.loginStoreId === data.shop_id) {
                            console.log('connect proposal_solution:', receivedConnectData);
                            EventSourceService.instance.handleNotification(e);
                        }
                    });
                }
            });
        }
        console.log(`복구 완료했습니다^^ : ${EventSourceService.instance.#eventSource}`);
    }

    removeESEventListener(event, callback) {
        EventSourceService.instance.#eventSource.removeEventListener(event, callback);
    }

    closeES() {
        EventSourceService.instance.#eventSource.close();
    }
}

export default EventSourceService;
