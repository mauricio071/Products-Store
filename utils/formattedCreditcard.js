export default (cardNumber) => {
    return cardNumber
        .replace(/\s/g, "")
        .replace(/^(\d{4})\d{6,10}(\d{4})$/, "$1 **** **** $2");
};
