"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || "this is key";
const generateToken = (userguid) => {
    const token = jsonwebtoken_1.default.sign({ userguid }, SECRET_KEY, { expiresIn: "1d" });
    return token;
};
exports.generateToken = generateToken;
