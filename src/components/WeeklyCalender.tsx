type Day = {
  name: string;
  date: string;
};

export type Week = Day[];

export type WeeksBySundayDate = {
  [sundayDate: string]: Week;
};

const DAYS_IN_WEEK = 7;
// const YEARS_DIFFERENCE = 1;
const MONTH_DIFFERENCE = 1;

const getWeeklyCalendar = () => {
  const getWeeksBySundayDate = (): WeeksBySundayDate => {
    const weeksBySundayDate: WeeksBySundayDate = {};

    // Get the date 7 years ago
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - MONTH_DIFFERENCE);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // startDate.setFullYear(startDate.getFullYear() - YEARS_DIFFERENCE);
    // startDate.setDate(startDate.getDate() - startDate.getDay());
    // Get the date 7 years from now
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - MONTH_DIFFERENCE);
    endDate.setDate(endDate.getDate() - endDate.getDay());

    // Loop through each week between the start and end dates
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const week: Week = [];

      //   console.log({currentDate});
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
      //   console.log({sundayDate});
      weeksBySundayDate[sundayDate] = week;
    }

    return weeksBySundayDate;
  };

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-GB').split('.').join('/');

  const getShortName = (dayOfWeek: number): string => {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return names[dayOfWeek];
  };

  const getSundayDate = (date: Date): string => {
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() - sunday.getDay() - DAYS_IN_WEEK);
    const formattedDate = formatDate(sunday);
    return formattedDate;
  };

  // Example usage
  const weeksBySundayDate = getWeeksBySundayDate();
  //   console.log(weeksBySundayDate);

  return weeksBySundayDate;
};

export default getWeeklyCalendar;
