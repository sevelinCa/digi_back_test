export interface ForgotPasswordForWebsMailData {
    to: string;
    data: {
       hash: string;
       websiteUrl: string;
    };
   }