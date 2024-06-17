class EventSourceService {
    #eventSource;
    #store;
    
    constructor(id, store) {

        if (!this.#eventSource) {
            this.#eventSource = new EventSource(`http://localhost:8080/connect?shop_id=${id}`);
            this.#store = store
            EventSourceService.instance = this;
            console.log("새로 생성된 EventSoource" ,EventSourceService.instance.#eventSource )

            // this.restoreEventListeners(EventSourceService.instance.#store);
        }
        // else{
        //     EventSourceService.instance.#store = store;       
        // }
        
    }

    getEventSource(){
        console.log("기존에 생성된 EventSource",this.#eventSource) 
        return this.#eventSource
    }

    addESEventListener(event, callback) {
        this.#eventSource.addEventListener(event, callback);
        console.log("event source에 add listener 완료");
        
        // vuex 추가
        this.#store.dispatch('triggerEventListener', {event});
        console.log(this.#store.state.eventListener);
    }

    restoreEventListeners(){
        console.log(this.#store)
        if (this.#store && this.#store.state.eventListener.length > 0) {
            console.log("test :",this.#store.state.eventListener);
            this.#store.state.eventListener.forEach(listener => {

                if(listener.event == "proposal_solution"){
                    this.#eventSource.addEventListener('proposal_solution', (e) => {
                        const { data: receivedConnectData } = e;
                
                        console.log("shop id 비교 전 데이터 검증 : ", receivedConnectData)
                        const data = JSON.parse(receivedConnectData);
                        console.log("shop_id : " ,data.shop_id);
                
                        if(this.#store.state.loginStoreId === data.shop_id){
                            console.log('connect proposal_solution:', receivedConnectData);
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