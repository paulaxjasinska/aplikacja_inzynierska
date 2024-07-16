<template>
  <div class="credit-view">
    <h1>Stwórz schemat swojego kredytu</h1>
    <p>Uzupełnij dany formularz by móc wygenerować schemat.</p>
    <br>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="kwotaglowna">Kwota główna:</label>
        <input type="number" v-model.number="kwotaglowna" min="0" required />
      </div>
      
      <div class="form-group">
        <label for="stopa">Nominalna stopa procentowa (%):</label>
        <input type="number" v-model.number="stopa" step="0.01" min="0" required />
      </div>

      <div class="form-group">
        <label>Rodzaj rat:</label>
      </div>

      <div class="form-group radio-group">
        <div class="radio-container">
          <label>
            <input type="radio" value="roczne" v-model="paymentType" />
            roczne
          </label>
          <label>
            <input type="radio" value="kwartalne" v-model="paymentType" />
            kwartalne
          </label>
          <label>
            <input type="radio" value="miesieczne" v-model="paymentType" />
            miesięczne
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label for="lata">Liczba lat:</label>
        <input type="number" v-model.number="lata" min="0" required />
      </div>

      <div class="form-group">
        <label>Rodzaj spłaty:</label>
      </div>

      <div class="form-group radio-group">
        <div class="radio-container">
          <label>
            <input type="radio" value="rowner" v-model="paymentMethod" />
            równe raty
          </label>
          <label>
            <input type="radio" value="rownek" v-model="paymentMethod" />
            równe części kapitałowe
          </label>
        </div>
      </div>
      
      <button type="submit">Oblicz</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const paymentType = ref('roczne'); // Domyślnie zaznaczone "roczne"
const paymentMethod = ref('rowner'); // Domyślnie zaznaczone "równe raty"
const lata = ref(0);
const kwotaglowna = ref(0);
const stopa = ref(0);

// liczymy ilość rat w zależności od rodzaju rat
const liczbarat = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return lata.value * 4;
  } else if (paymentType.value === 'miesieczne') {
    return lata.value * 12;
  }
  return lata.value;
});

// liczymy stopy w zależności od rodzaju rat
const przeliczonaStopa = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return (Math.pow(1 + stopa.value / 100, 1 / 4) - 1) * 100;
  } else if (paymentType.value === 'miesieczne'){
    return (Math.pow(1 + stopa.value / 100, 1 / 12) - 1)*100
  }
  return stopa.value
  });

// formatujemy stopę procentową do obliczeń
const formatowanaStopa = computed(() => {
  return przeliczonaStopa.value.toFixed(2) + '%';
});

// Obliczenie raty kredytu
const rata = computed(() => {
  if (kwotaglowna.value === 0 || formatowanaStopa.value === 0 || lata.value === 0 || liczbarat.value === 0) {
    return 0;
  }

  const formatowana = parseFloat(formatowanaStopa.value) / 100; // Konwersja na liczbę zmiennoprzecinkową i przeliczenie na ułamek dziesiętny
  const nawias = 1 + formatowana;
  const mianownik = Math.pow(nawias, liczbarat.value);
  const rata = (kwotaglowna.value * formatowana) /(1 - (1 / mianownik));
  
  return rata.toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
});

// Funkcja do obsługi przesyłania formularza
const submitForm = () => {
  console.log('Kwota główna:', kwotaglowna.value);
  console.log('Nominalna stopa procentowa:', stopa.value);
  console.log('Przeliczona stopa:', parseFloat(formatowanaStopa.value).toFixed(2)); // Konwersja na liczbę i zaokrąglenie do dwóch miejsc po przecinku
  console.log('Rodzaj rat:', paymentType.value);
  console.log('Liczba lat:', lata.value);
  console.log('Liczba rat:', liczbarat.value);
  console.log('Rata:', rata.value);
  console.log('Rodzaj spłaty:', paymentMethod.value);
};

</script>

<style scoped>
.credit-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f968;
  border-radius: 8px;
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
}

.radio-container {
  display: flex;
  gap: 20px; /* Zmniejszenie przerwy między przyciskami */
}

.radio-container label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-weight: normal;
  margin-left: 5px;
}

.radio-container input[type="radio"] {
  margin-right: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #03cf77;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #03aa62;
}
</style>
