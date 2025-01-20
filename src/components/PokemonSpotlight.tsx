import styled, { keyframes, useTheme } from "styled-components";
import { useAppSelector } from "../redux/hooks";
import { pokeAPI } from "../redux/api";
import { useEffect, useState } from "react";
import { IPokemonDetail } from "./PokemonList";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "motion/react";

export const slideBackground = keyframes`
    to {
      background-position: 200px 200px;
    }
`;

const Container = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin-top: 120px;
  width: 35%;
  aspect-ratio: 5/4;
  margin-left: 30px;
`;

const Corners = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  img {
    position: absolute;
    object-fit: cover;
    width: 10%;
    &:nth-child(1) {
      top: 0;
      left: 0;
      transform: scale(-1, -1);
    }
    &:nth-child(2) {
      top: 0;
      right: 0;
      transform: scaleY(-1);
    }
    &:nth-child(3) {
      bottom: 0;
      left: 0;
      transform: scaleX(-1);
    }
    &:nth-child(4) {
      bottom: 0;
      right: 0;
    }
  }
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
  background-position: 0 0;
  background: repeating-linear-gradient(
    -45deg,
    #8c8c8c 0,
    #8c8c8c 4px,
    #bcbcbc 4px,
    #bcbcbc 10px,
    #8c8c8c 10px,
    #8c8c8c 12px,
    #bcbcbc 12px,
    #bcbcbc 18px
  );
  background-attachment: fixed;
  border-top: 4px solid ${({ theme }) => theme.colors.brightPoint};
  border-bottom: 4px solid ${({ theme }) => theme.colors.brightPoint};
  margin-bottom: 40px;
  animation: ${slideBackground} 30s linear infinite;
  filter: brightness(0.9);
`;

const Sprite = styled.img`
  width: 60%;
  object-fit: cover;
  filter: brightness(1.1);
`;

const PokemonSpotlight = () => {
  const [pokemon, setPokemon] = useState<IPokemonDetail>();

  const theme = useTheme();

  const selectedPokemon = useAppSelector(
    (state) => state.userReducer.selectedPokemon
  );

  const isBootupCompleted = useAppSelector((state) => state.userReducer.bootup);

  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      if (isBootupCompleted) setStartAnimation(true);
    }, 300);

    return () => clearTimeout(animationTimeout);
  }, [isBootupCompleted]);

  const getPokemonSprites = async () => {
    const pokemon = await pokeAPI.get(`/pokemon/${selectedPokemon}`);
    setPokemon(pokemon.data);
  };

  useEffect(() => {
    getPokemonSprites();
  }, [selectedPokemon]);

  return (
    <Container
      initial={{ opacity: 0, x: -500 }}
      animate={startAnimation ? { opacity: 1, x: 0 } : undefined}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <Corners>
        <img src="/test.svg" alt="corner1" />
        <img src="/test.svg" alt="corner2" />
        <img src="/test.svg" alt="corner3" />
        <img src="/test.svg" alt="corner4" />
      </Corners>
      <ImageBox>
        {selectedPokemon && (
          <Sprite
            src={pokemon?.sprites?.front_default}
            alt={`${pokemon?.name} sprite`}
          />
        )}
      </ImageBox>
      {
        <span
          style={{
            color: theme.colors.brightPoint,
            fontSize: "40px",
            fontWeight: "600",
            height: "40px",
            textTransform: "capitalize",
            textShadow: `
              -2px -2px 0 ${theme.colors.darkPoint},
              2px -2px 0 ${theme.colors.darkPoint},
              -2px 2px 0 ${theme.colors.darkPoint},
              2px 2px 0 ${theme.colors.darkPoint}
            `,
          }}
        >
          {selectedPokemon && pokemon ? (
            <Typewriter
              words={[pokemon.name]}
              key={pokemon.name}
              typeSpeed={60}
            />
          ) : (
            "Hover over a Pokemon..."
          )}
        </span>
      }
    </Container>
  );
};

export default PokemonSpotlight;
