import { StoreonModule } from "storeon";
import { User } from "./user";
import { Service } from "./services";
import { Client } from "./clients";
import { Events, State } from "./index";
import {
  createRecordRequest,
  CreateRecordRequest,
  deleteRecordRequest,
  getRecordsByDateRequest,
  updateRecordRequest,
  UpdateRecordRequest,
} from "../Api";
import { formatRFC3339 } from "date-fns";

export type Record = {
  id: number;
  userId: number;
  user: User;
  services: Service[];
  clientId: number;
  client: Client;
  date: string;
};

export type RecordsState = {
  records: Record[];
  recordsDate: Date;
};

export type RecordsEvents = {
  "records/fetch": void;
  "records/set": Record[];
  "records/push": Record;
  "records/setRecordsDate": Date;
  "records/createRemote": CreateRecordRequest;
  "records/removeRemote": number;
  "records/remove": number;
  "records/updateRemote": UpdateRecordRequest;
  "records/update": { id: number; record: Record };
};

export const records: StoreonModule<State, Events> = store => {
  store.on("@init", () => {
    return {
      records: [],
      recordsDate: new Date(),
    };
  });

  store.on("records/set", (state, records) => ({ ...state, records }));
  store.on("records/setRecordsDate", (state, recordsDate) => ({ ...state, recordsDate }));
  store.on("records/setRecordsDate", (state, recordsDate) => ({ ...state, recordsDate }));
  store.on("records/remove", (state, id) => ({
    ...state,
    records: state.records.filter(record => record.id !== id),
  }));

  store.on("records/push", (state, record) => ({
    ...state,
    records: [...state.records, record],
  }));

  store.on("records/update", (state, { id, record }) => ({
    ...state,
    records: state.records.map(mRecord => (mRecord.id === id ? record : mRecord)),
  }));

  store.on("records/fetch", async state => {
    store.dispatch("common/setPending", true);

    try {
      const records = await getRecordsByDateRequest(state.recordsDate);
      store.dispatch("records/set", records);
    } catch (e) {
      store.dispatch("common/setErrors", ["Ошибка загрузки данных с сервера"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("records/removeRemote", async (state, id) => {
    store.dispatch("common/setPending", true);

    try {
      await deleteRecordRequest({ id });
      store.dispatch("records/remove", id);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("records/createRemote", async (state, props) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await createRecordRequest({
        ...props,
        date: formatRFC3339(new Date(props.date)),
      });

      response.isError
        ? store.dispatch("common/setErrors", response.errors)
        : store.dispatch("records/push", response.record);

      response.isError || store.dispatch("common/setSuccess", true);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });

  store.on("records/updateRemote", async (state, props) => {
    store.dispatch("common/setPending", true);

    try {
      const response = await updateRecordRequest({
        ...props,
        date: formatRFC3339(new Date(props.date)),
      });

      response.isError
        ? store.dispatch("common/setErrors", response.errors)
        : store.dispatch("records/update", {
            id: response.record.id,
            record: response.record,
          });

      response.isError || store.dispatch("common/setSuccess", true);
    } catch (e) {
      store.dispatch("common/setErrors", ["Сервер вернул ошибку"]);
    }

    store.dispatch("common/setPending", false);
  });
};
