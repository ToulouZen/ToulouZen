import { DrawerScreenProps } from '@react-navigation/drawer';
import { styles } from 'common/styles/styles';
import { Path, RootStackParamsList } from 'common/types/types';
import { Header } from 'components/Header';
import PathComponent from 'components/PathComponentV2';
import { PASSENGER, WINDOW_WIDTH } from 'constants/Constants';
import { useAuth } from 'contexts/AuthContext';
import { useFirestore } from 'contexts/FirestoreContext';
import I18n from 'internationalization';
import React, { FC } from 'react';
import { FlatList, View } from 'react-native';

type Props = DrawerScreenProps<RootStackParamsList, 'Paths'>;

type PathRenderItem = {
  item: Path;
};

const PathsScreen: FC<Props> = ({ navigation }) => {
  const firestore = useFirestore();
  const auth = useAuth();

  const renderPathComponent = ({ item }: PathRenderItem) => (
    <PathComponent path={item} />
  );

  return (
    <View style={styles.container}>
      <Header
        title={I18n.t('general.drawer_menu.rides')}
        navigation={navigation}
      />
      <FlatList
        data={
          auth.userInfo?.userType === PASSENGER
            ? firestore.passengerPaths
            : firestore.driverPaths
        }
        keyExtractor={item => item.id}
        renderItem={renderPathComponent}
      />
    </View>
  );
};

export default PathsScreen;
