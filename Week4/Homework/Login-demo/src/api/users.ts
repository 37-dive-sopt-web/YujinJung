export interface UserSignupRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  age: number;
}

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  age: number;
}
