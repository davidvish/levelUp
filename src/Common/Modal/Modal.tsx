import React from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, ModalProps } from 'react-native';

interface RNModalProps extends ModalProps {
  transparent?: boolean;
  onDismiss?: () => void;
}

const RNModal: React.FC<RNModalProps> = ({
  transparent = true,
  visible,
  style,
  onDismiss,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={transparent}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalView, style]}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RNModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
});
