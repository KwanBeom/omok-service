import { ButtonHTMLAttributes } from 'react';
import styles from './ConfirmButton.module.css';

function ConfirmButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <button type="button" className={styles.button} {...props}>
      {children}
    </button>
  );
}

export default ConfirmButton;
