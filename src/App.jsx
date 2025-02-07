import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./config/Routes/AppRoutes";
import Loader from "./components/Common/Loader";

const App = () => {
  console.error = () => {};
  console.warn = () => {};

  return <AppRoutes />;
};

export default App;
