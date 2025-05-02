<template>
    <div>
        <Modal :isVisible="modal" @close="closeModal">
            <div class="flex flex-col gap-2 items-center justify-between sm:gap-4 lg:w-[50rem] lg:-mb-4 xl:w-[60rem]">
                <h3 class="text-2xl font-bold text-center">Shipping address</h3>
                <Form :validation-schema="schema" @submit="onSubmit" class="w-full text-center">
                    <div v-if="creditCard" class="input-container mb-4">
                        <label>Credit card</label>
                        <div class="flex items-center gap-4">
                            <span class="text-gray-800">
                                {{ formattedCreditcard(creditCard.cardNumber) }}
                            </span>
                            <p @click="removeCreditCard" class="underline text-red-500 cursor-pointer">Remove</p>
                        </div>
                    </div>
                    <div class="grid gap-2 w-full border-b border-b-gray-300 pb-8 mb-4 sm:gap-8 sm:grid-cols-2">
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>Name*</label>
                                <Field v-model="addressData.name" name="name" type="text" placeholder="Name" />
                            </div>
                            <ErrorMessage name="name" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>Phone number*</label>
                                <Field v-model="addressData.phone" name="phone"
                                    v-mask="['(##) #####-####', '(##) ####-####']" type="text" placeholder="Phone" />
                            </div>
                            <ErrorMessage name="phone" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>ZIP code*</label>
                                <Field v-model="addressData.zipCode" name="zipCode" v-mask="'#####-###'" type="text"
                                    placeholder="ZIP code" />
                            </div>
                            <ErrorMessage name="zipCode" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>State*</label>
                                <Field v-model="addressData.state" name="state" type="text" placeholder="State"
                                    disabled />
                            </div>
                            <ErrorMessage name="state" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>City*</label>
                                <Field v-model="addressData.city" name="city" type="text" placeholder="City" disabled />
                            </div>
                            <ErrorMessage name="city" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>Neighborhood*</label>
                                <Field v-model="addressData.neighborhood" name="neighborhood" type="text"
                                    placeholder="Neighborhood" />
                            </div>
                            <ErrorMessage name="neighborhood" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>Street name*</label>
                                <Field v-model="addressData.streetName" name="streetName" type="text"
                                    placeholder="Street name" />
                            </div>
                            <ErrorMessage name="streetName" class="error-message" />
                        </div>
                        <div v-if="!creditCard">
                            <div class="input-container">
                                <label>Street number*</label>
                                <Field v-model="addressData.streetNumber" name="streetNumber" v-mask="'###'" type="text"
                                    placeholder="Street number" />
                            </div>
                            <ErrorMessage name="streetNumber" class="error-message" />
                        </div>
                    </div>
                    <button class="btn w-full hover:bg-[#11c091] !text-white py-3 max-w-[20rem]">
                        Save
                    </button>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { productsStore } from '~/store/productsStore';
import { collection, getDocs, query, where, addDoc, doc, updateDoc, } from 'firebase/firestore';

const { $toast, $db, $auth } = useNuxtApp();

const { modal, addressProps, disabledInputs } = defineProps(['modal', 'addressProps', 'disabledInputs']);
const $emit = defineEmits(["closeModal", "addCreditcardInfo"]);

const store = productsStore();
const { totalValue, creditCard } = storeToRefs(store);
const addressData = ref({});

const formType = ref("add");

const schema = yup.object({
    name: yup.string().required("Name is required"),
    phone: yup
        .string()
        .required("Phone is required")
        .matches(/^\(\d{2}\) (\d{4,5})-\d{4}$/, "Phone must be valid"),
    zipCode: yup.string().required("ZIP code is required").matches(/^\d{5}-?\d{3}$/, "ZIP code must be valid"),
    state: yup.string().required("State is required"),
    city: yup.string().required('City is required'),
    neighborhood: yup
        .string()
        .required("Neighborhood is required"),
    streetName: yup.string().required("Street name is required"),
    streetNumber: yup.string().required("Street number is required"),
});

const closeModal = () => {
    $emit('closeModal');
};

watch(() => addressData.value.zipCode, async (newValue, oldValue) => {
    if (newValue && newValue.length === 9) {

        const data = await $fetch(`https://viacep.com.br/ws/${addressData.value.zipCode}/json/`);

        addressData.value.state = data.estado;
        addressData.value.city = data.localidade;
        addressData.value.neighborhood = data.bairro;
        addressData.value.streetName = data.logradouro;
    }
}, { deep: true });

const onSubmit = async (values) => {
    const data = {
        ...values,
        uid: $auth.currentUser.uid
    }

    if (formType.value === "edit") {
        try {
            const addressInfoFire = await fetchUserAddress();
            const addressDoc = doc($db, "addressInfo", addressInfoFire.id);

            await updateDoc(addressDoc, values);

            $toast.success("Address updated!");

        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            await addDoc(collection($db, "addressInfo"), data);
            $toast.success("Address saved!");
        } catch (error) {
            console.error(error);
        }
    }

    $emit("addAddressInfo", values);
    closeModal();
};

const addressSaved = (data) => {
    addressData.value.name = data.name;
    addressData.value.phone = data.phone;
    addressData.value.zipCode = data.zipCode;
    addressData.value.state = data.state;
    addressData.value.city = data.city;
    addressData.value.neighborhood = data.neighborhood;
    addressData.value.streetName = data.streetName;
    addressData.value.streetNumber = data.streetNumber;
}

const fetchUserAddress = async () => {
    const addressInfoCollection = collection($db, "addressInfo");
    const addressInfoQuery = query(
        addressInfoCollection,
        where("uid", "==", $auth.currentUser.uid)
    );
    const querySnapShot = await getDocs(addressInfoQuery);
    const addressInfoFire = querySnapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }))[0];

    return addressInfoFire;
}

onMounted(async () => {
    try {
        const addressInfoFire = await fetchUserAddress();

        if (addressInfoFire) {
            addressSaved(addressInfoFire);
            formType.value = "edit";
        }
        $emit("addAddressInfo", addressInfoFire);
    } catch (error) {
        console.error(error);
    }
});
</script>
