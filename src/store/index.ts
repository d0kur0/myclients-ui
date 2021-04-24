import { createStoreon } from "storeon";
import { user, UserEvents, UserState } from "./user";
import { clients, ClientsEvents, ClientsState } from "./clients";
import { common, CommonEvents, CommonState } from "./common";
import { storeonLogger } from "storeon/devtools";
import { globalSearch, GlobalSearchEvents, GlobalSearchState } from "./globalSearch";
import { services, ServicesEvents, ServicesState } from "./services";

export type State = UserState &
  ClientsState &
  CommonState &
  GlobalSearchState &
  ServicesState;
export type Events = UserEvents &
  ClientsEvents &
  CommonEvents &
  GlobalSearchEvents &
  ServicesEvents;

export const store = createStoreon<State, Events>([
  user,
  clients,
  common,
  globalSearch,
  services,
  process.env.NODE_ENV !== "production" && storeonLogger,
]);
