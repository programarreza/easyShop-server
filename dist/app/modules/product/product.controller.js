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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.getSingleProduct = exports.getShopProducts = exports.getMyProducts = exports.getAllProducts = exports.deleteProduct = exports.createProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const product_constant_1 = require("./product.constant");
const product_services_1 = require("./product.services");
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const result = yield (0, product_services_1.createProductIntoDB)(user, Object.assign(Object.assign({}, req.body), { images: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product created successfully!",
        data: result,
    });
}));
exports.createProduct = createProduct;
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield (0, product_services_1.getAllProductsFromDB)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "products retrieved successfully!",
        data: result,
    });
}));
exports.getAllProducts = getAllProducts;
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, product_services_1.getSingleProductFromDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "product retrieved successfully!",
        data: result,
    });
}));
exports.getSingleProduct = getSingleProduct;
const getShopProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // const result = await getAllProductsFromDB(filters, options);
    const { id } = req.params;
    const result = yield (0, product_services_1.getShopProductsFromDB)(filters, options, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Shop product retrieved successfully!",
        data: result,
    });
}));
exports.getShopProducts = getShopProducts;
const getMyProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield (0, product_services_1.getMyProductsFromDB)(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "my product retrieved successfully!",
        data: result,
    });
}));
exports.getMyProducts = getMyProducts;
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const result = yield (0, product_services_1.updateProductFromDB)(id, Object.assign(Object.assign({}, req.body), { images: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "product updated successfully!",
        data: result,
    });
}));
exports.updateProduct = updateProduct;
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, product_services_1.deleteProductIntoDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "product deleted successfully!",
        data: result,
    });
}));
exports.deleteProduct = deleteProduct;
