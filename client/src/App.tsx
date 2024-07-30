import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Discover from "./pages/discover";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Discover />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
