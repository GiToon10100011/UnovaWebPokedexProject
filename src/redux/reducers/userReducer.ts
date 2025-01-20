interface IUserAction {
  type: string;
  payload: { name?: string; bootup?: boolean; mode: string; isSearch: boolean };
}

interface IUserState {
  selectedPokemon: string;
  bootup: boolean;
  menuMode: string;
  favoritePokemonList: string[];
  isSearch: boolean;
}

let initialState: IUserState = {
  selectedPokemon: "",
  bootup: false,
  menuMode: "",
  favoritePokemonList: [],
  isSearch: false,
};

const userReducer = (state = initialState, action: IUserAction) => {
  const { type, payload } = action;
  switch (type) {
    case "BOOTUP_FINISH":
      return { ...state, bootup: payload.bootup };
    case "SELECT":
      return { ...state, selectedPokemon: payload.name };
    case "SEARCH_MODE":
      return { ...state, isSearch: payload.isSearch };
    case "SLOT_MENU":
      return { ...state, menuMode: payload.mode };
    case "ADD_FAVORITES":
      return {
        ...state,
        favoritePokemonList: [...state.favoritePokemonList, payload.name],
      };
    case "REMOVE_FAVORITES":
      return {
        ...state,
        favoritePokemonList: state.favoritePokemonList.filter(
          (pokemon) => pokemon !== payload.name
        ),
      };
    default:
      return state;
  }
};

export default userReducer;
