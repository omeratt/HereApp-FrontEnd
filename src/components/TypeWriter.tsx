import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';

interface AnimatedTypingProps {
  text: string[];
  onComplete?: () => void;
}

export default function AnimatedTyping(props: AnimatedTypingProps) {
  const [text, setText] = useState('');
  const [cursorColor, setCursorColor] = useState('transparent');
  const [messageIndex, setMessageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [timeouts, setTimeouts] = useState<{
    cursorTimeout?: NodeJS.Timeout;
    typingTimeout?: NodeJS.Timeout;
    firstNewLineTimeout?: NodeJS.Timeout;
    secondNewLineTimeout?: NodeJS.Timeout;
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
    cursorTimeout?: NodeJS.Timeout;
    typingTimeout?: NodeJS.Timeout;
    firstNewLineTimeout?: NodeJS.Timeout;
    secondNewLineTimeout?: NodeJS.Timeout;
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
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 50);
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
      setCursorColor('#8EA960');
    } else {
      setCursorColor('transparent');
    }
  };

  useEffect(() => {
    const updatedTimeouts = {...timeoutsRef.current};
    updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 500);
    updatedTimeouts.cursorTimeout = setInterval(cursorAnimation, 250);
    setTimeouts(updatedTimeouts);

    return () => {
      clearTimeout(timeoutsRef.current.typingTimeout);
      clearTimeout(timeoutsRef.current.firstNewLineTimeout);
      clearTimeout(timeoutsRef.current.secondNewLineTimeout);
      clearInterval(timeoutsRef.current.cursorTimeout);
    };
  }, []);

  return (
    <Text style={styles.text}>
      {text}
      <Text style={{color: cursorColor, fontSize: 35}}>|</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#B76D68',
    fontSize: 30,
    alignSelf: 'stretch',
  } as TextStyle,
});
