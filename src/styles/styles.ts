import { StyleSheet } from 'react-native'
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/Constants'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    containerPadding: {
        paddingVertical: WINDOW_WIDTH * 0.01,
        paddingHorizontal: WINDOW_WIDTH * 0.02,
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
        elevation: 3,
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
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    logsInput: {
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.black,
        fontSize: WINDOW_WIDTH * 0.06,
    },
    logsInputLabel: {
        fontSize: WINDOW_WIDTH * 0.05,
        marginBottom: WINDOW_WIDTH * 0.01,
        color: COLORS.black,
    },
    logsButton: {
        width: WINDOW_WIDTH * 0.6,
        paddingVertical: WINDOW_WIDTH * 0.01,
        paddingHorizontal: WINDOW_WIDTH * 0.02,
        backgroundColor: COLORS.black,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        borderRadius: 5
    },
    logsButtonText: {
        fontSize: WINDOW_WIDTH * 0.08,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    }
})