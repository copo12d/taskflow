export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
