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
exports.getallusers = exports.getUserByApiKey = exports.login = exports.signup = void 0;
const schema_1 = __importDefault(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const userSchema_1 = require("../db/schema/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signup = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const savevalues = {
        username,
        email,
        password: hashedPassword,
        guid: (0, uuid_1.v4)()
    };
    const newUser = yield schema_1.default.insert(userSchema_1.users).values(savevalues).returning();
    return newUser[0];
});
exports.signup = signup;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield schema_1.default.select().from(userSchema_1.users).where((0, drizzle_orm_1.eq)(userSchema_1.users.email, email));
    if (user.length === 0) {
        throw new Error("User not found");
    }
    const validPassword = yield bcrypt_1.default.compare(password, user[0].password);
    if (!validPassword) {
        throw new Error("Invalid password");
    }
    return user[0];
});
exports.login = login;
const getUserByApiKey = (api_key) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield schema_1.default.select().from(userSchema_1.users).where((0, drizzle_orm_1.eq)(userSchema_1.users.guid, api_key));
    if (user.length === 0) {
        throw new Error("User not found");
    }
    return user[0];
});
exports.getUserByApiKey = getUserByApiKey;
const getallusers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allusers = yield schema_1.default.select().from(userSchema_1.users);
    return allusers;
});
exports.getallusers = getallusers;
