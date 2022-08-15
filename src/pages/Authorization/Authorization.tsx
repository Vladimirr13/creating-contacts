import React, { useEffect, useState } from 'react';
import AuthorizationService from '../../services/AuthorizationService';
import { IAuthUserData } from '../../api/interfaces/IAuthorization';
import DefaultInput from '../../components/Base/DefaultInput';
import Spinner from '../../components/Base/Spinner';
import HistoryService from '../../services/HistoryService';
import { RoutesEnum } from '../../routes';
import { toast } from 'react-toastify';

interface IFormInput {
  email: string;
  password: string;
}

const Authorization: React.FC = () => {
  const { authUser, initLoggedIn, loggedIn } = AuthorizationService;
  const { history } = HistoryService;

  useEffect(() => {
    if (loggedIn) {
      history.push(RoutesEnum.MAIN);
    }
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (
    name: string,
    withoutSpaces: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { value } = event.target;
    setFormValues((prevState) => {
      const localValues = { ...prevState, [name]: withoutSpaces ? value.trim() : value };
      validate(localValues);
      return { ...localValues };
    });
  };
  const [formValues, setFormValues] = useState<IAuthUserData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<IFormInput>({
    email: '',
    password: '',
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    let hasErrors = false;
    if (!validate(formValues)) {
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }
    try {
      setLoading(true);
      const newFormValues = { ...formValues, token: `${formValues.email}${formValues.password}` };
      const userData = await authUser(newFormValues);
      if (userData.token) {
        initLoggedIn();
      }
    } catch (error: unknown) {
      toast.error(`Вход не выполнен:${error}`);
    } finally {
      setLoading(false);
    }
  };
  const validate = (values: IFormInput): boolean => {
    const errorsValues: IFormInput = {
      email: '',
      password: '',
    };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (values.email === '') {
      errorsValues.email = 'Не может быть пустым';
    } else if (!regex.test(values.email)) {
      errorsValues.email = 'Неверный формат электронной почты';
    }
    if (values.password === '') {
      errorsValues.password = 'Не может быть пустым';
    } else if (values.password.length < 4) {
      errorsValues.password = 'Пароль должен содержать минимум 4 символа';
    }
    const foundErrorsValues = Object.keys(errorsValues).find(
      (key) => errorsValues[key as keyof IFormInput] !== '',
    );

    setFormErrors(errorsValues);
    return !foundErrorsValues;
  };
  return (
    <div className="authorization">
      <div className="authorization__form-wrapper">
        <form onSubmit={handleSubmit} className="authorization__form">
          <div>
            <DefaultInput
              value={formValues.email}
              name="email"
              label="E-mail"
              required={true}
              withoutSpaces={true}
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
              withoutSpaces={true}
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
    </div>
  );
};

export default Authorization;
