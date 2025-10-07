"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usercontroller_1 = require("../controllers/usercontroller");
const express_1 = __importDefault(require("express"));
const userrouter = express_1.default.Router();
userrouter.post("/signup", usercontroller_1.signupController);
userrouter.post("/login", usercontroller_1.loginController);
userrouter.get("/user/:api_key", usercontroller_1.getUserByApiKeyController);
userrouter.get("/getallusers", usercontroller_1.getallusersController);
exports.default = userrouter;
