import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import "./Asset/globle css/globle.css"
import MainRouter from "./MainRouter";

function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <MainRouter/>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
