import React, {useMemo} from 'react';
import {Vibration} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import constants from '../../assets/constants';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  ZoomIn,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';

interface circleSegmentProps {
  radius: number;
  startAngle: number;
  endAngle: number;
  strokeWidth: number;
  stroke: string;
  fill: string;
  size?: number;
}
const CircleSegment: React.FC<circleSegmentProps> = ({
  radius,
  startAngle,
  endAngle,
  strokeWidth,
  stroke,
  fill,
}) => {
  const angleDiff = endAngle - startAngle;
  const largeArcFlag = angleDiff <= 180 ? 0 : 1;
  const startX = radius + radius * Math.cos((startAngle * Math.PI) / 180);
  const startY = radius + radius * Math.sin((startAngle * Math.PI) / 180);
  const endX = radius + radius * Math.cos((endAngle * Math.PI) / 180);
  const endY = radius + radius * Math.sin((endAngle * Math.PI) / 180);
  const pathData = `
    M ${radius},${radius}
    L ${startX},${startY}
    A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}
    Z
  `;
  return (
    <Svg
      width={radius * 2}
      height={radius * 2}
      style={{
        position: 'absolute',
      }}>
      <Path
        d={pathData}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    </Svg>
  );
};

export default function Pizza({size}: {size: number}) {
  const slices = new Array(8).fill(0);
  const [selected, setSelected] = React.useState(6);
  const lastIndex = useSharedValue(selected);
  const curIndex = useSharedValue(selected);
  const SetColor = React.useCallback((i: number) => {
    setSelected(i);
  }, []);
  const handleVibration = React.useCallback((i: number) => {
    Vibration.vibrate(1);
  }, []);
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate(e => {
          lastIndex.value = curIndex.value;
          const containerCenterX = size / 2;
          const containerCenterY = size / 2;
          const touchX = e.x - containerCenterX;
          const touchY = e.y - containerCenterY;
          const angle = Math.atan2(touchY, touchX);
          let segment = Math.round((angle / Math.PI / 2 + 1 / 16) * 8) % 8;
          if (segment === 0) {
            segment = 7;
          } else if (segment < 0) {
            segment += 7;
          } else {
            segment -= 1;
          }
          curIndex.value = segment;
          if (lastIndex.value !== curIndex.value) {
            runOnJS(SetColor)(segment);
            runOnJS(handleVibration)(segment);
          }
        })
        .onTouchesDown(e => {
          lastIndex.value = curIndex.value;
          const containerCenterX = size / 2;
          const containerCenterY = size / 2;
          const touchX = e.changedTouches[0].x - containerCenterX;
          const touchY = e.changedTouches[0].y - containerCenterY;
          const angle = Math.atan2(touchY, touchX);
          let segment = Math.round((angle / Math.PI / 2 + 1 / 16) * 8) % 8;
          if (segment === 0) {
            segment = 7;
          } else if (segment < 0) {
            segment += 7;
          } else {
            segment -= 1;
          }
          curIndex.value = segment;
          if (lastIndex.value !== curIndex.value) {
            runOnJS(SetColor)(segment);
            runOnJS(handleVibration)(segment);
          }
        }),

    [],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={ZoomIn.duration(500)}
        style={{
          borderRadius: size / 2,
          borderColor: constants.colors.OFF_WHITE,
          borderWidth: 1,
          height: size + 1,
          width: size,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
        }}>
        {slices.map((_, i) => {
          const fillColor =
            selected === i ? constants.colors.GREEN : constants.colors.BGC;
          return (
            <CircleSegment
              size={size}
              startAngle={45 * i}
              endAngle={45 * (i + 1)}
              strokeWidth={1}
              stroke={constants.colors.OFF_WHITE}
              fill={fillColor}
              radius={size / 2}
              key={i}
            />
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
}
