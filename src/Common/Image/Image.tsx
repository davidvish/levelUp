import {
  ActivityIndicator,
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, IMAGES } from '../../constants';
import ImageView from 'react-native-image-viewing';
import { scale } from 'react-native-size-matters';
import { commonStyle } from '../../styles/styles';

interface RNImageProps extends PressableProps {
  singleClickPreview?: boolean;
  source?: any; // Update the type as per your source data type
  style?: any;
  borderRadius?: number;
  imageStyle?: any;
  resizeMode?: any;
  tintColor?: string;
  shadow?: boolean;
  Loading?: React.ReactNode;
  disableDefaultSource?: boolean;
}

const RNImage = ({
  singleClickPreview,
  onPress,
  source,
  style,
  borderRadius = 0,
  imageStyle,
  resizeMode,
  tintColor,
  shadow,
  Loading,
  disableDefaultSource,
  ...props
}: RNImageProps) => {
  const [loading, setLoading] = useState(true);
  const [visible, setIsVisible] = useState(false);

  return (
    <Pressable
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      onLongPress={() => (source?.uri ? setIsVisible(true) : null)}
      onPress={
        singleClickPreview && source?.uri ? () => setIsVisible(true) : onPress
      }
      style={[
        styles.imageStyle,
        borderRadius ? { borderRadius } : null, // Apply borderRadius style conditionally
        shadow && commonStyle.SHADOW,
        style
      ]}
      {...props}>
      <Image
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        // defaultSource={
        //   disableDefaultSource || !source?.uri ? undefined : IMAGES.logo
        // }
        source={source}
        style={[
          styles.image,
          tintColor && { tintColor },
          borderRadius && { borderRadius },
          resizeMode && { resizeMode },
          imageStyle,
        ]}
      />
      {/* {Loading || loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={COLORS.PRIMARY} />
        </View>
      ) : null} */}
      {source?.uri ? (
        <ImageView
          images={[
            {
              uri: source?.uri,
            },
          ]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      ) : null}
    </Pressable>
  );
};

export default RNImage;

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imageStyle: {
    width: scale(30),
    height: scale(30),
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});
