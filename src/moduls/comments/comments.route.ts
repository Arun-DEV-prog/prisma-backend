import { Router } from "express";
import { auth } from "../../middlewares/auth";


import { commentController } from "./comment.controller";
import { Role } from '../../../generated/prisma/enums';



const router=Router();


//router.get("/author/:authorId")
//router.get("/")
//router.post("/:commentId")
router.post("/",auth(Role.admin, Role.user),commentController.postComments)
router.get("/:commentId", commentController.getCommentById)
//router.delete("/commentID")
//router.patch("/commentId/moderate")



export const commentRoutes=router;