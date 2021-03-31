import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

type Props = {
    title: string | ((props: { color: string; focused: boolean; }) => React.ReactNode) | undefined
    focused?: boolean
    onPress: () => void
}

const DrawerItemCustom: React.FC<Props> = ({ title, onPress, focused }) => {

    return (
        <TouchableOpacity style={styles.drawerCustomItem} onPress={() => onPress()}>
            <Text style={styles.drawerCustomItemText}>{title}</Text>
        </TouchableOpacity>
    )
}

export default DrawerItemCustom