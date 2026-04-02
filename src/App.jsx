import { useState, useEffect } from "react";
import { useConnectionState } from "use-connection-state";
import { SpotRateProvider } from "./context/SpotRateContext";
import "./App.css";
import TvScreen from "./pages/tvscreenView";
import ErrorPage from "./components/ErrorPage";
import { Route, Routes } from "react-router-dom";
 

function App() {
  const [isTvScreen, setIsTvScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsTvScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // <SpotRateProvider>
    //   {!isTvScreen ? <ErrorPage /> : <TvScreen />}
    // </SpotRateProvider>

    <SpotRateProvider>
      {!isTvScreen ? (
        <ErrorPage />
      ) : (
        <Routes>
          <Route path="/" element={<TvScreen />} />
          <Route path="*" element={<ErrorPage />} />
       
        </Routes>
      )}
    </SpotRateProvider>
  );
}

export default App;
