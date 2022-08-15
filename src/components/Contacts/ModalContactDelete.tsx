import React, { useState } from 'react';
import Modal from 'react-responsive-modal';
import ContactsService from '../../services/ContactsService';
import Spinner from '../Base/Spinner';
import { toast } from 'react-toastify';

interface IModalContactDeleteProps {
  onClose: () => void;
  open: boolean;
  id: number | null;
}

const ModalContactDelete: React.FC<IModalContactDeleteProps> = ({ onClose, open, id }) => {
  const { deleteContactItem } = ContactsService;
  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = async (): Promise<void> => {
    try {
      setLoading(true);
      if (id) {
        await deleteContactItem(id);
        toast.success(`Контакт удален`);
      }
    } catch (error: unknown) {
      toast.error(`Удаление не выполнено:${error}`);
    }
  };
  const handleReject = (): void => {
    onClose();
  };
  return (
    <Modal
      classNames={{
        overlay: 'delete-contact-modal__overlay',
        modal: 'delete-contact-modal__container',
      }}
      onClose={onClose}
      open={open}
    >
      <h2>Вы действительно хотите удалить контакт ?</h2>
      {loading ? (
        <Spinner />
      ) : (
        <div className="delete-contact-modal__buttons">
          <button className="main-button" onClick={handleAccept}>
            ДА
          </button>
          <button className="empty-button" onClick={handleReject}>
            Нет
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ModalContactDelete;
