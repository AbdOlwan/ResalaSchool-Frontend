import { createStore } from "vuex";

// Check browser storage to keep the user logged in on page refresh
const userFromStorage =
  localStorage.getItem("user") || sessionStorage.getItem("user");

export default createStore({
  state: {
    isAuthenticated: !!userFromStorage,
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
  },
  mutations: {
    setAuth(state, { isAuthenticated, user }) {
      state.isAuthenticated = isAuthenticated;
      state.user = user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
  },
  actions: {},
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },
  modules: {},
});
