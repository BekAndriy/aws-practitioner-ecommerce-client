import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertsService, { Alert as AlertItem } from "~/utils/alert";

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const onAlertsListChanged = (list: AlertItem[]) => {
    // duplicate to trigger state change
    setAlerts([...list]);
  };

  useEffect(() => {
    AlertsService.instance.on(onAlertsListChanged);
    return () => {
      AlertsService.instance.off(onAlertsListChanged);
    };
  }, []);
  return alerts.length ? (
    <Box
      sx={{
        position: "fixed",
        top: 72,
        width: "80%",
        maxWidth: 370,
        right: 30,
      }}
    >
      {alerts.map(({ id, message, type }) => (
        <Alert
          sx={{ marginBottom: "10px" }}
          key={id}
          severity={type}
          onClose={() => AlertsService.instance.close(id)}
        >
          {message}
        </Alert>
      ))}
    </Box>
  ) : null;
};

export default Alerts;
