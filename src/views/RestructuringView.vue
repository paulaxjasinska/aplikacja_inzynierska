<template>
  <div class="credit-view">
    <h1>Stwórz restrukturyzację swojego kredytu</h1>
    <p>Uzupełnij dany formularz by móc wygenerować restrukturyzację.</p>
    <br />

    <div class="form-group radio-group">
      <!-- w pętli wyświetlamy 3 radioboxy służące do wyboru, który formularz ma być pokazany -->
      <div class="radio-container">
        <div class="radio-item">
          <input
            type="radio"
            :id='1'
            :value='1'
            v-model="type"
          />
          <label :for='1' v-tooltip.top="'W danym momencie spłaty kredytu zmienisz stopę procentową.'">zmiana wysokości stopy procentowej</label>
        </div>
        <div class="radio-item">
          <input
            type="radio"
            :id='2'
            :value='2'
            v-model="type"
          />
          <label :for='2' v-tooltip.top="'W danym momencie spłaty wydłużasz swój kredyt.'">wydłużenie okresu spłaty</label>
        </div>
        <div class="radio-item">
          <input
            type="radio"
            :id='3'
            :value='3'
            v-model="type"
          />
          <label :for='3' v-tooltip.top="'W danym momencie spłaty zawieszasz raty do pewnego momentu.'">'wakacje kredytowe'</label>
        </div>
      </div>
    </div>

    <!-- pokazujemy formularz w zależności od wybranego typu -->
    <form v-if="type === 1" class="form-group">
      <restructuring1 :kwotaglowna :lata :stopa :paymentMethod :paymentType/>
      <!-- tutaj umieść pola formularza dla tego typu -->
    </form>
    <form v-if="type === 2" class="form-group">
      <restructuring2 :kwotaglowna :lata :stopa :paymentMethod :paymentType/>
      <!-- tutaj umieść pola formularza dla tego typu -->
    </form>
    <form v-if="type === 3" class="form-group">
      <restructuring3 :kwotaglowna :lata :stopa :paymentMethod :paymentType/>
      <!-- tutaj umieść pola formularza dla tego typu -->
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import restructuring1 from "../components/restructuring1.vue";
import restructuring2 from "../components/restructuring2.vue";
import restructuring3 from "../components/restructuring3.vue";
const props = defineProps(["paymentMethod","kwotaglowna","lata","stopa","paymentType"])
// domyślnie pokazujemy 1-szy formularz
const type = ref(1);

// zakładamy że są 3 typy formularzy
// const types = [
//   { id: 1, label: "zmiana wysokości stopy procentowej" },
//   { id: 2, label: "wydłużenie okresu spłaty" },
//   { id: 3, label: "'wakacje kredytowe'" },
// ];
</script>

<style scoped>
.credit-view {
  max-width: 650px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f968;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}

.credit-view h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.radio-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Adjusted gap to reduce space between radio items */
  justify-content: center;
}

.radio-item {
  display: flex;
  align-items: center;
}

.radio-item label {
  margin-left: 5px;
  font-weight: normal;
  white-space: nowrap; /* Ensure labels do not wrap */
}

.radio-item input[type="radio"] {
  margin-right: 5px;
}
</style>
