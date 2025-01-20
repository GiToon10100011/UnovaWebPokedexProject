import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "motion/react";
import { searchBarVariants } from "../variants";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";

const Container = styled(motion.section)`
  position: relative;
  width: 100%;
  overflow: hidden;
  z-index: 1;
`;

const SearchBar = styled.form`
  width: 100%;
  height: 160px;
  background: #4a4a4a;
  padding: 14px;
  display: flex;
  align-items: end;
  gap: 14px;
`;

const SearchInput = styled.input`
  width: 90%;
  height: 60px;
  padding: 0 30px;
  clip-path: polygon(2% 0, 98% 0, 100% 50%, 98% 100%, 2% 100%, 0 50%);
  border: none;
  background: #dedede;
  color: #313131;
  font-size: 32px;
  font-family: ${({ theme }) => theme.fonts.bits};
  &:focus {
    outline: none;
  }
`;

const SubmitBtn = styled.input`
  width: 10%;
  height: 60px;
  background: #222;
  outline: none;
  border: none;
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.bits};
  font-size: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    filter: brightness(0.7);
  }
`;

const Search = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/?pokemon=${query}`);
    dispatch({ type: "SEARCH_MODE", payload: { isSearch: false } });
  };

  useEffect(() => {
    searchRef?.current?.focus();
    return () => {
      dispatch({ type: "SEARCH_MODE", payload: { isSearch: false } });
    };
  }, []);
  return (
    <Container
      variants={searchBarVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SearchBar onSubmit={handleSubmit}>
        <SearchInput
          ref={searchRef}
          onChange={handleQuery}
          type="text"
          name="pokemon"
          placeholder="Please enter a keyword.."
          minLength={1}
          required
        />
        <SubmitBtn data-sound-effect value={"Search"} type="submit" />
      </SearchBar>
    </Container>
  );
};

export default Search;
