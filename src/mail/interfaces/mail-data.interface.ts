export interface MailData<T = never> {
  to: string;
  websiteUrl?: string;
  data: T;
}

export interface OrderStatusUpdateMailData {
  to: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  orderUrl: string;
}


export interface enquiryEmailNotificationMailData {
  to: string;
  franchiseOwnerEmail: string;
  customerName: string; 
}


