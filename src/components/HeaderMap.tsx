import { DrawerNavigationProp } from '@react-navigation/drawer'
import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { COLORS, WINDOW_WIDTH } from '../constants/Constants'
import { RootStackParamsList } from '../types/types'

type Props = {
    navigation: DrawerNavigationProp<RootStackParamsList, "Home">
}

const HeaderMap: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={[{ position: 'absolute', top: 0, flexDirection: 'row', justifyContent: 'space-between', padding: WINDOW_WIDTH * 0.03, width: WINDOW_WIDTH }]}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon type="entypo" name="menu" size={WINDOW_WIDTH * 0.1} color={COLORS.blackBackground} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image source={require('../img/Button_SOS.png')} resizeMode="contain"
                    style={{ width: WINDOW_WIDTH * 0.1, height: WINDOW_WIDTH * 0.1 }} />
            </TouchableOpacity>
        </View>
    )
}
export default HeaderMap