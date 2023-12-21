import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import DbUser from "App/Models/User";

// API types
export type RegisterResponse = {
  user: BaseUser;
  token: OpaqueTokenContract<DbUser>;
};

// Resource types
export type BaseUser = {
  id: number;
  email: string;
};
