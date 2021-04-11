import { DrawerScreenProps } from '@react-navigation/drawer'
import React from 'react'
import { View } from 'react-native'
import HeaderMap from '../../components/HeaderMap'
import { styles } from '../../styles/styles'
import { RootStackParamsList } from '../../types/types'

type Props = DrawerScreenProps<RootStackParamsList, "Settings">


const SettingsScreen: React.FC<Props> = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <HeaderMap navigation={navigation} />
        </View>
    )
}

export default SettingsScreen