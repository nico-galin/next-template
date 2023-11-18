type ScheduleCampaign = {
  slotDuration: number;
  startTime: string; // HH:MM Military Time
  endTime: string; // HH:MM Military Time
  includedDays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  startDate: string;
  endDate: string;
  minAttendees?: number;
};

export default ScheduleCampaign;
