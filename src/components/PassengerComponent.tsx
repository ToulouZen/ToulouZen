import React from 'react'
import { View } from 'react-native'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants'

const PassengerComponent = () => {
    return (
        <View style={{ position: 'absolute', bottom: 0, width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.4, backgroundColor: '#fff', borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>

        </View>
    )
}

export default PassengerComponent