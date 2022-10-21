"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOTP = exports.GenerateOtp = void 0;
// Email
// Notification
// OTP
const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = 'AC1a9a5ed43f14c610b49a137f463d7f8f';
    const authToken = 'a85640ea970b226186214dc11cdc595b';
    const client = require('twilio')(accountSid, authToken);
    const respons = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from: `+18583914955`,
        to: `+91${toPhoneNumber}`,
    });
    return respons;
});
exports.onRequestOTP = onRequestOTP;
// Payment notification or emails
//# sourceMappingURL=NotificationUtility.js.map