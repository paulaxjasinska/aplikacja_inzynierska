<template>
<div>
  <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="kwotaglowna">Kwota główna:</label> 
        <input type="number" v-model="kwotaglowna" min="0" required />
      </div>
      
      <div class="form-group">
        <label for="stopa">Nominalna stopa procentowa (%):</label>
        <input type="number" v-model="stopa" step="0.01" min="0" required />
      </div>

      <div class="form-group">
        <label>Rodzaj rat:</label>
      </div>

      <div class="form-group radio-group">
        <div class="radio-container">
          <label>
            <input type="radio" value="roczne" v-model="paymentType" checked />
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
        <input type="number" v-model="lata" min="0" required />
      </div>

      <div class="form-group">
        <label for="latas">Liczba lat, po których ma nastąpić wydłużenie okresu spłaty:</label>
        <input type="number" v-model="latas" min="0" required />
      </div>

      <div class="form-group">
        <label for="latap">Liczba przedłużonych lat:</label>
        <input type="number" v-model="latap" min="0" required />
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

const props = defineProps(["paymentMethod","kwotaglowna","lata","stopa","paymentType"])
const latap = ref(0);
const latas = ref(0);
const paymentType = ref(props.paymentType || "roczne");
const lata = ref(props.lata || 0);
const kwotaglowna = ref(props.kwotaglowna || 0);
const stopa = ref(props.stopa || 0);
const chartType = ref("bar");

const liczbarat = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return lata.value * 4;
  } else if (paymentType.value === 'miesieczne') {
    return lata.value * 12;
  }
  return lata.value;
});

const liczbaratp = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return latap.value * 4;
  } else if (paymentType.value === 'miesieczne') {
    return latap.value * 12;
  }
  return latap.value;
});

const liczbarats = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return latas.value * 4;
  } else if (paymentType.value === 'miesieczne') {
    return latas.value * 12;
  }
  return latas.value;
});

const przeliczonaStopa = computed(() => {
  if (paymentType.value === 'kwartalne') {
    return (Math.pow(1 + stopa.value / 100, 1 / 4) - 1) * 100;
  } else if (paymentType.value === 'miesieczne'){
    return (Math.pow(1 + stopa.value / 100, 1 / 12) - 1) * 100;
  }
  return stopa.value;
});

const formatowanaStopa = computed(() => {
  return przeliczonaStopa.value.toFixed(2) + '%';
});

const zostalo = computed(() => liczbarat.value - liczbarats.value + liczbaratp.value);

const rata1 = computed(() => {
  if (kwotaglowna.value === 0 || przeliczonaStopa.value === 0 || lata.value === 0 || liczbarat.value === 0) {
    return 0;
  }

  const formatowana = parseFloat(formatowanaStopa.value) / 100;
  const nawias = 1 + formatowana;
  const mianownik = Math.pow(nawias, liczbarat.value);
  const rata1 = (kwotaglowna.value * formatowana) / (1 - 1 / mianownik);

  return rata1.toFixed(2);
});

const pozostaloscKwota = computed(() => {
  let pozostalaKwota = kwotaglowna.value;
  for (let i = 1; i <= liczbarats.value; i++) {
    const czescOdsetkowa = pozostalaKwota * (parseFloat(formatowanaStopa.value) / 100);
    const czescKapitalowa = rata1.value - czescOdsetkowa;
    pozostalaKwota -= czescKapitalowa;
  }
  return pozostalaKwota.toFixed(2);
});

const rata2 = computed(() => {
  if (pozostaloscKwota.value === 0) {
    return 0;
  }

  const formatowana = parseFloat(formatowanaStopa.value) / 100;
  const nawias = 1 + formatowana;
  const mianownik = Math.pow(nawias, zostalo.value);
  const rata2 = (pozostaloscKwota.value * formatowana) / (1 - 1 / mianownik);

  return rata2.toFixed(2);
});

const raty = ref([]);

const submitForm = () => {
  raty.value = [];
  let pozostalaKwota = parseFloat(kwotaglowna.value);
  let isAfterRestructuring = false;

  for (let i = 1; i <= liczbarat.value + liczbaratp.value; i++) {
    const rata = isAfterRestructuring ? parseFloat(rata2.value) : parseFloat(rata1.value);
    const czescOdsetkowa = pozostalaKwota * (parseFloat(formatowanaStopa.value) / 100);
    const czescKapitalowa = rata - czescOdsetkowa;
    const kwotaPoSplatach = pozostalaKwota - czescKapitalowa;

    // Dodajemy ratę do tablicy
    raty.value.push({
      numer: i,
      kwotaGlowna: pozostalaKwota.toFixed(2),
      rata: rata.toFixed(2),
      czescOdsetkowa: czescOdsetkowa.toFixed(2),
      czescKapitalowa: czescKapitalowa.toFixed(2),
      kwotaPoSplatach: i === liczbarat.value + liczbaratp.value ? "0.00" : kwotaPoSplatach.toFixed(2),
      restrukturyzacja: i === liczbarats.value + 1,
      ostatni: i === liczbarat.value + liczbaratp.value
    });

    // Aktualizacja pozostałej kwoty
    pozostalaKwota = kwotaPoSplatach;

    if (i === liczbarats.value) {
      isAfterRestructuring = true;
    }
  }

  console.log('Kwota główna:', kwotaglowna.value);
  console.log('Nominalna stopa procentowa:', stopa.value);
  console.log('Formatowana stopa:', formatowanaStopa.value);
  console.log('Rodzaj rat:', paymentType.value);
  console.log('Liczba rat:', liczbarat.value);
  console.log('Liczba rat przedłużonych:', liczbaratp.value);
  console.log('Liczba rat, po których ma nastąpić zmiana:', liczbarats.value);
  console.log('Rata przed zmianą:', rata1.value);
  console.log('Pozostała kwota:', pozostaloscKwota.value);
  console.log('Rata po zmianie:', rata2.value);
  console.log('Raty:', raty.value);
};
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

  <style scoped>
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
  </style>