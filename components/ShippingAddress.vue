<template>
    <div>
        <div class="address">
            <h2 class="flex items-center justify-between">Shipping address
                <button v-if="!loading" @click="openModalAddress" class="btn">
                    {{ Object.keys(addressData).length ? "Edit address" : "Add new address" }}
                </button>
            </h2>
            <span v-if="loading" class="skeleton-loader max-h-32"></span>
            <template v-else>
                <div v-if="Object.keys(addressData).length" class="address-content">
                    <p><span>Name: </span> {{ addressData.name }}</p>
                    <p><span>Phone: </span> {{ addressData.phone }}</p>
                    <p><span>Zipcode: </span> {{ addressData.zipCode }}</p>
                    <p><span>State: </span> {{ addressData.state }}</p>
                    <p><span>City: </span> {{ addressData.city }}</p>
                    <p><span>Neighborhood: </span> {{ addressData.neighborhood }}</p>
                    <p><span>Street name: </span> {{ addressData.streetName }}</p>
                    <p><span>Street number: </span> {{ addressData.streetNumber }}</p>
                </div>
                <div v-else>
                    <p>No address registered</p>
                </div>
            </template>
        </div>
        <AddressModal :modal="modalAddress" @close-modal="modalAddress = false" @addAddressInfo="addressSaved" />
    </div>
</template>

<script setup>
const $emit = defineEmits(["verifyAddressData"]);

const modalAddress = ref(false);

const loading = ref(true);

const addressData = ref({});

const openModalAddress = () => {
    modalAddress.value = true;
}

const addressSaved = (data) => {
    loading.value = true;
    if (data) {
        addressData.value.name = data.name;
        addressData.value.phone = data.phone;
        addressData.value.zipCode = data.zipCode;
        addressData.value.state = data.state;
        addressData.value.city = data.city;
        addressData.value.neighborhood = data.neighborhood;
        addressData.value.streetName = data.streetName;
        addressData.value.streetNumber = data.streetNumber;
        $emit("verifyAddressData", addressData.value);
    }
    loading.value = false;
}
</script>

<style scoped>
.address {
    @apply shadow-md rounded-lg bg-white flex flex-col gap-1.5 justify-between p-6;

    h2 {
        @apply text-2xl font-bold mb-4 text-primary;
    }

    .address-content {
        @apply grid grid-cols-2 gap-1;

        p {
            span {
                @apply font-bold text-lg;
            }
        }
    }
}
</style>