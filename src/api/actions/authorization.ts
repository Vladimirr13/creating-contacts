import { apiInstance } from '../api';
import { IAuthUserData, IGetAuthUsers } from '../interfaces/IAuthorization';

export const getAuthorizedUser = async (userData: IGetAuthUsers): Promise<IAuthUserData[]> => {
  try {
    const res = await apiInstance().get(`authUsers`, { params: { ...userData } });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const authorization = async (userData: IAuthUserData): Promise<IAuthUserData> => {
  try {
    const res = await apiInstance().post(`authUsers`, { ...userData });
    return res.data;
  } catch (e) {
    throw e;
  }
};
