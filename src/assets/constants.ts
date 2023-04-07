import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const constants = {
  BASE_URL: 'https://here.cyclic.app/',
  // BASE_URL: 'https://here-app.onrender.com/',
  /***************** Eliran ***************/
  // BASE_URL: 'http://192.168.1.30:3000/',

  /***************** Omer ***************/
  // BASE_URL: 'http://192.168.1.58:3000/',
  colors: {
    GREEN: '#D0FD0C',
    BLACK: '#000000',
    BGC: '#242424',
    GREY: '#707070',
    OFF_WHITE: '#F5F1E6',
    UNDER_LINE: '#B9AB85',
  },
  Fonts: {
    // paragraph: 'Report-Regular',
    paragraph: 'SansSerifFLF',
    text: 'Montserrat-Regular',
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
    {txt: 'Reading Comprehension'},
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
    {txt: 'Postponement of tasks'},
    {txt: 'confusion'},
  ],
};
export default constants;
