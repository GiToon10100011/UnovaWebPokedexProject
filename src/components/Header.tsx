import { useMatch, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa6";

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background: #000;
  width: 100%;
  padding: 20px;
  height: fit-content;
  clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #92c551;
    z-index: -1;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0 4px 4px 0;
    background: #000;
    z-index: -1;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
  }
`;

const HeaderTitle = styled.h1`
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 32px;
  color: white;
  text-transform: uppercase;
`;

const Header = () => {
  const detailMatch = useMatch("/pokemon/:pokemonId");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("pokemon");
  const favoriteMatch = useMatch("/favorites");

  return (
    <Container>
      <HeaderTitle>
        {detailMatch ? (
          <>
            <FaChevronRight color="#92c551" size={30} />
            {detailMatch.params.pokemonId}
          </>
        ) : searchQuery ? (
          `${searchQuery} Search Results`
        ) : favoriteMatch ? (
          "My Favorites"
        ) : (
          "National Pokedex"
        )}
      </HeaderTitle>
    </Container>
  );
};

export default Header;
