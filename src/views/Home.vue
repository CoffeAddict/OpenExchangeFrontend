<template>
    <div class="bg-white md:p-5 max-h-full h-full">
        <Suspense>
            <Home/>
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