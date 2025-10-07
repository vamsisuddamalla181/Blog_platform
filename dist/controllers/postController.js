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
const postServices_1 = require("../services/postServices");
class postcontroller {
    constructor() {
        this.createPostController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userguid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userguid;
                if (!userguid) {
                    return res.status(400).json({ error: "Invalid or missing userid " });
                }
                const { title, content, is_public } = req.body;
                if (!title || !content) {
                    return res.status(400).json({ error: "Title and content are required" });
                }
                const newPost = yield (0, postServices_1.createPost)(title, content, userguid, is_public);
                res.status(201).json(newPost);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getPostById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const postId = req.params.guid;
                const userguid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userguid;
                if (!postId) {
                    return res.status(400).json({ error: "Invalid or missing userid " });
                }
                const postbyid = yield (0, postServices_1.getPostById)(postId, userguid);
                res.status(201).json(postbyid);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        this.getallpost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userguid;
                if (!userID) {
                    res.status(404).json({ message: "userId not found" });
                }
                const getall = yield (0, postServices_1.getAllPosts)(userID);
                res.status(200).json(getall);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server Error" });
            }
        });
        this.upatepost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userguid;
                const guid = req.params.guid;
                const { title, context, is_boolean } = req.body;
                const update = yield (0, postServices_1.updatePost)(guid, userId, title, context, is_boolean);
                res.status(200).json(update);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        this.deletepost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userguid;
                const guid = req.params.guid;
                const deletepost = yield (0, postServices_1.deletePost)(guid, userId);
                res.status(200).json({ message: "post deleted", deletepost });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server Error" });
            }
        });
        this.deleteall = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userguid;
                if (userID) {
                    res.status(404).json({ message: "user id not found" });
                }
                const deleteallposts = yield (0, postServices_1.deleteall)(userID);
                res.status(200).json({ message: "All posts are delted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Internl server error" });
            }
        });
    }
}
exports.default = postcontroller;
