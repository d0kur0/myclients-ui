import { StoreonModule } from "storeon";
import {
  createServiceRequest,
  CreateServiceRequest,
  deleteServiceRequest,
  getServicesRequest,
  updateServiceRequest,
  UpdateServiceRequest,
} from "../Api";
import { Events, State } from "./index";

export type Service = {
  id: number;
  name: string;
  price: number;
};

export type ServicesState = {
  services: Service[];
};

export type ServicesEvents = {
  "services/push": Service;
  "services/remove": number;
  "services/removeRemote": number;
  "services/set": Service[];
  "services/update": { id: number; service: Service };
  "services/fetch": void;
  "services/createRemote": CreateServiceRequest;
  "services/updateRemote": UpdateServiceRequest;
};

export const services: StoreonModule<State, Events> = store => {
  store.on("@init", () => ({ services: [] }));
  store.on("services/set", (state, services) => ({ ...state, services }));

  store.on("services/push", (state, service) => ({
    ...state,
    services: [...state.services, service],
  }));

  store.on("services/remove", (state, id) => ({
    ...state,
    services: state.services.filter(service => service.id !== id),
  }));

  store.on("services/removeRemote", async (state, id) => {
    store.dispatch("common/setPending", true);

    try {
      await deleteServiceRequest({ id });
      store.dispatch("services/remove", id);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("services/update", (state, { id, service }) => ({
    ...state,
    services: state.services.map(mService => (mService.id === id ? service : mService)),
  }));

  store.on("services/fetch", async () => {
    store.dispatch("common/setPending", true);

    try {
      const services = await getServicesRequest();
      store.dispatch("services/set", services);
    } catch (e) {
      store.dispatch("common/setErrors", ["Ошибка загрузки данных с сервера"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("services/createRemote", async (state, serviceProps) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await createServiceRequest(serviceProps);
      response.isError
        ? store.dispatch("common/setErrors", response.errors)
        : store.dispatch("services/push", response.service);

      response.isError || store.dispatch("common/setSuccess", true);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("services/updateRemote", async (state, props) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await updateServiceRequest(props);
      response.isError
        ? store.dispatch("common/setErrors", response.errors)
        : store.dispatch("services/update", {
            id: response.service.id,
            service: response.service,
          });

      response.isError || store.dispatch("common/setSuccess", true);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });
};
