import moment from 'moment'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Icon } from 'react-native-elements'
import { COLORS, WINDOW_WIDTH } from '../constants/Constants'
import { styles } from '../styles/styles'
import { Path, } from '../types/types'

type Props = {
    path: Path,
    index: number,
    isPassenger?: boolean,
}

const PathComponent: React.FC<Props> = ({ path, index, isPassenger }) => {

    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true)

    return (
        <View style={[styles.containerPadding, styles.shadowContainer, styles.containerMargin, { backgroundColor: '#fff', borderRadius: 15 }]}>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.container, styles.containerPadding]}>
                    <Text style={{ fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'bold' }}>{isPassenger ? "Moi" : path.userFirstname}</Text>
                    <Text style={{ fontSize: WINDOW_WIDTH * 0.05, fontWeight: '500', color: COLORS.bluePrimary }}>{isPassenger ? "Le " + moment(path.dateDeparture).format("DD/MM/YYYY") + " à " + moment(path.timeDeparture).format("HH:mm") : "Départ à " + moment(path.timeDeparture).format("HH:mm")}</Text>
                </View>
                <View style={[styles.containerPadding, { justifyContent: 'center' }]}>
                    <Text style={{ fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'bold' }}>{(path.distance * 1.05).toFixed(2)} €</Text>
                </View>
            </View>
            {
                isPassenger &&
                <Collapsible collapsed={isCollapsed}>
                    <View style={styles.containerPadding}>
                        <Text style={{ fontSize: WINDOW_WIDTH * 0.05, fontWeight: '500' }}>Départ : {path.departureDestination.name}</Text>
                        <Text style={{ fontSize: WINDOW_WIDTH * 0.05, fontWeight: '500' }}>Arrivée : {path.arrivalDestination.name}</Text>
                    </View>
                </Collapsible>
            }
            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                <Icon name={isCollapsed ? "chevron-down" : "chevron-up"} type="ionicon" size={WINDOW_WIDTH * 0.08} color={COLORS.peach} />
            </TouchableOpacity>
        </View>
    )
}

export default PathComponent