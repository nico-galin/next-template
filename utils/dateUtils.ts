import { type Dayjs } from 'dayjs';

export function isBeforeOrSame(date0: Dayjs, date1: Dayjs) {
  return date0.isBefore(date1) || date0.isSame(date1);
}

export function isAfterOrSame(date0: Dayjs, date1: Dayjs) {
  return date0.isAfter(date1) || date0.isSame(date1);
}

export function areEventsOverlapping(
  event0Start: Dayjs,
  event1Start: Dayjs,
  event0End: Dayjs,
  event1End: Dayjs,
) {
  if (event0End.isBefore(event0Start))
    throw new Error('event0Start must be before event0End');
  if (event1End.isBefore(event1Start))
    throw new Error('event1Start must be before event1End');

  if (
    isBeforeOrSame(event0Start, event1Start) &&
    event0End.isAfter(event1Start)
  )
    return true;

  if (
    isBeforeOrSame(event1Start, event0Start) &&
    event1End.isAfter(event0Start)
  )
    return true;
  return false;
}
