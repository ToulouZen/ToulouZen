import { DrawerScreenProps } from '@react-navigation/drawer'
import React from 'react'
import { FlatList, View } from 'react-native'
import HeaderMap from '../../components/HeaderMap'
import PathComponent from '../../components/PathComponent'
import { useFirestore } from '../../contexts/FirestoreContext'
import { styles } from '../../styles/styles'
import { RootStackParamsList } from '../../types/types'

type Props = DrawerScreenProps<RootStackParamsList, "Paths">

const PathsScreen: React.FC<Props> = ({ navigation, route }) => {

    const firestore = useFirestore()

    return (
        <View style={styles.container}>
            <HeaderMap navigation={navigation} />
            <FlatList data={firestore.passengerPaths}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) =>
                    <PathComponent path={item} index={index} isPassenger={true} />
                }
            />
        </View>
    )
}

export default PathsScreen