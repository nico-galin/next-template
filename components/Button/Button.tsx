import { type HTMLProps } from 'react';
import classes from 'utils/classes';
import styles from './Button.module.scss';

type Props = {
  variant?: 'outlined' | 'filled' | 'text';
  size?: 'small';
  color?: 'primary' | 'grey';
} & Omit<HTMLProps<HTMLButtonElement>, 'size'>;

export default function Button({
  variant = 'filled',
  color = 'primary',
  size,
  type: passedType,
  className,
  ...buttonProps
}: Props) {
  const variantClass = styles[variant];
  const colorClass = color === 'primary' ? styles.primary : styles.grey;
  const sizeClass = size === 'small' ? styles.small : null;
  const type = (passedType as HTMLButtonElement['type']) ?? 'button';
  return (
    <button
      type={type}
      className={classes(
        styles.container,
        variantClass,
        colorClass,
        sizeClass,
        className,
      )}
      {...buttonProps}
    />
  );
}
