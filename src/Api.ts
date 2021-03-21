import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY,
  responseType: "json",
});

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  token: string;
};

export const SignInRequest = async (props: SignInRequest): Promise<SignInResponse> => {
  return Promise.resolve({ token: "213" });
};
