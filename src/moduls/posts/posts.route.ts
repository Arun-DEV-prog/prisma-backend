import { Router } from "express";
import { postController } from "./posts.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router= Router();


router.get("/",postController.getPostController)
router.get("/stats", auth(Role.admin,Role.user),postController.getStatsPostController)
router.get("/my-posts",auth(Role.admin, Role.user, Role.author),postController.getMYPostController)
router.get("/:postId",postController.getPostByIdController)
router.post(
    "/",
    auth(Role.user,Role.admin, Role.author ),
    postController.createNewPostByIdController
)
router.patch("/:postId", auth(Role.user,Role.admin, Role.author ),postController.updatePostByIdController)
router.delete("/:postId",auth(Role.user,Role.admin, Role.author ), postController.deletePostByIdController)


export const postRoutes = router;