<template>
    <div class="home">
        <h1>Currency Converter</h1>
        <Suspense>
            <Home/>
            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<script>
import Home from '@/components/Home.vue'
export default {
    name: 'LoginForm',
    components: {
        Home
    }
}
</script>