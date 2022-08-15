import React, { useState } from 'react';
import { IRegisterUserData } from '../../api/interfaces/IAuthorization';
import DefaultInput from '../../components/Base/DefaultInput';
import Spinner from '../../components/Base/Spinner';
import { toast } from 'react-toastify';
import AuthorizationService from '../../services/AuthorizationService';
import UserService from '../../services/UserService';

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authUser, initLoggedIn } = AuthorizationService;
  const { getUserInfo, setUserInfo } = UserService;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setFormValues((prevState) => {
      const localValues = { ...prevState, [name]: value };
      validate(localValues, name);
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

    if (!validate(formValues, 'all')) {
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
  const validate = (values: IRegisterUserData, fieldName: string): boolean => {
    const errorsValues: IRegisterUserData = {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (fieldName === 'name' || fieldName === 'all') {
      if (values.name === '') {
        errorsValues.name = 'Не может быть пустым';
      }
    }

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
    if (fieldName === 'confirmPassword' || fieldName === 'all') {
      if (values.confirmPassword === '') {
        errorsValues.confirmPassword = 'Не может быть пустым';
      } else if (values.confirmPassword !== values.password) {
        errorsValues.confirmPassword = 'Пароль должен совпадать';
      }
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
            {loading ? <Spinner /> : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
