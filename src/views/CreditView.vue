<template>
  <div class="credit-view">
    <h1>Stwórz schemat swojego kredytu</h1>
    <p>Uzupełnij dany formularz by móc wygenerować schemat.</p>
    <br>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="principal">Kwota główna:</label>
        <input type="number" id="principal" v-model="principal" required />
      </div>
      
      <div class="form-group">
        <label for="interestRate">Roczna stopa procentowa (%):</label>
        <input type="number" id="interestRate" v-model="interestRate" step="0.01" required />
      </div>

      <div class="form-group">
        <label>Rodzaj rat:</label>
      </div>

      <div class="form-group radio-group">
        <div class="radio-container">
          <label>
            <input type="radio" value="annual" v-model="paymentType" checked />
            roczne
          </label>
          <label>
            <input type="radio" value="quarterly" v-model="paymentType" />
            kwartalne
          </label>
          <label>
            <input type="radio" value="monthly" v-model="paymentType" />
            miesięczne
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label for="installments">Ilość rat:</label>
        <input type="number" id="installments" v-model="installments" required />
      </div>

      <div class="form-group">
        <label>Rodzaj spłaty:</label>
      </div>

      <div class="form-group radio-group">
        <div class="radio-container">
          <label>
            <input type="radio" value="equal" v-model="paymentMethod" checked />
            równe raty
          </label>
          <label>
            <input type="radio" value="equal_capital" v-model="paymentMethod" />
            równe części kapitałowe
          </label>
        </div>
      </div>
      
      <button type="submit">Oblicz</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const principal = ref('');
const interestRate = ref('');
const installments = ref('');
const paymentType = ref('annual'); // Domyślnie zaznaczone "roczne"
const paymentMethod = ref('equal'); // Domyślnie zaznaczone "równe raty"

const submitForm = () => {
  console.log('Kwota główna:', principal.value);
  console.log('Roczna stopa procentowa:', interestRate.value);
  console.log('Rodzaj rat:', paymentType.value);
  console.log('Ilość rat:', installments.value);
  console.log('Rodzaj spłaty:', paymentMethod.value);
  // Tutaj możesz dodać logikę obliczeń lub wysłania formularza
}
</script>

<style scoped>
.credit-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f968;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
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
  gap: 40px;
}

.radio-container label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-weight: normal;
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
  background-color: #020303;
}


</style>