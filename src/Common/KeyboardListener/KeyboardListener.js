import {useEffect, useState} from 'react';

import {Keyboard, Platform} from 'react-native';

const useKeyboardListener = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      res => {
        if (Platform.OS == 'ios') {
          setKeyboardHeight(res.endCoordinates.height);
        }

        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      res => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);
  return {keyboardVisible, keyboardHeight};
};
export default useKeyboardListener;
