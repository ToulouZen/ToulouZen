import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { Alert, Image, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/Constants';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';
import { RootStackParamsList } from '../../types/types';


type Props = StackScreenProps<RootStackParamsList, 'Login'>

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {

    const [mail, setMail] = React.useState<string>('lisa_dupond@gmail.com')
    const [password, setPassword] = React.useState<string>('password')
    const [switched, setSwitched] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (switched) {
            setToken()
        }
    }, [switched])

    const auth = useAuth()

    const setToken = async () => {
        await AsyncStorage.setItem('ToulouzenToken', 'autolog')
    }

    const reset = () => {
        setMail('')
        setPassword('')
    }

    const login = async () => {
        try {
            auth.signIn(mail, password)
                .then(() => {
                    console.log("then")
                    auth.getUserInfo()
                }).then(() => {
                    navigation.navigate('App')
                    reset()
                })

        } catch (e) {
            // e.code = "auth/user-not-found"
            // e.message = "There is no user record corresponding to this identifier. The user may have been deleted."
            if (e.code === "auth/user-not-found") {
                Alert.alert('Ce compte n\'existe pas')
            }
            else {
                Alert.alert(e.message)
            }
        }
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
                        <Text style={[styles.logTitle, styles.containerMargin]}>Connexion</Text>
                    </View>
                    <View style={styles.container}>
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
                                <Image source={(showPassword ? require('../../img/Password_show.png') : require('../../img/Password_hide.png'))} resizeMode="contain"
                                    style={{ width: WINDOW_WIDTH * 0.08, height: WINDOW_WIDTH * 0.08, tintColor: COLORS.black }} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.containerMargin, { width: WINDOW_WIDTH * 0.8, alignSelf: 'center', alignItems: 'flex-end' }]}>
                            <Text style={[styles.logTexts, { textDecorationLine: 'underline' }]}>Mot de passe oublié</Text>
                        </View>
                        <TouchableOpacity onPress={() => login()}
                            style={[styles.logButtons, mail.length == 0 || password.length == 0 ? styles.disabled : styles.logButtons, styles.containerMargin]}
                            disabled={mail.length == 0 || password.length == 0}    
                        >
                            <Text style={styles.userTypeTextPassagere}>Me connecter</Text>
                        </TouchableOpacity>
                        <View style={{ alignSelf: 'center', marginVertical: WINDOW_HEIGHT * 0.03 }}>
                            <Text style={styles.logTexts}>ou me connecter avec</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <TouchableOpacity>
                                    <Image source={require('../../img/google.png')} resizeMode="contain"
                                        style={{ width: WINDOW_WIDTH * 0.07, height: WINDOW_WIDTH * 0.07, tintColor: COLORS.bluePrimary }} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../img/facebook.png')} resizeMode="contain"
                                        style={{ width: WINDOW_WIDTH * 0.07, height: WINDOW_WIDTH * 0.07, tintColor: COLORS.bluePrimary }} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../img/twitter.png')} resizeMode="contain"
                                        style={{ width: WINDOW_WIDTH * 0.07, height: WINDOW_WIDTH * 0.07, tintColor: COLORS.bluePrimary }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={styles.logTexts}>Je n'ai pas de compte</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('UserType')}>
                                <Text style={[styles.logTexts, { color: COLORS.peach, textDecorationLine: 'underline', fontSize: WINDOW_WIDTH * 0.055 }]}> Je souhaite m'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default LoginScreen