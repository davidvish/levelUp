import React, { } from 'react';
import { StyleSheet, View, Dimensions, } from 'react-native';
import Video from 'react-native-video';
import { RNContainer } from '../../../Common';

const screenWidth = Dimensions.get('window').width;

const VideoShowingFullScreen: React.FC = (props: any) => {


    return (
        <RNContainer
            style={{ flex: 1 }} Points={undefined}            
            //back
            //onBack={() => onGoBackFunction()}
            //title=""
            //bottomChildren={scromData ? null : ButtonBottomView()}
            //scroll
            //showsVerticalScrollIndicator={false}
            //titleMarginRight
            //hideBackgroundImage
        >
            <Video
                //ref={videoRef}
                source={{ uri: "https://leveluplmsdevstorage.blob.core.windows.net/45953bb/1721300077454_MicrosoftTeams-video.mp4_a13563cf-81ee-4bb0-ea9a-08dca71763fc?sv=2018-03-28&sr=b&sig=zp71HjEn4kankVb5rgUzA%2F8J9qDpA6rue1OP414Tmt4%3D&se=2124-07-18T10%3A54%3A40Z&sp=r" }}
                style={{ flex: 1 }}
                //paused={isPaused}
                resizeMode="cover"
            //onEnd={handleVideoEnd}
            />
        </RNContainer>
    );
};

const styles = StyleSheet.create({

});

export default VideoShowingFullScreen;
