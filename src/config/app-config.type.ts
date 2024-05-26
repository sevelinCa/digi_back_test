export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};

export interface AppConfigType {
  ACADEMY_API_BASE_URL: string;
  ACADEMY_CSRF_TOKEN_ENDPOINT: string;
  ACADEMY_REGISTER_ENDPOINT: string;
  ACADEMY_LOGIN_ENDPOINT: string;
  ACADEMY_ORIGIN_URL: string;
}
