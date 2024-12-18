import React, { useEffect, useRef, useState, Suspense } from "react";
import GlobalLoader from "../GlobalLoader/GlobalLoader";
import { Canvas } from "@react-three/fiber";
import { Sky } from "../../models/Sky";
import { Ship } from "../../models/Ship";
import { Bird } from "../../models/Bird";
import styles from "./styles.module.css";
import Image from "next/image";
import Lottie from "lottie-react";
import compassAnimation from "../../assets/compass.json";

const CanvasComponent = ({
  isRotating = false,
  setIsRotating,
  setCurrentStage,
  islandPosition,
  islandScale,
  isOnlyBg = false,
  showCompass=false,
  onLoadComplete = () => {}  // Add prop for onLoadComplete callback
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // New state for hydration check

  const audioRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // UseEffect to set hydration state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
    if (isPlayingMusic) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isPlayingMusic]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 5000);
  };

  const handleTouchStart = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 5000);
  };

  useEffect(() => {
    if (isHydrated && onLoadComplete) {
      onLoadComplete(); // Invoke onLoadComplete when hydrated
    }
  }, [isHydrated, onLoadComplete]);

  if (!isHydrated) {
    // Render fallback until the hydration is complete
    return <GlobalLoader />;
  }

  return (
    <>
      <Suspense fallback={"loading..."}>
        <Canvas>
          <directionalLight position={[1, 1, 1]} intensity={1} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 5, 10]} intensity={1} />
          <spotLight position={[0, 50, 10]} angle={0.15} penumbra={1} intensity={1} />
          <hemisphereLight groundColor="#000000" intensity={1} />

          <Sky isRotating={isRotating} />
          {!isOnlyBg && (
            <Ship
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              setCurrentStage={setCurrentStage}
              position={islandPosition}
              scale={islandScale}
            />
          )}
          <Bird />
        </Canvas>

        <Image
          height={50}
          width={50}
          className={styles.audioIcon}
          src={!isPlayingMusic ? "/soundoff.png" : `/soundon.png`}
          alt="jukebox"
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
        />

        {(!isOnlyBg || showCompass) && (
          <div 
            className={`${styles.compassContainer} ${isHovered && styles.compassContainerHovered}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`${styles.compassText} ${styles.compassInnerTText} ${isHovered ? styles.displayBlock : styles.displayNone}`}
              onClick={() => {
                location.href = "/";
              }}
            >
              Home
            </div>
            <div className={styles.compassInnerContainer}>
              <div
                className={`${styles.compassText} ${styles.compassInnerText} ${isHovered ? styles.displayFlex : styles.displayNone}`}
                onClick={() => {
                  location.href = "/projects";
                }}
              >
                Project
              </div>
              <div
                className={`${styles.compassGif} ${isHovered && styles.compassGifHovered}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Lottie animationData={compassAnimation} loop={true} />
              </div>
              <div
                className={`${styles.compassText} ${styles.compassInnerText} ${isHovered ? styles.displayFlex : styles.displayNone}`}
                onClick={() => {
                  location.href = "/about";
                }}
              >
                About
              </div>
            </div>
            <div
              className={`${styles.compassText} ${styles.compassInnerDText} ${isHovered ? styles.displayBlock : styles.displayNone}`}
              onClick={() => {
                location.href = "/contact";
              }}
            >
              Contact
            </div>
            <div className={styles.bottomInfo}>
              Press <span>N</span> <span>S</span> <span>E</span> <span>W</span> key to navigate
            </div>
          </div>
        )}
      </Suspense>

      <audio ref={audioRef} src="/sakura.mp3" loop>
        Your browser does not support the <code>audio</code> element.
      </audio>
    </>
  );
};

export default CanvasComponent;
