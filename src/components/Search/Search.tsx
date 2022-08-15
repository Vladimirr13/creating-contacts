import React, { useState } from 'react';
import ContactsService from '../../services/ContactsService';
import { IContactsData } from '../../api/interfaces/IContacts';
import DefaultInput from '../Base/DefaultInput';

interface ISearchProps {
  setQuery: (query: string, arr: IContactsData[]) => void;
}

const Search: React.FC<ISearchProps> = ({ setQuery }) => {
  const { contactsList } = ContactsService;
  const [value, setValue] = useState<string>('');
  const handleQuery = (
    name: string,
    withoutSpaces: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const querySearch = event.target.value;
    setValue(querySearch);
    const contactsListFiltered = contactsList.filter(
      (contactItem) =>
        contactItem.firstName.toLowerCase().includes(querySearch.toLowerCase()) ||
        contactItem.middleName.toLowerCase().includes(querySearch.toLowerCase()) ||
        contactItem.lastName.toLowerCase().includes(querySearch.toLowerCase()),
    );
    setQuery(querySearch, contactsListFiltered);
  };

  return (
    <div className="search">
      <DefaultInput
        value={value}
        name="search"
        label="Поиск"
        required={false}
        withoutSpaces={false}
        onChange={handleQuery}
        placeholder="ФИО"
        type="search"
        showIcon={false}
      />
    </div>
  );
};

export default Search;
