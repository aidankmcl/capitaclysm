import { Provider } from "react-redux";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import "@flaticon/flaticon-uicons/css/all/all.css";

import { store } from "~/store";
import { Pages } from "~/pages";
import { capitaclysmTheme } from "./theme";
import { colors, spacing } from "~/constants";
import { PeerProvider } from "./services/p2p";
import "./App.css";

const generateCSSVariables = (variables: Record<string, string | number>) => Object.entries(variables)
  .map(([colorName, value]) => `--${colorName}: ${value};`)
  .join("\n");

const variables = `:root {
  ${generateCSSVariables(colors)}
  ${generateCSSVariables(spacing)}
}`;

function App() {
  return (
    <CssVarsProvider theme={capitaclysmTheme}>
      <CssBaseline />

      <PeerProvider>
        <Provider store={store}>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet/dist/leaflet.css"
          />
          <style>
            {variables}
          </style>
          <Pages />
        </Provider>
      </PeerProvider>
    </CssVarsProvider>
  );
}

export default App;
