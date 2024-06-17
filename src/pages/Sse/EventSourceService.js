class EventSourceService {
    #eventSource;
    #store;
  
    constructor(id, store) {
      if (!this.#eventSource) {
        this.#eventSource = new EventSource(`http://localhost:8080/connect?shop_id=${id}`);
        this.#store = store;
        EventSourceService.instance = this;
        console.log("새로 생성된 EventSource", EventSourceService.instance.#eventSource);
      }
    }
  
    getEventSource() {
      console.log("기존에 생성된 EventSource", this.#eventSource);
      return this.#eventSource;
    }
  
    addESEventListener(event, callback) {
      this.#eventSource.addEventListener(event, callback);
      console.log("event source에 add listener 완료");
  
      // Vuex 추가
      this.#store.dispatch('triggerEventListener', { event });
      console.log(this.#store.state.eventListener);
    }
  
    handleNotification(event) {
      const data = JSON.parse(event.data);
      this.#store.dispatch('addNotification', `connect proposal_solution: ${JSON.stringify(data)}`);
    }
  
    restoreEventListeners() {
      console.log(this.#store);
      if (this.#store && this.#store.state.eventListener.length > 0) {
        this.#store.state.eventListener.forEach(listener => {
          if (listener.event == "proposal_solution") {
            this.#eventSource.addEventListener('proposal_solution', (e) => {
              const { data: receivedConnectData } = e;
              const data = JSON.parse(receivedConnectData);
              if (this.#store.state.loginStoreId === data.shop_id) {
                console.log('connect proposal_solution:', receivedConnectData);
                this.handleNotification(e);
              }
            });
          }
        });
      }
      console.log(`복구 완료했습니다^^ : ${this.#eventSource}`);
    }
  
    removeESEventListener(event, callback) {
      this.#eventSource.removeEventListener(event, callback);
    }
  
    closeES() {
      this.#eventSource.close();
    }
  }
  
  export default EventSourceService;
  