export interface AuthTokenResponse {
  access_token?: string;
  token?: string;
  refresh_token?: string;
  access_ttl?: number;
  refresh_ttl?: number;
  role?: string;
  user_id?: string;
  user?: {
    id?: number | string;
    email?: string;
    fullName?: string;
  };
}
 
