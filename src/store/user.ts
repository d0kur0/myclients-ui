import { StoreonModule } from "storeon";
import { SignInRequest, signInRequest, signUpRequest, SignUpRequest } from "../Api";
import { Events, State } from "./index";

export type User = {
  name: string;
  email: string;
  avatarPath: string;
};

export type UserState = {
  isAuth: boolean;
  user: User;
};

export type UserEvents = {
  "user/setIsAuth": boolean;
  "user/set": User;
  "user/signIn": SignInRequest;
  "user/signUp": SignUpRequest;
  "user/signOut": void;
};

export const user: StoreonModule<State, Events> = store => {
  store.on("user/setIsAuth", (state, isAuth) => ({ ...state, isAuth }));
  store.on("user/set", (state, user) => ({ ...state, user }));

  store.on("@init", () => {
    const initialState: UserState = {
      isAuth: false,
      user: { email: "", name: "", avatarPath: "" },
    };

    return localStorage.token === undefined || localStorage.user === undefined
      ? initialState
      : { ...initialState, user: JSON.parse(localStorage.user), isAuth: true };
  });

  store.on("user/signIn", async (state, request) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await signInRequest(request);
      if (response.isError) {
        store.dispatch("common/setErrors", response.errors);
        store.dispatch("common/setPending", false);
        return;
      }

      store.dispatch("user/setIsAuth", true);
      store.dispatch("user/set", response.user);

      localStorage.token = response.token;
      localStorage.user = JSON.stringify(response.user);
    } catch (e) {
      store.dispatch("common/setErrors", ["Ошибка сервера"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("user/signUp", async (state, request) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await signUpRequest(request);
      if (response.isError) {
        store.dispatch("common/setErrors", response.errors);
        store.dispatch("common/setPending", false);
        return;
      }

      store.dispatch("user/setIsAuth", true);
      store.dispatch("user/set", response.user);

      localStorage.token = response.token;
      localStorage.user = JSON.stringify(response.user);
    } catch (e) {
      store.dispatch("common/setErrors", ["Ошибка сервера"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("user/signOut", () => {
    store.dispatch("user/setIsAuth", false);
    store.dispatch("user/set", { name: "", avatarPath: "", email: "" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  });
};
