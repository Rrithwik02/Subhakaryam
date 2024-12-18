import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ServiceProviderRegister from "./pages/auth/ServiceProviderRegister";
import Search from "./pages/search/Search";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/service-provider" element={<ServiceProviderRegister />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;