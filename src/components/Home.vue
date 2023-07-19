<template>
    <div class="home bg-white h-full md:rounded-xl flex flex-col py-3 px-5 justify-center items-center">
        <span class="uppercase text-xs">fast money</span>
        <h1 class="text-3xl md:text-7xl font-medium mt-5 md:mt-1">Currency Converter</h1>
        <p class="text-sm md:text-base mt-5 md:mt-8 mx-auto description">Convert popular currencies from around the world with updated exchange rates using our calculator.</p>
        <div class="chart-container flex flex-wrap flex-col md:flex-row mb-5 mt-5 bg-white rounded-md border-0 py-1.5 px-3 ring-1 ring-inset ring-gray-300 shadow-md">
            <div
                v-if="!loading"
                class="w-full md:w-1/2 flex items-center justify-center">
                <label for="from" class="block text-sm font-medium leading-6 text-gray-900 pt-1 ml-3 mr-2">From</label>
                <div class="mt-2">
                    <select id="from" name="from" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option
                            v-for="(currency, i) in onlyUSD"
                            :key="i"
                            :value="i"
                            :disabled="i != 'USD'"
                            :selected="i == 'USD'">
                            {{i}} - {{ currency }}
                        </option>
                    </select>
                </div>
                <div class="mt-2 w-3/4 pr-3">
                    <input
                        id="amount-from"
                        name="amount-from"
                        type="number"
                        placeholder="Amount"
                        class="ml-3 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        v-model="fromAmount"
                        @change="updateExchangeValues('from')"/>
                </div>
            </div>
            <div
                v-if="!loading"
                class="w-full md:w-1/2 flex items-center justify-center">
                <label for="from" class="block text-sm font-medium leading-6 text-gray-900 pt-1 ml-3 mr-2">To</label>
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
                <div class="mt-2 w-3/4 pr-3">
                    <input
                        id="amount-to"
                        name="amount-to"
                        type="number"
                        placeholder="Amount"
                        class="ml-3 mr-0 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        v-model="toAmount"
                        @change="updateExchangeValues('to')"/>
                </div>
            </div>
            <div
                v-if="!loading"
                class="w-full chart-section">
                <ApexChart
                    width="100%"
                    height="100%"
                    type="line"
                    :options="options"
                    :series="currencyData"/>
            </div>
            <div
                v-if="loading"
                class="w-full loading-section flex items-center justify-center">
                <span class="loading-circle animate-spin mr-3"></span>
                Loading
            </div>
        </div>
        <p class="text-sm mx-auto mt-3 md:mt-5">Currency calculation tools use reference exchange rates obtained from major market data sources</p>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from "vue3-cookies"
import VueApexCharts from "vue3-apexcharts"


const apiURL = process.env.VUE_APP_API_URL

export default {
    name: 'LoginForm',
    components: {
        ApexChart: VueApexCharts
    },
    async setup () {
        // Initialize and set default values
        const router = useRouter()
        const { cookies } = useCookies()
        const token = cookies.get("token")
        let currencies = ref([])
        let currencyData = ref([{name: 'currency', data: []}])
        let selectedCurrency = ref('ARS')
        let loading = ref(false)
        let fromAmount = ref(1)
        let toAmount = ref(1)

        let options = ref({ // Chart Options
            chart: {toolbar: {show: false},zoom: {enabled: false}},
            stroke: {curve: 'smooth'},
            xaxis: {categories: [],tooltip: {enabled: false},labels: {style: {colors: ['#9499A5','#9499A5','#9499A5','#9499A5','#9499A5','#9499A5']}}},
            yaxis: {labels: {style: {colors: ['#9499A5']},formatter: (value)=> value.toFixed(2)}},
            tooltip: {x: {show: false},intersect: false, custom: ({series, seriesIndex, dataPointIndex}) => `<div class="p-2"><span class="font-bold">${selectedCurrency.value}</span> ${series[seriesIndex][dataPointIndex].toFixed(2)}</div>`}
        })

        return {cookies, router, token, currencies, currencyData, selectedCurrency, loading, options, fromAmount, toAmount}
    },
    async mounted () {
        if (!this.token) this.router.push('/login')

        await this.getCurrencies()
        await this.getHistoric()
    },
    methods: {
        async getCurrencies () {
            this.loading = true

            let params = new URLSearchParams()
            params.append('token', this.token)

            await fetch(`${apiURL}/currencies?${params}`)
            .then(resp => resp.json())
            .then(data => {this.currencies = data; this.loading = false})
            .catch(err => {
                if (err.message == 401 || err.message == 403) this.router.push('/login')
                alert(err)
                this.loading = false
            })
        },
        async getHistoric () {
            this.loading = true

            const dates = this.getMonthsDates()

            let params = new URLSearchParams()
            params.append('token', this.token)
            params.append('dates', dates)
            params.append('symbols', this.selectedCurrency)

            await fetch(`${apiURL}/historic?${params}`)
            .then(resp => resp.json())
            .then(data => {
                if (Array.isArray(data)) {
                    this.currencyData[0].name = this.selectedCurrency
                    this.currencyData[0].data = data.map(d => d.rates[this.selectedCurrency]).reverse()
                    this.updateExchangeValues('from')
                }
                this.loading = false
            })
            .catch(err =>{
                if (err.message == 401 || err.message == 403) this.router.push('/login')
                alert(err)
                this.loading = false
            })
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

            this.options = { ...this.options, xaxis: {categories: dates.map(d => d.replace('2023-', '').replace('-', '/')).reverse()}}

            return dates
        },
        formatDate (date) {
            date = new Date(date)
            let year = date.getFullYear()
            let month = (date.getMonth()).toString().padStart(2, '0')
            let day = (date.getDate()).toString().padStart(2, '0')

            return `${year}-${month}-${day}`
        },
        updateExchangeValues (type) {
            const cData = this.currencyData[0].data
            if (type == 'from') this.toAmount = (this.fromAmount * cData[cData.length - 1]).toFixed(4)
            if (type == 'to') this.fromAmount = (this.toAmount / cData[cData.length - 1]).toFixed(4)
        }
    },
    watch: {
        selectedCurrency (newVal, oldVal) { newVal != oldVal ? this.getHistoric() : null }
    },
    computed: {
        onlyUSD () {
            return Object.fromEntries(Object.entries(this.currencies).filter(([key]) => key.includes('USD')));
        }
    }
}
</script>

<style scoped>
.home {
    background-color: #f1f1f1;
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

.chart-section, .loading-section {
    height: 43vh;
}

.loading-section {
    color: #c0c0c0;
}

.loading-circle {
    min-width: 30px;
    min-height: 30px;
    border: 3px solid #c0c0c0;
    border-radius: 50%; ;
    position: relative;
}

.loading-circle:before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    top: -7.5px;
    left: -7.5px;
    background: #fff;
}
</style>
