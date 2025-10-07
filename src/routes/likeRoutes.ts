import {LikesController} from "../controllers/likecontroller"
import express from "express"
const likerouter=express.Router()

const likesController = new LikesController();

likerouter.post("/like", likesController.addLike);
likerouter.delete("/like", likesController.removeLike);
likerouter.get("/count/:postguid", likesController.getLikesCount);
likerouter.get("/isLiked/:userguid/:postguid", likesController.isLikedByUser);

export default likerouter;