// Email
// Notification
// OTP
export const GenerateOtp = () => {
    const otp= Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    return{otp, expiry}
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountsid = "AC1a9a5ed43f14c610b49a137f463d7f8f";
  const authToken = "1d23489513fa7bafc6a88080b8bcf28f";
  const client = require("twilio")(accountsid, authToken);
  const respons = await client.message.create({
    body: `Your OTP is ${otp}`,
    from: `+18583914955`,
    to: toPhoneNumber,
  });
  return respons
};
// Payment notification or emails