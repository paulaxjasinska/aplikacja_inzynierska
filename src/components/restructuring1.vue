<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="kwotaglowna">Kwota główna:</label> 
      <input type="number" v-model="kwotaglowna" />
    </div>

    <div class="form-group">
      <label for="stopa1">Początkowa nominalna stopa procentowa (%):</label>
      <input type="number" v-model="stopa1" step="0.01" />
    </div>

    <div class="form-group">
      <label for="stopa2">Zmieniona nominalna stopa procentowa (%):</label>
      <input type="number" v-model="stopa2" step="0.01" />
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
      <input type="number" v-model="lata" />
    </div>

    <div class="form-group">
      <label for="lataz">Liczba lat, po której ma się zmienić stopa procentowa:</label>
      <input type="number" v-model="lataz" />
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
      <tr v-for="rata in raty" :key="rata.numer" :class="{ 'thick-border': rata.restrukturyzacja }">
        <td>{{ rata.numer }}</td>
        <td>{{ rata.kwotaGlowna }}</td>
        <td>{{ rata.rata }}</td>
        <td>{{ rata.czescOdsetkowa }}</td>
        <td>{{ rata.czescKapitalowa }}</td>
        <td :class="{ 'green-text': rata.ostatni }">
          {{ rata.kwotaPoSplatach }}
        </td>
      </tr>
    </tbody>
  </table>
  
  <div class="charts" v-if="raty.length > 0">
    <div class="charts__types">
      <label>
        <input id="bar" type="radio" value="bar" v-model="chartType" />Wykres słupkowy
      </label>
      <label>
        <input type="radio" value="line" v-model="chartType" />Wykres liniowy
      </label>
    </div>
    <CustomLineChart :chartData v-if="chartType === 'line'" />
    <CustomChart :chartData v-if="chartType === 'bar'" />
  </div>
</template>



<script setup>
import { ref, computed, watch } from 'vue';
import CustomChart from "@/components/CustomChart.vue";
import CustomLineChart from "@/components/CustomLineChart.vue";
import { toast } from 'vue3-toastify';

const props = defineProps(["paymentMethod", "kwotaglowna", "lata", "stopa", "paymentType"]);

const paymentType = ref(props.paymentType || "roczne");
const paymentMethod = ref(props.paymentMethod || "rowner");
const lata = ref(props.lata || 0);
const lataz = ref(0);
const kwotaglowna = ref(props.kwotaglowna || 0);
const stopa1 = ref(props.stopa || 0);
const stopa2 = ref(0);
const chartType = ref("bar");

const liczbarat = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return lata.value * 4;
  } else if (paymentType.value === 'miesieczne') {
    return lata.value * 12;
  }
  return lata.value;
});

const liczbaratz = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return lataz.value * 4;
  } else if (paymentType.value === 'miesieczne') {
    return lataz.value * 12;
  }
  return lataz.value;
});

const przeliczonaStopa1 = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return (Math.pow(1 + stopa1.value / 100, 1 / 4) - 1) * 100;
  } else if (paymentType.value === 'miesieczne') {
    return (Math.pow(1 + stopa1.value / 100, 1 / 12) - 1) * 100;
  }
  return stopa1.value;
});

const formatowanaStopa1 = computed(() => {
  return przeliczonaStopa1.value.toFixed(2) + '%';
});

const przeliczonaStopa2 = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return (Math.pow(1 + stopa2.value / 100, 1 / 4) - 1) * 100;
  } else if (paymentType.value === 'miesieczne') {
    return (Math.pow(1 + stopa2.value / 100, 1 / 12) - 1) * 100;
  }
  return stopa2.value;
});

const formatowanaStopa2 = computed(() => {
  return przeliczonaStopa2.value.toFixed(2) + '%';
});

const rata1 = computed(() => {
  if (
    kwotaglowna.value === 0 ||
    formatowanaStopa1.value === 0 ||
    lata.value === 0 ||
    liczbarat.value === 0
  ) {
    return 0;
  }

  const formatowana = parseFloat(formatowanaStopa1.value) / 100;
  const nawias = 1 + formatowana;
  const mianownik = Math.pow(nawias, liczbarat.value);
  const rata1 = (kwotaglowna.value * formatowana) / (1 - 1 / mianownik);

  return rata1.toFixed(2);
});

const pozostaloscKwota = computed(() => {
  let pozostalaKwota = kwotaglowna.value;
  for (let i = 1; i <= liczbaratz.value; i++) {
    const czescOdsetkowa = pozostalaKwota * (parseFloat(formatowanaStopa1.value) / 100);
    const czescKapitalowa = paymentMethod.value === "rownek"
      ? parseFloat(kwotaglowna.value / liczbarat.value)
      : parseFloat(rata1.value) - czescOdsetkowa;
    pozostalaKwota -= czescKapitalowa;
  }
  return pozostalaKwota.toFixed(2);
});

const rata2 = computed(() => {
  if (
    kwotaglowna.value === 0 ||
    formatowanaStopa2.value === 0 ||
    lata.value === 0 ||
    liczbarat.value === 0 ||
    pozostaloscKwota.value === 0
  ) {
    return 0;
  }

  const formatowana2 = parseFloat(formatowanaStopa2.value) / 100;
  const nawias = 1 + formatowana2;
  const mianownik = Math.pow(nawias, liczbarat.value - liczbaratz.value);
  const rata2 = (pozostaloscKwota.value * formatowana2) / (1 - 1 / mianownik);

  return rata2.toFixed(2);
});

