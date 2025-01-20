import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { pokeAPI } from "../redux/api";
import {
  IPokemonDetail,
  IPokemonPartialData,
  IPokemonSprites,
} from "../components/PokemonList";
import { formatOrderNumber, formatTypeSprites } from "../utils";
import { FaChevronLeft } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { GiSpeaker } from "react-icons/gi";
import StatChart from "../components/StatChart";
import { motion, AnimatePresence } from "motion/react";
import {
  descBoxVariants,
  infoBoxVariants1,
  infoBoxVariants2,
} from "../variants";

interface IPokemonSpeciesData {
  base_happiness: number;
  capture_rate: number;
  color: IPokemonPartialData;
  egg_groups: IPokemonPartialData[];
  evolution_chain: { url: string };
  evolves_from_species: IPokemonPartialData;
  flavor_text_entries: {
    flavor_text: string;
    language: IPokemonPartialData;
    version: IPokemonPartialData;
  }[];
  form_descriptions: object[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: {
    genus: string;
    language: IPokemonPartialData;
  }[];
  generation: IPokemonPartialData;
  habitat: IPokemonPartialData;
  names: {
    language: IPokemonPartialData;
    name: string;
  }[];
  order: number;
  pal_park_encounters: object[];
  pokedex_numbers: object[];
  shape: IPokemonPartialData;
  varieties: {
    is_default: boolean;
    pokemon: IPokemonPartialData;
  }[];
}

interface IPokemonEvolutionTriggers {
  gender: number;
  held_item: IPokemonPartialData;
  item: IPokemonPartialData;
  known_move: IPokemonPartialData;
  known_move_type: IPokemonPartialData;
  location: IPokemonPartialData;
  min_affection: IPokemonPartialData;
  min_beauty: IPokemonPartialData;
  min_happiness: IPokemonPartialData;
  min_level: IPokemonPartialData;
  needs_overworld_rain: boolean;
  party_species: IPokemonPartialData;
  party_type: IPokemonPartialData;
  relative_physical_stats: IPokemonPartialData;
  time_of_day: string;
  trade_species: IPokemonPartialData;
  trigger: IPokemonPartialData;
  turn_upside_down: boolean;
}

interface IChain {
  evolution_details: IPokemonEvolutionTriggers[];
  evolves_to: IChain[];
  is_baby: boolean;
  species: IPokemonPartialData;
}

interface IPokemonEvolutionChain {
  baby_trigger_item: IPokemonPartialData;
  chain: IChain;
  id: number;
}

interface IResolvedEvoChain {
  name?: string | null;
  trigger?: string | null;
  trigger_details:
    | ""
    | IPokemonPartialData
    | (string | number | boolean | IPokemonPartialData)[]
    | null;
  other: [string, number | boolean | string | IPokemonPartialData][][] | null;
  level: number;
}

export interface IPokemonAbilities {
  effect_entries: {
    effect: string;
    language: IPokemonPartialData;
    short_effect: string;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: IPokemonPartialData;
    version_group: IPokemonPartialData;
  }[];
  name: string;
  pokemon: {
    pokemon: IPokemonPartialData;
  }[];
}

const liveSprites = keyframes`
  from{
    transform: translateY(0);
  }
  50%{
    transform: translateY(-3px);
  }
  to{
    transform: translateY(3px);
  }
`;

const Container = styled.main`
  position: relative;
  padding: 120px 0;
  margin: 0 30px;
  height: 100vh;
  overflow: hidden;
`;

const PokeBackground = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: url("/assets/pokeDetailBackground.svg") center top/contain
    no-repeat;
`;

const Sprite = styled(motion.img)`
  position: absolute;
  width: 20%;
  aspect-ratio: 1;
  top: 16%;
  left: 8%;
  transform: translateY(-50%);
`;

const FileTop = styled.img`
  position: absolute;
  top: -15%;
  left: -4px;
  height: 15%;
  object-fit: cover;
`;

const PokeInfoBox = styled(motion.div)`
  position: absolute;
  right: 10%;
  width: 40%;
  height: 40%;
  border: 4px solid;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${FileTop} {
    height: 10%;
    top: -10%;
    left: -4px;
  }
`;

const PokeName = styled.span`
  display: block;
  width: 100%;
  text-align: center;
  text-transform: capitalize;
`;

const InfoBoxHeading = styled.p`
  display: flex;
  align-items: center;
  background: #d3d3d3;
  padding: 20px;
  font-size: 48px;
`;

const PreEvolutionBox = styled.div`
  position: absolute;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 50%;
  bottom: 10px;
  margin-right: 30px;
  cursor: pointer;
  span {
    width: 100%;
    position: absolute;
    text-transform: capitalize;
    font-size: 28px;
    bottom: 0;
  }
  ${Sprite} {
    &:hover {
      filter: brightness(1.2);
      animation: ${liveSprites} 0.3s infinite;
    }
  }
`;

const NextEvolutionBox = styled(PreEvolutionBox)``;

const EvolutionTrigger = styled(motion.div)`
  position: absolute;
  top: 20%;
  left: -120%;
  width: 140%;
  height: 40px;
  clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);
  background: #202020;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    position: absolute;
    right: 6px;
    scale: -1;
  }
