import { Request, Response } from "express";
import { LikesService } from "../services/likesServices";

export class LikesController  {
  addLike= async (req: Request, res: Response) => {
    try {
      const { userguid, postguid } = req.body;
      if (!userguid || !postguid) {
        return res.status(400).json({ success: false, message: "Missing userguid or postguid" });
      }

      const like = await LikesService.addLike(userguid, postguid);
      res.status(201).json({ success: true, like });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  removeLike= async (req: Request, res: Response) => {
    try {
      const { userguid, postguid } = req.body;
      if (!userguid || !postguid) {
        return res.status(400).json({ success: false, message: "Missing userguid or postguid" });
      }

      const removed = await LikesService.removeLike(userguid, postguid);
      res.status(200).json({ success: true, removed });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getLikesCount= async (req: Request, res: Response) => {
    try {
      const { postguid } = req.params;
      if (!postguid) {
        return res.status(400).json({ success: false, message: "Missing postguid" });
      }

      const count = await LikesService.getLikesCount(postguid);
      res.status(200).json({ success: true, count });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  isLikedByUser= async (req: Request, res: Response) => {
    try {
      const { userguid, postguid } = req.params;
      if (!userguid || !postguid) {
        return res.status(400).json({ success: false, message: "Missing userguid or postguid" });
      }

      const liked = await LikesService.isLikedByUser(userguid, postguid);
      res.status(200).json({ success: true, liked });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
};
