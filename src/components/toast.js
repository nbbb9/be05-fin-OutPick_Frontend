import { onUnmounted, computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {

    // store
    const store = useStore();

    const test = computed( () => {
        // store에서 가져오는 변수
        // return store.state.test
    })

}