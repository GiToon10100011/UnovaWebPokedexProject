import { createGlobalStyle, DefaultTheme } from "styled-components";
import reset from "styled-reset";
import { slideBackground } from "./components/PokemonSpotlight";

export const theme: DefaultTheme = {
  colors: {
    background: "#333",
    brightPoint: "#A1E64E",
    darkPoint: "#157327",
    text: "#F0F5F8",
  },
  fonts: {
    bits: "VT323",
  },
};

export const GlobalStyles = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  ul, li{
    list-style: none;
  }

  a{
    text-decoration: none;
    color: inherit;
  }

  ${reset}

  body{
    background: conic-gradient(from 90deg at 3px 3px,#18B57E 90deg,#0F7656 0) 
    0 0/20px 20px;
    font-family: ${theme.fonts.bits};
    animation: ${slideBackground} 30s linear reverse infinite;
  }
`;
