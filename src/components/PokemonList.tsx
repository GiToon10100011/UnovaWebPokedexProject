import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { pokeAPI } from "../redux/api";
import { AxiosResponse } from "axios";
import styled from "styled-components";
import PokemonItem from "./PokemonItem";
import { AnimatePresence } from "motion/react";
import Bootup from "./Bootup";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";

const Container = styled(motion.ul)<{ $isLoading: boolean }>`
  position: absolute;
  top: 120px;
  right: 0;
  width: 40%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 30px;
  ${({ $isLoading }) =>
    $isLoading ? "overflow: visible" : "overflow-y: scroll"};
  scrollbar-width: none;
  h2 {
    font-size: 120px;
  }
`;

const NoResults = styled.div`
  padding-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface IPokemonPartialData {
  name: string;
  url: string;
}

interface IPokemonMoves {
  move: IPokemonPartialData;
  version_group_details: {
    level_learned_at: number;
    version_group: IPokemonPartialData;
    move_learn_method: IPokemonPartialData;
  }[];
}

export interface IPokemonSprites {
  back_default?: string;
  back_female?: string;
  back_shiny?: string;
  back_shiny_female?: string;
  front_default?: string;
  front_female?: string;
  front_shiny?: string;
  front_shiny_female?: string;
  other?: any;
  versions?: any;
}

export interface IPokemonDetail {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: {
    ability: IPokemonPartialData;
  }[];
  forms: IPokemonPartialData[];
  game_indices: {
    game_index: number;
    version: IPokemonPartialData;
  }[];
  held_items: {
    item: IPokemonPartialData;
    version_details: { rarity: number; version: IPokemonPartialData }[];
  }[];
  location_area_encounters: string;
  moves: IPokemonMoves[];
  species: IPokemonPartialData;
  sprites: IPokemonSprites;
  cries: {
    latest: string;
    legacy: string;
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: IPokemonPartialData;
  }[];
  types: {
    slot: number;
    type: IPokemonPartialData;
  }[];
  past_types: object;
}

export const pokemonVariants = {
  pokemonList: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, type: "tween", staggerChildren: 0.06 },
    },
  },
  pokemonItem: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, type: "tween" },
    },
  },
};

const PokemonList = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("pokemon");
  const [detailData, setDetailData] = useState<IPokemonDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const pokemonData = useAppSelector((state) => state.pokeReducer.data);

  const isBootupFinished = useAppSelector((state) => state.userReducer.bootup);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setIsLoading(true);
      try {
        const promises = pokemonData.map((pokemon) =>
          pokeAPI.get(`/pokemon/${pokemon}`)
        );

        let completed = 0;
        const results = await Promise.all(
          promises.map(async (promise) => {
            const result = await promise;
            completed++;
            setLoadingProgress((completed / promises.length) * 100);
            return result;
          })
        );

        setDetailData(results.map((result: AxiosResponse) => result.data));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (pokemonData.length > 0) {
      fetchPokemonDetails();
    }
  }, [pokemonData]);

  const isBootupCompleted = useAppSelector((state) => state.userReducer.bootup);

  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      if (isBootupCompleted) setStartAnimation(true);
    }, 400);

    return () => clearTimeout(animationTimeout);
  }, [isBootupCompleted]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isBootupFinished && (
          <Bootup
            key="bootup"
            isLoading={isLoading}
            progress={loadingProgress}
          />
        )}
      </AnimatePresence>

      <Container
        $isLoading={isLoading}
        key="pokemonList"
        variants={pokemonVariants.pokemonList}
        initial={"hidden"}
        animate={startAnimation ? "visible" : undefined}
      >
        {detailData
          .filter((pokemon) =>
            searchQuery
              ? pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
              : true
          )
          .sort((a, b) =>
            a.order >= 0 && b.order >= 0 ? a.order - b.order : b.order - a.order
          )
          .map((data, index, arr) =>
            arr.length > 1 ? (
              <PokemonItem {...data} key={index} index={index} />
            ) : (
              <NoResults>
                <img src="/MissingNo..webp" alt="No Results" width={200} />
                <h2>No Results</h2>
              </NoResults>
            )
          )}
      </Container>
    </>
  );
};

export default PokemonList;
