import React from 'react';
import {View} from 'react-native';
import styles from './AssignmentnModal.styles';
import RNModal from '../../Modal/Modal';
import RNImage from '../../Image/Image';
import RNText from '../../Text/Text';
import {scale} from 'react-native-size-matters';
import {COLORS, IMAGES} from '../../../constants';
import RNButton from '../../Button/Button';

type AssignmentnModalProps = {
  visible: boolean;
  time?: string;
  percentage?: string;
  isTimeLimit?: boolean;
  setVisible: (visible: boolean) => void;
  onDoItLater?: () => void;
  onStartAssignment?: () => void;
};

export const AssignmentnModal: React.FC<AssignmentnModalProps> = ({
  visible,
  time,
  percentage,
  isTimeLimit = false,
  setVisible,
  onDoItLater,
  onStartAssignment
}) => {
  return (
    <RNModal visible={visible} transparent onDismiss={() => setVisible(false)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <RNText style={styles.title} large semiBold>
            Assignment Overview
          </RNText>
          <RNImage
            onPress={() => setVisible(false)}
            source={IMAGES.VectorIcon}
            style={styles.closeIcon}
          />
        </View>

        <View style={styles.timeContainer}>
          {isTimeLimit && (
            <RNText style={styles.timeLimit} TextAlignCenter large semiBold>
              This assignment has a {time} Time limit.
            </RNText>
          )}
          <RNText style={styles.timeLimit} TextAlignCenter large semiBold>
            You need to earn {percentage}% in the assignment to pass.
          </RNText>
        </View>
        <RNText style={styles.instruction}>
          Please ensure to submit your response within the allotted time.
        </RNText>
        <View style={styles.detailsContainer}>
          <View style={styles.tipsRow}>
            <RNImage source={IMAGES.FrameBulb} style={styles.bulbIcon} />
            <RNText style={styles.tipsTitle} small>
              Quick Tips
            </RNText>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <RNText style={styles.tipText}>
              Read all questions carefully before starting.
            </RNText>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <RNText style={styles.tipText}>
              Keep track of your remaining time.
            </RNText>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipDot} />
            <RNText style={styles.tipText}>
              Review your answers before submitting.
            </RNText>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <RNButton
            onPress={onDoItLater}
            textColor={'#9398A4'}
            title={'Do it later'}
            minHeightButton={true}
            textStyle={styles.doItLaterText}
            style={styles.doItLaterBtn}
            backgroundColor={'#F7F7FA'}
          />
          <RNButton
            onPress={onStartAssignment}
            textColor={COLORS.WHITE}
            title={'Start Assignment'}
            minHeightButton={true}
            textStyle={styles.startText}
            style={styles.startBtn}
            backgroundColor={'#4284F3'}
          />
        </View>
      </View>
    </RNModal>
  );
};
