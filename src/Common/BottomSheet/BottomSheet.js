// import {StyleSheet, Text, View} from 'react-native';
// import React, {useMemo} from 'react';
// import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
// import {commonStyle} from '../../styles/styles';
// import {COLORS} from '../../constants';
// import {scale} from 'react-native-size-matters';

// const RNBottomSheet = ({
//   children,
//   bottomSheetRef,
//   handleSheetChanges,
//   scroll,
//   snapPointsArr,
//   style,
//   index,
//   visible
// }) => {
//   // const bottomSheetRef = useRef(null);
//   const snapPoints = useMemo(() => snapPointsArr || ['50%', '70%'], []);
//   if (!visible) return null;
//   return (
//     <BottomSheet
//       keyboardBehavior="extend"
//       ref={bottomSheetRef}
//       index={index || 0}
//       style={[styles.BottomSheet, style]}
//       snapPoints={snapPoints}
//       onChange={handleSheetChanges}>
//       {scroll ? (
//         <BottomSheetScrollView
//           keyboardDismissMode={'on-drag'}
//           keyboardShouldPersistTaps={'always'}>
//           {children}
//         </BottomSheetScrollView>
//       ) : (
//         children
//       )}
//     </BottomSheet>
//   );
// };

// export default RNBottomSheet;

// const styles = StyleSheet.create({
//   BottomSheet: {
//     ...commonStyle.SHADOW,
//     ...commonStyle.borderRadius,
//     backgroundColor: COLORS.WHITE
//   }
// });

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const BottomSheet = () => {
  return (
    <View>
      <Text>BottomSheet</Text>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
