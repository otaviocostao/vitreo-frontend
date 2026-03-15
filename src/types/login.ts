export interface LoginResponse {
  email: string;
  jwtToken: string;
  password?: string | null;
}