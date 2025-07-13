import { Provider } from "react-redux";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import "@flaticon/flaticon-uicons/css/all/all.css";

import { store } from "~/store";
import { Pages } from "~/pages";
import { capitaclysmTheme } from "./theme";
import { PeerProvider } from "./services/p2p";
import "./App.css";
function App() {
  return (
    <CssVarsProvider theme={capitaclysmTheme}>
      <CssBaseline />

      <PeerProvider>
        <Provider store={store}>
          <div className="bg-background text-darkGreen w-full h-full">
            <Pages />
          </div>
        </Provider>
      </PeerProvider>
    </CssVarsProvider>
  );
}

export default App;
