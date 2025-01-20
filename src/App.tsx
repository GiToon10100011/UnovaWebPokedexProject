import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import pokeAction from "./redux/actions/pokeAction";
import { GlobalStyles } from "./theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Search from "./components/Search";

function App() {
  const isSearch = useAppSelector((state) => state.userReducer.isSearch);

  const clickEffect = useRef<HTMLAudioElement | null>(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(pokeAction.getPokemonData());
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const soundElement = target.closest("[data-sound-effect]");

      if (soundElement && clickEffect.current) {
        clickEffect.current.currentTime = 0;
        clickEffect.current.play();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <audio ref={clickEffect} src="/assets/clickSFX.mp3"></audio>
      <GlobalStyles />
      <Header />
      <AnimatePresence mode="wait">{isSearch && <Search />}</AnimatePresence>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
