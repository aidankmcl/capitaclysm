import { Provider } from "react-redux";
import "@flaticon/flaticon-uicons/css/all/all.css";

import { store } from "~/store";
import { Pages } from "~/pages";
import { PeerProvider } from "./services/p2p";
import "./App.css";
function App() {
  return (
      <PeerProvider>
        <Provider store={store}>
          <div className="bg-background text-darkGreen w-full h-full">
            <Pages />
          </div>
        </Provider>
      </PeerProvider>
  );
}

export default App;
