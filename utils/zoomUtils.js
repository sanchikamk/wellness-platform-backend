import axios from "axios";

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;

export const getZoomOAuthUrl = () => {
  return `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
};

export const getZoomAccessToken = async (code) => {
  const tokenUrl = "https://zoom.us/oauth/token";

  const response = await axios.post(tokenUrl, null, {
    params: {
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64")}`,
    },
  });

  return response.data.access_token;
};

export const createZoomMeeting = async (topic, start_time, accessToken) => {
  const zoomUserId = "sanchikamk@gmail.com"
  const response = await axios.post(
    `https://api.zoom.us/v2/users/${zoomUserId}/meetings`,
    {
      topic,
      type: 2,
      start_time,
      duration: 30,
      timezone: "Asia/Kolkata",
      settings: {
        join_before_host: true,
        approval_type: 0,
        registration_type: 1,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

