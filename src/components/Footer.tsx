import styled from "styled-components";
import { IoSearchOutline } from "react-icons/io5";
import { MdCatchingPokemon } from "react-icons/md";
import { HiMiniArrowUturnLeft } from "react-icons/hi2";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IoMdRefresh } from "react-icons/io";
import { IoIosHome } from "react-icons/io";

const Container = styled.footer`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  background: linear-gradient(
    to top,
    #111111 0%,
    #2b2b2b 60%,
    #4a4a4a 80%,
    #666666 100%
  );
  height: 60px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 2px solid #000;
`;

const LeftArea = styled.div<{ $mode: string }>`
  display: flex;
  gap: 20px;
  align-items: center;
  .${({ $mode }) => $mode} {
    filter: brightness(1.5);
    &::before {
      background: #fff;
    }
  }
`;

const Search = styled.button`
  width: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 24px;
  background: transparent;
  border: none;
  color: #ccc;
  padding: 10px;
  padding-left: 14px;
  font-family: ${({ theme }) => theme.fonts.bits};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #ccc;
    z-index: -1;
    clip-path: polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 55%);
    transition: background 0.3s;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 2px;
    background: #2b2b2b;
    z-index: -1;
    clip-path: polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 55%);
  }
`;

const MyFavs = styled(Search)``;

const RightArea = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    cursor: pointer;
  }
`;

const FavControls = styled(Controls)`
  gap: 14px;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
`;

const BackControls = styled(FavControls)``;

const FavContainer = styled.div`
  position: relative;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 2px solid #666;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
    background: #ddd;
  }
`;

const SlotMenu = styled(Search)`
  width: 100px;
  transition: all 0.3s;
  &::before,
  &::after {
    clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  }
`;

const Footer = () => {
  const detailMatch = useMatch("/pokemon/:pokemonId");
  const favoritesMatch = useMatch("/favorites");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPokemon = useAppSelector(
    (state) => state.userReducer.selectedPokemon
  );
  const favoriteList = useAppSelector(
    (state) => state.userReducer.favoritePokemonList
  );

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("pokemon");

  const isSearch = useAppSelector((state) => state.userReducer.isSearch);

  const isFavorites = favoriteList.find(
    (pokemon) => pokemon === currentPokemon
  );

  const currentMode = useAppSelector((state) => state.userReducer.menuMode);

  const switchSlots = (mode: string) => {
    dispatch({ type: "SLOT_MENU", payload: { mode } });
  };

  const handleSearch = () => {
    if (isSearch)
      dispatch({ type: "SEARCH_MODE", payload: { isSearch: false } });
    else dispatch({ type: "SEARCH_MODE", payload: { isSearch: true } });
  };

  const handleFavorites = () => {
    if (isFavorites)
      dispatch({ type: "REMOVE_FAVORITES", payload: { name: currentPokemon } });
    else dispatch({ type: "ADD_FAVORITES", payload: { name: currentPokemon } });
  };

  const handleReset = () => {
    navigate("/");
  };

  return (
    <Container>
      <LeftArea $mode={currentMode}>
        {!detailMatch ? (
          <>
            <Search data-sound-effect onClick={handleSearch}>
              <IoSearchOutline />
              {isSearch ? "Cancel" : "Search"}
            </Search>
            <MyFavs
              data-sound-effect
              onClick={() =>
                !favoritesMatch ? navigate("/favorites") : navigate("/")
              }
            >
              {!favoritesMatch ? (
                <>
                  <MdCatchingPokemon />
                  Favorites
                </>
              ) : (
                <>
                  <IoIosHome />
                  Home
                </>
              )}
            </MyFavs>
          </>
        ) : (
          <>
            <SlotMenu
              className={currentMode === "info" ? currentMode : undefined}
              onClick={() => switchSlots("info")}
              data-sound-effect
            >
              Info
            </SlotMenu>
            <SlotMenu
              className={currentMode === "forms" ? currentMode : undefined}
              onClick={() => switchSlots("forms")}
              data-sound-effect
            >
              Forms
            </SlotMenu>
            <SlotMenu
              className={currentMode === "stats" ? currentMode : undefined}
              onClick={() => switchSlots("stats")}
              data-sound-effect
            >
              Stats
            </SlotMenu>
          </>
        )}
      </LeftArea>
      <RightArea>
        {detailMatch && (
          <BackControls data-sound-effect onClick={() => navigate("/")}>
            <IoIosHome size={40} />
            Home
          </BackControls>
        )}
        {searchQuery && (
          <BackControls data-sound-effect onClick={handleReset}>
            {" "}
            <IoMdRefresh color="#EE5054" strokeWidth={2} size={40} />
            Reset
          </BackControls>
        )}
        <FavControls data-sound-effect onClick={handleFavorites}>
          <FavContainer>
            {isFavorites && <MdCatchingPokemon color={"#EE5054"} size={60} />}
          </FavContainer>
          {currentPokemon
            ? `Add ${
                currentPokemon[0].toUpperCase() + currentPokemon.substring(1)
              } to Favorites`
            : "Hover over a pokemon"}
        </FavControls>
        <BackControls data-sound-effect onClick={() => navigate(-1)}>
          <HiMiniArrowUturnLeft color="dodgerblue" strokeWidth={2} size={30} />
          Return
        </BackControls>
      </RightArea>
    </Container>
  );
};

export default Footer;
