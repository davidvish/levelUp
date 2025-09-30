import React from 'react';
import { ViewStyle, GestureResponderEvent, View } from 'react-native';

// Import icon components
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import constants
import { COMMON_SIZE } from '../../constants';

// Define the type for the icon component
type IconType =
  | 'AntDesign'
  | 'MaterialIcons'
  | 'EvilIcons'
  | 'Entypo'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Foundation'
  | 'Fontisto'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'Zocial'
  | 'Feather'
  | 'Octicons'
  | 'SimpleLineIcons';

// Define the props for the RNIcon component
interface RNIconProps {
  type: IconType;
  name: string;
  size?: number;
  style?: ViewStyle;
  color?: string;
  onPress?: (event: GestureResponderEvent) => void;
  hitSlop?: { top?: number; left?: number; bottom?: number; right?: number };
}

// Define the default color for the icon
const colordef = 'black';

// Define a mapping of icon types to their corresponding components
const VectorIcons: Record<string, React.ComponentType<any>> = {
  AntDesign,
  MaterialIcons,
  EvilIcons,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Feather,
  Octicons,
  SimpleLineIcons,
};

// Define the RNIcon component
const RNIcon: React.FC<RNIconProps> = ({
  type,
  name,
  size,
  style,
  color,
  onPress,
  hitSlop,
}) => {
  // Get the appropriate icon component based on the type
  const IconComponent = VectorIcons[type];

  // Render the icon component
  return (
    <IconComponent
      name={name}
      size={size || COMMON_SIZE.ICON}
      style={style}
      color={color || colordef}
      onPress={onPress}
      hitSlop={hitSlop}
    />
  );
};

export default RNIcon;
