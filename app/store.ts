'use client';

import createStore from "react-auth-kit/createStore";
import createRefresh from "react-auth-kit/createRefresh";
import {domain} from "@/app/actions/getRoomById";

const refresh = createRefresh({
  interval: 60,
  refreshApiCallback: async (param) => {
    try {
      console.log("Refreshing")
      const response = await fetch(`${domain}api/auth/token/refresh/`, {
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
        newAuthToken: response.access,
        newRefreshToken: response.refresh,
        newAuthTokenExpireIn: 60,
        newRefreshTokenExpiresIn: 1440
      }
    } catch (error) {
      console.error(error)
      return {
        isSuccess: false,
        newAuthToken: "",
        newRefreshToken: "",
        newAuthTokenExpireIn: 0,
        newRefreshTokenExpiresIn: 0
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