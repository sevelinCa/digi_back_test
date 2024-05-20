import { User } from 'src/users/domain/user';

export type LoginResponseType = Readonly<{
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
  academy_jwt_token?: string;
  academy_bearer_token?: {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
  };
}>;
