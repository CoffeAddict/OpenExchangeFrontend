<template>
    <form
        action=""
        @submit.prevent="tryLogin">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            v-model="email">
        <label for="password">Password</label>
        <input
            id="password"
            type="password"
            name="password"
            placeholder="******"
            v-model="password">
        <input
            type="checkbox"
            name="checkbox"
            id="checkbox"
            v-model="save">
        <label for="save">Remember machine for 30 days?</label>
        <button type="submit">Login</button>
    </form>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie';

export default {
    name: 'LoginForm',
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