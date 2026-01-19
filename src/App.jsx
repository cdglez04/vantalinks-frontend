import { Routes, Route} from "react-router-dom"
import Home  from "./pages/Home.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Main from "./pages/Main.jsx"


function App() {
  return (
    <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/main" element={<Main />} />
    </Routes>

  )
}

export default App
