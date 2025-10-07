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
exports.getallusersController = exports.getUserByApiKeyController = exports.loginController = exports.signupController = void 0;
const userServices_1 = require("../services/userServices");
const tokengenreation_1 = require("../utils/tokengenreation");
const signupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const user = yield (0, userServices_1.signup)(username, email, password);
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.signupController = signupController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, userServices_1.login)(email, password);
        const token = (0, tokengenreation_1.generateToken)(user.guid);
        user.token = token;
        res.status(200).json({ message: "Login successful", user });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
});
exports.loginController = loginController;
const getUserByApiKeyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.params.guid;
    if (!guid) {
        return res.status(400).json({ message: "API key is required" });
    }
    try {
        const user = yield (0, userServices_1.getUserByApiKey)(guid);
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.getUserByApiKeyController = getUserByApiKeyController;
const getallusersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allusers = yield (0, userServices_1.getallusers)();
        res.status(200).json({ allusers });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getallusersController = getallusersController;
