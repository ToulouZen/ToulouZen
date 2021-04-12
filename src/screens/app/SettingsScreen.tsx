import { DrawerScreenProps } from '@react-navigation/drawer'
import React from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import HeaderMap from '../../components/HeaderMap'
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants'
import { useAuth } from '../../contexts/AuthContext'
import { styles } from '../../styles/styles'
import { RootStackParamsList } from '../../types/types'

type Props = DrawerScreenProps<RootStackParamsList, "Settings">


const SettingsScreen: React.FC<Props> = ({ navigation, route }) => {

    const auth = useAuth()

    const [firstnameText, setFirstnameText] = React.useState<string>(auth.userInfo!.firstname!)
    const [lastnameText, setLastnameText] = React.useState<string>(auth.userInfo!.lastname!)
    const [ageText, setAgeText] = React.useState<string>(auth.userInfo!.age!.toString())
    const [mailText, setMailText] = React.useState<string>(auth.userInfo!.mail!)
    const [userTypeText, setUserTypeText] = React.useState<string>(auth.userInfo!.userType!)
    const [buttonTitle, setButtonTitle] = React.useState<string>('Sauvegarder')
    const [disableButton, setDisableButton] = React.useState<boolean>(true)

    React.useEffect(() => {
        getButtonTitle()
    }, [firstnameText, lastnameText, ageText, mailText, auth.userInfo])

    const getButtonTitle = () => {
        const { firstname, lastname, age, mail, userType } = auth.userInfo!
        setDisableButton(true)
        if (firstname != firstnameText || lastname != lastnameText ||
            age!.toString() != ageText || mail != mailText
        ) {
            setButtonTitle('Sauvegarder')
            setDisableButton(false)
        } else {
            // setButtonTitle('Sauvegardé')
        }
    }

    const updateUser = () => {
        auth.updateUser(mailText, firstnameText, lastnameText, Number(ageText), userTypeText)
    }

    return (
        <View style={styles.container}>
            <HeaderMap navigation={navigation} />
            <ScrollView style={styles.container} bounces={false} >
                <View style={styles.container}>
                    <TextInput value={lastnameText} onChangeText={lastname => setLastnameText(lastname)} placeholder="Nom"
                        style={[styles.logInputs, { padding: WINDOW_WIDTH * 0.04, marginVertical: WINDOW_WIDTH * 0.04 }]}
                    />
                    <TextInput value={firstnameText} onChangeText={firstname => setFirstnameText(firstname)} placeholder="Prénom"
                        style={[styles.logInputs, { padding: WINDOW_WIDTH * 0.04, marginVertical: WINDOW_WIDTH * 0.04 }]}
                    />
                    <TextInput value={ageText} onChangeText={age => setAgeText(age)} placeholder="Age"
                        style={[styles.logInputs, { padding: WINDOW_WIDTH * 0.04, marginVertical: WINDOW_WIDTH * 0.04 }]} keyboardType="numeric"
                    />
                    <TextInput value={mailText} keyboardType="email-address" onChangeText={mail => setMailText(mail)} placeholder="E-mail"
                        style={[styles.logInputs, { padding: WINDOW_WIDTH * 0.04, marginVertical: WINDOW_WIDTH * 0.04 }]}
                    />
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity disabled={disableButton} onPress={() => updateUser()}
                            style={[styles.logButtons, disableButton ? styles.disabled : styles.logButtons, styles.containerMargin]}>
                            <Text style={styles.userTypeTextPassagere}>{buttonTitle}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

        </View>
    )
}

export default SettingsScreen