import React from 'react';
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Avatar, Input, Icon } from 'react-native-elements';
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { styles } from '../../styles/styles';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../../types/types';

type Props = StackScreenProps<RootStackParamsList, 'Signup'>

const SignupScreen: React.FC<Props> = ({ navigation, route }) => {
    const [firstname, setFirstname] = React.useState<string>('')
    const [lastname, setLastname] = React.useState<string>('')
    const [age, setAge] = React.useState<string>('')
    const [mail, setMail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('')
    const [switched, setSwitched] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    const auth = useAuth()
    // avatar: {},
    React.useEffect(() => {
        if (switched) {
            setToken()
        }
    }, [switched])


    const setToken = async () => {
        await AsyncStorage.setItem('MoneyTrackToken', 'autolog')
    }

    const signup = async () => {
        try {
            await auth.register(mail, password, firstname, lastname, Number(age))
            Alert.alert("Votre espace personnalisé a été créée", "Nous vous souhaitons la bienvenue dans la famille Toulou'Zen !", [
                {
                    text: 'Super !',
                    onPress: () => {
                        navigation.navigate('App')
                    }
                }
            ])
        } catch (e) {
            console.log(e);
            Alert.alert(e)

        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <Image
                    style={{ width: WINDOW_WIDTH }}
                    source={require('../../img/Courbe.png')}
                    resizeMode="contain"
                />
                <View style={{ width: WINDOW_WIDTH * 0.85, alignSelf: 'center' }}>
                    <Text style={[styles.logTitle, styles.containerMargin]}>INSCRIPTION</Text>
                </View>
                <TextInput value={lastname} onChangeText={lastname => setLastname(lastname)} placeholder="Nom"
                    style={[styles.logInputs, styles.containerMargin, { padding: WINDOW_WIDTH * 0.04 }]}
                />
                <TextInput value={firstname} onChangeText={firstname => setFirstname(firstname)} placeholder="Prénom"
                    style={[styles.logInputs, styles.containerMargin, { padding: WINDOW_WIDTH * 0.04 }]}
                />
                <TextInput value={age} onChangeText={age => setAge(age)} placeholder="Age"
                    style={[styles.logInputs, styles.containerMargin, { padding: WINDOW_WIDTH * 0.04 }]} keyboardType="numeric"
                />
                <TextInput value={mail} onChangeText={mail => setMail(mail)} placeholder="E-mail"
                    style={[styles.logInputs, styles.containerMargin, { padding: WINDOW_WIDTH * 0.04 }]}
                />
                <View style={[styles.logInputs, styles.containerMargin, { flexDirection: 'row' }]}>
                    <TextInput value={password} secureTextEntry={!showPassword} onChangeText={password => setPassword(password)} placeholder="Mot de passe"
                        style={styles.logPasswordInput}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                        style={{ marginHorizontal: WINDOW_WIDTH * 0.02 }}
                    >
                        <Icon name={showPassword ? "eye" : "eye-off"} type="feather" size={WINDOW_WIDTH * 0.07} />
                    </TouchableOpacity>
                </View>
                <TextInput value={passwordConfirmation} onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)} placeholder="Confirmation du mot de passe"
                    style={[styles.logInputs, styles.containerMargin, { padding: WINDOW_WIDTH * 0.04 }]}
                />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => signup()}
                        style={[styles.logButtons, styles.containerMargin]}>
                        <Text style={styles.userTypeTextPassagere}>Validation</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )
}

export default SignupScreen