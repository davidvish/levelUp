import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Platform, 
  KeyboardAvoidingView,
  ScrollView,
  View,
  StatusBar,
  ScrollViewProps,
  KeyboardAvoidingViewProps,
  StyleProp,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import RNHeader from '../Header/Header';
import RNHeading from '../Heading/RNHeading';
import RNAnimatableWrapper from '../AnimatableWrapper/AnimatableWrapper';
import RNImage from '../Image/Image';
import AppHeader from '../AppHeader/AppHeader';
import { SCREEN_NAMES } from '../../config';
import { _onPressNavigate } from '../../utils/commonFunction';
import { COLORS } from '../../constants';
import { scale } from 'react-native-size-matters';

type RNContainerProps = {
  scroll?: boolean;
  onScroll?: any;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  style?: StyleProp<ViewStyle>;
  hidePaddingHorizontal?: boolean;
  hideBottomPadding?: boolean;
  hideScrollviewBottomPadding?: boolean;
  title?: string;
  back?: boolean;
  onBack?: () => void;
  rightComponent?: any;
  leftComponent?: any;
  headerStyle?: StyleProp<ViewStyle>;
  onPressCalnderHeader?: () => void;
  onPressAchivementHeader?: () => void,
  onPressLeaderBoaderHeader?: () => void,
  calnderHeader?: boolean;
  heading?: string;
  animation?: string;
  bottomChildren?: React.ReactNode;
  scrollViewRef?: React.RefObject<ScrollView>;
  keyboardVerticalOffset?: KeyboardAvoidingViewProps['keyboardVerticalOffset'];
  hideHeader?: boolean;
  bottomSafeAreaColor?: string;
  hideBottomSafeArea?: boolean;
  scrollHeight?: number;
  wrapperAnimationRef?: any;
  hideBackgroundImage?: boolean;
  showsVerticalScrollIndicator?: ScrollViewProps['showsVerticalScrollIndicator'];
  Appheader?: boolean;
  onPressLocation?: () => void;
  address?: string;
  locationLoading?: boolean;
  children?: any,
  titleMarginRight?:any
  onRefresh?:any,
  Points:any,
};

const RNContainer: React.FC<RNContainerProps> = ({
  scroll,
  onScroll,
  contentContainerStyle,
  children,
  style,
  hidePaddingHorizontal,
  hideBottomPadding,
  hideScrollviewBottomPadding,
  title,
  back,
  onBack,
  rightComponent,
  leftComponent,
  headerStyle,
  onPressCalnderHeader,
  onPressAchivementHeader,
  onPressLeaderBoaderHeader,
  calnderHeader,
  heading,
  animation,
  bottomChildren,
  scrollViewRef,
  keyboardVerticalOffset,
  hideHeader,
  bottomSafeAreaColor,
  hideBottomSafeArea,
  scrollHeight,
  wrapperAnimationRef,
  hideBackgroundImage = true,
  showsVerticalScrollIndicator,
  Appheader,
  titleMarginRight,
  onPressLocation,
  address,
  locationLoading,
  onRefresh,
  Points,
}) => {
  const [showBorderLine, setShowBorderLine] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    if (onRefresh) {
      onRefresh().then(() => setRefreshing(false));
    } else {
      setTimeout(() => setRefreshing(false), 2000);
    }
  }, [onRefresh]);

  const _onScroll : any = (event: ScrollViewProps['onScroll']) => {
    if (onScroll) {
      onScroll(event);
    }
    const { y } = (event as any).nativeEvent.contentOffset;
    if (y <= 0) {
      setShowBorderLine(false);
    } else {
      if (y > scrollHeight!) {
        setShowBorderLine(true);
      } else {
        setShowBorderLine(true);
      }
    }
  };

  // const _onPressCalnderHeader = () => {
  //   _onPressNavigate(SCREEN_NAMES.Notifications);
  // };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.HEADERCOLOR} />
      {hideBackgroundImage ? null : null}

      <SafeAreaView
        style={[
          { flex: 0, backgroundColor: Platform.OS === "android" ? COLORS.BG_COLOR : COLORS.PRIMARY },
          // hideBackgroundImage && { backgroundColor: COLORS.BG_COLOR }
        ]}
      />

      {hideHeader ? null : Appheader ? (
        <AppHeader />
      ) : (
        <RNHeader
          backgroundColor={
            hideBackgroundImage ? COLORS.HEADERCOLOR : COLORS.TRANSPARENT
          }
          title={title}
          back={back}
          Points={Points}
          onBack={onBack}
          titleMarginRight={titleMarginRight}
          rightComponent={rightComponent}
          leftComponent={leftComponent}
          style={[
            showBorderLine &&
              title && {
                borderBottomColor: COLORS.SILVER,
                borderBottomWidth: Platform.OS == 'android' ? 0.5 : 0.2,
              },
            headerStyle,
          ]}
          onPressCalnderHeader={onPressCalnderHeader}
          onPressAchivementHeader={onPressAchivementHeader}
          onPressLeaderBoaderHeader={onPressLeaderBoaderHeader}
          calnderHeader={calnderHeader}
        />
      )}
      {heading ? <RNHeading title={heading} /> : null}
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        style={[
          styles.container,
          !hidePaddingHorizontal && { paddingHorizontal: scale(10) },
          !hideBottomPadding && { paddingBottom: scale(10) },
          hideBackgroundImage && { backgroundColor: COLORS.BG_COLOR },
          style,
        ]}>
        {scroll ? (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            onScroll={_onScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh ? handleRefresh : undefined}
                colors={[COLORS.PRIMARY]}
                tintColor={COLORS.PRIMARY}
              />
            }
            contentContainerStyle={[
              { flexGrow: 1 },
              !hideScrollviewBottomPadding && { paddingBottom: scale(30) },
              style,
            ]}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
      {bottomChildren ? (
        <View
          style={{
            width: hidePaddingHorizontal ? '100%' : '95%',
            alignSelf: 'center',
            backgroundColor: COLORS.MAINBACKGROUNDCOLOR,
            paddingVertical: scale(5),
            paddingBottom:10
          }}>
          {bottomChildren}
        </View>
      ) : null}
      {hideBottomSafeArea ? null : (
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor: bottomSafeAreaColor || COLORS.BG_COLOR,
          }}
        />
      )}
    </>
  );
};

export default RNContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
