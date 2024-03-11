import {create} from 'zustand';

type TokenState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  isLoggedIn: () => boolean;
  logout: () => void;
};

const readTokensFromLocalStorage = (): { accessToken: string | null; refreshToken: string | null } => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return {accessToken, refreshToken};
};

// Đọc token từ local storage khi khởi tạo store
const initialTokens = readTokensFromLocalStorage();

const useTokenStore: any = create<TokenState>((set) => ({
  accessToken: initialTokens.accessToken,
  refreshToken: initialTokens.refreshToken,
  setTokens: (accessToken, refreshToken) => set(() => ({accessToken, refreshToken})),
  isLoggedIn: () => !!useTokenStore.getState().accessToken,
  logout: () => set(() => ({accessToken: null, refreshToken: null})),
}));

// Lưu trữ token vào local storage hoặc cookie
useTokenStore.subscribe(
  (state: { accessToken: any; refreshToken: any; }) => {
    // Lưu trạng thái token vào local storage hoặc cookie tại đây
    localStorage.setItem('accessToken', state.accessToken ?? '');
    localStorage.setItem('refreshToken', state.refreshToken ?? '');
  },
);

export default useTokenStore