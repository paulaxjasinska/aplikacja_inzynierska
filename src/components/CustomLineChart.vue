<template>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup>
    import { Line } from "vue-chartjs";
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    } from "chart.js";
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    defineProps({
        chartOptions: { type: Object, default: {} },
        chartData: {
            type: Object,
            default: {
                labels: ["January", "February", "March"],
                datasets: [
                    {
                        label: "Data One",
                        backgroundColor: "#f87979",
                        data: [40, 20, 12],
                    },
                ],
            },
        },
    });
</script>