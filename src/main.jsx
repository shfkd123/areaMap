import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Router from "./Router";
import theme from "./styles/theme";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <RecoilRoot>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </RecoilRoot>
  </ChakraProvider>
);
