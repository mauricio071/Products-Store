export default (routeName) => {
    if (
        routeName === "cart" ||
        routeName === "payment" ||
        routeName === "myOrders" ||
        routeName === "wishList" ||
        routeName === "paymentPix-id" ||
        routeName === "myOrders-details-id"
    ) {
        return false;
    }
    return true;
};
