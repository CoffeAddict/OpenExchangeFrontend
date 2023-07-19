<template>
    <div class="flex flex-col lg:flex-row h-screen ">
        <div class="lg:w-1/2 w-full h-full overflow-hidden justify-between flex flex-col">
            <Header class="pb-10"/>
            <div class="pb-20 flex flex-col align-center justify-center">
                <h1 class="text-3xl font-semibold">Login to Account</h1>
                <p class="pt-1 pb-4 text-base">Enter your credentials to access your account</p>
                <div>
                    <form
                        action=""
                        class="text-left"
                        @submit.prevent="tryLogin">
                        <label for="email" class="invisible">Email</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            class="shadow-sm block rounded-md border-0 py-1.5 px-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 w-full"
                            placeholder="Username"
                            :class="{
                                'ring-red-600': error
                            }"
                            v-model="username" />
                        <label for="password" class="invisible">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            class="shadow-sm block rounded-md border-0 py-1.5 px-3 pr-20  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 w-full"
                            placeholder="********"
                            :class="{
                                'ring-red-600': error
                            }"
                            v-model="password" />
                        <span
                            v-if="error"
                            class="mt-4 text-sm text-red-600"> These credentials are not valid. </span>
                        <div class="flex mt-5">
                            <input
                                id="checkbox"
                                name="checkbox"
                                type="checkbox"
                                class="mr-2"
                                v-model="save"/>
                            <label for="checkbox" class="block text-sm font-medium leading-6 text-gray-900">
                                Remember machine for 30 days
                            </label>
                        </div>
                        <button type="submit" class="mt-5 w-full rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
        <div class="lg:w-1/2 lg:visible w-full invisible right-size-background"/>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from "vue3-cookies"
import Header from './Home/Header.vue'
import Footer from './Home/Footer.vue'

export default {
    name: 'LoginForm',
    components: {
        Header,
        Footer
    },
    setup () {
        // Initialize
        const router = useRouter()
        const { cookies } = useCookies()
        const token = cookies.get("token")
        let username = ref('')
        let password = ref('')
        let save = ref(false)
        let error = ref(false)

        if (token) router.push('/home')

        return {username, password, router, save, error, cookies}
    },
    methods: {
        tryLogin () {
            this.error = false

            let params = new URLSearchParams()
            params.append('user', this.username)
            params.append('password', this.password)
            params.append('save', this.save)

            fetch(`${process.env.VUE_APP_API_URL}/login?${params}`, {method: 'POST'})
            .then(resp => resp.status == 200 ? resp.json() : null)
            .then(data => {
                this.cookies.set('token', data.token)
                this.router.push('/home')
            })
            .catch((err) => {
                this.error = true
                alert(err)
            })
        }
    }
}
</script>

<style scoped>
p, form {
    max-width: 400px;
    margin: 0 auto;
}

.right-size-background {
    background-image: url('~@/assets/coins.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

@media screen and (max-width: 600px) {
    p, form {
        max-width: 308px;
        margin: 0 auto;
    }
}
</style>