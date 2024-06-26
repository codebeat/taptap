let audioContext = null;
let gainNode = null;
let audioBuffer = null;
let source = null;

export const initializeAudio = (audioUrl) => {
    return new Promise(async(resolve, reject) => {
        if (audioBuffer) {
            resolve();
            return;
        }
        try {
            audioContext = new(window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();

            const data = await fetchAudioData(audioUrl);
            audioBuffer = await audioContext.decodeAudioData(data);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

const fetchAudioData = (audioUrl) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', audioUrl, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(new Error('Failed to load audio data'));
            }
        };
        request.onerror = () => reject(new Error('Network error'));
        request.send();
    });
};

export const playAudio = (volume = 1) => {
    if (!audioBuffer || !audioContext || !gainNode) return;
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
};

export const stopAudio = () => {
    if (source) {
        source.stop();
        source = null;
    }
};

export const Vibration = () => {
    if ('vibrate' in navigator) {

        navigator.vibrate([500, 200, 500]);
    } else {
        console.log('Vibration not supported on this device.');
    }
};