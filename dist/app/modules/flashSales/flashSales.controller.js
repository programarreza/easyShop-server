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
exports.getMyFlashSalesProducts = exports.getAllFlashSales = exports.deleteMyFlashSalesProduct = exports.createFlashSales = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const flashSales_services_1 = require("./flashSales.services");
const createFlashSales = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield (0, flashSales_services_1.createFlashSalesIntoDB)(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Flash sale created successfully!",
        data: result,
    });
}));
exports.createFlashSales = createFlashSales;
const getAllFlashSales = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, flashSales_services_1.getAllFlashSalesFromDB)();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Flash sales retrieved successfully!",
        data: result,
    });
}));
exports.getAllFlashSales = getAllFlashSales;
const getMyFlashSalesProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield (0, flashSales_services_1.getMyFlashSalesProductsFromDB)(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "My flash sales retrieved successfully!",
        data: result,
    });
}));
exports.getMyFlashSalesProducts = getMyFlashSalesProducts;
const deleteMyFlashSalesProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const result = yield (0, flashSales_services_1.deleteMyFlashSalesProductIntoDB)(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "My flash sales deleted successfully!",
        data: result,
    });
}));
exports.deleteMyFlashSalesProduct = deleteMyFlashSalesProduct;
