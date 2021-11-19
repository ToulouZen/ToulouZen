import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from 'common/styles/styles';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from 'constants/Constants';
import { useFirestore } from 'contexts/FirestoreContext';
import { Path, RootStackParamsList } from 'common/types/types';
import PathComponent from './PathComponent';
import I18n from 'internationalization';

type Props = {
  handlePath: (path: Path) => void;
  navigation: DrawerNavigationProp<RootStackParamsList, 'Home'>;
};

const PathsComponent: React.FC<Props> = ({ handlePath, navigation }) => {
  const [pathPicked, setPathPicked] = React.useState<Path>();
  const firestore = useFirestore();

  const pathChoosed = (pathPicked: Path) => {
    firestore.pickPath(pathPicked!);
    navigation.navigate('DriverConfirm');
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT * 0.4,
        backgroundColor: '#fff',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
      }}>
      <View
        style={[
          styles.containerPadding,
          { backgroundColor: 'transparent', flex: 2 },
        ]}>
        {firestore.paths.length > 0 ? (
          <FlatList
            data={firestore.paths}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setPathPicked(item);
                    handlePath(item);
                  }}>
                  <PathComponent
                    path={item}
                    index={index}
                    pathPicked={pathPicked}
                  />
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <Text style={styles.logTexts}>{I18n.t('ride.no_ride')}</Text>
          </View>
        )}
      </View>
      <View
        style={[
          styles.containerPadding,
          { backgroundColor: 'rgba(230,230,230,0.5)', flex: 1 },
        ]}>
        <TouchableOpacity
          style={[
            styles.logButtons,
            firestore.paths.length === 0 ? styles.disabled : styles.logButtons,
          ]}
          onPress={() => pathChoosed(pathPicked!)}
          disabled={firestore.paths.length === 0}>
          <Text style={[styles.userTypeTextConductrice, { color: '#fff' }]}>
            {I18n.t('ride.confirm_ride')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PathsComponent;
