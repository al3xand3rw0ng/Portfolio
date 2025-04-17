import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { PiPlayPauseBold, PiStopBold } from 'react-icons/pi';

/**
 * Component that reads out the given text using the browser's speech synthesis API.
 * @param {Object} props - Component props
 * @param {string} props.text - The text to be read out
 */
const TextToSpeech = ({ text }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume(); // Resume if paused
        setIsPaused(false);
      } else {
        synth.pause(); // Pause if playing
        setIsPaused(true);
      }
    } else {
      // Cancel any ongoing speech before starting
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set up a listener to reset state when playback finishes
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      synth.speak(utterance); // Start speaking
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel(); // Cancel any ongoing speech
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <Box>
      <Button
        leftIcon={<PiPlayPauseBold />}
        color='black'
        backgroundColor={'#dddddd'}
        _hover={'#dddddd'}
        onClick={handlePlayPause}
        size='xs'>
        {isPaused ? 'Resume' : isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Button
        leftIcon={<PiStopBold />}
        color='black'
        backgroundColor={'#dddddd'}
        _hover={'#dddddd'}
        onClick={handleStop}
        size='xs'
        ml={2}>
        Stop
      </Button>
    </Box>
  );
};

export default TextToSpeech;
