import { useEffect, useRef, useState } from 'react';
import styles from './modal.module.css';

type ModalProps = {
  isOpen?: boolean;
  toggleOpen?: () => void;
  title?: string;
  content?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
};

function Modal({
  title,
  isOpen,
  toggleOpen,
  placeholder,
  content,
  onSubmit,
  onCancel,
}: ModalProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const keydownClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toggleOpen) toggleOpen();
    };
    window.addEventListener('keydown', keydownClose);
    return () => window.removeEventListener('keydown', keydownClose);
  }, [toggleOpen]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    isOpen && (
      <>
        <div className={styles.modal}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.content}>{content}</p>
          <input
            type="text"
            ref={inputRef}
            className={styles.input}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <button type="button" className={styles['cancel-button']} onClick={onCancel}>
              취소
            </button>
            <button
              type="button"
              className={styles['confirm-button']}
              onClick={() => {
                if (onSubmit) {
                  onSubmit(value);
                }
              }}
            >
              확인
            </button>
          </div>
        </div>
        <div
          className={styles.backdrop}
          role="button"
          tabIndex={0}
          onMouseDown={toggleOpen}
          aria-label="close modal"
        />
      </>
    )
  );
}

export default Modal;
