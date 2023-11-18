'use client';
import Button from 'components/Button/Button';
import dayjs, { type Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import useWindowDimensions from 'hooks/useWindowDimensions';
import type ScheduleCampaign from 'models/ScheduleCampaign';
import { useState, type MouseEvent } from 'react';
import generateArray from 'utils/arrayUtils';
import classes from 'utils/classes';
import {
  areEventsOverlapping,
  isAfterOrSame,
  isBeforeOrSame,
} from 'utils/dateUtils';
import deepClone from 'utils/objectUtils';
import { isDefined } from 'utils/validators';
import styles from './SlotPicker.module.scss';

dayjs.extend(utc);
dayjs.extend(timezone);

function getTimestampKey(timestamp: Dayjs) {
  return timestamp.toISOString();
}

type MouseState =
  | {
      mode: 'adding';
      initialTimestamp: Dayjs;
    }
  | {
      mode: 'removing';
      initialTimestamp: Dayjs;
    }
  | {
      mode: null;
    };

function parseCampaign(campaign: ScheduleCampaign) {
  const startTime = campaign.startTime.split(':').map((e) => parseInt(e));
  const startHour = startTime[0] ?? 0;
  const startMinute = startTime[1] ?? 0;
  const endTime = campaign.endTime.split(':').map((e) => parseInt(e));
  const endHour = endTime[0] ?? 0;
  const endMinute = endTime[1] ?? 0;
  const startDate = dayjs(campaign.startDate)
    .add(startHour, 'hours')
    .add(startMinute, 'minutes');
  const endDate = dayjs(campaign.endDate)
    .add(endHour, 'hours')
    .add(endMinute, 'minutes');
  const numDays = endDate.diff(startDate, 'days');
  const numDailyTimeslots =
    (60 * endHour - 60 * startHour + endMinute - startMinute) /
      campaign.slotDuration +
    1;
  return {
    startDate,
    endDate,
    numDays,
    numDailyTimeslots,
  };
}

export default function SlotPicker() {
  const { responsive } = useWindowDimensions();
  const [frameIndex, setFrameIndex] = useState(0);
  const [mouseState, setMouseState] = useState<MouseState>({ mode: null });
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const campaign: ScheduleCampaign = {
    slotDuration: 30,
    startTime: '9:30',
    endTime: '18:00',
    includedDays: [true, true, true, true, true, true, true],
    startDate: dayjs('2015-05-01T00:00-04:00').utc().format(),
    endDate: dayjs('2015-05-10T00:00-04:00').utc().format(),
  };
  const { startDate, endDate, numDays, numDailyTimeslots } =
    parseCampaign(campaign);
  const numDaysVisible = Math.min(responsive([3, 4, 5, 7]), numDays);
  const frameStartDate = startDate.add(numDaysVisible * frameIndex, 'days');
  const frameEndDate = frameStartDate.add(numDaysVisible, 'days');

  const busyEvents: [Dayjs, Dayjs][] = [
    [startDate.add(27, 'hours'), startDate.add(29, 'hours')],
  ];

  function handleMouseDown(e: MouseEvent, timestamp: Dayjs) {
    setSelection((prev) => {
      const key = getTimestampKey(timestamp);
      const newSelection = deepClone(prev);
      if (key in prev) {
        setMouseState({
          mode: 'removing',
          initialTimestamp: timestamp,
        });
        delete newSelection[key];
      } else {
        setMouseState({ mode: 'adding', initialTimestamp: timestamp });
        newSelection[key] = true;
      }
      return newSelection;
    });
  }

  function handleMouseEnter(e: MouseEvent, timestamp: Dayjs) {
    if (!mouseState.mode) return;
    const key = getTimestampKey(timestamp);
    setSelection((prev) => {
      const newSelection = deepClone(prev);
      if (mouseState.mode === 'adding') {
        newSelection[key] = true;
      } else {
        delete newSelection[key];
      }
      return newSelection;
    });
  }

  function onPrev() {
    setFrameIndex((prev) => prev - 1);
  }

  function onNext() {
    setFrameIndex((prev) => prev + 1);
  }

  function resetMouse() {
    setMouseState({ mode: null });
  }

  function isTimeslotAvailable(timeslot: Dayjs) {
    for (let i = 0; i < busyEvents.length; i++) {
      const eventStart = busyEvents[i]?.[0];
      const eventEnd = busyEvents[i]?.[1];
      if (!isDefined(eventStart) || !isDefined(eventEnd)) continue;
      if (
        areEventsOverlapping(
          eventStart,
          timeslot,
          eventEnd,
          timeslot.add(campaign.slotDuration, 'minutes'),
        )
      ) {
        return false;
      }
    }
    return true;
  }

  function isDayDisabled(timeslot: Dayjs) {
    return (
      !campaign.includedDays.at(parseInt(timeslot.format('d'))) ||
      isAfterOrSame(timeslot, endDate)
    );
  }

  function dayLabelRenderer(dayIdx: number) {
    const date = frameStartDate.add(dayIdx, 'days');
    const isDisabled = isDayDisabled(date);
    return (
      <div
        key={dayIdx}
        className={classes(styles.header, isDisabled ? styles.disabled : null)}
      >
        <div className={styles.weekDay}>{date.format('ddd').toUpperCase()}</div>
        <div className={styles.monthDay}>{date.format('D')}</div>
      </div>
    );
  }

  function timeslotLabelRenderer(idx: number) {
    const labelTimeslot = frameStartDate.add(
      idx * campaign.slotDuration,
      'minutes',
    );
    const labelFormat = 'h:mma';
    return (
      <div
        key={'label-' + getTimestampKey(labelTimeslot)}
        style={{ gridColumn: '1 / 1' }}
        className={classes(
          styles.timestamp,
          idx + 1 === numDailyTimeslots ? styles.last : null,
        )}
      >
        {labelTimeslot.format(labelFormat)}
      </div>
    );
  }

  function cellRenderer(dayIdx: number, timeslotIdx: number) {
    const timeslot = frameStartDate
      .add(timeslotIdx * campaign.slotDuration, 'minutes')
      .add(dayIdx, 'days');
    const key = getTimestampKey(timeslot);
    const prevTimeslot = timeslot.subtract(campaign.slotDuration, 'minutes');
    const nextTimeslot =
      timeslotIdx + 1 === numDailyTimeslots
        ? frameStartDate.add(dayIdx + 1, 'days')
        : timeslot.add(campaign.slotDuration, 'minutes');
    const isPrevSlotDisabled =
      !isTimeslotAvailable(prevTimeslot) || isDayDisabled(prevTimeslot);
    const isNextSlotDisabled =
      !isTimeslotAvailable(nextTimeslot) || isDayDisabled(nextTimeslot);
    const isSelected = key in selection;
    const isDisabled =
      isDayDisabled(timeslot) || !isTimeslotAvailable(timeslot);
    const isTopEdge = !isDisabled && (timeslotIdx === 0 || isPrevSlotDisabled);
    const isBottomEdge =
      timeslotIdx + 1 === numDailyTimeslots || isNextSlotDisabled;
    const noTail =
      dayIdx + 1 === numDaysVisible || timeslotIdx + 1 === numDailyTimeslots;
    const noBottomLine = timeslotIdx + 1 === numDailyTimeslots;
    return (
      <div
        key={key}
        className={classes(
          styles.cell,
          isSelected ? styles.selected : null,
          isTopEdge ? styles.isTopEdge : null,
          isBottomEdge ? styles.isBottomEdge : null,
          isDisabled ? styles.isDisabled : null,
          noTail ? styles.noTail : null,
          noBottomLine ? styles.noBottomLine : null,
        )}
        style={{
          gridColumn: `${dayIdx + 2}`,
          gridRow: `${timeslotIdx + 2}`,
        }}
        onMouseDown={
          !isDisabled ? (e) => handleMouseDown(e, timeslot) : undefined
        }
        onMouseEnter={
          !isDisabled ? (e) => handleMouseEnter(e, timeslot) : undefined
        }
      />
    );
  }

  return (
    <div
      className={styles.container}
      onMouseUp={resetMouse}
      onMouseLeave={resetMouse}
      style={{
        gridTemplateColumns: `auto repeat(${numDaysVisible}, 1fr) auto`,
      }}
    >
      <div>
        <Button
          variant='outlined'
          onClick={onPrev}
          disabled={isBeforeOrSame(frameStartDate, startDate)}
        >
          Prev
        </Button>
      </div>
      {generateArray(numDaysVisible).map((_, dayIdx) =>
        dayLabelRenderer(dayIdx),
      )}
      <div className={styles.nextContainer}>
        <Button
          variant='outlined'
          onClick={onNext}
          disabled={isAfterOrSame(frameEndDate, endDate)}
        >
          Next
        </Button>
      </div>
      {generateArray(numDailyTimeslots).map((_, timeslotIdx) =>
        timeslotLabelRenderer(timeslotIdx),
      )}
      {generateArray(numDailyTimeslots).map((_, timeslotIdx) =>
        generateArray(numDaysVisible).map((_, dayIdx) =>
          cellRenderer(dayIdx, timeslotIdx),
        ),
      )}
    </div>
  );
}
