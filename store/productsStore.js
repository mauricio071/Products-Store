import { defineStore } from "pinia";

export const productsStore = defineStore("products", {
    //state
    state: () => ({
        cart: [],
        costShipping: 50,
        checkAll: true,
        wishList: [],
    }),
    //action
    actions: {
        addProduct(product, quantity) {
            const exist = this.cart.find((item) => item.id === product.id);

            if (!exist) {
                const data = {
                    ...product,
                    quantity: quantity ? quantity : 1,
                    total: quantity ? quantity * product.price : product.price,
                    checked: true,
                };
                this.cart.push(data);
            } else {
                exist.quantity += quantity ? quantity : 1;
                exist.total += quantity
                    ? quantity * product.price
                    : exist.price;
            }
        },
        removeProduct(id) {
            this.cart = this.cart.filter((item) => item.id !== id);
        },
        removeUnit(id) {
            const product = this.cart.find((item) => item.id === id);
            if (product.quantity > 1) {
                product.quantity -= 1;
                product.total -= product.price;
            } else {
                this.removeProduct(id);
            }
        },
        addToWish(id) {
            const verify = this.wishList.find((productId) => productId === id);

            if (!verify) {
                this.wishList.push(id);
            } else {
                this.wishList = this.wishList.filter(
                    (productId) => productId !== id
                );
            }
        },
        favorited(id) {
            return this.wishList.find((productId) => productId === id);
        },
        checkAllProduct() {
            this.checkAll = !this.checkAll;

            this.cart = this.cart.map((product) => ({
                ...product,
                checked: this.checkAll,
            }));
        },
        deleteCheckedProducts() {
            this.cart = this.cart.filter((product) => !product.checked);
        },
        checkout() {
            this.cart = [];
        },
    },
    //getter
    getters: {
        productsQuantity() {
            return this.cart.reduce(
                (total, item) => (total += item.quantity),
                0
            );
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
        checkedAny() {
            return this.cart.find((product) => product.checked);
        },
    },
    persist: true,
});
