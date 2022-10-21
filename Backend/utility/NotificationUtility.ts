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
  const accountSid = 'AC1a9a5ed43f14c610b49a137f463d7f8f';
  const authToken = 'a85640ea970b226186214dc11cdc595b';
  const client = require('twilio')(accountSid, authToken);
  const respons = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: `+18583914955`,
    to: `+91${toPhoneNumber}`,
  });
  return respons
};
// Payment notification or emails