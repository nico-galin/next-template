import Calendar from 'components/Calendar/Calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type ScheduleCampaign from 'models/ScheduleCampaign';
import styles from './styles.module.scss';
dayjs.extend(utc);

const today = dayjs().utc();

type AvailableSlotsResponse = {
  campaign: ScheduleCampaign;
  availableSlots: string[];
};

const slotsResponseDummy = {
  campaign: {},
  availableSlots: [
    today.format(),
    today.add(1, 'hour'),
    today.add(2, 'hour'),
    today.add(3.5, 'hour'),
    today.add(1, 'day').format(),
  ],
};

export default function BookPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Calendar />
        <div className={styles.divider} />
      </div>
    </div>
  );
}
