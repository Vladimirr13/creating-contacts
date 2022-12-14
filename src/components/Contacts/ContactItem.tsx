import React, { useState, useMemo, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import IconEdit from '../../assets/icons/icon-editing.svg';
import IconDelete from '../../assets/icons/icon-delete.svg';
import IconArrow from '../../assets/icons/icon-arrow.svg';
import { IContactsData } from '../../api/interfaces/IContacts';
import ContactsService from '../../services/ContactsService';
import UserService from '../../services/UserService';
import ModalContactDelete from './ModalContactDelete';
import DefaultInput from '../Base/DefaultInput';
import Spinner from '../Base/Spinner';
import { toast } from 'react-toastify';
import { StatusEventsContactsEnum } from '../../api/interfaces/IContacts';
import { observer } from 'mobx-react';
import isEqual from 'lodash/isEqual';
import { handleValidEmail, handleValidName, handleValidPhone } from '../../helpers/fieldsValidate';

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
  const { userInfo } = UserService;
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
    token: userInfo?.token,
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
      toast.error(`???????????? ???? ????????????????????`);
      return;
    }

    if (!isValid(formValues, 'all')) {
      return;
    }
    try {
      setLoading(true);
      if (addNewModelStatus) {
        await addNewContact(formValues);
        if (addSuccess) {
          addSuccess();
        }
        toast.success(`?????????????? ????????????????`);
      } else {
        if (idDeleteContact) {
          await updateContactItem(idDeleteContact, formValues);
          toast.success(`?????????????? ????????????????`);
        }
      }
    } catch (error: unknown) {
      toast.error(`???????????? ???????????????????????????? ?? ??????????????????:${error}`);
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
      const localValues = { ...prevState, [name]: value.trim() };
      isValid(localValues, name);
      return { ...localValues };
    });
  };
  const isValid = (values: IContactsData, fieldName: string): boolean => {
    const errorsValues: IFormInputContact = {
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      email: '',
    };
    if (fieldName === 'firstName' || fieldName === 'all') {
      errorsValues.firstName = handleValidName(values.firstName);
    }
    if (fieldName === 'middleName' || fieldName === 'all') {
      errorsValues.middleName = handleValidName(values.middleName);
    }
    if (fieldName === 'lastName' || fieldName === 'all') {
      errorsValues.lastName = handleValidName(values.lastName);
    }
    if (fieldName === 'email' || fieldName === 'all') {
      errorsValues.email = handleValidEmail(values.email);
    }
    if (fieldName === 'phone' || fieldName === 'all') {
      errorsValues.phone = handleValidPhone(values.phone, 11);
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
                  title="????????????????"
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
                  title="??????????????????????????"
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
                  title="??????????????"
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
                label="??????"
                required={true}
                onChange={handleChange}
                placeholder="??????"
                type="text"
                error={formErrors.firstName}
                disabled={loading}
              />
            </div>
            <div>
              <DefaultInput
                value={formValues.middleName}
                name="middleName"
                label="??????????????"
                required={true}
                onChange={handleChange}
                placeholder="??????????????"
                type="text"
                error={formErrors.middleName}
                disabled={loading}
              />
            </div>
            <div>
              <DefaultInput
                value={formValues.lastName}
                name="lastName"
                label="????????????????"
                required={true}
                onChange={handleChange}
                placeholder="????????????????"
                type="text"
                error={formErrors.lastName}
                disabled={loading}
              />
            </div>
            <div>
              <DefaultInput
                value={formValues.phone}
                name="phone"
                label="??????????????"
                required={true}
                onChange={handleChange}
                placeholder="??????????????"
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
                {loading ? <Spinner /> : '??????????????????'}
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
