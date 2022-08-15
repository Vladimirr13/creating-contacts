import { apiInstance } from '../api';
import { IAuthUserData } from '../interfaces/IAuthorization';

export const authorization = async (userData: IAuthUserData): Promise<IAuthUserData> => {
  try {
    const res = await apiInstance().post(`authUsers`, { ...userData });
    return res.data;
  } catch (e) {
    throw e;
  }
};