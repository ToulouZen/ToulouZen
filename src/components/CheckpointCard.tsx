import Marker from 'assets/img/marker.svg';
import { styles } from 'common/styles/styles';
import { Checkpoint } from 'common/types/types';
import { COLORS, WINDOW_WIDTH } from 'constants/Constants';
import I18n from 'internationalization';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = {
  checkpoint: Checkpoint;
  goTo: (checkpoint: Checkpoint) => void;
};

const CheckpointCard: FC<Props> = ({ checkpoint, goTo }) => {
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
        <Text style={{ color: COLORS.peach, fontSize: RFValue(14) }}>
          {I18n.t('common.going_there')}
        </Text>
        <Marker width={WINDOW_WIDTH * 0.07} height={WINDOW_WIDTH * 0.07} />
      </TouchableOpacity>
    </View>
  );
};

export default CheckpointCard;
