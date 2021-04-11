import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants'
import { useFirestore } from '../contexts/FirestoreContext'
import { styles } from '../styles/styles'
import { Path } from '../types/types'
import PathComponent from './PathComponent'

type Props = {
    handlePath: (path: Path) => void
}

const PathsComponent: React.FC<Props> = ({ handlePath }) => {

    const [pathPicked, setPathPicked] = React.useState<Path>()
    const firestore = useFirestore()

    return (
        <View style={{ position: 'absolute', bottom: 0, width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.4, backgroundColor: '#fff', borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
            <View style={[styles.containerPadding, { backgroundColor: "#fff", flex: 2 }]}>
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
            </View>
            <View style={[styles.containerPadding, { backgroundColor: 'rgba(230,230,230,0.5)', flex: 1 }]}>
                <TouchableOpacity style={[styles.logButtons]} onPress={() => firestore.pickPath(pathPicked!)}>
                    <Text>Valider la course</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default PathsComponent