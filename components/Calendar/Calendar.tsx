'use client';
import ChevronLeftIcon from 'app/assets/icons/ChevronLeftIcon.svg';
import ChevronRightIcon from 'app/assets/icons/ChevronRightIcon.svg';
import Button from 'components/Button/Button';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import generateArray from 'utils/arrayUtils';
import classes from 'utils/classes';
import { modulo } from 'utils/mathUtils';
import styles from './Calendar.module.scss';

type Props = {
  selected?: Dayjs;
  onChange?(date: Dayjs): void;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function Calendar({ selected, onChange }: Props) {
  const today = dayjs().startOf('day');
  const [date, setDate] = useState<Dayjs>(
    selected ? selected.startOf('day') : today,
  );
  const [month, setMonth] = useState<number>(parseInt(date.format('M')) - 1);
  const [year, setYear] = useState<number>(parseInt(date.format('YYYY')));
  const firstOfMonth = date.month(month).startOf('month');
  const daysInMonth = date.month(month).daysInMonth();

  let firstSunday = firstOfMonth;
  while (firstSunday.format('d') != '0') {
    firstSunday = firstSunday.subtract(1, 'day');
  }
  let lastSaturday = firstOfMonth.add(daysInMonth, 'days');
  let totalDays = Math.abs(firstSunday.diff(lastSaturday, 'days')) + 1;
  while (totalDays <= 35 || lastSaturday.format('d') != '6') {
    lastSaturday = lastSaturday.add(1, 'day');
    totalDays += 1;
  }
  const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  function handleChangeDate(newDate: Dayjs) {
    if (onChange) onChange(newDate);
    setDate(newDate);
    setMonth(newDate.month());
  }

  function subtractMonth() {
    setMonth((prev) => modulo(prev - 1, 12));
    if (month === 0) {
      setYear((prev) => prev - 1);
    }
  }

  function addMonth() {
    setMonth((prev) => modulo(prev + 1, 12));
    if (month === 11) {
      setYear((prev) => prev + 1);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.month}>
        <Button variant='text' size='small' onClick={subtractMonth}>
          <ChevronLeftIcon />
        </Button>
        {`${months[month] ?? ''} ${year}`}
        <Button variant='text' size='small' onClick={addMonth}>
          <ChevronRightIcon />
        </Button>
      </div>
      <div className={styles.weekdays}>
        {weekdays.map((day) => (
          <div key={day} className={styles.cell}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.dates}>
        {generateArray(totalDays).map((_, idx) => {
          const curDate = firstSunday.add(idx, 'days');
          const isCurMonth = curDate.month() === month;
          const isSelected = curDate.isSame(date);
          const isToday = curDate.isSame(today);
          return (
            <button
              key={idx}
              onClick={() => handleChangeDate(curDate)}
              className={classes(
                styles.cell,
                !isCurMonth ? styles.diffMonth : null,
                isSelected ? styles.selected : null,
                isToday ? styles.today : null,
              )}
            >
              <time dateTime={curDate.format()}>{curDate.format('D')}</time>
            </button>
          );
        })}
      </div>
    </div>
  );
}
