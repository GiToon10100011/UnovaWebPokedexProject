import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { pokeAPI } from "../redux/api";
import styled from "styled-components";
import PokemonItem from "./PokemonItem";
import { motion } from "motion/react";
import { IPokemonDetail, pokemonVariants } from "./PokemonList";
import { useNavigate } from "react-router-dom";

const Container = styled(motion.ul)`
  position: absolute;
  top: 120px;
  right: 0;
  width: 40%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 30px;
  scrollbar-width: none;
  h2 {
    font-size: 100px;
  }
`;

const NoResults = styled(motion.div)`
  padding-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FavoriteList = () => {
  const navigate = useNavigate();
  const isBootupFinished = useAppSelector((state) => state.userReducer.bootup);
  const [detailData, setDetailData] = useState<IPokemonDetail[]>([]);
  const pokemonData = useAppSelector(
    (state) => state.userReducer.favoritePokemonList
  );

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const promises = pokemonData.map((pokemon) =>
          pokeAPI.get(`/pokemon/${pokemon}`)
        );
        const results = Promise.all(promises);

        setDetailData((await results).map((data) => data.data));
      } catch (error) {
        console.error(error);
      }
    };
    if (pokemonData.length > 0) fetchPokemonDetails();
  }, [pokemonData]);

  useEffect(() => {
    if (!isBootupFinished) navigate("/");
  }, []);

  return (
    <>
      <Container
        key="favoriteList"
        variants={pokemonVariants.pokemonList}
        initial={"hidden"}
        animate={"visible"}
      >
        {detailData.length === 0 ? (
          <NoResults initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1.2}}>
            <img src="/MissingNo..webp" alt="No Favorites" width={200} />
            <h2>No Favorites</h2>
          </NoResults>
        ) : (
          detailData
            .sort((a, b) =>
              a.order >= 0 && b.order >= 0
                ? a.order - b.order
                : b.order - a.order
            )
            .map((data, index) => (
              <PokemonItem {...data} key={index} index={index} />
            ))
        )}
      </Container>
    </>
  );
};

export default FavoriteList;
