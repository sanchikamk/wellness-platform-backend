import express from "express";
import {
  zoomAuthorize,
  zoomOAuthCallback,
  createZoomMeetingHandler,
  getZoomAccessTokenDirect
} from "../controllers/zoom.controller.js";

const router = express.Router();

router.get("/authorize", zoomAuthorize);
router.get("/oauth/callback", zoomOAuthCallback);
router.post("/create-meeting", createZoomMeetingHandler);
router.get("/token", getZoomAccessTokenDirect);


export default router;
