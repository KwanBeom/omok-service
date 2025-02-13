import styles from './modal.module.css';
import { useState } from 'react';

type ModalProps = {
  isOpen?: boolean;
  title?: string;
  content?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
};

const Modal = ({ title, isOpen, placeholder, content, onSubmit, onCancel }: ModalProps) => {
  const [value, setValue] = useState('');
  return (
    isOpen && (
      <>
        <div className={styles.modal}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.content}>{content}</p>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => {
                if (onSubmit) {
                  onSubmit(value);
                }
              }}
            >
              확인
            </button>
            <button type="button" onClick={onCancel}>
              취소
            </button>
          </div>
        </div>
        <div className={styles.backdrop} />
      </>
    )
  );
};

export default Modal;
