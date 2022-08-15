export interface IContactsData {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
}
export enum StatusEventsContactsEnum {
  SHOW = 'show',
  EDIT = 'edit',
  DELETE = 'delete',
}
