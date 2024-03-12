'use client';

import createStore from "react-auth-kit/createStore";
import createRefresh from "react-auth-kit/createRefresh";

const refresh = createRefresh({
  interval: 10,
  refreshApiCallback: async (param) => {
    try {
      const response = await fetch('/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
      }).then((res) => res.json())
      console.log("Refreshing")
      return {
        isSuccess: true,
        newAuthToken: response.access,
        newAuthTokenExpireIn: 10,
        newRefreshTokenExpiresIn: 60
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
  cookieSecure: true,
  refresh: refresh
});

export default store