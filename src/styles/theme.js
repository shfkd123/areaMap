import { extendTheme } from "@chakra-ui/react";
import themeBtn from "./components/button";

const theme = extendTheme({
  fonts: {
    body: `'Noto Sans KR', sans-serif`,
  },
  colors: {
    main: "blue",
    test: "yellow",
  },
  components: {
    Button: themeBtn,
  },
});

export default theme;
