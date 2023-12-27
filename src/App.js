import React, { useState, useEffect } from 'react';
import './App.css';

// Import your frame images
import animation1 from './Frames/animation1.png';
import animation2 from './Frames/animation2.png';
import animation3 from './Frames/animation3.png';
import animation4 from './Frames/animation4.png';
import mailboxOpening from './Frames/mailbox.png'; // This should be the mailbox image.
import letterFrame from './Frames/letter.png'; // This should be the letter image.
import mute from './Icons/mute.png';
import play from './Icons/play.png';
import nextSong from './Icons/next.png';
import gift from './Widgets/gift.png';
import reindeer from './Widgets/reindeer.png';


//import sounds
import mailboxSound from './Sounds/mailbox.mp3';
import firstlove from './Sounds/firstlove.mp3';
import hawaii from './Sounds/hawaii.mp3';
import mistletoe from './Sounds/mistletoe.mp3';


const messages = [
  "Dear Yutong, Merry Christmas! This will be our second Christmas together! I always think back to our Montreal trip together. There was magic in the air. With each meal we share, every pretty scenery we see, and every conversation we have,  I grew to understand you more Thank you for being here, to be someone I can rely on, to be someone I can share these moments with. I love you. Merry Christmas",
  "I love your smile :) It makes me feel warm",
  "I want you always to remember me. Will you remember that I existed, and that I stood next to you here like this? - Norwegian Wood, Haruki Murakami",
  "Hey yutong <3 if you're having a bad day just remember you are capable of anything you set your mind to. You are amazing <3 ",
  "I loved making those snow ducks with you",
  "I miss your cuddles. Even when I am physically with you I miss holding you",
  "You are so beautiful. Your smile, your big eyes (small face i like), your cute dimples, your squishy cheeks, the way you look at me. I have the prettiest gf in the whole wide world :)))",
  "I love the person that you are",
  "How do sheep say Merry Christmas to each other? Fleece Navidad! >:)",
  "You have no idea how much my heart races when I see you", 
  "If you see this message, text me right now and tell me you love me!!! DO IT!!",
  "How lucky am I to have fallen in love with my best friend?", 
  "Your smile is literally the cutest thing I've ever seen in my life",
  "Let's travel everywhere :)",
  "We make a great 🍐 ",
  "Hey baby. You busy? No? Then call me rn! I mish u!!!",
  "Can I borrow a kiss? I promise to give it back 😘 ", 
  " Here are some flowers for u :3 i wuv u  -----> 🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹",
  "What do you call Santa when he stops moving? Santa Pause",
  "You know, that's not a candy cane in my pocket… I'm just happy to see you :3",
  "Merry Christmas babyyy <3 I love youuu", 

];


const playlist = [firstlove, hawaii, mistletoe];

