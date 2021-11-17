import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, WINDOW_WIDTH } from 'constants/Constants';
import { styles } from 'common/styles/styles';
import { Checkpoint } from 'common/types/types';

type Props = {
  checkpoint: Checkpoint;
  goTo: (checkpoint: Checkpoint) => void;
};

const CheckpointCard: React.FC<Props> = ({ checkpoint, goTo }) => {
  return (
    <View
      style={[
        styles.checkpointCardView,
        styles.shadowContainer,
        styles.containerPadding,
        { alignSelf: 'center' },
      ]}>
      <Text
        style={{
          fontSize: WINDOW_WIDTH * 0.07,
          fontWeight: 'bold',
          color: COLORS.bluePrimary,
        }}>
        {checkpoint.name}
      </Text>
      <TouchableOpacity
        onPress={() => goTo(checkpoint)}
        style={[
          styles.containerMargin,
          styles.startButton,
          {
            padding: WINDOW_WIDTH * 0.01,
            width: WINDOW_WIDTH * 0.3,
            justifyContent: 'space-around',
          },
        ]}>
        <Text style={{ color: COLORS.peach, fontSize: WINDOW_WIDTH * 0.04 }}>
          Y aller
        </Text>
        <Image
          resizeMode="contain"
          source={require('../assets/img/localisation_itineraire.png')}
          style={{
            height: WINDOW_WIDTH * 0.07,
            width: WINDOW_WIDTH * 0.07,
            tintColor: COLORS.peach,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CheckpointCard;
