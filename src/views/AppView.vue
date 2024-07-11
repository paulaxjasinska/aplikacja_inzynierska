<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="nav-container">
        <nav class="naglowek">
          <RouterLink to="/" class="nav-link">Strona Główna</RouterLink>
          <RouterLink to="/credit" class="nav-link">Schemat kredytu</RouterLink>
          <RouterLink to="/restructuring" class="nav-link">Restrukturyzacja</RouterLink>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer container-fluid bg-light fixed-bottom text-center pt-2">
      <div class="row text-center pt-2">
        <p class="text-dark">Aplikacja Kredyty/Restrukturyzacja</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #03cf77;
  color: #333;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height:calc(100vh - 90px); 
}

/* Wygląd nagłówka */
.header {
  background-color: #03cf77;
  color: #fff;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 50px;
}

.nav-container {
  display: flex;
}

.naglowek {
  display: flex;
}

/* Wygląd linków w nagłówku */
.nav-link {
  color: #000000;
  font-size: large;
  text-decoration: none;
  margin-right: 20px;
  transition: color 0.3s ease;
}

/* Podświetlanie linków w nagłówku */
.nav-link:hover {
  color: #ddd;
}

/* Stylizacja obrazka */
.main-content {
  background-image: url('D:\Studia\praca inżynierska\aplikacja\aplikacja\src\assets\images\money.jpg');
  width: 100%;
  min-height:calc(100vh - 90px); 
  background-size: cover;
  z-index: -1;
  flex: 1;
  background-color: #ffffff5f;

  
}

/* Stylizacja stopki */
.footer {
  background-color: #03cf77;
  color: #333;
  text-align: center;
  padding: 5px 0;
  height: 40px;
  width: 100%;
  margin-top: auto;
}

</style>


