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
exports.getallusers = exports.getUserByApiKey = exports.login = exports.resetPassword = exports.requestPasswordReset = exports.signup = void 0;
const schema_1 = __importDefault(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const userSchema_1 = require("../db/schema/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = require("./mailer");
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
// Request a password reset for a given email: creates a token, stores expiry, and sends email
const requestPasswordReset = (email, resetBaseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield schema_1.default.select().from(userSchema_1.users).where((0, drizzle_orm_1.eq)(userSchema_1.users.email, email));
    if (user.length === 0) {
        // For security, don't reveal whether email exists — but return success for client
        return { ok: true };
    }
    const u = user[0];
    const token = (0, uuid_1.v4)();
    // expires in 1 hour
    const expires = new Date(Date.now() + 1000 * 60 * 60);
    yield schema_1.default.update(userSchema_1.users).set({ password_reset_token: token, password_reset_expires: expires }).where((0, drizzle_orm_1.eq)(userSchema_1.users.guid, u.guid));
    const resetLink = `${resetBaseUrl.replace(/\/$/, '')}/reset-password?token=${token}`;
    // send email (don't await to avoid blocking, but ensure errors bubble if awaited)
    try {
        yield (0, mailer_1.sendPasswordResetEmail)(u.email, resetLink);
    }
    catch (err) {
        console.error('Error sending password reset email:', err);
    }
    return { ok: true };
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const usersWithToken = yield schema_1.default.select().from(userSchema_1.users).where((0, drizzle_orm_1.eq)(userSchema_1.users.password_reset_token, token));
    if (usersWithToken.length === 0) {
        throw new Error('Invalid or expired token');
    }
    const user = usersWithToken[0];
    if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
        throw new Error('Invalid or expired token');
    }
    const hashed = yield bcrypt_1.default.hash(newPassword, 10);
    yield schema_1.default.update(userSchema_1.users).set({ password: hashed, password_reset_token: null, password_reset_expires: null }).where((0, drizzle_orm_1.eq)(userSchema_1.users.guid, user.guid));
    return { ok: true };
});
exports.resetPassword = resetPassword;
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
