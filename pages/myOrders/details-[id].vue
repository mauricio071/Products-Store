<template>
    <div class="max-w-5xl mx-auto">
        <div class="card">
            Status
        </div>
        <div class="card security">
            <div class="security-content">
                <div class="item">
                    <IconsPackage />
                    <h3>Fast delivery</h3>
                </div>
                <p>Receive your orders quickly with our efficient and reliable delivery service.</p>
            </div>
            <div class="security-content">
                <div class="item">
                    <IconsShield />
                    <h3>Security & Privacy</h3>
                </div>
                <p>Your data is always protected with the highest security and privacy standards.</p>
            </div>
            <div class="security-content">
                <div class="item">
                    <IconsLock />
                    <h3>Safe Payments</h3>
                </div>
                <p>Make payments with confidence using our secure and encrypted payment system.</p>
            </div>
        </div>
        <div class="grid gap-6 mb-6 sm:grid-cols-2">
            <div class="card">
                Address
            </div>
            <div class="card">
                Order info
            </div>
        </div>
        <div class="card">
            Product
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Details - Products Store"
});
</script>

<style scoped>
.card {
    @apply mb-6 p-6;
}

.security {
    @apply flex flex-col gap-4;

    h3 {
        @apply text-lg font-bold;
    }

    .security-content {
        @apply border-b border-b-slate-200 pb-4;

        .item {
            @apply flex gap-3 items-center mb-2;
        }

        &:last-of-type {
            @apply border-none pb-0;
        }
    }
}
</style>