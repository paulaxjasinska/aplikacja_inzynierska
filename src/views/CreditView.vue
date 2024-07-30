<template>
	<div class="credit-view">
		<h1>Stwórz schemat swojego kredytu</h1>
		<p>Uzupełnij dany formularz by móc wygenerować schemat.</p>
		<br />

		<form @submit.prevent="submitForm">
			<div class="form-group">
				<label for="kwotaglowna">Kwota główna:</label>
				<input type="number" v-model.number="kwotaglowna" min="0" required />
			</div>

			<div class="form-group">
				<label for="stopa">Nominalna stopa procentowa (%):</label>
				<input
					type="number"
					v-model.number="stopa"
					step="0.01"
					min="0"
					required
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
				<tr v-for="rata in raty" :key="rata.numer">
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
		<RouterLink
			v-if="showRestructureLink"
			:to="{
				name: 'restructuring',
				query: {
					paymentType: paymentType,
					paymentMethod: paymentMethod,
					lata: lata,
					kwotaglowna: kwotaglowna,
					stopa: stopa,
				},
			}"
			class="restructure-link"
		>
			Zrestrukturuj kredyt
		</RouterLink>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import CustomChart from "@/components/CustomChart.vue";
	import CustomLineChart from "@/components/CustomLineChart.vue";

	const paymentType = ref("roczne"); // Domyślnie zaznaczone "roczne"
	const paymentMethod = ref("rowner"); // Domyślnie zaznaczone "równe raty"
	const lata = ref(0);
	const kwotaglowna = ref(0);
	const stopa = ref(0);
	const chartType = ref("bar");
	const showRestructureLink = ref(false);

	// liczymy ilość rat w zależności od rodzaju rat
	const liczbarat = computed(() => {
		if (paymentType.value === "kwartalne") {
			return lata.value * 4;
		} else if (paymentType.value === "miesieczne") {
			return lata.value * 12;
		}
		return lata.value;
	});

	// liczymy stopy w zależności od rodzaju rat
	const przeliczonaStopa = computed(() => {
		if (paymentType.value === "kwartalne") {
			return (Math.pow(1 + stopa.value / 100, 1 / 4) - 1) * 100;
		} else if (paymentType.value === "miesieczne") {
			return (Math.pow(1 + stopa.value / 100, 1 / 12) - 1) * 100;
		}
		return stopa.value;
	});

	// formatujemy stopę procentową do obliczeń
	const formatowanaStopa = computed(() => {
		return przeliczonaStopa.value.toFixed(2) + "%";
	});

	// Obliczenie raty kredytu
	const rata = computed(() => {
		if (
			kwotaglowna.value === 0 ||
			formatowanaStopa.value === 0 ||
			lata.value === 0 ||
			liczbarat.value === 0
		) {
			return 0;
		}

		const formatowana = parseFloat(formatowanaStopa.value) / 100; // Konwersja na liczbę zmiennoprzecinkową i przeliczenie na ułamek dziesiętny
		const nawias = 1 + formatowana;
		const mianownik = Math.pow(nawias, liczbarat.value);
		const rata = (kwotaglowna.value * formatowana) / (1 - 1 / mianownik);

		return rata.toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
	});

	// tworzenie schematu spłaty kredytu

	const raty = ref([]);

	const submitForm = () => {
		raty.value = [];
		let pozostalaKwota = parseFloat(kwotaglowna.value);

		for (let i = 1; i <= liczbarat.value; i++) {
			const czescKapitalowa =
				paymentMethod.value === "rownek"
					? parseFloat(kwotaglowna.value / liczbarat.value)
					: parseFloat(
							rata.value -
								parseFloat(pozostalaKwota * (przeliczonaStopa.value / 100))
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
				kwotaPoSplatach:
					i === liczbarat.value ? "0.00" : kwotaPoSplatach.toFixed(2),
				ostatni: i === liczbarat.value,
			});

			pozostalaKwota = kwotaPoSplatach;
		}

		showRestructureLink.value = true;

		console.log("Kwota główna:", kwotaglowna.value);
		console.log("Nominalna stopa procentowa:", stopa.value);
		console.log("Przeliczona stopa:", przeliczonaStopa.value.toFixed(2));
		console.log("Rodzaj rat:", paymentType.value);
		console.log("Liczba lat:", lata.value);
		console.log("Liczba rat:", liczbarat.value);
		console.log("Rata:", rata.value);
		console.log("Rodzaj spłaty:", paymentMethod.value);
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

	.restructure-link {
		display: block;
		width: 100%;
		padding: 10px;
		background-color: #03cf77;
		color: #fff;
		text-align: center;
		text-decoration: none;
		border-radius: 4px;
		margin-top: 20px;
	}

	.restructure-link:hover {
		background-color: #03aa62;
	}
</style>
