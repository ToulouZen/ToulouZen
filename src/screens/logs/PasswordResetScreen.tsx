import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { WINDOW_WIDTH } from '../../constants/Constants'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../styles/styles'
import { RootStackParamsList } from '../../types/types'

type Props = StackScreenProps<RootStackParamsList, 'PasswordReset'>

const PasswordResetScreen: React.FC<Props> = ({ navigation, route }) => {

    const [mail, setMail] = React.useState<string>('')
    const auth = useAuth()

    const reset = () => {
        Alert.alert('Réinitialisation', 'En appuyant sur "Oui", vous allez recevoir un courrier électronique sur l\'adresse e-mail que vous avez renseigné. Si vous ne recevez rien, réessayez en vérifiant que l\'adresse e-mail renseignée est correcte.',
            [
                {
                    text: 'Oui',
                    onPress: () => auth.resetPassword(mail, navigation)
                },
                {
                    text: 'Annuler',
                    onPress: () => navigation.goBack()
                }
            ]
        )
    }

    return (
        <ScrollView style={styles.container}>
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
                <View style={styles.container}>
                    <View style={{ width: WINDOW_WIDTH * 0.85, alignSelf: 'center' }}>
                        <Text style={[styles.logTitle, styles.containerMargin]}>Réinitialisation</Text>
                    </View>
                    <View style={styles.container}>
                        <TextInput value={mail} keyboardType="email-address" onChangeText={mail => setMail(mail)} placeholder="E-mail"
                            style={[styles.logInputs, styles.containerMargin, { padding: WINDOW_WIDTH * 0.04 }]}
                        />

                        <TouchableOpacity onPress={() => reset()}
                            style={[styles.logButtons, mail.length == 0 ? styles.disabled : styles.logButtons, styles.containerMargin]}
                            disabled={mail.length == 0}
                        >
                            <Text style={styles.userTypeTextPassagere}>Envoyer l'email</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default PasswordResetScreen