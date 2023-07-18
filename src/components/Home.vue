<template>
    <div class="home h-full md:rounded-xl flex flex-col py-3 px-5 justify-center items-center">
        <span class="uppercase text-xs">fast money</span>
        <h1 class="text-3xl md:text-7xl font-medium mt-5 md:mt-1">Currency Converter</h1>
        <p class="text-sm md:text-base mt-5 md:mt-8 mx-auto description">Convert popular currencies from around the world with updated exchange rates using our calculator.</p>
        <div class="chart-container flex flex-wrap flex-col md:flex-row  mt-12 mb-5 md:mt-5 bg-white rounded-md border-0 py-1.5 px-3 ring-1 ring-inset ring-gray-300 shadow-md">
            <div class="w-full md:w-1/2 flex items-center justify-center">
                <label for="from" class="block text-sm font-medium leading-6 text-gray-900 pt-1 mr-3">From</label>
                <div class="mt-2">
                    <select
                        id="from"
                        name="from"
                        class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                        <option
                            v-for="(currency, i) in currencies"
                            :key="i"
                            :value="i"
                            :disabled="i != 'USD'"
                            :selected="i == 'USD'">
                            {{i}} - {{ currency }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="w-full md:w-1/2 flex items-center justify-center">
                <label for="from" class="block text-sm font-medium leading-6 text-gray-900 pt-1 mr-3">To</label>
                <div class="mt-2">
                    <select
                        id="to"
                        name="to"
                        class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        v-model="selectedCurrency">
                        <option
                            v-for="(currency, i) in currencies"
                            :key="i"
                            :value="i">
                            {{i}} - {{ currency }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="w-full chart-section">
                <ApexChart
                    width="100%"
                    height="100%"
                    type="line"
                    :options="options"
                    :series="currencyData"/>
            </div>
        </div>
        <p class="text-sm mx-auto mt-3 md:mt-5">Currency calculation tools use reference exchange rates obtained from major market data sources</p>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import VueApexCharts from "vue3-apexcharts";


const apiURL = process.env.VUE_APP_API_URL
const token = Cookies.get('token')

export default {
    name: 'LoginForm',
    components: {
        ApexChart: VueApexCharts
    },
    async setup () {
        // Initialize and set default values
        const router = useRouter()
        let currencies = ref([])
        let currencyData = ref([{name: 'currency', data: []}])
        let selectedCurrency = ref('ARS')
        let loading = ref(false)

        let options = ref({
            chart: {
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            stroke: {
               curve: 'smooth',
            },
            xaxis: {
                categories: [],
                tooltip: {
                    enabled: false
                }
            },
            tooltip: {
                x: {
                    show: false
                },
                intersect: false
            }
        })

        if (!token) router.push('/login')

        return {router, currencies, currencyData, selectedCurrency, loading, options}
    },
    async mounted () {
        await this.getCurrencies()
        await this.getHistoric()
    },
    methods: {
        async getCurrencies () {
            let params = new URLSearchParams()
            params.append('token', token)

            await fetch(`${apiURL}/currencies?${params}`)
            .then(resp => resp.json())
            .then(data => this.currencies = data)
            .catch(err => alert(err))
        },
        async getHistoric () {
            this.loading = true
            const dates = this.getMonthsDates()
            let params = new URLSearchParams()
            params.append('token', token)
            params.append('dates', dates)
            params.append('symbols', this.selectedCurrency)

            await fetch(`${apiURL}/historic?${params}`)
            .then(resp => resp.json())
            .then(data => {
                this.currencyData[0].name = this.selectedCurrency
                this.currencyData[0].data = data.map(d => d.rates[this.selectedCurrency].toFixed(2))
            })
            .catch(err => alert(err))
        },
        getMonthsDates (amount) {
            if (!amount) amount = 5

            let dates = []
            let initDate = new Date()
            initDate.setDate(1)

            dates.push(this.formatDate(initDate))

            for (let i = 0; i < amount; i++) {
                let date = initDate.setMonth(initDate.getMonth() - 1)
                dates.push(this.formatDate(date))
            }

            this.options = { ...this.options, xaxis: {categories: dates.map(d => d.replace('2023-', ''))}}

            return dates
        },
        formatDate (date) {
            date = new Date(date)
            let year = date.getFullYear()
            let month = (date.getMonth()).toString().padStart(2, '0')
            let day = (date.getDate()).toString().padStart(2, '0')

            return `${year}-${month}-${day}`
        }
    },
    watch: {
        selectedCurrency (newVal, oldVal) { newVal != oldVal ? this.getHistoric() : null }
    }
}
</script>

<style scoped>
.home {
    background-color: #F8F8F8;
}

.chart-container {
    width: min(100%, 1000px);
}

p.description {
    max-width: 560px;
}

label {
    min-width: 35px;
}

.chart-section {
    height: 43vh;
}
</style>
