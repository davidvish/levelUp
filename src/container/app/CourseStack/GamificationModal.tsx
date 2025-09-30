import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { scale } from 'react-native-size-matters'; // Adjust based on your setup
import RNModal from '../../../Common/Modal/Modal';
import { RNImage, RNText } from '../../../Common';
import { COLORS, IMAGES } from '../../../constants';

interface LevelUpModalSecondProps {
    visible: boolean;
    onClose: () => void;
    data: any
}

const LevelUpGamificationModal: React.FC<LevelUpModalSecondProps> = ({ visible, onClose, data }) => {
    const VerticalDottedSeparator = () => (
        <View style={styles.dottedSeparator}>
            {[...Array(6)].map((_, index) => (
                <View
                    key={index}
                    style={styles.dottedSeparatorDot}
                />
            ))}
        </View>
    );

    return (
        <RNModal
            style={styles.modal}
            transparent
            visible={visible}>
            <View style={styles.container}>
                <RNImage
                    source={{ uri: data?.isUserBadge && data?.isUserLevel ? data?.badgeImage : data?.idleBadgeImage }}
                    style={styles.mainImage}
                />
                <RNText style={[styles.text, { marginTop: 20 }]}>
                    {data?.isUserBadge && data?.isUserLevel ? "Leveled Up" : "Keep Going"}
                </RNText>

                {data?.isUserBadge && data?.isUserLevel ? null :
                    <RNText textColor={"#2B2B2F"} small TextAlignCenter style={{ marginTop: scale(5) }}>Earn more points to unlock Level 1 and the Bronze I badge!</RNText>}

                    <View style={styles.infoContainer}>
                        <View style={styles.infoItem}>
                            <RNImage
                                source={data?.isUserLevel ? IMAGES.trophyStarLeaderBoard : IMAGES.trophyStarBlur}
                                style={styles.icon}
                            />
                            <RNText style={[styles.infoText, { color: data?.isUserLevel ? '#000' : COLORS.BORDER_COLOR }]}>Level</RNText>
                            <RNText style={[styles.infoValue, { color: data?.isUserLevel ? '#4284F4' : COLORS.BORDER_COLOR }]}>{data?.level || ""}</RNText>
                        </View>
                        {VerticalDottedSeparator()}
                        <View style={styles.infoItem}>
                            <RNImage
                                source={IMAGES.boltLeaderBoard}
                                style={styles.icon}
                            />
                            <RNText style={styles.infoText}>Points</RNText>
                            <RNText style={[styles.infoValue, { color: '#4284F4' }]}>{data?.points || 0}</RNText>
                        </View>
                        {VerticalDottedSeparator()}
                        <View style={styles.infoItem}>
                            <RNImage
                                source={data?.isUserBadge ? IMAGES.medalLeaderBoard : IMAGES.medalBlur}
                                style={styles.icon}
                            />
                            <RNText style={[styles.infoText, { color: data?.isUserBadge ? '#000' : COLORS.BORDER_COLOR }]}>Badge</RNText>
                            <RNText style={[styles.infoValue, { color: data?.isUserBadge ? '#4284F4' : COLORS.BORDER_COLOR }]}>{data?.badge || ""}</RNText>
                        </View>
                    </View>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}>
                    <RNText style={styles.closeButtonText}>
                        Close
                    </RNText>
                </TouchableOpacity>
            </View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#F0F0F8',
    },
    container: {
        width: scale(280),
        paddingHorizontal: 10,
        backgroundColor: '#F0F0F8',
        paddingVertical: 20,
        alignItems: 'center',
    },
    mainImage: {
        width: scale(60),
        height: scale(60),
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', // Change to COLORS.TEXTCOLOR dynamically if needed
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '95%',
        padding: 10,
        backgroundColor: '#E9E9F7',
        paddingHorizontal: scale(30),
        paddingVertical: scale(15),
    },
    infoItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 15,
        height: 13,
    },
    infoText: {
        paddingTop: 5,
        fontSize: 12,
        color: '#000', // Change to COLORS.TEXTCOLOR dynamically if needed
    },
    infoValue: {
        paddingTop: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: scale(25),
        marginBottom: scale(0),
        width: scale(250),
        padding: 5,
        backgroundColor: '#5453EE',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(5),
    },
    closeButtonText: {
        color: '#FFF', // Change to COLORS.WHITE dynamically if needed
        fontWeight: '300',
        padding: 5,
    },
    dottedSeparator: {
        height: scale(30),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: scale(8),
    },
    dottedSeparatorDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#DDD',
        marginVertical: 2,
    },
});

export { LevelUpGamificationModal };
