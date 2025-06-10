import { Router } from "express";

const router = Router();

router.get("/session", (req, res) => {
    if (req.session.userId) {
        res.send({
            isLoggedIn: true,
            userId: req.session.userId,
            isAdmin: req.session.isAdmin,
            username: req.session.username,
            email: req.session.email,
        });
    } else {
        res.send({
            isLoggedIn: false,
            userId: null,
            isAdmin: false,
            username: null,
            email: null,
        });
    }
});

export default router;