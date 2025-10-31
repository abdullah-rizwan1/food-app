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
exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const Food_1 = require("../models/Food");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.FindVendor)('', email);
    if (existingVendor !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const token = (0, utility_1.GenerateToken)({
                _id: existingVendor.id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodType: existingVendor.foodType,
            });
            return res.json(token);
        }
    }
    return res.json({ message: 'Login credentials not valid' });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ message: 'Vendor information not found' });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodType, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
    }
    return res.json({ message: 'Vendor Information not found' });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({
        message: 'Something went wrong updating vendor cover image',
    });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
    }
    return res.json({ message: 'Vendor Information not found' });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const files = req.files;
        const images = files.map((file) => file.filename);
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const createFood = yield Food_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0,
            });
            vendor.foods.push(createFood);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({ message: 'Something went wrong when adding food' });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        if (foods != null) {
            return res.json(foods);
        }
    }
    return res.json({ message: 'No food found' });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map