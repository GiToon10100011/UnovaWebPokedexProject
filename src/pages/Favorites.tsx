import PokemonSpotlight from "../components/PokemonSpotlight";
import styled from "styled-components";
import ListBackground from "../components/ListBackground";
import { useAppSelector } from "../redux/hooks";
import FavoriteList from "../components/FavoriteList";

const Container = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Favorites = () => {
  const isSearch = useAppSelector((state) => state.userReducer.isSearch);
  return (
    <Container>
      {!isSearch && <PokemonSpotlight />}
      <FavoriteList />
      <ListBackground />
    </Container>
  );
};

export default Favorites;
