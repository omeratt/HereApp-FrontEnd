import {Dimensions} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const constants = {
  baseUrl: 'https://here.cyclic.app/',
  colors: {
    GREEN: '#D0FD0C',
    BLACK: '#000000',
    BGC: '#242424',
    GREY: '#707070',
    OFF_WHITE: '#F5F1E6',
    UNDER_LINE: '#B9AB85',
  },
  HEIGHT,
  WIDTH,
};
export default constants;
