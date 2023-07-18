<template>
    <div class="p-4 flex justify-between md:justify-around footer">
        <p class="text">©{{ year }}</p>
        <a class="text" href="https://arodriguez.vercel.app/" target="_blank">Made by Cafecito</a>
    </div>
</template>

<script>
export default {
    setup () {
        const year = new Date().getFullYear()
        return {year}
    }
}
</script>

<style scoped>
#app .text {
    color: #4F4D55;
    font-size: 0.875em;
}
</style>