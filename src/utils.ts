import { IPokemonPartialData } from "./components/PokemonList";

export const formatOrderNumber = (num: number): string => {
  return String(num).padStart(3, "0");
};

export const formatTypeSprites = (
  types: { slot: number; type: IPokemonPartialData }[]
) => {
  const pokemonTypes = types.map((type) => type.type.name);
  const typeSprites = pokemonTypes.map((type) => `/assets/types/${type}.png`);
  return typeSprites;
};
