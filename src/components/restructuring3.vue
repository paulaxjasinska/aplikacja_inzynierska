<template>
  <div>
    <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="kwotaglowna" >Kwota główna:</label>
          <input type="number" v-model.number="kwotaglowna" placeholder="300000"/>
        </div>
  
        <div class="form-group">
          <label for="stopa">Nominalna stopa procentowa (%):</label>
          <input
            type="number"
            v-model.number="stopa"
            step="0.01"
          />
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
          <input type="number" v-model.number="lata" />
        </div>
  
        <div class="form-group">
          <label for="odr">Rata, od której mają zacząć się 'wakacje kredytowe':</label>
          <input type="number" v-model.number="odr" />
        </div>
  
        <div class="form-group">
          <label for="dor">Rata, do której mają skończyć się 'wakacje kredytowe':</label>
          <input type="number" v-model.number="dor" />
        </div>
  
        <button type="submit">Oblicz</button>
      </form>
  
      <table v-if="raty.length > 0">
        <thead>
          <tr>
            <th>Numer raty</th>
            <th>Kwota główna</th>
            <th>Rata</th>
            <th>Część odsetkowa</th>
            <th>Część kapitałowa</th>
            <th>Kwota główna po zapłaceniu raty</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="rata in raty"
            :key="rata.numer"
            :class="{ 'pause-row': rata.pause, 'additional-row': rata.additional }"
          >
            <td>{{ rata.numer }}</td>
            <td>{{ rata.kwotaGlowna }}</td>
            <td>{{ rata.rata }}</td>
            <td>{{ rata.czescOdsetkowa }}</td>
            <td>{{ rata.czescKapitalowa }}</td>
            <td 
        :class="{ 'green-text': index === raty.length - 1 }"
      >
        {{ index === raty.length - 1 ? '0.00' : rata.kwotaPoSplatach }}
      </td>
          </tr>
        </tbody>
      </table>
      <div class="charts" v-if="raty.length > 0">
        <div class="charts__types">
          <label>
            <input id="bar" type="radio" value="bar" v-model="chartType" />Wykres
            słupkowy
          </label>
          <label>
            <input type="radio" value="line" v-model="chartType" />Wykres
            liniowy</label
          >
        </div>
        <CustomLineChart :chartData v-if="chartType === 'line'" />
        <CustomChart :chartData v-if="chartType === 'bar'" />
      </div>
  </div>
  </template>
  
  
  <script setup>
import { ref, computed } from 'vue';
import CustomChart from "@/components/CustomChart.vue";
import CustomLineChart from "@/components/CustomLineChart.vue";
import { toast } from 'vue3-toastify';

const props = defineProps(["paymentMethod", "kwotaglowna", "lata", "stopa", "paymentType"]);

// Reaktywne zmienne dla formularza
const paymentType = ref(props.paymentType || "roczne");
const lata = ref(props.lata || 0);
const kwotaglowna = ref(props.kwotaglowna || 0);
const stopa = ref(props.stopa || 0);
const odr = ref(0);
const dor = ref(0);
const chartType = ref("bar");

// Obliczenia liczby rat
const liczbarat = computed(() => {
  if (paymentType.value === 'kwartalne') return lata.value * 4;
  if (paymentType.value === 'miesieczne') return lata.value * 12;
  return lata.value;
});

// Przeliczenie nominalnej stopy procentowej
const przeliczonaStopa = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return (Math.pow(1 + stopa.value / 100, 1 / 4) - 1) * 100 || 0;
  }
  if (paymentType.value === 'miesieczne') {
    return (Math.pow(1 + stopa.value / 100, 1 / 12) - 1) * 100 || 0;
  }
  return stopa.value || 0;
});


// Formatowanie stopy procentowej
const formatowanaStopa = computed(() => {
  const stopaNum = parseFloat(przeliczonaStopa.value); // Upewniamy się, że to liczba
  return isNaN(stopaNum) ? '0.00%' : stopaNum.toFixed(2) + '%';
});

// Obliczanie raty
const rata = computed(() => {
  if (
    kwotaglowna.value === 0 ||
    przeliczonaStopa.value === 0 ||
    lata.value === 0 ||
    liczbarat.value === 0
  ) {
    return 0;
  }
  const formatowana = parseFloat(przeliczonaStopa.value) / 100;
  const mianownik = Math.pow(1 + formatowana, liczbarat.value);
  return ((kwotaglowna.value * formatowana) / (1 - 1 / mianownik)).toFixed(2);
});

// Tablica rat
const raty = ref([]);

