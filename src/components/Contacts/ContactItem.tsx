import React, { useState, useMemo, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import IconEdit from '../../assets/icons/icon-editing.svg';
import IconDelete from '../../assets/icons/icon-delete.svg';
import IconArrow from '../../assets/icons/icon-arrow.svg';
import { IContactsData } from '../../api/interfaces/IContacts';
import ContactsService from '../../services/ContactsService';
import ModalContactDelete from './ModalContactDelete';
import DefaultInput from '../Base/DefaultInput';
import Spinner from '../Base/Spinner';
import { toast } from 'react-toastify';
import { StatusEventsContactsEnum } from '../../api/interfaces/IContacts';
import { observer } from 'mobx-react';
import isEqual from '../../helpers/isEqual';

interface IFormInputContact {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
}

interface IContactItemProps {
  contact?: IContactsData;
  addNewModelStatus: boolean;
  addSuccess?: () => void | null;
}

const ContactItem: React.FC<IContactItemProps> = ({ contact, addNewModelStatus, addSuccess }) => {
  const { addNewContact, updateContactItem } = ContactsService;
  const [showContact, setShowContact] = useState<boolean>(false);
  const [showModalDeleteContact, setShowModalDeleteContact] = useState<boolean>(false);
  const [idDeleteContact, setIdDeleteContact] = useState<number | null>(null);
  const [contactEventStatus, setContactEventStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const initialFormValues = {
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    middleName: contact?.middleName || '',
    phone: contact?.phone || '',
    email: contact?.email || '',
  };

  const [formValues, setFormValues] = useState<IContactsData>(initialFormValues);
  const [formErrors, setFormErrors] = useState<IFormInputContact>({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const isEqualContactsObjects = (): boolean => {
    if (contact) {
      const copyObjectContact = { ...contact };
      delete copyObjectContact?.id;
      return isEqual(formValues, copyObjectContact);
    } else {
      return false;
    }
  };

  const memoizedIsEqualContactsObjects = useMemo(
    () => isEqualContactsObjects(),
    [formValues, contact],
  );
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (memoizedIsEqualContactsObjects) {
      toast.error(`Данные не изменились`);
      return;
    }

    if (!validate(formValues)) {
      return;
    }
    try {
      setLoading(true);
      if (addNewModelStatus) {
        await addNewContact(formValues);
        if (addSuccess) {
          addSuccess();
        }
        toast.success(`Контакт добавлен`);
      } else {
        if (idDeleteContact) {
          await updateContactItem(idDeleteContact, formValues);
          toast.success(`Контакт обновлен`);
        }
      }
    } catch (error: unknown) {
      toast.error(`Ошибка взаимодействия с контактом:${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name } = event.target;
    let value = event.target.value;
    if (name === 'phone') {
      value = value.replace(/\D/g, '');
    }
    setFormValues((prevState) => {
      const localValues = { ...prevState, [name]: value };
      validate(localValues);
      return { ...localValues };
    });
  };
  const validate = (values: IContactsData): boolean => {
    const errorsValues: IFormInputContact = {
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      email: '',
    };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    for (const key in values) {
      if (values[key as keyof IContactsData] === '') {
        errorsValues[key as keyof IFormInputContact] = 'Не может быть пустым';
      } else if (key === 'email') {
        if (!regex.test(values.email)) {
          errorsValues.email = 'Неверный формат электронной почты';
        }
      } else if (key === 'phone') {
        if (values.phone?.length < 8) {
          errorsValues.phone = 'телефон должен состоять из 8 цифр';
        }
      }
    }
    const foundErrorsValues = Object.keys(errorsValues).find(
      (key) => errorsValues[key as keyof IFormInputContact] !== '',
    );

    setFormErrors(errorsValues);
    return !foundErrorsValues;
  };
  const handleShowContact = (statusEvent: string) => {
    setContactEventStatus(statusEvent);
    if (!showContact || contactEventStatus === StatusEventsContactsEnum.SHOW) {
      setShowContact(!showContact);
    }
    if (showContact && contactEventStatus === StatusEventsContactsEnum.SHOW) {
      setContactEventStatus('');
    }
  };
  const handleEditContact = (id: number | null, statusEvent: string) => {
    setContactEventStatus(statusEvent);
    if (!showContact || contactEventStatus === StatusEventsContactsEnum.EDIT) {
      setShowContact(!showContact);
    }
    if (showContact && contactEventStatus === StatusEventsContactsEnum.EDIT) {
      setContactEventStatus('');
    }
    if (id) {
      setIdDeleteContact(id);
    }
  };
  const handleDeleteContact = (id: number | null, statusEvent: string): void => {
    setShowContact(false);
    setContactEventStatus(statusEvent);
    if (id) {
      setIdDeleteContact(id);
    }
    setShowModalDeleteContact(true);
  };
  const onCloseModalDeleteContact = (): void => {
    setShowModalDeleteContact(false);
    setContactEventStatus('');
  };
  useEffect(() => {
    if (!memoizedIsEqualContactsObjects && contactEventStatus !== '') {
      setFormValues(initialFormValues);
    }
  }, [contactEventStatus]);
  return (
    <>
      <div className="contact-item">
        <div className="contact-item__wrapper">
          {!addNewModelStatus && (
            <div className={`contact-item__title ${showContact ? 'active' : ''}`}>
              <div
                className="contact-item__name"
                onClick={() => handleShowContact(StatusEventsContactsEnum.SHOW)}
              >{`${contact?.firstName} ${contact?.middleName} ${contact?.lastName}`}</div>
              <div className="contact-item__tools">
                <button
                  className="contact-item__tools-button"
                  title="Просмотр"
                  onClick={() => handleShowContact(StatusEventsContactsEnum.SHOW)}
                >
                  <SVG
                    src={IconArrow}
                    className={`icon-show ${
                      contactEventStatus === StatusEventsContactsEnum.SHOW ? 'active' : ''
                    } `}
                  />
                </button>
                <button
                  className="contact-item__tools-button"
                  title="Редактировать"
                  onClick={() =>
                    handleEditContact(contact?.id || null, StatusEventsContactsEnum.EDIT)
                  }
                >
                  <SVG
                    src={IconEdit}
                    className={`icon-edit ${
                      contactEventStatus === StatusEventsContactsEnum.EDIT ? 'active' : ''
                    }`}
                  />
                </button>
                <button
                  title="Удалить"
                  className="contact-item__tools-button"
                  onClick={() =>
                    handleDeleteContact(contact?.id || null, StatusEventsContactsEnum.DELETE)
                  }
                >
                  <SVG
                    src={IconDelete}
                    className={`icon-delete ${
                      contactEventStatus === StatusEventsContactsEnum.DELETE ? 'active' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          <form
            className={`contact-item__form ${
              showContact || addNewModelStatus ? 'active' : 'inactive'
            } ${contactEventStatus}`}
            onSubmit={handleSubmit}
          >
            <div>
              <DefaultInput
                value={formValues.firstName}
                name="firstName"
                label="Имя"
                required={true}
                onChange={handleChange}
                placeholder="Имя"
                type="text"
                error={formErrors.firstName}
                disabled={loading}
              />
            </div>
            <div>
              <DefaultInput
                value={formValues.middleName}
                name="middleName"
                label="Фамилия"
                required={true}
                onChange={handleChange}
                placeholder="Фамилия"
                type="text"
                error={formErrors.middleName}
                disabled={loading}
              />
            </div>
            <div>
              <DefaultInput
                value={formValues.lastName}
                name="lastName"
                label="Отчество"
                required={true}
                onChange={handleChange}
                placeholder="Отчество"
                type="text"
                error={formErrors.lastName}
                disabled={loading}
              />
            </div>
            <div>
              <DefaultInput
                value={formValues.phone}
                name="phone"
                label="Телефон"
                required={true}
                onChange={handleChange}
                placeholder="Телефон"
                type="text"
                error={formErrors.phone}
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
                placeholder="E-mail"
                type="text"
                error={formErrors.email}
                disabled={loading}
              />
            </div>
            {contactEventStatus !== 'show' && (
              <button className="main-button" disabled={loading}>
                {loading ? <Spinner /> : 'Сохранить'}
              </button>
            )}
          </form>
        </div>
      </div>
      <ModalContactDelete
        open={showModalDeleteContact}
        id={idDeleteContact}
        onClose={onCloseModalDeleteContact}
      />
    </>
  );
};

export default observer(ContactItem);
