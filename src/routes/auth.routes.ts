import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAdmin, verifyEditor, verifyToken } from "../middleware/jwt.middleware";

const authRoutes = Router()

// -> /api/users/register
authRoutes.post("/register", AuthController.createNewUser);

// -> /api/users/login
authRoutes.post("/login", AuthController.loginUser);

// -> /api/users/profile
authRoutes.get("/profile",verifyToken, AuthController.profile );

// -> /api/users/logout
authRoutes.post("/logout", AuthController.logout );

// -> /api/users/allUsers
authRoutes.get("/", verifyToken, AuthController.allUsers );

// -> /api/users/id
authRoutes.patch("/:id",[verifyToken, verifyEditor], AuthController.updatePartialUser );


// -> /api/users/id
authRoutes.delete("/:id", [verifyToken, verifyAdmin],  AuthController.deleteUser);


// -> /api/users/change password
authRoutes.put("/change-password", verifyToken,  AuthController.changePassword);


export default authRoutes