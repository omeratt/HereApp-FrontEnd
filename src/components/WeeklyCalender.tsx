type Day = {
  name: string;
  date: string;
};

export interface DateObject {
  day: number;
  dayName: string;
  month: string;
  fullDate: Date;
}

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-GB').split('.').join('/');

export const formatStringToDate = (date: string) => {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const getShortName = (dayOfWeek: number): string => {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[dayOfWeek];
};

export function getDatesForYear(_date: Date): Record<string, DateObject> {
  const year = _date.getFullYear();
  const _month = _date.getMonth();
  const dates: Record<string, DateObject> = {};

  // Loop over all days of the year
  for (let month = _month - 1; month < _month + 2; month++) {
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

export function generateMonthObjects(date: Date): Record<string, DateObject> {
  const monthObjects: Record<string, DateObject> = {};

  // Get the start of the month one month before the given date
  const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);

  // Get the end of the month of the given date
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  console.log({endDate, startDate});

  // Loop through each day between the start and end dates
  for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
    console.log({month: date.getMonth()});
    // const dayName = currentDate.toLocaleString('default', {weekday: 'short'});
    // currentDate.getUTCDate()
    const dayNumber = currentDate.getUTCDate();
    const dayName = getShortName(currentDate.getDay());

    const monthName = currentDate.toLocaleString('default', {month: 'short'});

    // Create a DateObject for the current date
    const dateObject: DateObject = {
      day: dayNumber,
      dayName: dayName,
      month: monthName,
      // month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      fullDate: currentDate,
    };

    // Add the DateObject to the monthObjects dictionary with the current date as the key
    // monthObjects[currentDate] = dateObject;
    const key = currentDate.toISOString();
    monthObjects[key] = dateObject;
  }

  return monthObjects;
}
