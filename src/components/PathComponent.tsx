import React from 'react'
import { Text, View } from 'react-native'
import { COLORS, WINDOW_WIDTH } from '../constants/Constants'
import { styles } from '../styles/styles'
import { Path } from '../types/types'

type Props = {
    path: Path,
    index: number
}

const PathComponent: React.FC<Props> = ({ path, index }) => {
    return (
        <View style={[styles.containerPadding, styles.shadowContainer, { flexDirection: 'row', backgroundColor: '#fff', borderTopLeftRadius: index == 0 ? 15 : undefined, borderTopRightRadius: index == 0 ? 15 : undefined }]}>
            <View style={[styles.container, styles.containerPadding]}>
                <Text style={{ fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'bold' }}>{path.userFirstname}</Text>
                <Text style={{ fontSize: WINDOW_WIDTH * 0.05, fontWeight: '500', color: COLORS.bluePrimary }}>Départ à {path.timeDeparture}</Text>
            </View>
            <View style={[styles.containerPadding, { justifyContent: 'center' }]}>
                <Text style={{ fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'bold' }}>{(path.distance * 1.05).toFixed(2)} €</Text>
            </View>
        </View>
    )
}

export default PathComponent