import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans KR",
      "Segoe UI", sans-serif;
  }
`;
