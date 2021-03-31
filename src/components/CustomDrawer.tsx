import React from 'react'
import { Image, Text, View } from 'react-native';
import { COLORS, WINDOW_WIDTH } from '../constants/Constants';
import { DrawerContentOptions, DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerDescriptorMap, DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import DrawerItemCustom from '../components/DrawerItemCustom';
import { CommonActions, DrawerActions, DrawerNavigationState, ParamListBase } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

type PropsDrawer = Omit<DrawerContentOptions, 'contentContainerStyle' | 'style'> & {
    state: DrawerNavigationState<ParamListBase>;
    navigation: DrawerNavigationHelpers;
    descriptors: DrawerDescriptorMap;
};
const CustomDrawer: React.FC<PropsDrawer> = ({ state, descriptors, navigation }) => {
    const auth = useAuth()

    React.useEffect(() => {
        console.log("created")
        console.log(auth.userInfo)
    }, [])

    return (
        <DrawerContentScrollView contentContainerStyle={{ flex: 1, paddingTop: 0 }} {...state} {...descriptors} {...navigation}>
            <View style={{ flexDirection: 'row', backgroundColor: COLORS.peach, alignItems: 'center' }}>
                <Image source={require('../img/logo.png')} resizeMode="contain" style={{ width: WINDOW_WIDTH * 0.15, height: WINDOW_WIDTH * 0.15, tintColor: '#fff', margin: WINDOW_WIDTH * 0.07 }} />
                <Text style={{ color: '#fff', fontSize: WINDOW_WIDTH * 0.06, fontWeight: 'normal' }}>{auth.userInfo?.firstname}</Text>
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
        </DrawerContentScrollView>
    )
}

export default CustomDrawer