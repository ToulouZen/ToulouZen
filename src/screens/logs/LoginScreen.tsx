import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { COLORS, WINDOW_WIDTH } from '../../constants/Constants';
import { styles } from '../../styles/styles';
import { RootStackParamsList } from '../../types/types';


type Props = StackScreenProps<RootStackParamsList, 'Login'>

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {

    const [mail, setMail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.green }]}>
            <View style={[styles.container, { backgroundColor: COLORS.green }]}>
                <Image style={styles.logo} source={require('../../img/ToulouZenPink.png')} />
                <View style={[styles.container, { backgroundColor: COLORS.green }]}>
                    <Input value={mail} onChangeText={mail => setMail(mail)} placeholder="jeanne_dupont@gmail.com"
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Identifiant" labelStyle={styles.logsInputLabel}
                    />
                    <Input value={password} onChangeText={password => setPassword(password)} secureTextEntry={true}
                        inputContainerStyle={[styles.containerPadding, styles.logsInput]} containerStyle={{ width: WINDOW_WIDTH * 0.9, alignSelf: 'center' }}
                        label="Mot de passe" labelStyle={styles.logsInputLabel}
                    />
                </View>
                <View style={[styles.container, { backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center' }]}>
                    <TouchableOpacity style={[styles.logsButton, { marginBottom: WINDOW_WIDTH * 0.02, backgroundColor: COLORS.pink }]}>
                        <Text style={[styles.logsButtonText, { fontFamily: 'Montserrat-Bold' }]}>Connexion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.logsButton, { marginTop: WINDOW_WIDTH * 0.02, backgroundColor: COLORS.pink }]}>
                        <Text style={styles.logsButtonText}>Inscription</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default LoginScreen