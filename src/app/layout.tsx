import { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Gomoku',
  description: '온라인 2인 오목 게임',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      <body>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <div className={styles.wrapper}>{children}</div>
        </Suspense>
      </body>
    </html>
  );
}
