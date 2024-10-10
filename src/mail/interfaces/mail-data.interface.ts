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

export interface enquiryAndComplaintEmailNotificationMailData {
  to: string;
  franchiseOwnerEmail: string;
  customerName: string; 
}