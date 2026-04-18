import { forwardRef, InputHTMLAttributes } from 'react';
import { styles } from '@/styles/styles';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  return <input ref={ref} className={styles.input.base} {...props} />;
});