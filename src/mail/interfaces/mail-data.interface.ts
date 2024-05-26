export interface MailData<T = never> {
  to: string;
  websiteUrl?: string;
  data: T;
}
