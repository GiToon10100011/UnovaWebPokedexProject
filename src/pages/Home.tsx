import PokemonSpotlight from "../components/PokemonSpotlight";
import PokemonList from "../components/PokemonList";
import styled, { keyframes } from "styled-components";
import ListBackground from "../components/ListBackground";
import { useRef, useState } from "react";
import { CiSpeaker } from "react-icons/ci";
import { useAppSelector } from "../redux/hooks";

const speakerPlaying = keyframes`
  from{
    transform: rotate(0deg);
  }
  
  50%{
    transform: rotate(6deg);
  }

  to{
    transform: rotate(-6deg);
  }
`;

const Container = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const PlayTheme = styled.div`
  position: fixed;
  bottom: 100px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  background: #000;
  padding: 6px 14px;
  padding-right: 40px;
  clip-path: polygon(0 0, 95% 0, 100% 100%, 0 100%);
  font-size: 20px;
  z-index: 2;
  cursor: pointer;
  .playing {
    animation: ${speakerPlaying} 1s linear infinite both;
  }
`;

const Home = () => {
  const isSearch = useAppSelector((state) => state.userReducer.isSearch);
  const themeRef = useRef<HTMLAudioElement | null>(null);

  const [themePlay, setThemePlay] = useState(false);
  const [themeDesc, setThemeDesc] = useState(
    "Click to play the best city theme of Pokemon black and white :D"
  );

  const handlePlayTheme = () => {
    if (themeRef?.current) {
      if (themePlay) {
        themeRef.current.pause();
        setThemeDesc("Paused");
      } else {
        themeRef.current.play();
        setThemeDesc("Now Playing: Castelia City");
      }
    }
    setThemePlay((current) => !current);
  };

  return (
    <>
      <audio src="/assets/mainTheme.mp3" ref={themeRef} loop></audio>
      <PlayTheme onClick={handlePlayTheme}>
        <CiSpeaker
          className={themePlay ? "playing" : undefined}
          size={40}
          color={"#ccc"}
        />
        <p>{themeDesc}</p>
      </PlayTheme>
      <Container>
        {!isSearch && <PokemonSpotlight />}
        <PokemonList />
        <ListBackground />
      </Container>
    </>
  );
};

export default Home;
