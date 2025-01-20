export default (price) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
    return formattedPrice;
};
