import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const constants = {
  // BASE_URL: 'https://here.cyclic.app/',
  /***************** Eliran ***************/
  // BASE_URL: 'http://192.168.1.32:3000/',

  /***************** Omer ***************/
  BASE_URL: 'http://192.168.1.58:3000/',
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
    text: 'Montserrat-Regular',
    button: 'Montserrat-Thin',
    italic: 'Montserrat-MediumItalic',
  },
  HEIGHT,
  WIDTH,
};
export default constants;
