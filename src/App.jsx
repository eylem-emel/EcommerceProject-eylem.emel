import { Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import PageContent from "./layout/PageContent";
import Footer from "./layout/Footer";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </PageContent>
      <Footer />
    </div>
  );
}
