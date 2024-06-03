<template>
  <div>
    Login !!!
  </div>
</template>

<script>
export default {

    setup(){

      // 통신 객체가 담겨짐
      const sse = new EventSource("http://localhost:8080/connect");

      sse.addEventListener('connect', (e) => {
        const {data : receivedConnectData } = e;
        console.log('connect event data : ', receivedConnectData);
      })

      return{


      }
    }

}
</script>

<style>

</style>