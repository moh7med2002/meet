import React ,{useState , useEffect} from 'react'

export default function Jitsi() {
    const [state , setState] = useState({
        room: 'bwb-bfqi-vmg',
        user: {
            name: 'Akash Verma'
        },
        isAudioMuted: false,
        isVideoMuted: false
    });
    const domain = 'meet.jit.si';
    const [api ,setApi] = useState({});

    const startMeet = () => {
        const options = {
            roomName: state.room,
            width: '100%',
            height: 500,
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
                // overwrite interface properties
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: state.user.name
            }
        }
        // setApi(new window.JitsiMeetExternalAPI(domain, options));
        const api2 = new window.JitsiMeetExternalAPI(domain, options)

        api2.addEventListeners({
            readyToClose: handleClose,
            participantLeft: handleParticipantLeft,
            participantJoined: handleParticipantJoined,
            videoConferenceJoined: handleVideoConferenceJoined,
            videoConferenceLeft: handleVideoConferenceLeft,
            audioMuteStatusChanged: handleMuteStatus,
            videoMuteStatusChanged: handleVideoStatus
        });
    }

    const handleClose = () => {
        console.log("handleClose");
    }

    const handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await getParticipants();
    }

    const handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await getParticipants();
    }

    const handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await getParticipants();
    }

    const handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        // return this.props.history.push('/thank-you');
    }

    const handleMuteStatus = (audio) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    const  handleVideoStatus = (video) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    function getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    function executeCommand(command) {
        api.executeCommand(command);;
        if(command == 'hangup') {
            // return this.props.history.push('/thank-you');
        }

        if(command == 'toggleAudio') {
            setState(pre => {
                return { ...pre ,isAudioMuted :  pre.isAudioMuted }
            });
        }

        if(command == 'toggleVideo') {
            setState(pre=>{
                return { ...pre , isVideoMuted: !pre.isVideoMuted }
            });
        }
    }

    useEffect(()=>{
        if (window.JitsiMeetExternalAPI) {
            startMeet();
            console.log("in");
        } else {
            alert('JitsiMeetExternalAPI not loaded');
        }
    },[]);


    const { isAudioMuted, isVideoMuted } = state;
  return (
    <>
        <header className="nav-bar">
            <p className="item-left heading">Jitsi React</p>
        </header>
        <div id="jitsi-iframe"></div>
        <div class="item-center">
            <span>Custom Controls</span>
        </div>
        <div class="item-center">
            <span>&nbsp;&nbsp;</span>
            <i onClick={ () => this.executeCommand('toggleAudio') } className={`fas fa-2x grey-color ${isAudioMuted ? 'fa-microphone-slash' : 'fa-microphone'}`} aria-hidden="true" title="Mute / Unmute"></i>
            <i onClick={ () => this.executeCommand('hangup') } className="fas fa-phone-slash fa-2x red-color" aria-hidden="true" title="Leave"></i>
            <i onClick={ () => this.executeCommand('toggleVideo') } className={`fas fa-2x grey-color ${isVideoMuted ? 'fa-video-slash' : 'fa-video'}`} aria-hidden="true" title="Start / Stop camera"></i>
            <i onClick={ () => this.executeCommand('toggleShareScreen') } className="fas fa-film fa-2x grey-color" aria-hidden="true" title="Share your screen"></i>
        </div>
    </>
  )
}
