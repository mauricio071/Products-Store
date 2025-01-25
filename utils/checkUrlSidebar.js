export default (routeName) => {
    if (
        routeName === "cart" ||
        routeName === "payment" ||
        routeName === "myOrders" ||
        routeName === "wishList" ||
        !routeName.includes("details-id") === false
    ) {
        return false;
    }
    return true;
};
