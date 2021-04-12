import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants'
import { useFirestore } from '../contexts/FirestoreContext'
import { styles } from '../styles/styles'
import { Path } from '../types/types'
import PathComponent from './PathComponent'

type Props = {
    handlePath: (path: Path) => void
    navigation: any
}

const PathsComponent: React.FC<Props> = ({ handlePath, navigation }) => {

    const [pathPicked, setPathPicked] = React.useState<Path>()
    const firestore = useFirestore()

    const pathChoosed = (pathPicked: Path) => {
        firestore.pickPath(pathPicked!)
        navigation.navigate('DriverConfirm', { path: pathPicked })
    }

    return (
        <View style={{ position: 'absolute', bottom: 0, width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.4, backgroundColor: '#fff', borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
            <View style={[styles.containerPadding, { backgroundColor: "transparent", flex: 2 }]}>
                {
                    firestore.paths.length > 0 ? (
                        <FlatList data={firestore.paths}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setPathPicked(item)
                                handlePath(item)
                            }}>
                                <PathComponent path={item} index={index} />
                            </TouchableOpacity>
                        )
                    }}
                />
                    )
                    :
                    (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Text style={styles.logTexts}>
                                Aucun trajet disponible
                            </Text>
                        </View>
                    )
                }
                
            </View>
            <View style={[styles.containerPadding, { backgroundColor: 'rgba(230,230,230,0.5)', flex: 1, justifyContent: 'center' }]}>
                <TouchableOpacity style={[styles.logButtons, firestore.paths.length == 0 ? styles.disabled : styles.logButtons]} onPress={() => pathChoosed(pathPicked!)} disabled={firestore.paths.length == 0}>
                    <Text>Valider la course</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default PathsComponent