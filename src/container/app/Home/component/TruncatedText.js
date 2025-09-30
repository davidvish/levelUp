import React from 'react';
import { Text } from 'react-native';
import { RNText } from '../../../../Common';
import { COLORS } from '../../../../constants';

const TruncatedText = ({ text, maxLength, style, textColor, size }) => {
  const truncate = (str, max) => {
    if (str.length <= max) return str;
    return str.slice(0, max).trim() + '...';
  };

  return (
    <RNText style={style} textColor={textColor} size bold>
      {truncate(text, maxLength)}
    </RNText>
  );
};

export default TruncatedText;