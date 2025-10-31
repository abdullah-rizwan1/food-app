"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.VendorRoutes = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post('/login', controllers_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get('/profile', controllers_1.GetVendorProfile);
router.patch('/profile', controllers_1.UpdateVendorProfile);
router.patch('/coverimage', images, controllers_1.UpdateVendorCoverImage);
router.patch('/service', controllers_1.UpdateVendorService);
router.post('/food', images, controllers_1.AddFood);
router.get('/foods', controllers_1.GetFoods);
router.get('/', (req, res, next) => {
    res.json({ message: 'Hello from Vendor' });
});
//# sourceMappingURL=VendorRoutes.js.map