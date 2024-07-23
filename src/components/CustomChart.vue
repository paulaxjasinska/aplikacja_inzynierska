<template>
     <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>
  
<script setup>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
    defineProps({
        chartOptions:{type:Object, default:{}},
        chartData:{type:Object, default:{
        labels: [ 'January', 'February', 'March'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20, 12]
          }
        ]}},
    })
</script>