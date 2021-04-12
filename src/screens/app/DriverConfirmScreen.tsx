import React from 'react';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamsList, Path } from '../../types/types'
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements';
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/Constants';
import { styles } from '../../styles/styles';

type Props = StackScreenProps<RootStackParamsList, 'DriverConfirm'>

const DriverConfirmScreen: React.FC<Props> = ({ navigation, route }) => {

    const [driverPath, setPath] = React.useState<Path>()

    React.useEffect(() => {
        const path = route.params?.path
        setPath(path)
      }, [])
    
    return (
        <>
            <View style={[styles.container, {backgroundColor: COLORS.white, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
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
                <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Text style={[styles.logTexts, {color: COLORS.peach}]}>
                        Trajet confirmé ! {'\n'}
                    </Text>
                    <Text style={[styles.logTexts, {color: COLORS.peach}]}>
                        Attente de la confirmation de {driverPath?.userFirstname} {driverPath?.userLastname}
                    </Text>

                    {/* {Validation passager} */}
                    {
                        true ? (
                            <ActivityIndicator animating={true} color="#52ad8d" style={{marginTop: 50}} size="large" />
                        )
                        :
                        (
                            <Icon name="checkmark-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#52ad8d" style={{marginTop: 50}} />
                        )
                    }
                </View>
            </View>
        </>
    )
}

export default DriverConfirmScreen