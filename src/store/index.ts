import { createStoreon } from "storeon";
import { user, UserEvents, UserState } from "./user";

export const store = createStoreon<UserState, UserEvents>([user]);
