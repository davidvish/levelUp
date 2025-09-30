import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export const navigation = useNavigation();
// export const dispatch = useDispatch();
export const wp = val => {
  return widthPercentageToDP(val);
};
export const hp = val => {
  return heightPercentageToDP(val);
};
