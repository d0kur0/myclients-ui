import { StoreonModule } from "storeon";

export type GlobalSearchState = {
  searchQuery: string;
};

export type GlobalSearchEvents = {
  "globalSearch/setQuery": string;
};

export const globalSearch: StoreonModule<
  GlobalSearchState,
  GlobalSearchEvents
> = store => {
  store.on("@init", () => ({ searchQuery: "" }));
  store.on("globalSearch/setQuery", (state, searchQuery) => ({ ...state, searchQuery }));
};
