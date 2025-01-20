import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      brightPoint: string;
      darkPoint: string;
      text: string;
    };
    fonts: {
      bits: string;
    };
  }
}
