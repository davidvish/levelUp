import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {formatTime} from '../../../../helper/helper';
import {RNText} from '../../../../Common';
import {scale} from 'react-native-size-matters';

interface TimerComponentProps {
  initialTimeInSeconds: number;
  onTimeUp: () => void;
  onTimerCountChange?: (count: number) => void; // optional callback
}

const TimerComponent: React.FC<TimerComponentProps> = ({
  initialTimeInSeconds,
  onTimeUp,
  onTimerCountChange,
}) => {
  const [displayTime, setDisplayTime] = useState(initialTimeInSeconds || 0);
  const elapsedRef = useRef(0); // total seconds elapsed
  const toast = useToast();

  const alert10MinShown = useRef(false);
  const alert30SecShown = useRef(false);
  const alert10SecShown = useRef(false);

  // Reset displayTime when initialTimeInSeconds changes
  useEffect(() => {
    setDisplayTime(initialTimeInSeconds || 0);
    elapsedRef.current = 0;
    alert10MinShown.current = false;
    alert30SecShown.current = false;
    alert10SecShown.current = false;
  }, [initialTimeInSeconds]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setDisplayTime(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });

      // increment elapsedRef without causing re-render
      elapsedRef.current += 1;

      // call parent callback occasionally (every 5 seconds)
      if (onTimerCountChange && elapsedRef.current % 5 === 0) {
        onTimerCountChange(elapsedRef.current);
      }

      // handle alerts
      if (displayTime === 600 && !alert10MinShown.current) {
        (global as any).Toast.show('Only 10 minutes left!', {
          type: 'warning',
          duration: 3000,
        });
        alert10MinShown.current = true;
      }
      if (displayTime === 30 && !alert30SecShown.current) {
        (global as any).Toast.show('Only 30 seconds left!', {
          type: 'danger',
          duration: 3000,
        });
        alert30SecShown.current = true;
      }
      if (displayTime === 10 && !alert10SecShown.current) {
        (global as any).Toast.show('Only 10 seconds left!', {
          type: 'danger',
          duration: 3000,
        });
        alert10SecShown.current = true;
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [onTimeUp, onTimerCountChange]);

  return (
    <View>
      <RNText style={{fontSize: scale(14), color: 'white'}}>
        {formatTime(displayTime)}
      </RNText>
    </View>
  );
};

export default TimerComponent;
