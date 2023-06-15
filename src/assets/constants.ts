import {Dimensions, PixelRatio} from 'react-native';
import json from '../../AllDates.json';

export interface CategoryListType {
  _id: string;
  name: string;
  lists: ListType[];
}
export interface ListType {
  _id: string;
  title: string;
  flag: boolean;
  checkBoxListType: 'NUMBERS' | 'DOTS' | 'V' | 'NONE';
  listItems: ListItemType[];
  categoryId?: string;
  new?: boolean;
  categoryName?: string;
  category?: string;
}

export interface ListItemType {
  _id: string;
  description: string;
  done: boolean;
  flag: boolean;
}

export type OnBoardingList =
  | 'Time management'
  | 'Confusion'
  | 'Unorganized'
  | 'Lack of focus'
  | 'Self-expression'
  | 'Priorities'
  | 'Feeling lonely'
  | 'Distractions'
  | 'Feeling abnormal'
  | 'Frustration';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
const rf = (size: number) => size / fontScale;
const constants = {
  BASE_URL: 'https://here.cyclic.app/',
  DOMAIN: 'here.cyclic.app',
  // BASE_URL: 'https://here-app.onrender.com/',
  /***************** Eliran ***************/
  // BASE_URL: 'http://192.168.1.41:3000/',
  //
  /***************** Omer ***************/
  // BASE_URL: 'http://192.168.1.26:3000/',
  colors: {
    GREEN: '#E5FF00',
    BLACK: '#000000',
    BGC: '#242424',
    GREY: '#707070',
    OFF_WHITE: '#F2F1ED',
    UNDER_LINE: '#787664',
    // UNDER_LINE: '#B9AB85',
  },
  Fonts: {
    paragraph: 'Report-Regular',
    // paragraph: 'SansSerifFLF',
    text: 'Montserrat-Regular',
    text_medium: 'Montserrat-Medium',
    button: 'Montserrat-Thin',
    italic: 'Montserrat-MediumItalic',
  },
  Dates: {
    min: new Date(json['1.1.2023'].fullDate),
    max: new Date(json['9.9.2031'].fullDate),
  },
  allDates: json,
  HEIGHT,
  WIDTH,
  FreqList: [
    'None',
    'Every day',
    'Every 2 days',
    'Every 3 days',
    'Every 4 days',
    'Every 5 days',
    'Every 6 days',
    'Every week',
    'Every 2 weeks',
    'Every 3 weeks',
    'Every month',
    'Every 2 months',
    'Every 3 months',
    'Every 4 months',
    'Every 5 months',
    'Every 6 months',
    'Every 7 months',
    'Every 8 months',
    'Every 9 months',
    'Every 10 months',
    'Every 11 months',
    'Every year',
  ],
  OnBoardingList: [
    {txt: 'Time management' as OnBoardingList},
    {txt: 'Confusion' as OnBoardingList},
    {txt: 'Unorganized' as OnBoardingList},
    {txt: 'Lack of focus' as OnBoardingList},
    {txt: 'Self-expression' as OnBoardingList},
    {txt: 'Priorities' as OnBoardingList},
    {txt: 'Feeling lonely' as OnBoardingList},
    {txt: 'Distractions' as OnBoardingList},
    {txt: 'Feeling abnormal' as OnBoardingList},
    {txt: 'Frustration' as OnBoardingList},
  ],
  rf,
  // rf: (size: number, multiplier = 2) => {
  //   const scale = (WIDTH / HEIGHT) * multiplier;

  //   const newSize = size * scale;

  //   return Math.round(PixelRatio.roundToNearestPixel(newSize));
  // },
};
// export const minimumDate = new Date(json['1.1.2023'].fullDate);
// export const maximumDate = new Date(json['9.9.2031'].fullDate);
export enum Frequency {
  'Every day' = 1,
  'Every 2 days',
  'Every 3 days',
  'Every 4 days',
  'Every 5 days',
  'Every 6 days',
  'Every week' = 1,
  'Every 2 weeks',
  'Every 3 weeks',
  'Every month' = 1,
  'Every 2 months',
  'Every 3 months',
  'Every 4 months',
  'Every 5 months',
  'Every 6 months',
  'Every 7 months',
  'Every 8 months',
  'Every 9 months',
  'Every 10 months',
  'Every 11 months',
  'Every year' = 1,
  'None' = -1,
}
export default constants;
