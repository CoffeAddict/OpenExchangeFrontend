<template>
    <div class="flex flex-col lg:flex-row h-full">
        <div class="lg:w-1/2 w-full">
            <Header class="pb-10"/>
            <div>
                <h1>Login to Account</h1>
                <p class="pt-1 pb-4">Enter your credentials to access your account</p>
                <div>
                    <form
                        action=""
                        @submit.prevent="tryLogin">
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autocomplete="email"
                            class="block rounded-md border-0 py-1.5 px-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="example@email.com"
                            v-model="email" />
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autocomplete="current-password"
                            class="block rounded-md border-0 py-1.5 px-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="********"
                            v-model="password" />
                        <input
                            type="checkbox"
                            name="checkbox"
                            id="checkbox"
                            v-model="save">
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="lg:w-1/2 lg:visible w-full invisible">
            right-side
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie';
import Header from './Home/Header.vue'

export default {
    name: 'LoginForm',
    components: {
        Header
    },
    setup () {
        // Initialize
        const router = useRouter()
        const token = Cookies.get('token')
        let email = ref('')
        let password = ref('')
        let save = ref(false)

        if (token) router.push('/home')

        return {email, password, router, save}
    },
    methods: {
        tryLogin () {
            let params = new URLSearchParams()
            params.append('user', this.email)
            params.append('password', this.password)
            params.append('save', this.save)

            fetch(`${process.env.VUE_APP_API_URL}/login?${params}`, {method: 'POST'})
            .then(resp => resp.json())
            .then(data => {
                Cookies.set('token', data.token)
                this.router.push('/home')
            })
            .catch(err => alert(err))
        }
    }
}
</script>

<style scoped>
@media screen and (max-width: 600px) {
    p {
        max-width: 308px;
        margin: 0 auto;
    }
}
</style>