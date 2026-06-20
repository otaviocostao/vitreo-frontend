export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}
