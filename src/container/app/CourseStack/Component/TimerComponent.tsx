import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {formatTime} from '../../../../helper/helper';
import {RNText} from '../../../../Common';
import {scale} from 'react-native-size-matters';

interface TimerComponentProps {
  initialTimeInSeconds: number;
  onTimeUp: () => void;
  onTimerCountChange?: (count: number) => void; // 🔹 new prop
}

const TimerComponent: React.FC<TimerComponentProps> = ({
  initialTimeInSeconds,
  onTimeUp,
  onTimerCountChange // 🔹 receive callback
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds || 0);
  const [timerCount, setTimerCount] = useState(0);
  const [alert10MinShown, setAlert10MinShown] = useState(false);
  const [alert30SecShown, setAlert30SecShown] = useState(false);
  const [alert10SecShown, setAlert10SecShown] = useState(false);
  const toast = useToast();

  // 🔹 Sync with prop changes
  useEffect(() => {
    const safeTime = initialTimeInSeconds > 0 ? initialTimeInSeconds : 0; // Ensure non-negative
    setTimeLeft(safeTime);
    setTimerCount(0); // reset timerCount whenever initialTimeInSeconds changes
  }, [initialTimeInSeconds]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });

      setTimerCount(prev => {
        const newCount = prev + 1;
        onTimerCountChange && onTimerCountChange(newCount); // 🔹 call parent callback
        return newCount;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [onTimeUp, onTimerCountChange]);

  // Alerts
  useEffect(() => {
    // 🔔 10 minutes left
    if (timeLeft === 600 && !alert10MinShown) {
      (global as any).Toast.show('Only 10 minutes left!', {
        type: 'warning',
        duration: 3000
      });
      setAlert10MinShown(true);
    }

    // 🔔 30 seconds left
    if (timeLeft === 30 && !alert30SecShown) {
      (global as any).Toast.show('Only 30 seconds left!', {
        type: 'danger',
        duration: 3000
      });
      setAlert30SecShown(true);
    }

    // 🔔 10 seconds left
    if (timeLeft === 10 && !alert10SecShown) {
      (global as any).Toast.show('Only 10 seconds left!', {
        type: 'danger',
        duration: 3000
      });
      setAlert10SecShown(true);
    }
  }, [timeLeft, alert10MinShown, alert30SecShown, alert10SecShown, toast]);

  return (
    <View>
      <RNText style={{fontSize: scale(14), color: 'white'}}>
        {formatTime(timeLeft)}
      </RNText>
    </View>
  );
};

export default TimerComponent;
