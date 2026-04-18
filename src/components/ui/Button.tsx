import { ButtonHTMLAttributes } from 'react';
import { styles } from '@/styles/styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'secondary' ? styles.button.secondary : styles.button.primary;

  return <button className={`${variantClass} ${className}`} {...props} />;
}