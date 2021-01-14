import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Input, Icon } from 'react-native-elements';
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { styles } from '../../styles/styles';

const SignupScreen = () => {
    const [firstname, setFirstname] = React.useState<string>('')
    const [lastname, setLastname] = React.useState<string>('')
    const [age, setAge] = React.useState<string>('')
    const [mail, setMail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('')

    // avatar: {},

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.nude }]}>
            <View style={[styles.container, { backgroundColor: COLORS.nude }]}>
                <Avatar
                    containerStyle={styles.avatar}
                    icon={{ type: "simple-line-icon", name: "user-female", size: WINDOW_WIDTH * 0.25, color: COLORS.white }}
                    size="large"
                    activeOpacity={0}
                >
                    <View style={[styles.avatarEdit, { position: 'absolute', bottom: 0 }]}>
                        <MaterialIcons name="mode-edit" color={COLORS.white} size={WINDOW_WIDTH * 0.05} />
                    </View>
                </Avatar>
                <ScrollView style={[styles.container, { backgroundColor: COLORS.nude }]}>
                    <Input value={firstname} onChangeText={firstname => setFirstname(firstname)} placeholder="Jeanne"
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Prénom" labelStyle={styles.logsInputLabel}
                    />
                    <Input value={lastname} onChangeText={lastname => setLastname(lastname)} placeholder="Dupont"
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Nom" labelStyle={styles.logsInputLabel}
                    />
                    <Input value={age} onChangeText={age => setAge(age)} placeholder="18"
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Age" labelStyle={styles.logsInputLabel}
                    />
                    <Input value={mail} onChangeText={mail => setMail(mail)} placeholder="jeanne_dupont@gmail.com"
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="E-mail" labelStyle={styles.logsInputLabel}
                    />
                    <Input value={password} onChangeText={password => setPassword(password)}
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Mot de passe" labelStyle={styles.logsInputLabel}
                    />
                    <Input value={passwordConfirmation} onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)}
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Confirmation du mot de passe" labelStyle={styles.logsInputLabel}
                    />
                </ScrollView>
                <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                    <TouchableOpacity style={[styles.logsButton, { marginBottom: WINDOW_WIDTH * 0.02 }]}>
                        <Text style={styles.logsButtonText}>Valider</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView >
    )
}

export default SignupScreen