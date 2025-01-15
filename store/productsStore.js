import { defineStore } from "pinia";

export const productsStore = defineStore("products", {
    //state
    state: () => ({
        cart: [],
        costShipping: 50,
        checkAll: true,
        // checkoutProducts: [],
    }),
    //action
    actions: {
        addProduct(product, amount) {
            const exist = this.cart.find((item) => item.id === product.id);

            if (!exist) {
                const data = {
                    ...product,
                    amount: amount ? amount : 1,
                    total: amount ? amount * product.price : product.price,
                    checked: true,
                };
                this.cart.push(data);
            } else {
                exist.amount += amount ? amount : 1;
                exist.total += amount ? amount * product.price : exist.price;
            }
        },
        removeProduct(id) {
            this.cart = this.cart.filter((item) => item.id !== id);
        },
        removeUnit(id) {
            const product = this.cart.find((item) => item.id === id);
            if (product.amount > 1) {
                product.amount -= 1;
                product.total -= product.price;
            } else {
                this.removeProduct(id);
            }
        },
        checkAllProduct() {
            this.checkAll = !this.checkAll;

            this.cart = this.cart.map((product) => ({
                ...product,
                checked: this.checkAll,
            }));
            console.log(this.checkAll);
        },
        deleteCheckedProducts() {
            this.cart = this.cart.filter((product) => !product.checked);
        },
        removeAllProduct() {
            this.cart = [];
        },
        checkout() {
            this.cart = [];
        },
    },
    //getter
    getters: {
        productsAmount() {
            return this.cart.reduce((total, item) => (total += item.amount), 0);
        },
        subTotal() {
            return Number(
                this.checkoutCart
                    .reduce((total, item) => (total += item.total), 0)
                    .toFixed(2)
            );
        },
        shippingFee() {
            if (this.costShipping <= this.subTotal) {
                return 0;
            } else {
                return 5;
            }
        },
        tax() {
            return +(this.subTotal * 0.2).toFixed(2);
        },
        totalSaved() {
            return 0;
        },
        totalValue() {
            return +(this.subTotal + this.tax + this.shippingFee).toFixed(2);
        },
        checkoutCart() {
            return this.cart.filter((product) => product.checked);
        },
        selectAll() {
            const verify = this.cart.find((product) => !product.checked);

            if (!verify) {
                this.checkAll = true;
                return true;
            } else {
                this.checkAll = false;
                return false;
            }
        },
    },
    persist: true,
});
