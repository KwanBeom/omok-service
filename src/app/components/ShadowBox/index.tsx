import React from 'react';
import styles from './ShadowBox.module.css';

function ShadowBox({ children }: { children: React.ReactNode }) {
  return <div className={styles['shadow-box']}>{children}</div>;
}

export default ShadowBox;
