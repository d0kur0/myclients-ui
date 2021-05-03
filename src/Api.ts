import axios from "axios";
import { User } from "./store/user";
import { Client } from "./store/clients";
import { Service } from "./store/services";
import { Record } from "./store/records";
import { format } from "date-fns";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY,
  responseType: "json",
});

/* user sign */

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  isError: boolean;
  errors: string[];
  user: User;
  token: string;
};

export const signInRequest = async (props: SignInRequest): Promise<SignInResponse> => {
  return await API.post("/user/signIn", props).then(response => response.data);
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  isError: boolean;
  errors: string[];
  user: User;
  token: string;
};

export const signUpRequest = async (props: SignUpRequest): Promise<SignUpResponse> => {
  return await API.post("/user/signUp", props).then(response => response.data);
};

/* clients */

export const getClientsRequest = async (): Promise<Client[]> => {
  return await API.post("/client/getAll", "", {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

export type CreateClientRequest = {
  firstName: string;
  middleName: string;
  description: string;
};

export type CreateClientResponse = {
  isError: boolean;
  errors: string[];
  client: Client;
};

export const createClientRequest = async (
  props: CreateClientRequest
): Promise<CreateClientResponse> => {
  return await API.post("client/create", props, {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

export type DeleteClientRequest = {
  id: number;
};

export const deleteClientRequest = async (props: DeleteClientRequest) => {
  return await API.post("client/delete", props, {
    headers: { AuthToken: localStorage.token },
  });
};

export type UpdateClientRequest = {
  id: number;
  firstName: string;
  middleName: string;
  description: string;
};

export type UpdateClientResponse = {
  isError: boolean;
  errors: string[];
  client: Client;
};

export const updateClientRequest = async (
  props: UpdateClientRequest
): Promise<UpdateClientResponse> => {
  return await API.post("client/update", props, {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

/* services */

export const getServicesRequest = async (): Promise<Service[]> => {
  return await API.post("service/getAll", "", {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

export type CreateServiceRequest = {
  name: string;
  price: number;
};

export type CreateServiceResponse = {
  isError: boolean;
  errors: string[];
  service: Service;
};

export const createServiceRequest = async (
  props: CreateServiceRequest
): Promise<CreateServiceResponse> => {
  return await API.post("service/create", props, {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

export type UpdateServiceRequest = {
  id: number;
  name: string;
  price: number;
};

export type UpdateServiceResponse = {
  isError: boolean;
  errors: string[];
  service: Service;
};

export const updateServiceRequest = async (
  props: UpdateServiceRequest
): Promise<UpdateServiceResponse> => {
  return await API.post("service/update", props, {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

export type DeleteServiceRequest = {
  id: number;
};

export const deleteServiceRequest = async (props: DeleteServiceRequest) => {
  return await API.post("service/delete", props, {
    headers: { AuthToken: localStorage.token },
  });
};

/* records */

export type GetRecordsCountOfMonthRequest = Date;
export type GetRecordsCountOfMonthResponse = { day: number; count: number }[];

export const getRecordsCountOFMonthRequest = async (
  date: GetRecordsCountOfMonthRequest
): Promise<GetRecordsCountOfMonthResponse> => {
  return await API.post(
    "record/getCountOfMonth",
    { date: format(date, "yyyy-MM-dd") },
    {
      headers: { AuthToken: localStorage.token },
    }
  ).then(response => response.data);
};

export type GetRecordsByDateRequest = Date;

export const getRecordsByDateRequest = async (
  date: GetRecordsByDateRequest
): Promise<Record[]> => {
  return await API.post(
    "record/getByDate",
    { date: format(date, "yyyy-MM-dd") },
    {
      headers: { AuthToken: localStorage.token },
    }
  ).then(response => response.data);
};

export type CreateRecordRequest = {
  serviceIds: number[];
  clientId: number;
  date: string;
};

export type CreateRecordResponse = {
  isError: boolean;
  errors: string[];
  record: Record;
};

export const createRecordRequest = async (
  props: CreateRecordRequest
): Promise<CreateRecordResponse> => {
  return API.post("record/create", props, {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};

export type DeleteRecordRequest = {
  id: number;
};

export const deleteRecordRequest = async (props: DeleteRecordRequest) => {
  return await API.post("record/delete", props, {
    headers: { AuthToken: localStorage.token },
  });
};

export type UpdateRecordRequest = {
  id: number;
  serviceIds: number[];
  clientId: number;
  date: string;
};

export type UpdateRecordResponse = {
  isError: boolean;
  errors: string[];
  record: Record;
};

export const updateRecordRequest = async (
  props: UpdateRecordRequest
): Promise<UpdateRecordResponse> => {
  return await API.post("record/update", props, {
    headers: { AuthToken: localStorage.token },
  }).then(response => response.data);
};
