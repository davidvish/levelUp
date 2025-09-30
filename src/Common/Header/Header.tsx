import { StyleSheet, View, Pressable, ImageSourcePropType, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, COMMON_SIZE, IMAGES } from '../../constants';
import { scale } from 'react-native-size-matters';
import RNText from '../Text/Text';
import RNIcon from '../Icon/Icon';
import { _onPressNavigate } from '../../utils/commonFunction';
import { commonStyle } from '../../styles/styles';
import RNImage from '../Image/Image';

interface RNHeaderProps {
  title?: string;
  back?: boolean;
  onBack?: () => void;
  rightComponent?: JSX.Element | null;
  leftComponent?: JSX.Element | null;
  style?: any;
  onPressCalnderHeader?: () => void;
  calnderHeader?: boolean;
  backgroundColor?: string;
  titleMarginRight?: any;
  onPressAchivementHeader?: () => void,
  onPressLeaderBoaderHeader?: () => void,
  Points?:any
}

const RNHeader: React.FC<RNHeaderProps> = ({
  title,
  back = true,
  onBack,
  rightComponent,
  leftComponent,
  style,
  onPressCalnderHeader,
  onPressAchivementHeader,
  onPressLeaderBoaderHeader,
  calnderHeader,
  backgroundColor,
  titleMarginRight,
  Points
}) => {
  const { goBack } = useNavigation();
  const BackgroundColor = backgroundColor;

  return (
    <>
      <View style={[styles.container, BackgroundColor && { backgroundColor }, style]}>
        {back ? (
          <Pressable
            onPress={() => {
              onBack ? onBack() : goBack();
            }}
            style={styles.button}>
            <RNIcon
              onPress={() => {
                onBack ? onBack() : goBack();
              }}
              name="arrowleft"
              type={'AntDesign'}
              size={COMMON_SIZE.MEDIUM_ICON}
              color={COLORS.WHITE}
            />
          </Pressable>
        ) : leftComponent ? (
          leftComponent
        ) : (
          <View style={styles.button} />
        )}

        {title ? (
          <View style={[styles.titleContainer]}>
            <RNText textColor={COLORS.WHITE} extraLarge semiBold style={styles.text}>
              {title}
            </RNText>
          </View>
        ) : null}

        <View style={{ ...commonStyle.row }}>
          {/* {calnderHeader ? (
            <>
            <Pressable
              style={[styles.CalnderHeaderIcon,{width:"0%"}]}
              hitSlop={{ top: 10, bottom: 10, left: 7, right: 5 }}>
              <RNImage
                onPress={onPressCalnderHeader}
                source={IMAGES.calendardaysImage as ImageSourcePropType}
                style={{ width: 20, height: 20 }} />
            </Pressable>
              </>
          ) : rightComponent ? (
            rightComponent
          ) : (
            <View style={styles.button} />
          )} */}
          {calnderHeader && (
          <View style={{ flexDirection: "row", width: 150, justifyContent: "space-between" }}>
          
          <Pressable
            onPress={onPressAchivementHeader}
              style={[styles.CalnderHeaderIcon, { width: "70%", alignItems:"center", justifyContent:"center"}]}>
              <RNImage
                onPress={onPressAchivementHeader}
                source={IMAGES.boltImage as ImageSourcePropType}
                style={{ width: 18, height: 18, }} />
                <RNText style={{left:3}} large textColor={"#7D94EC"}>{Points}</RNText>
            </Pressable>

            <Pressable
              onPress={onPressLeaderBoaderHeader}
              style={[styles.CalnderHeaderIcon, { width: "25%", alignItems: "center", justifyContent: "center" }]}>
              <RNImage
                onPress={onPressLeaderBoaderHeader}
                source={IMAGES.crownImage as ImageSourcePropType}
                style={{ width: 22, height: 22 }} />
            </Pressable>
            
          </View>)}
        </View>
      </View>
    </>
  );
};

export default RNHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: scale(60),
    paddingHorizontal: 10,
  },
  CalnderHeaderIcon: {
    //padding: scale(17),
    backgroundColor: COLORS.GAMIFICATIONHEADER,
    height: 35,
    borderRadius: 10,
    flexDirection:"row"
  },
  button: {
    width: 40,
    paddingLeft: 5
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center', 
    //marginRight: '40%' 
  },
  text: {
    textTransform: 'capitalize',
  },
  backIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  actionsheet: {
    height: scale(180),
    padding: 20,
    justifyContent: 'space-evenly',
  },
});
