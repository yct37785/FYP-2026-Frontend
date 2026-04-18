import { PropsWithChildren } from 'react';
import { styles } from '@/styles/styles';

export function Card({ children }: PropsWithChildren) {
  return <div className={styles.card.base}>{children}</div>;
}