export const createUserSlice = (set) => ({
  user: null,
  isLoggedIn: false,
  checkingAuth: true,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
})