const raty = ref([]);

const submitForm = () => {

  if(!kwotaglowna.value || kwotaglowna.value <= 0) return toast.error('Kwota główna jest wymagana i musi być większa od 0.');
	if(!stopa1.value || stopa1.value <= 0) return toast.error('Nominalna stopa procentowa jest wymagana i musi być większa od 0.');
  if(!stopa2.value || stopa2.value <= 0) return toast.error('Zmieniona nominalna stopa procentowa jest wymagana i musi być większa od 0.');
	if(!lata.value || lata.value <= 0) return toast.error('Liczba lat jest wymagana i musi być większa od 0.');
  if(!lataz.value || lataz.value <= 0) return toast.error('Liczba lat, po której ma się zmienić stopa procentowa jest wymagana i musi być większa od 0.');
  if(stopa1.value == stopa2.value) return toast.error('Zmieniona nominalna stopa procentowa nie może być równa nominalnej stopie procentowej.');
  if(lataz.value > lata.value) return toast.error('Liczba lat, po których ma się zmienić stopa procentowa musi być mniejsza od liczby lat.');

  raty.value = [];
  let pozostalaKwota = parseFloat(kwotaglowna.value);
  let isAfterRestructuring = false;

  for (let i = 1; i <= liczbarat.value; i++) {
    const przeliczonaStopa = isAfterRestructuring ? przeliczonaStopa2 : przeliczonaStopa1;
    const rata = isAfterRestructuring ? rata2 : rata1;

    const czescKapitalowa = 
      paymentMethod.value === "rownek"
        ? parseFloat(kwotaglowna.value / liczbarat.value)
        : parseFloat(
            rata.value - parseFloat(pozostalaKwota * (przeliczonaStopa.value / 100))
          );

    const czescOdsetkowa = parseFloat(
      pozostalaKwota * (przeliczonaStopa.value / 100)
    );
    const kwotaPoSplatach = parseFloat(pozostalaKwota - czescKapitalowa);
    const rataWyliczona = 
      paymentMethod.value === "rownek"
        ? (czescKapitalowa + czescOdsetkowa).toFixed(2)
        : parseFloat(rata.value).toFixed(2);

    raty.value.push({
      numer: i,
      kwotaGlowna: pozostalaKwota.toFixed(2),
      rata: rataWyliczona,
      czescOdsetkowa: czescOdsetkowa.toFixed(2),
      czescKapitalowa: czescKapitalowa.toFixed(2),
      kwotaPoSplatach: i === liczbarat.value ? "0.00" : kwotaPoSplatach.toFixed(2),
      ostatni: i === liczbarat.value,
      restrukturyzacja: i === liczbaratz.value + 1
    });

    if (i === liczbaratz.value) {
      isAfterRestructuring = true;
    }

    pozostalaKwota = kwotaPoSplatach;
  }

  console.log('Kwota główna:', kwotaglowna.value);
  console.log('Nominalna stopa procentowa:', stopa1.value);
  console.log('Nominalna stopa procentowa do zmiany:', stopa2.value);
  console.log('Formatowana 1 stopa:', formatowanaStopa1.value);
  console.log('Formatowana 2 stopa:', formatowanaStopa2.value);
  console.log('Rodzaj rat:', paymentType.value);
  console.log('Liczba rat:', liczbarat.value);
  console.log('Liczba rat po zmianie:', liczbaratz.value);
  console.log('Rodzaj spłaty:', paymentMethod.value);
  console.log('Rata przed zmianą:', rata1.value);
  console.log("Pozostała kwota:", pozostaloscKwota.value);
  console.log('Rata PO zmianie:', rata2.value);
  console.log('Raty:', raty.value);
}

const chartData = computed(() => {
  return {
    labels: raty.value.map((item) => `Rata: ${item.numer}`),
    datasets: [
      {
        label: "Raty",
        backgroundColor: "#FF8C00",
        data: raty.value.map((item) => item.rata),
      },
      {
        label: "Część odsetkowa",
        backgroundColor: "#03cf77",
        data: raty.value.map((item) => item.czescOdsetkowa),
      },
      {
        label: "Część kapitałowa",
        backgroundColor: "#4169E1",
        data: raty.value.map((item) => item.czescKapitalowa),
      },
      {
        label: "Kwota Główna",
        backgroundColor: "yellow",
        data: raty.value.map((item) => item.kwotaGlowna),
      }
    ],
  };
});
</script>





  <style>
.credit-view {
  max-width: 650px;
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
  color: rgb(0, 119, 0);
  font-weight: bold;
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
		gap: 1rem;
	}
	.charts__types label {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2rem;
	}

  .tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  border-radius: 4px;
  padding: 5px;
  font-size: 0.75em;
  display: inline-block;
  z-index: 1000;
  top: 100%;
  left: 0;
  transform: translateY(5px);
}

.form-group {
  position: relative;
  margin-bottom: 15px;
}

input[type="number"]:focus ~ .tooltip {
  display: block;
}

  </style>