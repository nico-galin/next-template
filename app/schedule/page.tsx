import Button from 'components/Button/Button';
import SlotPicker from './components/SlotPicker/SlotPicker';
import styles from './styles.module.scss';
export default function SchedulePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select your availability</h1>
      <div className={styles.slotPickerWrapper}>
        <SlotPicker />
      </div>
      <div className={styles.actionBtnContainer}>
        <Button variant='outlined' color='grey'>
          Cancel
        </Button>
        <Button>Continue</Button>
      </div>
    </div>
  );
}
