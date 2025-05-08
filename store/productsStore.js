import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { defineStore } from "pinia";

export const productsStore = defineStore("products", {
    //state
    state: () => ({
        userInfo: {},
        cart: [],
        costShipping: 50,
        checkAll: true,
        wishList: [],
        orders: [],
        dollar: 6,
        taxRate: 0.2,
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
        async fetchWishList() {
            const { $db, $auth } = useNuxtApp();

            const wishListCollection = collection($db, "wishList");
            const wishListQuery = query(
                wishListCollection,
                where("uid", "==", $auth.currentUser.uid)
            );
            const querySnapShot = await getDocs(wishListQuery);
            const wishListFire = querySnapShot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            return wishListFire;
        },
        async addToWish(id) {
            const { $db, $auth, $toast } = useNuxtApp();
            const $router = useRouter();

            if ($auth.currentUser) {
                const wishListFire = await this.fetchWishList();

                const verify = wishListFire.find(
                    (product) => product.itemId === id
                );

                const wishItem = {
                    uid: $auth.currentUser.uid,
                    itemId: id,
                };

                if (!verify) {
                    await addDoc(collection($db, "wishList"), wishItem);
                } else {
                    const document = doc($db, "wishList", verify.id);
                    await deleteDoc(document);
                }
            } else {
                $router
                    .push("/login")
                    .then(() => $toast.warning("Login is required"));
            }
        },

        async removeWishList(id) {
            const { $db } = useNuxtApp();

            const wishListFire = await this.fetchWishList();

            const verify = wishListFire.find(
                (product) => product.itemId === id
            );
            const document = doc($db, "wishList", verify.id);
            await deleteDoc(document);
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
        emptyShoppingCart() {
            this.cart = [];
        },
        async checkout(data) {
            const { $db } = useNuxtApp();
            const document = await addDoc(collection($db, "orders"), data);
            return document.id;
        },
        async confirmPayment(id) {
            const { $db } = useNuxtApp();
            const orderDoc = doc($db, "orders", id);
            const orderData = await getDoc(orderDoc);

            await updateDoc(orderDoc, {
                ...orderData.data(),
                status: "To receive",
            });
        },
        async getOrders() {
            const { $db, $auth } = useNuxtApp();
            const ordersCollection = collection($db, "orders");
            const ordersQuery = query(
                ordersCollection,
                where("uid", "==", $auth.currentUser.uid),
                orderBy("date", "desc")
            );
            const querySnapShot = await getDocs(ordersQuery);
            const ordersFire = querySnapShot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            return ordersFire;
        },
        async getOrder(id) {
            const { $db } = useNuxtApp();
            const orderDoc = doc($db, "orders", id);
            const orderData = await getDoc(orderDoc);

            return {
                ...orderData.data(),
                id,
            };
        },
        async completeOrders(orders) {
            const { $db } = useNuxtApp();

            const today = new Date();
            const todayFormatted = `${today.getFullYear()}-${(
                today.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}-${today
                .getDate()
                .toString()
                .padStart(2, "0")} ${today
                .getHours()
                .toString()
                .padStart(2, "0")}:${today
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

            const data = await Promise.all(
                orders.map(async (order) => {
                    const verify =
                        new Date(todayFormatted) >
                        new Date(order.estimatedDate);

                    if (verify && order.status === "To pay") {
                        const orderDoc = doc($db, "orders", order.id);

                        const body = {
                            ...order,
                            status: "Canceled",
                        };

                        await updateDoc(orderDoc, body);

                        return body;
                    }

                    if (verify && order.status === "To receive") {
                        const orderDoc = doc($db, "orders", order.id);

                        const body = {
                            ...order,
                            status: "Completed",
                        };

                        await updateDoc(orderDoc, body);

                        return body;
                    }

                    return order;
                })
            );

            return data;
        },
        async completeOrder(order) {
            const { $db } = useNuxtApp();

            const today = new Date();
            const todayFormatted = `${today.getFullYear()}-${(
                today.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}-${today
                .getDate()
                .toString()
                .padStart(2, "0")} ${today
                .getHours()
                .toString()
                .padStart(2, "0")}:${today
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

            const verify =
                new Date(todayFormatted) > new Date(order.estimatedDate);

            if (verify && order.status === "To pay") {
                const orderDoc = doc($db, "orders", order.id);

                const body = {
                    ...order,
                    status: "Canceled",
                };

                await updateDoc(orderDoc, body);

                return body;
            }

            if (verify && order.status === "To receive") {
                const orderDoc = doc($db, "orders", order.id);

                const body = {
                    ...order,
                    status: "Completed",
                };

                await updateDoc(orderDoc, body);

                return body;
            }

            return order;
        },
        async cancelOrder(id) {
            const { $db } = useNuxtApp();
            const orderDoc = doc($db, "orders", id);
            const orderData = await getDoc(orderDoc);

            await updateDoc(orderDoc, {
                ...orderData.data(),
                status: "Canceled",
            });
        },
        async saveCreditCard(data) {
            const { $db } = useNuxtApp();

            const response = await addDoc(collection($db, "creditCard"), data);
            return {
                ...data,
                id: response.id,
            };
        },
        async removeCreditCard(id) {
            const { $db } = useNuxtApp();

            const document = doc($db, "creditCard", id);
            await deleteDoc(document);
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
            return this.checkoutCart.reduce(
                (total, item) => (total += item.total),
                0
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
            return this.subTotal * 0.2;
        },
        totalSaved() {
            return 0;
        },
        totalValue() {
            return this.subTotal + this.tax + this.shippingFee;
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
