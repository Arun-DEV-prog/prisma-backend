import { Router } from "express";
import { postController } from "./posts.controller";

const router= Router();


router.get("/",postController.getPostController)
router.get("/stats",postController.getStatsPostController)
router.get("/postID",postController.getPostByIdController)
router.post("/",postController.createNewPostByIdController)
router.patch("/postId", postController.updatePostByIdController)
router.delete("/postID", postController.deletePostByIdController)


export const postRoutes = router;