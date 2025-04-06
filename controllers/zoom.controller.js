import { getZoomOAuthUrl, getZoomAccessToken, createZoomMeeting } from "../utils/zoomUtils.js";
import axios from "axios";

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;

export const zoomAuthorize = (req, res) => {
  const url = getZoomOAuthUrl();
  res.redirect(url);
};

export const zoomOAuthCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const accessToken = await getZoomAccessToken(code);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createZoomMeetingHandler = async (req, res) => {
  const { topic, start_time, accessToken } = req.body;
  try {
    const meeting = await createZoomMeeting(topic, start_time, accessToken);
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// controller: zoom.controller.js
export const getZoomAccessTokenDirect = async (req, res) => {
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

  try {
    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.status(200).json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error("Zoom token error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to get Zoom access token",
      error: error.response?.data || error.message,
    });
  }
};
