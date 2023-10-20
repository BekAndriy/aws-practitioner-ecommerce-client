import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "~/queries/init";
import Header from "~/components/MainLayout/components/Header";
import Box from "@mui/material/Box";
import Alerts from "../Alerts/Alerts";
import Auth from "~/utils/auth";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}Phone For You {new Date().getFullYear()}.
    </Typography>
  );
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    Auth.instance.init().catch(() => null);
  }, []);

  return (
    <>
      <main>
        <Header />
        <Container sx={{ pb: 8 }} maxWidth="md">
          {children}
        </Container>
      </main>
      <Box
        component={"footer"}
        sx={{ bgcolor: (theme) => theme.palette.background.paper, padding: 6 }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Thank you for your purchase!
        </Typography>
        <Copyright />
        <Alerts />
      </Box>
    </>
  );
};

export default MainLayout;
