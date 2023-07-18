<template>
    <div class="home h-full md:rounded-xl flex flex-col py-3 px-5">
        <span class="uppercase text-xs">fast money</span>
        <h1 class="text-7xl font-medium mt-12">Currency Converter</h1>
        <p class="text-base mt-8 mx-auto description">Convert popular currencies from around the world with updated exchange rates using our calculator.</p>
        <div class="flex mt-5 bg-white rounded-md border-0 py-1.5 px-3 pr-20 ring-1 ring-inset ring-gray-300 shadow-sm">
            <div class="w-1/2">
                <label for="from">
                    From
                </label>
                <select name="" id="" disabled>
                    <option value="usd">usd</option>
                </select>
            </div>
            <div class="w-1/2">to</div>
        </div>
        <p class="text-sm mx-auto mt-5">Currency calculation tools use reference exchange rates obtained from major market data sources</p>
        <!-- <label for="from">From</label>
        <select name="from" id="from">
            <option
                v-for="(currency, i) in currencies"
                :key="i"
                :disabled="i != 'USD'"
                :selected="i == 'USD'"
                :value="currency">
                {{i}} - {{ currency }}
            </option>
        </select> <br>
        <label for="to">To</label>
        <select name="to" id="to" v-model="selectedCurrency">
            <option
                v-for="(currency, i) in currencies"
                :key="i"
                :value="i">
                {{i}} - {{ currency }}
            </option>
        </select>
        <div v-if="!loading">
            <p
                v-for="(data, i) in currencyData"
                :key="i">
                Rate: {{ selectedCurrency }} {{ data.rates[selectedCurrency] }}
            </p>
        </div>
        <div v-else>
            Loading...
        </div> -->
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const apiURL = process.env.VUE_APP_API_URL
const token = Cookies.get('token')

export default {
    name: 'LoginForm',
    async setup () {
        // Initialize and set default values
        const router = useRouter()
        let currencies = ref([])
        let currencyData = ref(null)
        let selectedCurrency = ref('ARS')
        let loading = ref(false)

        if (!token) router.push('/login')

        return {router, currencies, currencyData, selectedCurrency, loading}
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
            .then(data => {this.currencyData = data; this.loading = false})
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

p.description {
    max-width: 560px;
}
</style>
