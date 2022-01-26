import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { FC } from 'react';
import { FlatList, View } from 'react-native';
import HeaderMap from 'components/HeaderMap';
import PathComponent from 'components/PathComponent';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import { styles } from 'common/styles/styles';
import { RootStackParamsList } from 'common/types/types';
import { PASSENGER } from 'constants/Constants';

type Props = DrawerScreenProps<RootStackParamsList, 'Paths'>;

const PathsScreen: FC<Props> = ({ navigation }) => {
  const firestore = useFirestore();
  const auth = useAuth();

  return (
    <View style={styles.container}>
      <HeaderMap navigation={navigation} />
      <FlatList
        data={
          auth.userInfo?.userType === PASSENGER
            ? firestore.passengerPaths
            : firestore.driverPaths
        }
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <PathComponent
            path={item}
            index={index}
            isPassenger={auth.userInfo?.userType === PASSENGER}
          />
        )}
      />
    </View>
  );
};

export default PathsScreen;
