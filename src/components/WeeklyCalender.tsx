type Day = {
  name: string;
  date: string;
};

export type Week = Day[];

export type WeeksBySundayDate = {
  [sundayDate: string]: Week;
};

const DAYS_IN_WEEK = 7;
const MONTH_DIFFERENCE = 1;
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

const getWeeklyCalendar = () => {
  const getWeeksBySundayDate = (): WeeksBySundayDate => {
    const weeksBySundayDate: WeeksBySundayDate = {};

    // Get the date month ago
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - MONTH_DIFFERENCE);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // Get the date month from now
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + MONTH_DIFFERENCE);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Loop through each week between the start and end dates
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const week: Week = [];
      // Loop through each day in the week
      for (let i = 0; i < DAYS_IN_WEEK; i++) {
        const day: Day = {
          name: getShortName(currentDate.getDay()),
          date: formatDate(currentDate),
        };
        week.push(day);

        // Increment the date to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Store the week in the dictionary with the Sunday date as the key
      const sundayDate = getSundayDate(currentDate);
      weeksBySundayDate[sundayDate] = week;
    }

    return weeksBySundayDate;
  };

  // const formatDate = (date: Date): string =>
  //   date.toLocaleDateString('en-GB').split('.').join('/');

  const getSundayDate = (date: Date): string => {
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() - sunday.getDay() - DAYS_IN_WEEK);
    const formattedDate = formatDate(sunday);
    return formattedDate;
  };

  const weeksBySundayDate = getWeeksBySundayDate();

  return weeksBySundayDate;
};

export interface DateObject {
  day: number;
  dayName: string;
  month: string;
  fullDate: Date;
}

export function getDatesForYear(year: number): DateObject[] {
  const dates = [];

  // Loop over all days of the year
  for (let month = 0; month < 12; month++) {
    const numDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= numDaysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = getShortName(date.getDay());
      const formattedMonth = date.toLocaleString('default', {month: 'short'});

      dates.push({
        day,
        dayName,
        month: formattedMonth,
        fullDate: date,
      });
    }
  }

  return dates;
}

export default getWeeklyCalendar;
