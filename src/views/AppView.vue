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
          <RouterLink to="/restructuring1" class="nav-link">Restrukturyzacja</RouterLink>
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
  min-height: 100vh; 
}

.header {
  background-color: #03cf77;
  color: #fff;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
}

.naglowek {
  display: flex;
}

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
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  z-index: -1;
  flex: 1;
  padding: 20px;
  background-color: #ffffff5f;
  
}

/* Stylizacja stopki */
.footer {
  background-color: #03cf77;
  color: #333;
  text-align: center;
  padding: 5px 0;
  width: 100%;
  margin-top: auto;
}

</style>