function App() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [displayMailbox, setDisplayMailbox] = useState(false);
  const [displayLetter, setDisplayLetter] = useState(false);
  const [randomText, setRandomText] = useState('');
  const animationFrames = [animation1, animation2, animation3, animation4];
  const [showReindeer, setShowReindeer] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [audio] = useState(new Audio(playlist[currentSongIndex]));

  const[mailboxAudio] = useState(new Audio(mailboxSound));
  const[isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);


  useEffect(() => {
    // Create an array to hold the loaded Image objects
    const loadedImages = [];
    // Array of image sources to preload
    const imageSources = [animation1, animation2, animation3, animation4, mailboxOpening, letterFrame];
    // Track the number of images loaded
    let imagesLoadedCount = 0;
  
    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === imageSources.length) {
          // Once all images are loaded, set the state to true
          setImagesLoaded(true);
        }
      };
      loadedImages.push(img);
    });
  
    return () => {
      loadedImages.forEach((img) => {
        img.onload = null;
      });
    };
  }, []);
  
  useEffect(() => {
    // Trigger playSong when hasInteracted changes to true
    if (hasInteracted) {
      playSong();
    }
  }, [hasInteracted]); // Depend on hasInteracted
  useEffect(() => {
    // Set the volume based on whether the sound is muted or not
    audio.volume = isMuted ? 0.0 : 0.3;
    mailboxAudio.volume = isMuted ? 0.0 : 0.1;
  }, [isMuted, audio, mailboxAudio]); // Add isMuted as a dependency

  const toggleMute = (event) => {
    event.stopPropagation(); // This stops the click event from bubbling up
    setIsMuted(!isMuted); // Toggle the isMuted state
  };

  const toggleWidget = (event) => {
    event.stopPropagation(); // Prevent the click event from triggering other actions
    setShowReindeer(!showReindeer); // Toggle between showing the gift and the reindeer
  };
  
  const playSong = () => {
    audio.src = playlist[currentSongIndex];
    audio.volume = isMuted ? 0.0 : 0.3;
    if (hasInteracted) {
      audio.play().catch((error) => console.error('Error playing audio:', error));
    }
  };


  useEffect(() => {

    // Add event listener for when the song ends
    audio.addEventListener('ended', () => {
      setCurrentSongIndex((currentSongIndex + 1) % playlist.length); // Loop back to the start of the playlist when you reach the end
    });

    playSong(); // Play the song when the component mounts

    // Cleanup function to remove event listener
    return () => {
      audio.removeEventListener('ended', playSong);
    };
  }, [currentSongIndex, audio]);

  const skipSong = (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up
    if (!hasInteracted) {
      setHasInteracted(true);
      // No need to call playSong here because setCurrentSongIndex will trigger the useEffect
    }
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(nextIndex);
  };
  


  useEffect(() => {
    if (!displayMailbox && !displayLetter) {
      const interval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % animationFrames.length);
      }, 700); // Adjusted for 1 fps (1000ms would be exact 1 fps)
      return () => clearInterval(interval);
    }
  }, [displayMailbox, displayLetter]);

  useEffect(() => {
    // Play mailbox sound when the mailbox is displayed
    if (displayMailbox) {
      mailboxAudio.volume = 0.2;
      mailboxAudio.play();

    }
  }, [displayMailbox, mailboxAudio]);

  const handleClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      playSong(); // Start playing the song
    }
    // First click: show the mailbox
    if (!displayMailbox && !displayLetter) {
      setDisplayMailbox(true);
      setRandomText(messages[Math.floor(Math.random() * messages.length)]); // Pick a random message
      setTimeout(() => {
        // After 3 seconds, show the letter
        setDisplayMailbox(false);
        setDisplayLetter(true);
      }, 2000);
    } 
    // Second click: hide the letter and show the animation frames again
    else if (displayLetter) {
      setDisplayMailbox(false);
      setDisplayLetter(false);
    }
    // If the mailbox is currently displayed, do nothing until the letter is displayed
  };

  return (
    <div className="animation-container" onClick={handleClick}>
      <button className="next-button" onClick={skipSong}>
        <img src={nextSong} alt="Next Song" />
      </button>
      <button className={`mute-button ${isMuted ? 'muted' : ''}`} onClick={toggleMute}>
        <img src={isMuted ? mute : play} alt="Mute/Unmute" />
      </button>

      {!displayLetter && (
      <div className="widget-container" onClick={toggleWidget}>
        <img src={showReindeer ? reindeer : gift} alt="Toggle Widget" />
      </div>
    )}
      {!displayMailbox && !displayLetter && (
        <img src={animationFrames[currentFrame]} alt={`Frame ${currentFrame + 1}`} className="frame" />
      )}
      {displayMailbox && (
        <img src={mailboxOpening} alt="Mailbox Opening Frame" className="frame" />
      )}
      {displayLetter && (
        <div className="frame">
          <img src={letterFrame} alt="Letter Frame" />
          <p className="letter-text">{randomText}</p>
        </div>
      )}
    </div>
  );
}

export default App;
