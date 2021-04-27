import { StoreonModule } from "storeon";
import { User } from "./user";
import { Service } from "./services";
import { Client } from "./clients";
import { Events, State } from "./index";
import { GetRecordsByDateRequest, getRecordsByDateRequest } from "../Api";

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
  recordsDate: GetRecordsByDateRequest;
};

export type RecordsEvents = {
  "records/fetch": void;
  "records/set": Record[];
  "records/setRecordsDate": GetRecordsByDateRequest;
};

export const records: StoreonModule<State, Events> = store => {
  store.on("@init", () => {
    const [month, day, year] = new Date().toLocaleDateString("en-Us").split("/");

    return {
      records: [],
      recordsDate: { year, day, month: month.toString().padStart(2, "0") },
    };
  });

  store.on("records/set", (state, records) => ({ ...state, records }));
  store.on("records/setRecordsDate", (state, recordsDate) => ({ ...state, recordsDate }));

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
};
