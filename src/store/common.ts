import { StoreonModule } from "storeon";

export type CommonState = {
  isPending: boolean;
  isSuccess: boolean;
  errors: string[];
};

export type CommonEvents = {
  "common/setErrors": string[];
  "common/removeErrorByKey": number;
  "common/setPending": boolean;
  "common/setSuccess": boolean;
};

export const common: StoreonModule<CommonState, CommonEvents> = store => {
  store.on("@init", () => ({ errors: [], isPending: false, isSuccess: false }));
  store.on("common/setSuccess", (state, isSuccess) => ({ ...state, isSuccess }));
  store.on("common/setErrors", (state, errors) => ({ ...state, errors }));
  store.on("common/setPending", (state, isPending) => ({ ...state, isPending }));
  store.on("common/removeErrorByKey", (state, keyForDelete) => ({
    ...state,
    errors: state.errors.filter((error, key) => key !== keyForDelete),
  }));
};
