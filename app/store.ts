'use client';

import createStore from "react-auth-kit/createStore";
import createRefresh from "react-auth-kit/createRefresh";
import {domain} from "@/app/actions/getRoomById";

// @ts-ignore
const refresh = createRefresh({
  interval: 3600, // time in sec
  refreshApiCallback: async (param) => {
    try {
      console.log("Refreshing")
      const response = await fetch(`${domain}api/auth/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: param.refreshToken,
        }),
      }).then(res => res.json())
      return {
        isSuccess: true,
        newAuthToken: response.data.access,
        newRefreshToken: response.data.refresh,
        newAuthTokenExpireIn: 3600,
        newRefreshTokenExpiresIn: 86400
      }
    } catch (error) {
      console.error(error)
      return {
        isSuccess: false
      }
    }
  }
})

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: typeof window !== "undefined" ? window.location.hostname : 'localhost',
  cookieSecure: typeof window !== "undefined" ? window.location.protocol === 'https:' : true,
  refresh: refresh
});

export default store