import styles from './layout.module.css'

function Layout({ children }: { children: React.ReactNode }) {
  return <section className={styles.section}>{children}</section>;
}

export default Layout