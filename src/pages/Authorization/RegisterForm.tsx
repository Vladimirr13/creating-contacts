import React, { useState } from 'react';
import { IRegisterUserData } from '../../api/interfaces/IAuthorization';
import DefaultInput from '../../components/Base/DefaultInput';
import Spinner from '../../components/Base/Spinner';
import { toast } from 'react-toastify';
import AuthorizationService from '../../services/AuthorizationService';
import UserService from '../../services/UserService';
import {
  handleValidConfirmPassword,
  handleValidEmail,
  handleValidName,
  handleValidPassword,
} from '../../helpers/fieldsValidate';

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authUser, initLoggedIn } = AuthorizationService;
  const { getUserInfo, setUserInfo } = UserService;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setFormValues((prevState) => {
      const localValues = { ...prevState, [name]: value.trim() };
      isValid(localValues, name);
      return { ...localValues };
    });
  };
  const [formValues, setFormValues] = useState<IRegisterUserData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<IRegisterUserData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!isValid(formValues, 'all')) {
      return;
    }
    try {
      setLoading(true);

      const userData = await getUserInfo({
        email: formValues.email,
      });
      if (userData.length) {
        toast.error('Email уже используется');
      } else {
        const newFormValues = {
          ...formValues,
          token: `${new Date().getTime()}`,
        };
        delete newFormValues.confirmPassword;
        const userAuthData = await authUser(newFormValues);
        if (userAuthData.token) {
          setUserInfo(userAuthData);
          initLoggedIn();
        }
      }
    } catch (error: unknown) {
      toast.error(`Вход не выполнен:${error}`);
    } finally {
      setLoading(false);
    }
  };
  const isValid = (values: IRegisterUserData, fieldName: string): boolean => {
    const errorsValues: IRegisterUserData = {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    };

    if (fieldName === 'name' || fieldName === 'all') {
      errorsValues.name = handleValidName(values.name);
    }

    if (fieldName === 'email' || fieldName === 'all') {
      errorsValues.email = handleValidEmail(values.email);
    }
    if (fieldName === 'password' || fieldName === 'all') {
      errorsValues.password = handleValidPassword(values.password, 5);
    }
    if (fieldName === 'confirmPassword' || fieldName === 'all') {
      errorsValues.confirmPassword = handleValidConfirmPassword(
        values.confirmPassword,
        values.password,
      );
    }

    const foundErrorsValues = Object.keys(errorsValues).find(
      (key) => errorsValues[key as keyof IRegisterUserData] !== '',
    );

    setFormErrors(errorsValues);
    return !foundErrorsValues;
  };
  return (
    <div className="authorization__form-wrapper">
      <h2 className="authorization__form-title">Регистрация</h2>
      <form onSubmit={handleSubmit} className="authorization__form">
        <div>
          <DefaultInput
            value={formValues.name}
            name="name"
            label="Имя"
            required={true}
            onChange={handleChange}
            error={formErrors.name}
            placeholder="Имя пользователя"
            type="name"
            disabled={loading}
          />
        </div>
        <div>
          <DefaultInput
            value={formValues.email}
            name="email"
            label="E-mail"
            required={true}
            onChange={handleChange}
            error={formErrors.email}
            placeholder="email"
            type="text"
            autoComplete="on"
            disabled={loading}
          />
        </div>
        <div>
          <DefaultInput
            value={formValues.password}
            name="password"
            label="Пароль"
            required={true}
            onChange={handleChange}
            error={formErrors.password}
            placeholder="Пароль"
            type="password"
            disabled={loading}
          />
        </div>
        <div>
          <DefaultInput
            value={formValues.confirmPassword}
            name="confirmPassword"
            label="Подтверждение пароля"
            required={true}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            placeholder="Подтверждение пароля"
            type="password"
            disabled={loading}
          />
        </div>
        <div className="authorization__button">
          <button className="main-button" disabled={loading}>
            {loading ? <Spinner /> : 'Зарегистрироваться'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
