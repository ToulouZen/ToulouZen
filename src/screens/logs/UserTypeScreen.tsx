import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Image, Text, View, TouchableOpacity } from 'react-native'
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants'
import { styles } from '../../styles/styles'
import { RootStackParamsList } from '../../types/types'

type Props = StackScreenProps<RootStackParamsList, 'UserType'>

const UserTypeScreen: React.FC<Props> = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.logoHeader}
                source={require('../../img/logo_toulouzen.png')}
                resizeMode="contain"
            />
            <Image
                style={{ width: WINDOW_WIDTH }}
                source={require('../../img/Courbe.png')}
                resizeMode="contain"
            />
            <View style={[styles.container]}>
                <View style={{ width: WINDOW_WIDTH * 0.85, alignSelf: 'center' }}>
                    <Text style={[styles.logTitle, styles.containerMargin]}>JE SUIS ...</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login', { userType: "driver" })}
                    style={[styles.logButtons, styles.containerMargin, { backgroundColor: COLORS.lightGrey }]}>
                    <Text style={styles.userTypeTextConductrice}>Conductrice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login', { userType: "passenger" })}
                    style={[styles.logButtons, styles.containerMargin]}>
                    <Text style={styles.userTypeTextPassagere}>Passagère</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UserTypeScreen