`;

const TriggerContent = styled.div`
  span {
    width: fit-content;
    position: absolute;
    color: ${({ theme }) => theme.colors.text};
    &:first-child {
      top: -10%;
      left: 5%;
    }

    &:last-child {
      right: 14%;
      bottom: 0;
      font-size: 16px;
    }
  }
`;

const PokeMiniInfoBox1 = styled(PokeInfoBox)<{ $spriteCount?: number }>`
  right: auto;
  left: -34%;
  top: 25%;
  width: 50%;
  height: 60%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right, #c9c9c9 4px, transparent 4px),
    linear-gradient(to bottom, #c9c9c9 4px, transparent 4px);
  background-size: 24px 24px;
  background-color: #e7e7e7;
  ${InfoBoxHeading} {
    font-size: 32px;
  }
  ${Sprite} {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 100%;
  }
  h2 {
    width: 100%;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    text-align: center;
  }

  &.forms {
    width: fit-content;
    height: fit-content;
    min-height: 60%;
    left: -30%;
    left: ${({ $spriteCount }) =>
      $spriteCount && $spriteCount <= 4 ? `${$spriteCount * -10}%` : "-45%"};
  }

  &.stats {
    top: 20%;
    left: -40%;
    width: 60%;
    height: fit-content;
    ${FileTop} {
      top: -8%;
      height: 8%;
    }
  }
`;
const PokeMiniInfoBox2 = styled(PokeMiniInfoBox1)`
  left: auto;
  right: -20%;
  top: auto;
  bottom: -20%;
  width: 40%;
  ${TriggerContent} {
    span {
      font-size: 20px;
      &:first-child {
        top: -5%;
        left: 5%;
      }
      &:last-child {
        right: 20%;
        bottom: 5%;
        font-size: 12px;
      }
    }
  }
  &.stats {
    top: -5%;
    left: auto;
    right: -25%;
    width: 45%;
    height: fit-content;
    min-height: 60%;
  }
`;

const PokeNumber = styled.span`
  &::before {
    content: "•";
    margin-right: 10px;
  }
`;

const PokeGenus = styled(PokeName)`
  font-size: 42px;
  color: #4c4c4e;
`;

const PokeTypes = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-image: linear-gradient(to right, #e7e7e7 2px, transparent 2px),
    linear-gradient(to bottom, #e7e7e7 2px, transparent 2px);
  background-size: 10px 10px;
  background-color: #c9c9c9;
`;

const PokeType = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 40%;
  }
`;

const PokeSpecs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 20px;
`;
const Height = styled.p`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  font-size: 40px;
  span {
    z-index: 1;
  }
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 130%;
    height: 10px;
    border-radius: 20px;
    background: #d3d3d3;
    z-index: 1;
  }
`;
const Weight = styled(Height)``;

const PokeDescBox = styled(motion.section)`
  position: absolute;
  bottom: 80px;
  width: 100%;
  height: 30%;
  background: #2a2a2a;
  border-top: 4px solid #000;
  display: flex;
  align-items: center;
  padding: 0 30px;
  font-size: 36px;
  color: #f0f5f8;
  line-height: 1.5;
`;

const FormsBox = styled(PreEvolutionBox)`
  position: static;
  width: 100%;
  max-width: 450px;
  align-self: normal;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-right: 0;
  cursor: initial;
  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    span {
      position: static;
      font-size: 18px;
    }
    ${Sprite} {
      width: 100px;
      &:hover {
        filter: none;
        animation: none;
      }
    }
  }
`;

