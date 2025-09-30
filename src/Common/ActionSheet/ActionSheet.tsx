import React, { createRef } from 'react';
import { View, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

export const actionSheetRef: any = createRef();

interface RNActionSheetProps {
  children?: any;
  ActionSheetRef?: any;
  containerStyle?: any;
  onNavigateBack?: () => void;
  onClose?: () => void;
  overlayColor?:any
}

const RNActionSheet: React.FC<RNActionSheetProps> = ({
  children,
  ActionSheetRef,
  containerStyle,
  onNavigateBack,
  onClose,
  overlayColor,
  ...props
}) => {
  return (
    <ActionSheet
      {...props}
      onNavigateBack={onNavigateBack}
     // onClose={onClose}
      containerStyle={[styles.sheetContainer, containerStyle]}
      ref={ActionSheetRef || actionSheetRef}
      overlayColor={overlayColor}
    >
      {children}
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    height: "85%", // Set the specific height for the action sheet (adjust as needed)
    backgroundColor: 'white', // Optional: Customize the background color
    borderRadius: 40, // Optional: Add rounded corners if needed
  },
});

export default RNActionSheet;
