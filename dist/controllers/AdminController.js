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
exports.GetVandorByID = exports.GetVandors = exports.CreateVandor = exports.FindVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const FindVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.FindVandor = FindVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, OwnerName, foodType, pincode, address, phone, email, password, } = req.body;
    const existingvandorEmail = yield (0, exports.FindVandor)("", email);
    const existingvandorPhone = yield models_1.Vandor.findOne({ phone: phone });
    if (existingvandorEmail != null) {
        return res.json({ message: "A vander is exist with this email id" });
    }
    if (existingvandorPhone != null) {
        return res.json({ message: "A vander is exist with this Phone number" });
    }
    //   Genrate the salt
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GenratePassword)(password, salt);
    const CreateVandor = yield models_1.Vandor.create({
        name: name,
        OwnerName: OwnerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    });
    return res.json(CreateVandor);
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vanders = yield models_1.Vandor.find();
    if (vanders != null) {
        return res.json(vanders);
    }
    return res.json({ message: "vandors data not available" });
});
exports.GetVandors = GetVandors;
const GetVandorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    const vandor = yield (0, exports.FindVandor)(vandorId);
    if (vandor !== null) {
        return res.json(vandor);
    }
    return res.json({ message: "vandors data not available" });
});
exports.GetVandorByID = GetVandorByID;
//# sourceMappingURL=AdminController.js.map