import { StyleSheet, Text, View, TextInputProps, ViewStyle, Pressable, TextInput } from "react-native";
import React from "react";
import { RNTextInput } from "../TextInput";
import { COLORS, COMMON_SIZE, FONTS, IMAGES, STRINGS } from "../../constants";
import { scale } from "react-native-size-matters";
import RNImage from "../Image/Image";

interface RNSearchBarProps extends TextInputProps {
  rightIcon?: string;
  leftIcon?: string;
  leftIconStyle?: ViewStyle;
  rightIconStyle?: ViewStyle;
  onPressClearText?: () => void;
  style?: ViewStyle;
  onPress?: () => void;  // Ensure correct type
  inputText?: string
}

const RNSearchBar: React.FC<RNSearchBarProps> = ({
  rightIcon,
  leftIcon,
  keyboardType,
  blurOnSubmit = true,
  autoCapitalize,
  autoFocus,
  onChangeText,
  leftIconStyle,
  rightIconStyle,
  placeholder,
  value,
  onPressClearText,
  onPress,
  inputText,
  style,
  ...props
}) => {
  return (
    <>
      <View style={{marginTop:scale(20), flexDirection: "row", width: "100%", height: "auto", justifyContent: "space-between", alignItems: "center", alignSelf: "center" }}>
          <TextInput
          style={[styles.container, {borderWidth: 0,
            borderColor: COLORS.TRANSPARENT,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            color: COLORS.PRIMARY,
            fontSize: COMMON_SIZE.LARGE,
            fontFamily: FONTS.openSans_SemiBold,
            paddingVertical: scale(10),
            paddingLeft: scale(10),
          }]}
            placeholder={placeholder || STRINGS.search}
            onChangeText={onChangeText}
            value={value}
          />
          {/* <RNTextInput
            {...props}
            onChangeText={onChangeText}
            autoCapitalize={autoCapitalize}
            autoFocus={autoFocus}
            blurOnSubmit={blurOnSubmit}
            containerStyle={{
              borderWidth: 0,
              borderColor: COLORS.TRANSPARENT,
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
            }}
            keyboardType={keyboardType}
            placeholder={placeholder || STRINGS.search}
            value={value}
            onPressClearText={onPressClearText}
            hideHeader /> */}
        <Pressable
          onPress={onPress}
          style={[styles.container, {borderBottomRightRadius: 10,
            borderTopRightRadius: 10, backgroundColor: inputText != "" ? COLORS.PRIMARY : COLORS.DISABLED, width:"20%", alignItems:"center", justifyContent:"center"}]}>
          <RNImage onPress={onPress} source={IMAGES.search} style={{ width: 25, height: 25 }} />
        </Pressable>
      </View>
    </>
  );
};

export default RNSearchBar;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderColor: COLORS.TRANSPARENT,
    height: scale(48),
    bottom: scale(10),
    width: "80%",
    backgroundColor:COLORS.WHITE
    //marginBottom: scale(10)
  },
  searchIconStyle:{
   // marginBottom: scale(10),
    width: "20%",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    borderColor: COLORS.TRANSPARENT,
    height: scale(47),
    backgroundColor: COLORS.PRIMARY,
   // top: scale(1),  // Adjusted to align with the text input
    justifyContent: "center",
    alignItems: "center"
  }
});