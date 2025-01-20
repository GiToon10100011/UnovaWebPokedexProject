interface IPokeAction {
  type: string;
  payload: { allPokemon: string[] };
}

let initialState = {
  data: [],
  loading: true,
};

const pokeReducer = (state = initialState, action: IPokeAction) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_DATA_SUCCESS":
      return { ...state, data: payload.allPokemon, loading: false };
    default:
      return state;
  }
};

export default pokeReducer;
