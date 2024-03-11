import {createStore} from 'zustand/vanilla';
import {devtools} from 'zustand/middleware';
import {useStore} from "zustand";
import {cookies} from 'next/headers';

const CookieService = cookies()

type AuthStore = {
  accessToken: string | undefined;
  accessTokenData: any | undefined;
  refreshToken: string | undefined;

  actions: {
    setAccessToken: (accessToken: string | undefined) => void;
    setRefreshToken: (refreshToken: string | undefined) => void;
    // set tokens on the app start
    init: () => void;
    clearTokens: () => void;
  }
}

const authStore = createStore<AuthStore>()(
  devtools(
    (set, get) => ({
      accessToken: undefined,
      accessTokenData: undefined,
      refreshToken: undefined,

      actions: {
        setAccessToken: (accessToken: string | undefined) => {
          set({
            accessToken,
          });

          if (accessToken) {
            CookieService.set('ACCESS_TOKEN_KEY', accessToken, {path: '/'});
          }
        },
        setRefreshToken: (refreshToken: string | undefined) => {
          set({
            refreshToken,
          });

          if (refreshToken) {
            CookieService.set('REFRESH_TOKEN_KEY', refreshToken, {path: '/'});
          }
        },
        init: () => {
          const {setAccessToken, setRefreshToken} = get().actions;
          setAccessToken(CookieService.get('ACCESS_TOKEN_KEY')?.value);
          setRefreshToken(CookieService.get('REFRESH_TOKEN_KEY')?.value);
        },
        clearTokens: () =>
        {
          set({
            accessToken: undefined,
            accessTokenData: undefined,
            refreshToken: undefined,
          })

          CookieService.delete('ACCESS_TOKEN_KEY');
          CookieService.delete('REFRESH_TOKEN_KEY');
        },
      }
    }),
    {
      name: 'auth-store',
    }
  )
);

export type ExtractState<S> = S extends {
    getState: () => infer T;
  }
  ? T
  : never;

type Params<U> = Parameters<typeof useStore<typeof authStore, U>>;

// Selectors
const accessTokenSelector = (state: ExtractState<typeof authStore>) => state.accessToken;
const accessTokenDataSelector = (state: ExtractState<typeof authStore>) => state.accessTokenData;
const refreshTokenSelector = (state: ExtractState<typeof authStore>) => state.refreshToken;
const actionsSelector = (state: ExtractState<typeof authStore>) => state.actions;

// getters
export const getAccessToken = () => accessTokenSelector(authStore.getState());
export const getAccessTokenData = () => accessTokenDataSelector(authStore.getState());
export const getRefreshToken = () => refreshTokenSelector(authStore.getState());
export const getActions = () => actionsSelector(authStore.getState());

function useAuthStore<U>(selector: Params<U>[1], equalityFn?: Params<U>[2]) {
  return useStore(authStore, selector, equalityFn);
}

// Hooks
export const useAccessToken = () => useAuthStore(accessTokenSelector);
export const useAccessTokenData = () => useAuthStore(accessTokenDataSelector);
export const useRefreshToken = () => useAuthStore(refreshTokenSelector);
export const useActions = () => useAuthStore(actionsSelector);