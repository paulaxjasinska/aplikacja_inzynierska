<script setup>

</script>


<template>
  <div class="home-view">
    <div class="content-overlay">
      <h1>Witaj w aplikacji Kredyty/Restrukturyzacja</h1>
      <p>Tutaj będziesz mógł zbudować schemat lub zrestrukturyzować swój kredyt.</p>
    </div>
  </div>
</template>

<style scoped>
/* Wygląd diva */
.home-view {
  text-align: center;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}
/* Wygląd napisu i backgroundu */
.content-overlay {
  text-align: center;
  justify-content: center;
  align-items: center;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #000000;
  min-height:calc(100vh - 90px); 
  box-sizing: border-box;
  backdrop-filter: blur(3px);
}
  
</style>