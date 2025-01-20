import { Dispatch } from "redux";
import { pokeAPI } from "../api";

type pokemonData = {
  name: string;
  url: string;
};

const getPokemonData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const allPokemonApi = pokeAPI.get("pokemon/?limit=1302");
      const allPokemonData = await allPokemonApi.then(
        (response) => response.data
      );
      const allPokemon = allPokemonData.results.map(
        (pokemon: pokemonData) => pokemon.name
      );
      dispatch({
        type: "GET_DATA_SUCCESS",
        payload: { allPokemon },
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export default { getPokemonData };
