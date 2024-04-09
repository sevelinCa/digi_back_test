// export interface MailData<T = never> {
//   to: string;
//   data: T;
// }


export interface MailData<T extends { hash: string; websiteUrl?: string; }> {
  to: string;
  data: T;
 }