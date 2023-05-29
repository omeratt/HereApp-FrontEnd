import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
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
}

export interface ListItemType {
  _id: string;
  description: string;
  done: boolean;
  flag: boolean;
}

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
    GREEN: '#D0FD0C',
    BLACK: '#000000',
    BGC: '#242424',
    GREY: '#707070',
    OFF_WHITE: '#F5F1E6',
    UNDER_LINE: '#B9AB85',
  },
  Fonts: {
    paragraph: 'Report-Regular',
    // paragraph: 'SansSerifFLF',
    text: 'Montserrat-Regular',
    text_medium: 'Montserrat-Medium',
    button: 'Montserrat-Thin',
    italic: 'Montserrat-MediumItalic',
  },
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
    'Every year',
  ],
  OnBoardingList: [
    {txt: 'Postponement of tasks'},
    {txt: 'Frustration'},
    {txt: 'Distractions'},
    {txt: 'Lack of focus'},
    {txt: 'Self-expression'},
    {txt: 'Priorities'},
    {txt: 'Confusion'},
    {txt: 'Time management'},
    {txt: 'Feeling lonely'},
    {txt: 'Unorganized'},
    {txt: 'Anxiety'},
    {txt: 'Feeling abnormal'},
  ],
};
export default constants;
export const searchTasksData: ISearchElement[] = [
  {
    name: 'Home work',
    description: 'Finish with Biology HM',
  },
  {
    name: 'Home work',
    description: 'Finish with Biology HM',
  },
  {
    name: 'Home work',
    description: 'Finish with Biology HM',
  },
];
export const searchListsData: ISearchElement[] = [
  {
    name: 'Interactive',
    description: 'Finish with ...',
  },
  {
    name: 'biology',
    description: 'Finish with ...',
  },
  {
    name: 'Home deco',
    description: 'Finish with ...',
  },
];
export const searchMessageData: ISearchElement[] = [
  {
    name: '14/5/23',
    description: 'finish with omer’s birth...',
  },
  {
    name: '4/6/22',
    description: 'Finish with ...',
  },
];
