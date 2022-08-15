import { apiInstance } from '../api';
import { IContactsData } from '../interfaces/IContacts';

export const contacts = async (token: string): Promise<IContactsData[]> => {
  try {
    const res = await apiInstance().get(`contacts`, {
      params: {
        token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const addContact = async (contactData: IContactsData): Promise<IContactsData> => {
  try {
    const res = await apiInstance().post(`contacts`, { ...contactData });
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteContact = async (id: number): Promise<IContactsData> => {
  try {
    const res = await apiInstance().delete(`contacts/${id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const editContact = async (
  id: number,
  contactData: IContactsData,
): Promise<IContactsData> => {
  try {
    const res = await apiInstance().put(`contacts/${id}`, { ...contactData });
    return res.data;
  } catch (e) {
    throw e;
  }
};
