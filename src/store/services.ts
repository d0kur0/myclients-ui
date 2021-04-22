import { StoreonModule } from "storeon";
import {
  createClientRequest,
  CreateClientRequest,
  deleteClientRequest,
  getClientsRequest,
  updateClientRequest,
  UpdateClientRequest,
} from "../Api";
import { Events, State } from "./index";

export type Service = {
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
  "services/update": { id: number; client: Service };
  "services/fetch": void;
  "services/createRemote": CreateClientRequest;
  "services/updateRemote": UpdateClientRequest;
};

export const services: StoreonModule<State, Events> = store => {
  store.on("@init", () => ({ clients: [] }));
  store.on("services/set", (state, clients) => ({ ...state, clients }));

  store.on("services/push", (state, client) => ({
    ...state,
    clients: [...state.clients, client],
  }));

  store.on("services/remove", (state, id) => ({
    ...state,
    clients: state.clients.filter(client => client.id !== id),
  }));

  store.on("services/removeRemote", async (state, id) => {
    store.dispatch("common/setPending", true);

    try {
      await deleteClientRequest({ id });
      store.dispatch("clients/remove", id);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("clients/update", (state, { id, client }) => ({
    ...state,
    clients: state.clients.map(mClient => (mClient.id === id ? client : mClient)),
  }));

  store.on("clients/fetch", async () => {
    store.dispatch("common/setPending", true);

    try {
      const clients = await getClientsRequest();
      store.dispatch("clients/set", clients);
    } catch (e) {
      store.dispatch("common/setErrors", ["Ошибка загрузки данных с сервера"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("clients/createRemote", async (state, clientProps) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await createClientRequest(clientProps);
      response.isError
        ? store.dispatch("common/setErrors", response.errors)
        : store.dispatch("clients/push", response.client);

      response.isError || store.dispatch("common/setSuccess", true);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("clients/updateRemote", async (state, props) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await updateClientRequest(props);
      response.isError
        ? store.dispatch("common/setErrors", response.errors)
        : store.dispatch("clients/update", {
            id: response.client.id,
            client: response.client,
          });

      response.isError || store.dispatch("common/setSuccess", true);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });
};
