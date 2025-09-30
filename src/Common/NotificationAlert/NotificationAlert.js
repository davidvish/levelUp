import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { COLORS, STRINGS } from '../../constants';

import { scale } from 'react-native-size-matters';
import { commonStyle } from '../../styles/styles';

const RNNotificationAlert = ({
  onPress,
  body,
  title,
  container,
  rightButtonTitle,
}) => {
  return (
    <View style={[styles.container, container]}>
      <View style={{ width: '80%', paddingHorizontal: 10 }}>
        <Text
          numberOfLines={3}
          style={{ fontWeight: 'bold', color: 'red', fontSize: 18 }}>
          {title}
        </Text>
        <Text
          style={{ color: 'black', marginVertical: scale(5) }}
          numberOfLines={8}>
          {body}
        </Text>
      </View>

      <View style={styles.buttonView}>
        <Pressable onPress={onPress} style={styles.buttonViewInner}>
          <Text style={{ color: 'white', textAlign: "center" }}>
            {rightButtonTitle || STRINGS.retry}
          </Text>
        </Pressable>
      </View>
    </View>
    // <Animatable.View
    //   ref={buttonRef}
    //   // duration={1000} delay={100}
    //   animation={'fadeInDown'}
    //   //  animation={animation || "zoomIn"}
    //   easing="ease-out"
    //   style={[styles.container, container]}>
    //   <View style={{width: '80%', paddingHorizontal: 10}}>
    //     <Text
    //       numberOfLines={3}
    //       style={{fontWeight: 'bold', color: 'red', fontSize: 18}}>
    //       {title}
    //     </Text>
    //     <Text
    //       style={{color: 'black', marginVertical: scale(5)}}
    //       numberOfLines={8}>
    //       {body}
    //     </Text>
    //   </View>

    //   <View style={styles.buttonView}>
    //     <Pressable
    //       onPress={() => {
    //         // buttonRef.current.fadeOutUp();
    //         onPress(buttonRef);
    //       }}
    //       style={styles.buttonViewInner}>
    //       <Text style={{color: 'white'}}>
    //         {rightButtonTitle || STRINGS.retry}
    //       </Text>
    //     </Pressable>
    //   </View>
    // </Animatable.View>
  );
};

export default RNNotificationAlert;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    borderRadius: 7,
    position: 'absolute',
    zIndex: 2,
    marginTop: 40,
    // alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingVertical: 10,
    ...commonStyle.SHADOW
    // height: 100,
  },
  buttonView: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonViewInner: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    borderRadius: 10,
    maxHeight: 80,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.PRIMARY_DARK,
  },
});
