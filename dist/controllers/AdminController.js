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
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.FindVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById({ _id: id });
    }
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, email, password, } = req.body;
    const existingVendor = yield (0, exports.FindVendor)('', email);
    if (existingVendor !== null) {
        return res.json({
            message: 'A Vendor with this email id Already exists',
        });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const hashedPassword = yield (0, utility_1.GenerateHashedPassword)(password, salt);
    const createVendor = yield models_1.Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: hashedPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: [],
    });
    return res.json(createVendor);
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null) {
        return res.json(vendors);
    }
    return res.json({ message: 'No vendors available' });
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield (0, exports.FindVendor)(vendorId);
    if (vendor !== null) {
        return res.json(vendor);
    }
    return res.json({ message: "Vendor with the following id doesn't exist" });
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map