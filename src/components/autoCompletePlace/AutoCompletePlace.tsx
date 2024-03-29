import GeoJSON, { Point } from 'geojson';
import useDebounce from 'hooks/debounce';
import I18n from 'internationalization';
import { autoCompleteAddress } from 'networking/adressToLocation';
import React, { useEffect, useState } from 'react';
import { LogBox, Text, TextInput, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { styles as componentStyle } from './AutoCompletePlace.style';

const AutoCompletePlace = ({
  placeholder = '',
  value = '',
  onChangeText = (_: string) => {},
  style,
  excludeFields = [I18n.t('ride.current_location')],
}) => {
  const [addressesResult, setAddressesResult] =
    useState<GeoJSON.FeatureCollection<Point> | null>();
  const [selectedAddress, setSelectedAddress] = useState('');
  const debouncedTypingValue = useDebounce(value, 300);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    if (selectedAddress === debouncedTypingValue) {
      return;
    }
    if (excludeFields.includes(debouncedTypingValue)) {
      return;
    }
    if (!debouncedTypingValue || debouncedTypingValue.length < 4) {
      setAddressesResult(null);
      return;
    }
    autoCompleteAddress({ address: debouncedTypingValue }).then(
      futureCollection => {
        setAddressesResult(futureCollection);
      },
    );
  }, [debouncedTypingValue]);

  return (
    <View>
      <TextInput
        onEndEditing={() => {
          setAddressesResult(null);
        }}
        style={style}
        placeholder={placeholder}
        value={value}
        onChangeText={text => {
          onChangeText(text);
        }}
      />
      {addressesResult ? (
        <View
          style={[
            componentStyle.suggestionContainer,
            componentStyle.parentContainer,
            style,
          ]}>
          <FlatList
            style={{ height: 100 }}
            data={addressesResult.features}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.2}
                style={componentStyle.suggestionItem}
                onPress={() => {
                  setAddressesResult(null);
                  setSelectedAddress(item.properties.label);
                  onChangeText(item.properties.label);
                }}>
                <Text>{item.properties.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.properties.id}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AutoCompletePlace;
