import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { scale } from 'react-native-size-matters';

import Text from '../Text/Text';
import { COLORS, STRINGS } from '../../constants';

const RNHeadingChips = ({ arr, onSelect, count }) => {
  const refForFlatlist = React.useRef(null);
  const [selectedItem, setSelectedItem] = useState(STRINGS.all);

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          refForFlatlist?.current?.scrollToIndex({ index: index });
          setSelectedItem(item);
          onSelect(item);
        }}
        style={[
          styles.buttonStyle,
          {
            backgroundColor:
              selectedItem == item ? COLORS.PRIMARY : 'transparent',
            borderWidth: selectedItem == item ? 0 : 0.5,
          },
        ]}>
        <Text
          bold
          capitalize
          textColor={selectedItem == item ? COLORS.WHITE : COLORS.PRIMARY}>
          {item} {selectedItem == item ? count : ''}
        </Text>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        keyExtractor={(_, index) => index + ''}
        showsHorizontalScrollIndicator={false}
        horizontal
        ref={refForFlatlist}
        showsVerticalScrollIndicator={false}
        data={[STRINGS.all, ...arr]}
        renderItem={renderItem}
      />
    </View>
  );
};

export default RNHeadingChips;

const styles = StyleSheet.create({
  buttonStyle: {
    paddingHorizontal: scale(15),
    marginHorizontal: scale(5),
    marginVertical: scale(10),
    height: scale(30),
    borderRadius: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.PRIMARY,
  },
});
