import { defineStore } from "pinia";

export const productsStore = defineStore("products", {
    //state
    state: () => ({
        cart: [],
        costShipping: 50,
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
                this.cart
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
            if (this.shippingFee > 0) {
                return "0";
            } else {
                return "5.0";
            }
        },
        totalValue() {
            return +(this.subTotal + this.tax + this.shippingFee).toFixed(2);
        },
    },
    persist: true,
});
