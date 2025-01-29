<template>
    <div>
        <Modal :isVisible="modal" @close="closeModal">
            <div class="flex flex-col gap-2 items-center justify-between sm:gap-4 lg:w-[50rem] lg:-mb-4 xl:w-[60rem]">
                <h3 class="text-2xl font-bold text-center">Credit card information</h3>
                <p class="flex items-center text-primary gap-2 -mt-2">
                    <IconsSecurity />
                    Your payment information is safe with us
                </p>
                <div class="gap-2 items-center bg-[#53c0a336] w-full text-gray-800 px-4 py-4 rounded-lg hidden sm:flex">
                    <IconsCreditCard class="w-8 h-6 border border-gray-200 px-1.5 bg-white" />
                    <h2 class="font-semibold">Pay in installments</h2>
                    <IconsVisa class="w-8 h-6 px-1 bg-white" />
                    <IconsMastercard class="w-8 h-6 px-1 bg-white" />
                    <IconsAmericanExpress class="w-8 h-6 px-1 bg-white" />
                    <IconsElo class="w-8 h-6 px-1 bg-white" />
                </div>
                <Form :validation-schema="schema" @submit="onSubmit" class="w-full text-center">
                    <div class="grid gap-2 w-full border-b border-b-gray-300 pb-8 mb-4 sm:gap-8 sm:grid-cols-2">
                        <div>
                            <div class="input-container">
                                <label>Card number</label>
                                <Field name="cardNumber" v-mask="'#### #### #### ####'" type="text"
                                    placeholder="Card number" />
                            </div>
                            <ErrorMessage name="cardNumber" class="error-message" />
                        </div>
                        <div>
                            <div class="input-container">
                                <label>Cardholder name</label>
                                <Field name="cardholder" type="text" placeholder="Cardholder name" />
                            </div>
                            <ErrorMessage name="cardholder" class="error-message" />
                        </div>
                        <div>
                            <div class="input-container">
                                <label>Expiration Date</label>
                                <div class="flex items-baseline gap-2 w-full">
                                    <div class="w-full">
                                        <Field as="select" name="month">
                                            <option value="" disabled selected>MM</option>
                                            <option v-for="month in months" :key="month.value" :value="month.value">
                                                {{ month.name }}
                                            </option>
                                        </Field>
                                        <ErrorMessage name="month" class="error-message" />
                                    </div>
                                    /
                                    <div class="w-full">
                                        <Field as="select" name="year">
                                            <option value="" disabled selected>YY</option>
                                            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                        </Field>
                                        <ErrorMessage name="year" class="error-message" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="input-container">
                                <label>CVV</label>
                                <Field name="cvv" v-mask="'###'" type="text" placeholder="CVV" />
                            </div>
                            <ErrorMessage name="cvv" class="error-message" />
                        </div>
                        <div>
                            <div class="input-container">
                                <label>Choose months of installment</label>
                                <Field as="select" name="installment">
                                    <option v-for="i in 6 " :key="i" :value="i" :selected="i === 1">
                                        {{ formattedPrice(totalValue / i) }} * {{ i }}
                                        {{ i > 1 ? "months" : "month" }}
                                    </option>
                                </Field>
                            </div>
                            <ErrorMessage name="installment" class="error-message" />
                        </div>
                    </div>
                    <button class="btn w-full hover:bg-[#11c091] !text-white py-3 max-w-[20rem]">
                        Save & confirm
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

const store = productsStore();
const { totalValue } = storeToRefs(store);

const schema = yup.object({
    cardNumber: yup.string().required("Card number is required").matches(/^(?:\d\s?){16}$/, "Card number must be 16 digits"),
    cardholder: yup
        .string()
        .required("Cardholder name is required")
        .matches(/^[a-zA-Z\s]+$/, "Cardholder name must be valid"),
    month: yup.string().required("Expiration month is required"),
    year: yup.string().required("Expiration year is required"),
    cvv: yup.string().required('The CVV is required').matches(/^\d{3}$/, 'The CVV must contain exactly 3 digits'),
    installment: yup
        .number()
        .required("Please select the number of installments")
        .min(1, "You must select at least one installment"),
})

const modal = ref(true);

const closeModal = () => {
    modal.value = false;
}

const months = [
    { value: '01', name: 'January (01)' },
    { value: '02', name: 'February (02)' },
    { value: '03', name: 'March (03)' },
    { value: '04', name: 'April (04)' },
    { value: '05', name: 'May (05)' },
    { value: '06', name: 'June (06)' },
    { value: '07', name: 'July (07)' },
    { value: '08', name: 'August (08)' },
    { value: '09', name: 'September (09)' },
    { value: '10', name: 'October (10)' },
    { value: '11', name: 'November (11)' },
    { value: '12', name: 'December (12)' },
];

const years = ref([]);
const today = new Date();

for (let i = 0; i <= 25; i++) {
    years.value.push(today.getFullYear() + i);
}

const onSubmit = (values) => {
    const data = values;
    const installment = data.installment;
    delete data.installment;
    store.saveCreditCard(data);
    store.saveInstallment(installment);
    closeModal();
};
</script>

<style scoped></style>