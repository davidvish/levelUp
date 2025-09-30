import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import RNIcon from '../Icon/Icon';
import { RNTextInput } from '../TextInput';
import { COLORS, COMMON_SIZE, STRINGS } from '../../constants';
import { commonStyle } from '../../styles/styles';
import { scale } from 'react-native-size-matters';
import RNAnimatableWrapper from '../AnimatableWrapper/AnimatableWrapper';

const RNDropdown = ({ arr, value, onSelect, placeholder }) => {
  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState(arr);
  const searchRef = useRef();

  const onSearch = search => {
    if (search !== '') {
      let tempData = data.filter(item => {
        return item.value.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(arr);
    }
  };
  const _onClearSearchText = () => {
    setSearch('');
    setData(arr);
  };
  return (
    <View style={{ flex: 1 }}>
      <RNTextInput
        hideClearText
        placeholder={placeholder}
        value={value}
        onPress={() => {
          setClicked(!clicked);
        }}>
        {clicked ? (
          <RNIcon
            size={COMMON_SIZE.SMALL_ICON}
            name={'up'}
            type={'AntDesign'}
          />
        ) : (
          <RNIcon
            size={COMMON_SIZE.SMALL_ICON}
            name={'down'}
            type={'AntDesign'}
          />
        )}
      </RNTextInput>
      {clicked ? (
        <RNAnimatableWrapper
          animation={'zoomInDown'}
          duration={300}
          style={styles.subContainer}>
          <RNTextInput
            hideHeader
            onPressClearText={_onClearSearchText}
            placeholder={STRINGS.search}
            value={search}
            ref={searchRef}
            onChangeText={txt => {
              onSearch(txt);
              setSearch(txt);
            }}
            containerStyle={styles.searchBarStyle}
          />

          <FlatList
            keyExtractor={(_, index) => index + ''}
            data={data}
            nestedScrollEnabled
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.dropDownItemStyle}
                  onPress={() => {
                    onSelect && onSelect(item);
                    onSearch('');
                    setClicked(!clicked);
                    setSearch('');
                  }}>
                  <Text style={{ fontWeight: '600' }}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </RNAnimatableWrapper>
      ) : null}
    </View>
  );
};

export default RNDropdown;

const styles = StyleSheet.create({
  subContainer: [
    commonStyle.SHADOW,
    {
      maxHeight: 300,
      alignSelf: 'center',
      width: '97%',
      marginTop: 10,
      // backgroundColor: 'red',
      borderRadius: 10,
      paddingVertical: scale(10),
      paddingHorizontal: scale(10),
    },
  ],
  searchBarStyle: {
    borderWidth: 0.5,
    borderRadius: 10,
    height: scale(40),
  },
  dropDownItemStyle: {
    width: '85%',
    alignSelf: 'center',
    height: scale(45),
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: COLORS.PLACEHOLDER_COLOR,
  },
});
