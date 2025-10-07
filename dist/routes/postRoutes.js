"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postController_1 = __importDefault(require("../controllers/postController"));
const express_1 = __importDefault(require("express"));
const postrouter = express_1.default.Router();
const authmiddleware_1 = require("../middleware/authmiddleware");
const post = new postController_1.default();
postrouter.post("/createpost", authmiddleware_1.authMiddleware, post.createPostController);
postrouter.get("/getallposts", authmiddleware_1.authMiddleware, post.getallpost);
postrouter.get("/getpostbyid/:guid", authmiddleware_1.authMiddleware, post.getPostById);
postrouter.put("/updatepost/:guid", authmiddleware_1.authMiddleware, post.upatepost);
// router.delete("/deletepost/:id",postController.deletePostController);
exports.default = postrouter;
