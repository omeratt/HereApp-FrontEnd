import {ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

export interface ISvgElement {
  height: number;
  width: number;
  Svg: React.FC<SvgProps>;
  content: string;
  title: string;
  style?: ViewStyle;
}
