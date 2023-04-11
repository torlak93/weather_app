
export interface IUserModel {
  token: string;
  user: IUser;
}

export interface IUser {
  id?: string;
  email?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  role?: string;
}