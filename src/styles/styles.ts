import { StyleSheet, Platform } from 'react-native'
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants'

export const styles = StyleSheet.create({
    containerMargin: {
        margin: WINDOW_WIDTH * 0.02
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    containerPadding: {
        padding: WINDOW_WIDTH * 0.02,
    },
    logoHeader: {
        width: WINDOW_WIDTH * 0.7,
        alignSelf: 'center',
        marginTop: WINDOW_HEIGHT * 0.03,
    },
    logo: {
        marginVertical: WINDOW_HEIGHT * 0.05,
        width: WINDOW_WIDTH * 0.5,
        height: WINDOW_WIDTH * 0.5,
        alignSelf: 'center',
    },
    avatar: {
        marginBottom: WINDOW_HEIGHT * 0.05,
        backgroundColor: COLORS.raspberry,
        borderRadius: WINDOW_WIDTH * 0.25,
        alignSelf: 'center',
        width: WINDOW_WIDTH * 0.5,
        height: WINDOW_WIDTH * 0.5,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    avatarEdit: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black,
        borderRadius: WINDOW_WIDTH * 0.06,
        width: WINDOW_WIDTH * 0.12,
        height: WINDOW_WIDTH * 0.12,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    logsInputLabel: {
        fontSize: WINDOW_WIDTH * 0.04,
        marginBottom: WINDOW_WIDTH * 0.01,
        marginLeft: WINDOW_WIDTH * 0.01,
        color: COLORS.black,
    },
    stayConnected: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: WINDOW_WIDTH * 0.02
    },
    stayConnectedText: {
        fontSize: WINDOW_WIDTH * 0.05,
        color: COLORS.black,
        fontWeight: 'bold',
        marginRight: WINDOW_WIDTH * 0.01
    },
    menuItemView: {
        width: WINDOW_WIDTH * 0.12,
        height: WINDOW_WIDTH * 0.12,
        borderRadius: WINDOW_WIDTH * 0.06,
        backgroundColor: COLORS.raspberry,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logTitle: {
        fontWeight: 'bold',
        fontSize: WINDOW_WIDTH * 0.06,
        color: COLORS.peach
    },
    logButtons: {
        width: Platform.OS == "ios" ? WINDOW_WIDTH * 0.8 : WINDOW_WIDTH * 0.7,
        borderColor: COLORS.peach,
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: COLORS.peach,
        padding: Platform.OS == "ios" ? WINDOW_WIDTH * 0.04 : WINDOW_WIDTH * 0.03,
        alignItems: 'center',
        alignSelf: 'center',
        // Shadow
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowColor: '#000',
        elevation: 8
    },
    logInputs: {
        width: WINDOW_WIDTH * 0.8,
        borderColor: COLORS.darkGrey,
        borderWidth: 3,
        borderRadius: 50,
        backgroundColor: COLORS.lightGrey,
        alignItems: 'center',
        alignSelf: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowColor: '#000',
        elevation: 8,
        fontSize: WINDOW_WIDTH * 0.04,
        fontWeight: 'bold',
        color: '#000'
    },
    logPasswordInput: {
        fontSize: WINDOW_WIDTH * 0.04,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        padding: WINDOW_WIDTH * 0.04,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50
    },
    logTexts: {
        fontSize: WINDOW_WIDTH * 0.042,
        fontWeight: 'bold',
        color: '#000',
    },
    userTypeTextConductrice: {
        color: COLORS.peach,
        fontSize: WINDOW_WIDTH * 0.06,
        fontWeight: 'bold'
    },
    userTypeTextPassagere: {
        color: COLORS.white,
        fontSize: WINDOW_WIDTH * 0.05,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputAddress: {
        backgroundColor: '#dddddd',
        color: '#000',
        fontSize: WINDOW_WIDTH * 0.04,
        fontWeight: 'bold',
        alignSelf: 'center',
        width: WINDOW_WIDTH * 0.7
    },
    shadowContainer: {
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 5
        }
    },
    startButton: {
        flexDirection: 'row',
        borderColor: COLORS.peach,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#ddd',
        justifyContent: 'space-between',
        width: WINDOW_WIDTH * 0.5,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    drawer: {
        backgroundColor: '#fff',
        width: WINDOW_WIDTH * 0.7
    },
    drawerCustomItem: {
        padding: WINDOW_WIDTH * 0.05,
    },
    drawerCustomItemText: {
        color: COLORS.blackBackground,
        fontSize: Platform.OS == "ios" ? WINDOW_WIDTH * 0.07 : WINDOW_WIDTH * 0.05,
        fontWeight: 'bold'
    },
    drawerIcon: {
        backgroundColor: COLORS.peach,
        borderRadius: 50,
        borderColor: '#FFF',
        borderWidth: 1

    },
    checkpointCardView: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: WINDOW_WIDTH * 0.8,
    },
    deconnectionView: {
        backgroundColor: COLORS.peach,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: WINDOW_WIDTH * 0.07,
        paddingHorizontal: WINDOW_WIDTH * 0.02
    },
    disabled: {
        backgroundColor: COLORS.blackBackground,
        opacity: 0.3,
        borderColor: 'transparent'
    }
})