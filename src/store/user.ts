import { StoreonModule } from "storeon";

export type User = {
  Name: string;
  Email: string;
  AvatarPath: string;
};

export type UserState = User & {
  isAuth: boolean;
};

export type UserEvents = {
  setIsAuth: boolean;
  setUser: User;
};

export const user: StoreonModule<UserState, UserEvents> = store => {
  store.on("@init", () => {
    return {
      isAuth: false,
      Name: "test",
      Email: "213@gg.gg",
      AvatarPath: "123",
    };
  });

  store.on("setIsAuth", (state, isAuth) => ({ ...state, isAuth }));
  store.on("setUser", (state, user) => ({ ...state, ...user }));
};
