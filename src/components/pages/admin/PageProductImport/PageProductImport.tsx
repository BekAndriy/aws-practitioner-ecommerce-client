import API_PATHS from "~/constants/apiPaths";
import ProductsTable from "~/components/pages/admin/PageProductImport/components/ProductsTable";
import CSVFileImport from "~/components/pages/admin/PageProductImport/components/CSVFileImport";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { useProfile } from "~/utils/auth";

export default function PageProductImport() {
  const [isLogged] = useProfile();
  return (
    <Box py={3}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Box>
          <CSVFileImport
            url={`${API_PATHS.import}/import`}
            title="Import Products CSV"
          />
          <hr />
          <Typography align="center" fontSize="small">
            Module 7. Private upload only for authorized users by <b>Basic</b>{" "}
            token
          </Typography>
          <CSVFileImport
            localStorageTokenKey="basicToken"
            url={`${API_PATHS.import}/import-private`}
            title="Import Products CSV"
          />
          {isLogged ? (
            <>
              <hr />
              <Typography align="center" fontSize="small">
                Module 7. Private upload only for authorized users by{" "}
                <b>COGNITO</b>
              </Typography>
              <CSVFileImport
                localStorageTokenKey="IdToken"
                url={`${API_PATHS.import}/import-cognito`}
                title="Import Products CSV"
              />
            </>
          ) : null}
        </Box>
        <Button
          size="small"
          color="primary"
          variant="contained"
          sx={{ alignSelf: "end" }}
          component={Link}
          to={"/admin/product-form"}
        >
          Create product
        </Button>
      </Box>
      <ProductsTable />
    </Box>
  );
}
