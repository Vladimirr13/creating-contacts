import React, { useState } from 'react';

import { IAuthUserData } from '../../api/interfaces/IAuthorization';
import DefaultInput from '../../components/Base/DefaultInput';
import Spinner from '../../components/Base/Spinner';
import { toast } from 'react-toastify';
import AuthorizationService from '../../services/AuthorizationService';
import UserService from '../../services/UserService';

const AuthorizationForm: React.FC = () => {
  const { setToken, initLoggedIn } = AuthorizationService;
  const { getUserInfo } = UserService;
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setFormValues((prevState) => {
      const localValues = { ...prevState, [name]: value.trim() };
      validate(localValues, name);
      return { ...localValues };
    });
  };
  const [formValues, setFormValues] = useState<IAuthUserData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<IAuthUserData>({
    email: '',
    password: '',
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validate(formValues, 'all')) {
      return;
    }
    try {
      setLoading(true);
      const userData = await getUserInfo({
        email: formValues.email,
        password: formValues.password,
      });

      if (userData.length && userData[0].token) {
        setToken(userData[0].token);
        initLoggedIn();
      } else {
        toast.error('Email или пароль не верны');
      }
    } catch (error: unknown) {
      toast.error(`Вход не выполнен:${error}`);
    } finally {
      setLoading(false);
    }
  };
  const validate = (values: IAuthUserData, fieldName: string): boolean => {
    const errorsValues: IAuthUserData = {
      email: '',
      password: '',
    };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (fieldName === 'email' || fieldName === 'all') {
      if (values.email === '') {
        errorsValues.email = 'Не может быть пустым';
      } else if (!regex.test(values.email)) {
        errorsValues.email = 'Неверный формат электронной почты';
      }
    }
    if (fieldName === 'password' || fieldName === 'all') {
      if (values.password === '') {
        errorsValues.password = 'Не может быть пустым';
      } else if (values.password.length < 4) {
        errorsValues.password = 'Пароль должен содержать минимум 4 символа';
      }
    }

    const foundErrorsValues = Object.keys(errorsValues).find(
      (key) => errorsValues[key as keyof IAuthUserData] !== '',
    );

    setFormErrors(errorsValues);
    return !foundErrorsValues;
  };
  return (
    <div className="authorization__form-wrapper">
      <h2 className="authorization__form-title">Авторизация</h2>
      <form onSubmit={handleSubmit} className="authorization__form">
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
        <div className="authorization__button">
          <button className="main-button" disabled={loading}>
            {loading ? <Spinner /> : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorizationForm;
