import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/Constants';
import { styles } from '../styles/styles';

type Props = {
    title: string | ((props: { color: string; focused: boolean; }) => React.ReactNode) | undefined
    focused?: boolean
    onPress: () => void
}

const DrawerItemCustom: React.FC<Props> = ({ title, onPress, focused }) => {

    return (
        <TouchableOpacity style={[styles.drawerCustomItem, { backgroundColor: focused ? COLORS.bluePrimary : COLORS.white }]} onPress={() => onPress()}>
            <Text style={[styles.drawerCustomItemText, { color: focused ? COLORS.white : COLORS.black }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default DrawerItemCustom