// Obliczanie raty
const submitForm = () => {
  if (!kwotaglowna.value || kwotaglowna.value <= 0)
    return toast.error('Kwota główna jest wymagana i musi być większa od 0.');
  if (!stopa.value || stopa.value <= 0)
    return toast.error('Nominalna stopa procentowa jest wymagana i musi być większa od 0.');
  if (!lata.value || lata.value <= 0)
    return toast.error('Liczba lat jest wymagana i musi być większa od 0.');
  if (!odr.value || odr.value <= 0)
    return toast.error('Rata, od której mają się zacząć wakacje kredytowe jest wymagana i musi być większa od 0.');
  if (!dor.value || dor.value <= 0)
    return toast.error('Rata, do której mają się skończyć wakacje kredytowe jest wymagana i musi być większa od 0.');
  if (odr.value > dor.value)
    return toast.error(
      'Rata, od której mają się zacząć wakacje kredytowe musi być mniejsza od raty kończącej wakacje kredytowe.'
    );
  if (dor.value > liczbarat.value)
    return toast.error('Rata, do której mają się skończyć wakacje kredytowe musi być mniejsza od liczby rat kredytu.');
  if (odr.value > liczbarat.value && dor.value > liczbarat.value)
    return toast.error(
      'Raty dotyczące wakacji kredytowych muszą być mniejsze od wartości rat kredytu.'
    );

  raty.value = [];
  let pozostalaKwota = parseFloat(kwotaglowna.value);
  const tymczasoweRaty = [];
  const wartosciDoDodania = [];

  for (let i = 1; i <= liczbarat.value; i++) {
    let rataWyliczona = parseFloat(rata.value);
    let czescOdsetkowa = pozostalaKwota * (parseFloat(przeliczonaStopa.value) / 100);
    let czescKapitalowa = rataWyliczona - czescOdsetkowa;
    let kwotaPoSplatach = pozostalaKwota - czescKapitalowa;

    let kwotaGlowna = i < odr.value || i > dor.value ? pozostalaKwota.toFixed(2) : '-';
    let rataValue = i < odr.value || i > dor.value ? rataWyliczona.toFixed(2) : '-';
    let czescOdsetkowaValue = i < odr.value || i > dor.value ? czescOdsetkowa.toFixed(2) : '-';
    let czescKapitalowaValue = i < odr.value || i > dor.value ? czescKapitalowa.toFixed(2) : '-';
    let kwotaPoSplatachValue =
      i === liczbarat.value
        ? '0.00'
        : i < odr.value || i > dor.value
        ? kwotaPoSplatach.toFixed(2)
        : '-';

  tymczasoweRaty.push({
  numer: i,
  kwotaGlowna,
  rata: rataValue,
  czescOdsetkowa: czescOdsetkowaValue,
  czescKapitalowa: czescKapitalowaValue,
  kwotaPoSplatach: i === liczbarat.value ? "0,00" : kwotaPoSplatachValue, // Wartość 0,00 dla ostatniej raty
  ostatni: i === liczbarat.value, // Oznaczenie ostatniego wiersza
  pause: i >= odr.value && i <= dor.value,
  additional: kwotaGlowna === '-'
});


    if (kwotaGlowna === '-') {
      wartosciDoDodania.push({
        numer: i,
        rata: rataWyliczona.toFixed(2),
        czescOdsetkowa: czescOdsetkowa.toFixed(2),
        czescKapitalowa: czescKapitalowa.toFixed(2),
        additional: true, // Wskazanie, że jest to dodatkowy wiersz
      });
    }

    pozostalaKwota = kwotaPoSplatach;
  }

  wartosciDoDodania.forEach((rata) => {
    tymczasoweRaty.push({
      ...rata,
      pause: false, // Wartości te nie będą miały oznaczenia wakacji kredytowych
    });
  });

  raty.value = tymczasoweRaty;
};
const chartData = computed(() => {
  return {
    labels: raty.value.map((item) => `Rata: ${item.numer}`),
    datasets: [
      {
        label: 'Raty',
        backgroundColor: '#FF8C00',
        data: raty.value.map((item) => item.rata),
      },
      {
        label: 'Część odsetkowa',
        backgroundColor: '#03cf77',
        data: raty.value.map((item) => item.czescOdsetkowa),
      },
      {
        label: 'Część kapitałowa',
        backgroundColor: '#4169E1',
        data: raty.value.map((item) => item.czescKapitalowa),
      },
      {
        label: 'Kwota Główna',
        backgroundColor: 'yellow',
        data: raty.value.map((item) => item.kwotaGlowna),
      },
    ],
  };
});
</script>



<style scoped>
.credit-view {
  max-width: 650px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #02b766;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

th {
  font-weight: bold;
}

.green-text {
  color: rgb(0, 119, 0); /* Zielony kolor */
  font-weight: bold; /* Pogrubienie */
}

.thick-border {
  border-top: 4px solid #03cf77;
}

.charts {
  margin-top: 1rem;
}

.charts__types {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.charts__types label {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
}

.table-container {
  margin: 20px 0;
}

.pause-row {
  background-color: #f0f0f0;
}

.additional-row {
  background-color: #e0f7e0;
}

</style>



