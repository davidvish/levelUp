import React from 'react';
import {View} from 'react-native';
import styles from './AttestationModal.styles';
import RNModal from '../../Modal/Modal';
import RNImage from '../../Image/Image';
import RNText from '../../Text/Text';
import {s, scale} from 'react-native-size-matters';
import {COLORS, IMAGES, STRINGS} from '../../../constants';
import RNButton from '../../Button/Button';
import {_onPressNavigate} from '../../../utils/commonFunction';
import {SCREEN_NAMES} from '../../../config';

type AttestationnModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onStartAttestation?: () => void;
};

export const AttestationnModal: React.FC<AttestationnModalProps> = ({
  visible,
  setVisible,
  onStartAttestation
}) => {
  return (
    <RNModal transparent visible={visible} onDismiss={() => setVisible(false)}>
      <View style={styles.container}>
        <RNText large bold>
          Attestation
        </RNText>
        <RNText style={{marginTop: 20}} large>
          Please complete this one-question quiz to confirm your acceptance of
          the training materials. Click the Start button below, answer the
          question, and then click Submit.
        </RNText>

        {/* <RNButton
            onPress={sendRequestFunction}
            textColor={COLORS.SECONDARY}
            title={STRINGS.yes}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          /> */}

        <RNButton
          onPress={onStartAttestation}
          textColor={COLORS.WHITE}
          title={STRINGS.start}
          minHeightButton={true}
          style={[styles.courseButtonStyle, {marginTop: scale(30)}]}
          backgroundColor={COLORS.SECONDARY}
        />
      </View>
    </RNModal>
  );
};