const CriesBox = styled(FormsBox)`
  gap: 10px;
  & > div {
    span {
      font-size: 24px;
    }
    svg {
      cursor: pointer;
    }
  }
`;

const StatsBox = styled.div``;
const AbilitiesBox = styled.div`
  padding: 20px;
  span {
    text-transform: capitalize;
    font-size: 24px;
  }
  p {
    margin-bottom: 10px;
    line-height: 1.2;
    font-size: 18px;
  }
`;

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.userReducer.menuMode);

  const { pokemonId } = useParams();

  const audioRefs = {
    legacy: useRef<HTMLAudioElement | null>(null),
    latest: useRef<HTMLAudioElement | null>(null),
  };

  const [pokemonData, setPokemonData] = useState<IPokemonDetail | null>(null);

  const [pokemonSpecies, setPokemonSpecies] =
    useState<IPokemonSpeciesData | null>(null);

  const [pokemonEvolutionData, setPokemonEvolutionData] =
    useState<IPokemonEvolutionChain | null>(null);

  const [preEvolutionPokemon, setPreEvolutionPokemon] =
    useState<IPokemonDetail | null>(null);

  const [nextEvolutionPokemon, setNextEvolutionPokemon] =
    useState<IPokemonDetail | null>(null);

  const [pokemonAbilities, setPokemonAbilities] = useState<
    IPokemonAbilities[] | null
  >(null);

  const fetchPokemon = async () => {
    const targetPokemon = await pokeAPI.get(`/pokemon/${pokemonId}`);
    setPokemonData(targetPokemon.data);
    const pokemonSpecies = await fetch(targetPokemon.data?.species?.url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.error(error));
    setPokemonSpecies(pokemonSpecies);
    const evolutionData = await fetch(pokemonSpecies.evolution_chain.url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.error(error));
    setPokemonEvolutionData(evolutionData);
    const abilityData = targetPokemon?.data.abilities.map(
      async (ability: { ability: IPokemonPartialData }) =>
        await fetch(ability.ability.url)
          .then((response) => response.json())
          .then((data) => data)
          .catch((error) => console.error(error))
    );
    const resolvedAbilities = abilityData && (await Promise.all(abilityData));
    setPokemonAbilities(resolvedAbilities);
    if (pokemonId?.includes("mega") || pokemonId?.includes("gmax")) {
      const target = pokemonId.split("-");
      const preEvolution = await pokeAPI.get(`/pokemon/${target[0]}`);
      setPreEvolutionPokemon(preEvolution.data);
      setNextEvolutionPokemon(null);
    } else {
      const preEvolution = await pokeAPI.get(
        `/pokemon/${pokemonSpecies.evolves_from_species.name}`
      );
      setPreEvolutionPokemon(preEvolution.data);
    }
  };

  useEffect(() => {
    fetchPokemon();
    setNextEvolutionPokemon(null);
    setPreEvolutionPokemon(null);
    dispatch({ type: "SELECT", payload: { name: pokemonId } });
  }, [pokemonId]);

  const resolveEvolutionChain = (chain: IChain) => {
    if (!chain) return null;
    let evoChain: IResolvedEvoChain[] = [];
    let level = 0;
    const processChain = (currentChain: IChain, level: number) => {
      const trigger =
        currentChain.evolution_details?.[0]?.trigger?.name || null;

      let formattedTrigger;

      switch (trigger) {
        case null:
          formattedTrigger = null;
          break;
        case "level-up":
          formattedTrigger = "min_level";
          break;
        case "use-item":
          formattedTrigger = "item";
          break;
        case "trade":
          formattedTrigger = "trade_species";
          break;
        default:
          formattedTrigger = null;
          break;
      }
      evoChain.push({
        name: currentChain.species.name,
        trigger,
        trigger_details:
          (trigger &&
            currentChain.evolution_details.map(
              (detail) =>
                detail[formattedTrigger as keyof IPokemonEvolutionTriggers]
            )) ||
          null,
        other: currentChain.evolution_details.map(
          (detail) =>
            Object.entries(detail).filter(([_, value]) => value !== null) as [
              string,
              number | boolean | string | IPokemonPartialData
            ][]
        ),
        level,
      });

      currentChain.evolves_to.forEach((nextChain) => {
        processChain(nextChain, level + 1);
      });
    };

    processChain(chain, level);

    return evoChain;
  };

  const fetchNextPokemonEvolution = async (data?: IResolvedEvoChain | null) => {
    if (data && nextEvolutionPokemon?.name !== data.name) {
      const nextPokemon = await pokeAPI.get(`/pokemon/${data.name}`);
      if (pokemonId?.includes("mega") || pokemonId?.includes("gmax"))
        setNextEvolutionPokemon(null);
      setNextEvolutionPokemon(nextPokemon.data);
    }
  };

  const findPokemonTriggerOrder = () => {
    if (!pokemonEvolutionData || !pokemonData) return null;

    if (
      pokemonData.name.includes("mega") ||
      pokemonData.name.includes("gmax")
    ) {
      const basePokemonName = pokemonData.name.split("-")[0];
      const currentEvolutionTrigger = resolveEvolutionChain(
        pokemonEvolutionData.chain
      )?.find((chain) => chain.name === basePokemonName);

      return {
        isMaxEvoDepth: true,
        currentPokemonEvolutionDepth: currentEvolutionTrigger?.level,
        preEvolutionTrigger: currentEvolutionTrigger,
        nextEvolutionTrigger: null,
      };
    }

    const currentPokemonEvolutionDepth = resolveEvolutionChain(
      pokemonEvolutionData.chain
    )?.find((chain) => chain.name === pokemonData.name)?.level;

    const maxEvolutionDepths = Math.max(
      ...(resolveEvolutionChain(pokemonEvolutionData.chain)?.map(
        (data) => data.level
      ) || [0])
    );

    if (currentPokemonEvolutionDepth === maxEvolutionDepths) {
      const currentEvolutionTrigger = resolveEvolutionChain(
        pokemonEvolutionData.chain
      )?.find((chain) => chain.name === pokemonData.name);

      const nextEvolutionTrigger = null;

      fetchNextPokemonEvolution(nextEvolutionTrigger);

      return {
        isMaxEvoDepth: true,
        currentPokemonEvolutionDepth,
        preEvolutionTrigger: currentEvolutionTrigger,
        nextEvolutionTrigger: nextEvolutionTrigger,
      };
    } else if (currentPokemonEvolutionDepth) {
      const currentEvolutionTrigger = resolveEvolutionChain(
        pokemonEvolutionData.chain
      )?.find((chain) => chain.name === pokemonData.name);

      const nextEvolutionTrigger = resolveEvolutionChain(
        pokemonEvolutionData.chain
      )?.find((chain) => chain.level === currentPokemonEvolutionDepth + 1);

      fetchNextPokemonEvolution(nextEvolutionTrigger);

      return {
        isMaxEvoDepth: false,
        currentPokemonEvolutionDepth,
        preEvolutionTrigger: currentEvolutionTrigger,
        nextEvolutionTrigger,
      };
    } else {
      const preEvolutionTrigger = null;
      const nextEvolutionTrigger = resolveEvolutionChain(
        pokemonEvolutionData.chain
      )?.find((chain) => chain.level === 1);

      fetchNextPokemonEvolution(nextEvolutionTrigger);

      return {
        isMaxEvoDepth: false,
        currentPokemonEvolutionDepth,
        preEvolutionTrigger,
        nextEvolutionTrigger,
      };
    }
  };

  const formatTriggerDesc = (data: IResolvedEvoChain) => {
    let formattedDesc;

    if (pokemonData?.name.includes("mega")) {
      formattedDesc = "Mega stone";
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Sprite
            style={{ width: 20 }}
            src={`/assets/megastones/${pokemonData.name}.png`}
          />
          {formattedDesc}
        </div>
      );
    }

    if (!data) return null;

    const heldItem = data.other
      ?.flatMap((arr) => arr)
      .find((obj) => obj.includes("held_item"));

    switch (data.trigger) {
      case "level-up":
        formattedDesc = `Level up to ${data.trigger_details}`;
        break;
      case "trade":
        formattedDesc = heldItem
          ? `Trade while holding ${(heldItem[1] as IPokemonPartialData).name}`
          : `Trade`;
        break;
      case "use-item":
        formattedDesc = `Use ${
          (data.trigger_details as IPokemonPartialData[])[0].name
        }`;
        break;
      default:
        formattedDesc = "";
        break;
    }

    return formattedDesc;
  };

  useEffect(() => {
    if (pokemonData && pokemonEvolutionData) {
      const evolutionInfo = findPokemonTriggerOrder();
      if (
        pokemonData.name.includes("mega") ||
        pokemonData.name.includes("gmax")
      ) {
        setNextEvolutionPokemon(null);
      } else if (evolutionInfo?.nextEvolutionTrigger) {
        fetchNextPokemonEvolution(evolutionInfo.nextEvolutionTrigger);
      } else {
        setNextEvolutionPokemon(null);
      }
    }
  }, [pokemonData, pokemonEvolutionData, pokemonId]);

  useEffect(() => {
    dispatch({ type: "SLOT_MENU", payload: { mode: "info" } });
  }, []);

  const SlotBoxes = () => {
    switch (currentMode) {
      case "info":
        return (
          <>
            <PokeMiniInfoBox1
              variants={infoBoxVariants1}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <span>Evolves From: </span>
              </InfoBoxHeading>
              {preEvolutionPokemon ? (
                <PreEvolutionBox
                  onClick={() =>
                    navigate(`/pokemon/${preEvolutionPokemon.name}`)
                  }
                >
                  <EvolutionTrigger
                    variants={infoBoxVariants1}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <FaChevronLeft color="#737373" size={40} />
                    <TriggerContent>
                      <span>Evolves By: </span>
                      <span>
                        {formatTriggerDesc(
                          findPokemonTriggerOrder()
                            ?.preEvolutionTrigger as IResolvedEvoChain
                        )}
                      </span>
                    </TriggerContent>
                  </EvolutionTrigger>
                  <Sprite
                    src={preEvolutionPokemon?.sprites.front_default}
                    data-sound-effect
                  />
                  <span>{preEvolutionPokemon && preEvolutionPokemon.name}</span>
                </PreEvolutionBox>
              ) : (
                <h2>No Pre-Evolution</h2>
              )}
            </PokeMiniInfoBox1>
            <PokeMiniInfoBox2
              variants={infoBoxVariants2}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <span>Evolves To: </span>
              </InfoBoxHeading>
              {nextEvolutionPokemon ? (
                <NextEvolutionBox
                  onClick={() =>
                    navigate(`/pokemon/${nextEvolutionPokemon.name}`)
                  }
                >
                  <EvolutionTrigger
                    variants={infoBoxVariants1}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <FaChevronLeft color="#737373" size={40} />
                    <TriggerContent>
                      <span>Evolves By: </span>
                      <span>
                        {formatTriggerDesc(
                          findPokemonTriggerOrder()
                            ?.nextEvolutionTrigger as IResolvedEvoChain
                        )}
                      </span>
                    </TriggerContent>
                  </EvolutionTrigger>
                  <Sprite
                    src={
                      nextEvolutionPokemon &&
                      nextEvolutionPokemon.sprites.front_default
                    }
                    data-sound-effect
                  />
                  <span>
                    {nextEvolutionPokemon && nextEvolutionPokemon.name}
                  </span>
                </NextEvolutionBox>
              ) : (
                <h2>No further Evolutions</h2>
              )}
            </PokeMiniInfoBox2>
          </>
        );
      case "forms":
        const sprites =
          pokemonData &&
          (
            Object.keys(pokemonData?.sprites) as Array<keyof IPokemonSprites>
          ).filter((key) =>
            key === "other" || key === "versions"
              ? null
              : pokemonData?.sprites[key]
          );
        const cries =
          pokemonData &&
          (
            Object.keys(pokemonData?.cries) as Array<
              keyof IPokemonDetail["cries"]
            >
          ).filter((key) => pokemonData?.cries[key]);
        return (
          <>
            <PokeMiniInfoBox1
              variants={infoBoxVariants1}
              initial="initial"
              animate="animate"
              exit="exit"
              className={currentMode}
              $spriteCount={sprites?.length}
            >
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <span>Forms: </span>
              </InfoBoxHeading>
              {pokemonData?.sprites ? (
                <FormsBox>
                  {sprites?.map((spriteKey) => (
                    <div key={`${spriteKey + 1}`}>
                      <Sprite
                        src={pokemonData.sprites[spriteKey]}
                        alt={`${pokemonData.name + spriteKey}`}
                      />
                      <span>{spriteKey}</span>
                    </div>
                  ))}
                </FormsBox>
              ) : (
                <h2>No Sprites</h2>
              )}
            </PokeMiniInfoBox1>
            <PokeMiniInfoBox2
              variants={infoBoxVariants2}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <span>Cries: </span>
              </InfoBoxHeading>
              {cries ? (
                <CriesBox>
                  {cries?.map((cry) => (
                    <div key={cry}>
                      <audio
                        src={pokemonData?.cries[cry]}
                        ref={audioRefs[cry]}
                      ></audio>
                      <GiSpeaker
                        size={100}
                        onClick={() => audioRefs[cry].current?.play()}
                      />
                      <span>{cry}</span>
                    </div>
                  ))}
                </CriesBox>
              ) : (
                <h2>No Cries Available</h2>
              )}
            </PokeMiniInfoBox2>
          </>
        );
      case "stats":
        const stats = pokemonData?.stats;
        return (
          <>
            <PokeMiniInfoBox1
              variants={infoBoxVariants1}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stats"
            >
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <span>Stats: </span>
              </InfoBoxHeading>
              {stats ? (
                <StatsBox>
                  <StatChart stats={stats} />
                </StatsBox>
              ) : (
                <h2>No Stat Data</h2>
              )}
            </PokeMiniInfoBox1>
            <PokeMiniInfoBox2
              variants={infoBoxVariants2}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stats"
            >
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <span>Abilities: </span>
              </InfoBoxHeading>
              {pokemonAbilities ? (
                <AbilitiesBox>
                  {pokemonAbilities.map((ability) => (
                    <>
                      <span>{ability.name} : </span>
                      <p>
                        {
                          ability.effect_entries.find(
                            (lang) => lang.language.name === "en"
                          )?.short_effect
                        }
                      </p>
                    </>
                  ))}
                </AbilitiesBox>
              ) : (
                <h2>No Abilities</h2>
              )}
            </PokeMiniInfoBox2>
          </>
        );
    }
  };

  return (
    <Container>
      <PokeBackground>
        {pokemonData && (
          <>
            {" "}
            <Sprite
              src={pokemonData?.sprites.front_default}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <PokeInfoBox>
              <AnimatePresence mode="wait">
                <SlotBoxes key={currentMode} />
              </AnimatePresence>
              <FileTop src="/assets/fileTop.svg" />
              <InfoBoxHeading>
                <PokeNumber>
                  {pokemonData && formatOrderNumber(pokemonData.order)}
                </PokeNumber>
                <PokeName>{pokemonData && pokemonData.name}</PokeName>
              </InfoBoxHeading>
              <PokeGenus>
                {pokemonSpecies &&
                  pokemonSpecies.genera.find(
                    (data) => data.language.name === "en"
                  )?.genus}
              </PokeGenus>
              <PokeTypes>
                {formatTypeSprites(pokemonData.types).map((sprite, index) => (
                  <PokeType key={index}>
                    <img src={sprite} />
                  </PokeType>
                ))}
              </PokeTypes>
              <PokeSpecs>
                <Height>
                  <span>HT</span>
                  <span>{pokemonData.height * 10}cm</span>
                </Height>
                <Weight>
                  <span>WT</span>
                  <span>{pokemonData.weight / 10}kg</span>
                </Weight>
              </PokeSpecs>
            </PokeInfoBox>
          </>
        )}
      </PokeBackground>
      <PokeDescBox
        variants={descBoxVariants}
        initial="initial"
        animate="animate"
        className="stats"
      >
        <FileTop src="/assets/fileTop.svg" />
        <p>
          {pokemonSpecies &&
            pokemonSpecies?.flavor_text_entries.find(
              (desc) => desc.language.name === "en"
            )?.flavor_text}{" "}
          <br />
          This pokemon was originated from{" "}
          {pokemonSpecies && (
            <>
              {pokemonSpecies.generation.name.split("-")[0] +
                " " +
                pokemonSpecies.generation.name.split("-")[1].toUpperCase()}
              . <br />
              It is also known as the name{" "}
              {pokemonSpecies.names.find((name) => name.language.name === "ja")
                ?.name + "(JP)"}{" "}
              or{" "}
              {pokemonSpecies.names.find((name) => name.language.name === "ko")
                ?.name + "(KR)"}
              .
            </>
          )}
        </p>
      </PokeDescBox>
    </Container>
  );
};

export default Detail;
