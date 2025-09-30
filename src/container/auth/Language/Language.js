import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {scale} from 'react-native-size-matters';
import {COLORS, COMMON_SIZE, IMAGES} from '../../../constants';
import {commonStyle} from '../../../styles/styles';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../config';
import STRINGS from '../../../constants/languagesString';
import {useDispatch} from 'react-redux';
import {RNContainer, RNImage, RNText, RNTextInput} from '../../../Common';
import {_onPressNavigate} from '../../../utils/commonFunction';
import {setLanguage} from '../../../utils/authentication';
import {LanguageArr} from '../../../constants/Mocks';

const Language = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    searchText: '',
    LanguageArrMain: []
  });
  const {searchText, LanguageArrMain} = state;

  const _onLanguageSelect = language => {
    console.log('🚀 ~ file: Language.js:28 ~ Language ~ language:', language);
    let languageCode = language.code;
    STRINGS.setLanguage(languageCode);
    setLanguage(languageCode);
    _onPressNavigate(SCREEN_NAMES.OnBoarding);
  };

  useEffect(() => {
    setState(prev => ({
      ...prev,
      LanguageArrMain: LanguageArr
    }));
  }, []);

  const _onChangeText = text => {
    const updatedData = LanguageArr.filter(item => {
      const item_data = item.name.toUpperCase();
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });

    setState(prev => ({
      ...prev,
      searchText: text,
      LanguageArrMain: updatedData
    }));
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => _onLanguageSelect(item)}
        style={styles.button}>
        <RNImage
          source={item?.code == 'en' ? IMAGES.en : IMAGES.bul}
          style={styles.flag}
        />
        <RNText style={{flex: 1}}>{item.name}</RNText>
      </TouchableOpacity>
    );
  };

  return (
    <RNContainer
      showsVerticalScrollIndicator={false}
      hideHeader
      style={{paddingHorizontal: scale(10)}}
      back={false}
      scroll>
      <RNText extraLarge bold>
        {STRINGS.ChooseLanguage}
      </RNText>
      <RNTextInput
        onChangeText={_onChangeText}
        onPressClearText={() => {
          setState(prev => ({
            ...prev,
            searchText: '',
            LanguageArrMain: LanguageArr
          }));
        }}
        leftIcon="search1"
        leftIconStyle={{
          color: COLORS.GRAY,
          fontSize: COMMON_SIZE.SMALL_ICON
        }}
        type={'AntDesign'}
        placeholder={STRINGS.searchLanguage}
        containerStyle={{marginBottom: 20}}
        value={searchText}
      />
      <FlatList data={LanguageArrMain} renderItem={renderItem} />
    </RNContainer>
  );
};

export default Language;

const styles = StyleSheet.create({
  space: {
    height: scale(30)
  },
  button: {
    height: scale(50),
    width: '98%',
    alignSelf: 'center',
    ...commonStyle.row,
    ...commonStyle.SHADOW,
    paddingHorizontal: scale(10),
    marginVertical: scale(10),
    justifyContent: 'space-between',
    borderRadius: scale(10)
  },
  flag: {
    height: scale(35),
    width: scale(35),
    resizeMode: 'contain',
    marginRight: 10
  },
  image: {
    width: '50%',
    height: scale(60),
    marginTop: 20
  }
});
