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

export const compareDates = (date1: Date, date2: Date): boolean => {
  return date1?.toDateString() === date2?.toDateString();
};

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
  for (let month = _month; month < _month + 12; month++) {
    // console.log({month});
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
export function getMoreDays(_date: Date): Record<string, DateObject> {
  const year = _date.getFullYear();
  const _month = _date.getMonth();
  const _day = _date.getDay() + 1;
  const dates: Record<string, DateObject> = {};
  for (let i = 0; i < 15; i++) {
    let newDate = new Date(_date);
    newDate.setTime(_date.getTime() + i * 24 * 60 * 60 * 1000);
    const dayName = getShortName(newDate.getDay());
    const formattedMonth = newDate.toLocaleString('default', {month: 'short'});
    const key = newDate.toLocaleDateString();
    const day = newDate.getDate();
    dates[key] = {
      day,
      dayName,
      month: formattedMonth,
      fullDate: newDate,
    };
  }
  // console.log({dates});
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

export function reloadMonthObjects(
  originalObjects: Record<string, DateObject>,
) {
  // Get the keys of the original dictionary and sort them in ascending order
  const keys = Object.keys(originalObjects).sort();

  // Get the date of the last object in the dictionary
  const lastDate = new Date(keys[keys.length - 1]);

  // Calculate the start date for the new objects (one day after the last object)
  const startDate = new Date(
    lastDate.getFullYear(),
    lastDate.getMonth(),
    lastDate.getDate() + 1,
  );

  // Calculate the end date for the new objects (30 days after the start date)
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 30,
  );

  // Create a new dictionary for the updated objects
  const updatedObjects: Record<string, DateObject> = {};

  // Loop through each day between the start and end dates
  for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
    const currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      day,
    );
    const dayName = currentDate.toLocaleString('default', {weekday: 'short'});
    const monthName = currentDate.toLocaleString('default', {month: 'long'});

    // Create a DateObject for the current date
    const dateObject: DateObject = {
      fullDate: currentDate,
      day: day,
      dayName: dayName,
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
    };

    // Add the DateObject to the updatedObjects dictionary with the current date as the key
    updatedObjects[currentDate.toISOString().split('T')[0]] = dateObject;
  }

  // Get the keys of the updatedObjects dictionary and sort them in ascending order
  const updatedKeys = Object.keys(updatedObjects).sort();

  // Delete the last 30 objects from the original dictionary
  for (let i = 0; i < 30; i++) {
    delete originalObjects[keys[keys.length - 1 - i]];
  }

  // Add the updatedObjects to the original dictionary
  for (const key of updatedKeys) {
    originalObjects[key] = updatedObjects[key];
  }

  return originalObjects;
}
