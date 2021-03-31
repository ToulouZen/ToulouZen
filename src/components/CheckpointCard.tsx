import React from 'react'
import { Text, View } from 'react-native'
import { styles } from '../styles/styles'
import { Checkpoint } from '../types/types'

type Props = {
    checkpoint: Checkpoint
}

const CheckpointCard: React.FC<Props> = ({ checkpoint }) => {
    return (
        <View style={[styles.checkpointCardView, styles.shadowContainer]}>
            <Text>{checkpoint.name}</Text>
        </View>
    )
}