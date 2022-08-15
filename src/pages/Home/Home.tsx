import React, { useEffect, useState } from 'react';
import ContactItem from '../../components/Contacts/ContactItem';
import ContactsService from '../../services/ContactsService';
import { IContactsData } from '../../api/interfaces/IContacts';
import Modal from 'react-responsive-modal';
import { observer } from 'mobx-react';
import Search from '../../components/Search/Search';
import Spinner from '../../components/Base/Spinner';
import { toast } from 'react-toastify';
import UserService from '../../services/UserService';

const Home = () => {
  const { getContactsList, contactsList } = ContactsService;
  const { userInfo } = UserService;
  const [contacts, setContacts] = useState<IContactsData[]>([]);
  const [showAddNewContactModal, setShowAddNewContactModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleGetContactsList();
  }, []);
  const handleGetContactsList = async (): Promise<void> => {
    try {
      setLoading(true);
      await getContactsList();
    } catch (error: unknown) {
      toast.error(`Ошибка получения контактов:${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setContacts(contactsList);
  }, [contactsList]);

  const handleAddNewContact = (): void => {
    setShowAddNewContactModal(true);
  };
  const onCloseModalNewContact = (): void => {
    setShowAddNewContactModal(false);
  };
  const handleQuerySearch = (query: string, dataContactsListFiltered: IContactsData[]): void => {
    if (query) {
      setContacts(dataContactsListFiltered);
    } else {
      setContacts(contactsList);
    }
  };
  return (
    <div className="home-page">
      <div className="home-page__wrapper-title">
        {userInfo?.name}
        <h1 className="title">Список контактов</h1>
        <Search setQuery={handleQuerySearch} />
      </div>
      {loading && <Spinner className="home-page__loading-contacts" />}
      {!!contacts.length &&
        !loading &&
        contacts.map((contact, i) => {
          return (
            <ContactItem
              contact={contact}
              key={`${contact.firstName}${contact.id}${i}`}
              addNewModelStatus={false}
            />
          );
        })}
      {!contacts.length && !loading && (
        <div className="home-page__not-found-contacts"> не найдено ни одного контакта :(</div>
      )}
      <div className="home-page__add-buttons">
        <button onClick={handleAddNewContact} className="main-button">
          добавить контакт
        </button>
      </div>
      <Modal
        open={showAddNewContactModal}
        onClose={onCloseModalNewContact}
        center={true}
        classNames={{
          overlay: 'add-contact-modal__overlay',
          modal: 'add-contact-modal__container',
        }}
      >
        <h2>Добавить новый контакт</h2>
        <ContactItem addNewModelStatus={true} addSuccess={onCloseModalNewContact} />
      </Modal>
    </div>
  );
};

export default observer(Home);
