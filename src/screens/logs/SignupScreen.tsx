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
    const [firstname, setFirstname] = React.useState<string>('Angèle')
    const [lastname, setLastname] = React.useState<string>('Mazio')
    const [age, setAge] = React.useState<string>('27')
    const [mail, setMail] = React.useState<string>('angele.mazio@gmail.com')
    const [password, setPassword] = React.useState<string>('passwordSpe')
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('passwordSpe')
    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    const auth = useAuth()

    const signup = async () => {
        auth.register(mail, password, firstname, lastname, Number(age), route.params.userType)
            .then(() => {
                auth.getUserInfo()
            })
            .then(() => {
                Alert.alert("Votre espace personnalisé a été créée", "Nous vous souhaitons la bienvenue dans la famille Toulou'Zen !", [
                    {
                        text: 'Super !',
                        onPress: () => {
                            navigation.navigate('App')
                        }
                    }
                ])
            })
            .catch(e => {
                if (e.code == "auth/user-not-found") {
                    Alert.alert('Utilisateur', 'Ce compte n\'existe pas !')
                }
                if (e.code == "auth/wrong-password") {
                    Alert.alert('Mot de passe', 'Le mot de passe est incorrecte !')
                }
                if (e.code == 'auth/email-already-in-use') {
                    Alert.alert('Adresse e-mail', 'Cette adresse e-mail est déjà utilisée !')
                }
                if (e.code == 'auth/invalid-email') {
                    Alert.alert('Adresse e-mail', 'Cette adresse e-mail est invalide !');
                }
                if (e.code == 'auth/weak-password') {
                    Alert.alert('Mot de passe', 'Le mot de passe utilisé est trop faible, privilégiez 8 caractères au minimum, en ajoutant des chiffres, majuscules et caractères spéciaux');
                }
            })

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
                        <Image source={(showPassword ? require('../../img/Password_show.png') : require('../../img/Password_hide.png'))} resizeMode="contain"
                            style={{ width: WINDOW_WIDTH * 0.08, height: WINDOW_WIDTH * 0.08, tintColor: COLORS.black }} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.logInputs, styles.containerMargin, { flexDirection: 'row' }]}>
                    <TextInput value={passwordConfirmation} secureTextEntry={!showPassword} onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)} placeholder="Confirmation du mot de passe"
                        style={styles.logPasswordInput}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                        style={{ marginHorizontal: WINDOW_WIDTH * 0.02 }}
                    >
                        <Image source={(showPassword ? require('../../img/Password_show.png') : require('../../img/Password_hide.png'))} resizeMode="contain"
                            style={{ width: WINDOW_WIDTH * 0.08, height: WINDOW_WIDTH * 0.08, tintColor: COLORS.black }} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => signup()}
                        style={[styles.logButtons, styles.containerMargin]}>
                        <Text style={[styles.userTypeTextConductrice, { color: '#fff' }]}>Validation</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )
}

export default SignupScreen