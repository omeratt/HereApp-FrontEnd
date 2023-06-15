import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';

interface AnimatedTypingProps {
  text: string[];
  onComplete?: () => void;
  style?: TextStyle;
  cursorStyle?: TextStyle;
  cursorColor?: string;
}

export default function AnimatedTyping(props: AnimatedTypingProps) {
  const [text, setText] = useState('');
  const [cursorColor, setCursorColor] = useState('transparent');
  const [messageIndex, setMessageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [timeouts, setTimeouts] = useState<{
    cursorTimeout?: number;
    typingTimeout?: number;
    firstNewLineTimeout?: number;
    secondNewLineTimeout?: number;
  }>({});

  const textRef = useRef<string>(text);
  textRef.current = text;

  const cursorColorRef = useRef<string>(cursorColor);
  cursorColorRef.current = cursorColor;

  const messageIndexRef = useRef<number>(messageIndex);
  messageIndexRef.current = messageIndex;

  const textIndexRef = useRef<number>(textIndex);
  textIndexRef.current = textIndex;

  const timeoutsRef = useRef<{
    cursorTimeout?: number;
    typingTimeout?: number;
    firstNewLineTimeout?: number;
    secondNewLineTimeout?: number;
  }>({});
  timeoutsRef.current = timeouts;

  const typingAnimation = () => {
    if (textIndexRef.current < props.text[messageIndexRef.current].length) {
      setText(
        textRef.current +
          props.text[messageIndexRef.current].charAt(textIndexRef.current),
      );
      setTextIndex(textIndexRef.current + 1);

      const updatedTimeouts = {...timeoutsRef.current};
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 20);
      setTimeouts(updatedTimeouts);
    } else if (messageIndexRef.current + 1 < props.text.length) {
      setMessageIndex(messageIndexRef.current + 1);
      setTextIndex(0);

      const updatedTimeouts = {...timeoutsRef.current};
      updatedTimeouts.firstNewLineTimeout = setTimeout(newLineAnimation, 120);
      updatedTimeouts.secondNewLineTimeout = setTimeout(newLineAnimation, 200);
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 280);
      setTimeouts(updatedTimeouts);
    } else {
      timeoutsRef.current?.cursorTimeout &&
        clearInterval(timeoutsRef.current.cursorTimeout);
      setCursorColor('transparent');

      if (props.onComplete) {
        props.onComplete();
      }
    }
  };

  const newLineAnimation = () => {
    setText(textRef.current + '\n');
  };

  const cursorAnimation = () => {
    if (cursorColorRef.current === 'transparent') {
      setCursorColor(props.cursorColor || '#fffff');
    } else {
      setCursorColor('transparent');
    }
  };

  useEffect(() => {
    const updatedTimeouts = {...timeoutsRef.current};
    updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 100);
    updatedTimeouts.cursorTimeout = setInterval(cursorAnimation, 50);
    setTimeouts(updatedTimeouts);

    return () => {
      timeoutsRef.current.typingTimeout &&
        clearTimeout(timeoutsRef.current.typingTimeout);
      timeoutsRef.current.firstNewLineTimeout &&
        clearTimeout(timeoutsRef.current.firstNewLineTimeout);
      timeoutsRef.current.secondNewLineTimeout &&
        clearTimeout(timeoutsRef.current.secondNewLineTimeout);
      timeoutsRef.current.cursorTimeout &&
        clearInterval(timeoutsRef.current.cursorTimeout);
    };
  }, []);

  return (
    <Text
      style={[props.style]}
      textBreakStrategy="simple"
      adjustsFontSizeToFit
      allowFontScaling={false}>
      {text}
      <Text style={[props.cursorStyle, {color: cursorColor}]}>|</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#B76D68',
    fontSize: 30,
    // alignSelf: 'stretch',
  } as TextStyle,
});
