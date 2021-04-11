import React from 'react'
import { Image, Switch, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, WINDOW_WIDTH } from '../constants/Constants';
import { DrawerContentOptions, DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerDescriptorMap, DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import DrawerItemCustom from '../components/DrawerItemCustom';
import { CommonActions, DrawerActions, DrawerNavigationState, ParamListBase } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/styles';

type PropsDrawer = Omit<DrawerContentOptions, 'contentContainerStyle' | 'style'> & {
    state: DrawerNavigationState<ParamListBase>;
    navigation: DrawerNavigationHelpers;
    descriptors: DrawerDescriptorMap;
};
const CustomDrawer: React.FC<PropsDrawer> = ({ state, descriptors, navigation }) => {

    const [isSwitched, setIsSwitched] = React.useState<boolean>(false)
    const auth = useAuth()

    React.useEffect(() => {
        if (auth.userInfo?.userType == "driver") {
            setIsSwitched(false)
        } else {
            setIsSwitched(true)
        }
        _setUserType(auth.userInfo?.userType)
    }, [auth.userInfo?.userType])

    const _setUserType = async (userType: string | null | undefined) => {
        if (typeof userType == "string") {
            AsyncStorage.setItem('ToulouzenUserType', userType).then(() => auth.getUserInfo())
        }
    }

    const disconnect = async () => {
        await AsyncStorage.multiRemove(["ToulouzenUserUID", "ToulouzenFirstname", "ToulouzenLastname", "ToulouzenEmail", "ToulouzenAge", "ToulouzenUserType", "ToulouzenToken"])
        auth.signOut()
        navigation.navigate("Log", { screen: "Login" })
    }

    return (
        <DrawerContentScrollView contentContainerStyle={{ flex: 1, paddingTop: 0, justifyContent: 'space-between' }} {...state} {...descriptors} {...navigation}>
            <View>
                <View style={{ flexDirection: 'row', backgroundColor: COLORS.peach, alignItems: 'center' }}>
                    <Image source={require('../img/logo.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.15, height: WINDOW_WIDTH * 0.15, tintColor: '#fff', margin: WINDOW_WIDTH * 0.07 }} />
                    <Text style={{ color: '#fff', fontSize: WINDOW_WIDTH * 0.07, fontWeight: 'bold' }}>{auth.userInfo?.firstname}</Text>
                </View>
                {
                    state.routes.map((route, i) => {
                        const focused = i === state.index
                        const { drawerLabel } = descriptors[route.key].options;
                        return <DrawerItemCustom key={route.key} focused={focused} title={drawerLabel} onPress={() => {
                            navigation.dispatch({
                                ...(focused ? DrawerActions.closeDrawer() : CommonActions.navigate(route.name)),
                                target: state.key
                            })
                        }} />
                    })
                }
            </View>
            {/* <View style={{ flexDirection: 'row', backgroundColor: COLORS.peach, alignItems: 'center', justifyContent: 'space-between', paddingVertical: WINDOW_WIDTH * 0.07, paddingHorizontal: WINDOW_WIDTH * 0.02 }}>
                <Text style={{ color: "#fff", fontSize: WINDOW_WIDTH * 0.04, fontWeight: '700' }}>Conductrice</Text>
                <Switch value={isSwitched} onValueChange={(isSwitched) => setIsSwitched(isSwitched)} thumbColor="#000" ios_backgroundColor="#fff" trackColor={{ false: "#fff", true: "#fff" }} />
                <Text style={{ color: "#fff", fontSize: WINDOW_WIDTH * 0.04, fontWeight: '700' }}>Passagère</Text>
            </View> */}
            <TouchableOpacity onPress={() => disconnect()} style={styles.deconnectionView}>
                <Text style={[styles.drawerCustomItemText, { color: "#fff" }]}>Déconnexion</Text>
            </TouchableOpacity>
        </DrawerContentScrollView >
    )
}

export default CustomDrawer