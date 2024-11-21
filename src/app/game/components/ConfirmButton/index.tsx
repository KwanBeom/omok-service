import { ButtonHTMLAttributes } from 'react';
import styles from './ConfirmButton.module.css';

/** 착수 버튼 */
function ConfirmButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <button type="button" className={styles.button} {...props}>
      착수
    </button>
  );
}

export default ConfirmButton;
