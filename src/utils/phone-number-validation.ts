export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /^\(\d{1,3}\)\d+$/;
  
  return regex.test(phoneNumber);
}

export function removeCountryCode(phoneNumber: string): string {
  const regex = /^\(\d{1,3}\)/;
  
  return phoneNumber.replace(regex, '0');
}