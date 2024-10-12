import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import "./App.css";
import UsersList from "./components/UsersList";
import { AppBar, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <>
      <AppBar position="static" sx={{ mb: "1rem" }}>
        <Toolbar>
          <Typography>Doge Labs VR</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ width: "100vw", minHeight: "100vh" }} maxWidth="lg">
        <Box>
          <UsersList />
        </Box>
      </Container>
    </>
  );
}

export default App;
