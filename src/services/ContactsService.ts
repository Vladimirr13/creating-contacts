import { action, makeObservable, observable, runInAction } from 'mobx';
import { IContactsData } from '../api/interfaces/IContacts';
import { addContact, contacts, deleteContact, editContact } from '../api/actions/contacts';

class ContactsService {
  contactsList: IContactsData[] | [];

  constructor() {
    makeObservable(this, {
      contactsList: observable,
      getContactsList: action,
      addNewContact: action,
      deleteContactItem: action,
      updateContactItem: action,
    });
    this.contactsList = [];
  }

  getContactsList = async (): Promise<IContactsData[]> => {
    try {
      const contactsList = await contacts();
      if (contactsList.length) {
        runInAction(() => {
          this.contactsList = contactsList;
        });
      }
      return contactsList;
    } catch (e) {
      throw e;
    }
  };
  addNewContact = async (contactData: IContactsData): Promise<IContactsData> => {
    try {
      const contact = await addContact(contactData);
      if (contact) {
        runInAction(() => {
          this.contactsList = [...this.contactsList, ...[contact]];
        });
      }
      return contact;
    } catch (e) {
      throw e;
    }
  };
  deleteContactItem = async (id: number): Promise<void> => {
    try {
      await deleteContact(id);
      runInAction(() => {
        this.contactsList = this.contactsList.filter((contactItem) => contactItem.id !== id);
      });
    } catch (e) {
      throw e;
    }
  };
  updateContactItem = async (id: number, contactData: IContactsData): Promise<void> => {
    try {
      const editedContact = await editContact(id, contactData);
      runInAction(() => {
        this.contactsList = this.contactsList.map((contactsItem) => {
          if (contactsItem.id === editedContact.id) {
            contactsItem = { ...editedContact };
          }
          return contactsItem;
        });
      });
    } catch (e) {
      throw e;
    }
  };
}

export default new ContactsService();
