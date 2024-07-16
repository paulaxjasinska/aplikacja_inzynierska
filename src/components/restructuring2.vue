<script>

</script>

<template>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="principal">Kwota główna:</label> 
        <input type="number" v-model="principal" min="0" required />
      </div>
      
      <div class="form-group">
        <label for="interestRate">Nominalna stopa procentowa (%):</label>
        <input type="number" v-model="interestRate" step="0.01" min="0" required />
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
        <label for="installments">Liczba lat:</label>
        <input type="number" v-model="installments" min="0" required />
      </div>

      <div class="form-group">
        <label for="installments">Liczba przedłużonych lat:</label>
        <input type="number" v-model="installments" min="0" required />
      </div>
      
      <button type="submit">Oblicz</button>
    </form>
</template>

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
  background-color: #03aa62;
}

  </style>