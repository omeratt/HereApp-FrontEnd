export interface DateObject {
  day: number;
  dayName: string;
  month: string;
  fullDate: Date;
}

export const compareDates = (date1: Date, date2: Date): boolean => {
  return date1?.toDateString() === date2?.toDateString();
};

export const getShortName = (dayOfWeek: number): string => {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[dayOfWeek];
};
export const getRealDate = (
  date?: Date,
  isSetToCurrentHours?: boolean,
): Date => {
  const fixedDate = date ? date : new Date();
  const realDate = new Date(
    fixedDate.getTime() - fixedDate.getTimezoneOffset() * 60000,
  );
  if (isSetToCurrentHours) {
    const time = new Date().toLocaleTimeString();
    const [hours, minutes] = time.split(':');
    realDate.setUTCHours(+hours, +minutes);
  }
  return realDate;
};

export const getTimeFromDateString = (
  date?: string,
  isRealDate?: boolean,
  isIn24Hours?: boolean,
) => {
  if (!date) return ' ';
  // console.log()
  const fixedDate = isRealDate
    ? getRealDate(new Date(date)).toISOString()
    : date;
  const itemTime = fixedDate.split('T')[1];
  const [hours, minutes] = itemTime.split(':');
  if (isIn24Hours) return `${hours}:${minutes} `;
  const amOrPm = +hours >= 12 ? 'PM' : 'AM';
  const hoursIn12Hour = +hours % 12 || 12;
  const itemHours = `${hoursIn12Hour}:${minutes} ${amOrPm}`;
  return itemHours;
};

export function getDatesForYear(_date: Date): Record<string, DateObject> {
  const year = _date.getFullYear();
  const _month = _date.getMonth();
  const dates: Record<string, DateObject> = {};

  // Loop over all days of the year
  for (let month = _month; month < _month + 12 * 1; month++) {
    const numDaysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= numDaysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = getShortName(date.getDay());
      const formattedMonth = date.toLocaleString('default', {month: 'short'});
      const key = date.toLocaleDateString();
      dates[key] = {
        day,
        dayName,
        month: formattedMonth,
        fullDate: date,
      };
    }
  }
  return dates;
}
