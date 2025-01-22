import { QrCodePix } from "qrcode-pix";

export const generatePixQrCode = async (data) => {
    const qrCodePix = QrCodePix({
        version: "01",
        key: "naokimau@gmail.com",
        name: "Mauricio",
        city: "SAO PAULO",
        transactionId: Math.random()
            .toString(36)
            .substring(2, 12)
            .toUpperCase(),
        message: "Pay me :)",
        cep: "99999999",
        value: data.value,
    });

    return {
        payload: qrCodePix.payload(),
        qrCode: await qrCodePix.base64(),
    };
};
