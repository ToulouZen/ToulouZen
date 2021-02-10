import React from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import { COLORS, WINDOW_WIDTH } from '../constants/Constants'
import { styles } from '../styles/styles'

const HeaderComponent = () => {
    return (
        <View style={styles.containerPadding}>
            <View style={styles.menuItemView}>
                <Icon type="entypo" name="menu" size={WINDOW_WIDTH * 0.1} color={COLORS.white} />
            </View>
        </View>
    )
}

export default HeaderComponent