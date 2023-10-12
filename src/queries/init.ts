import axios from "axios";
import Alerts from "~/utils/alert";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      [400, 404, 500].includes(error.response.status) &&
      error.response?.data?.message
    ) {
      Alerts.instance.show({
        type: "error",
        message: error.response.data.message,
      });
    }

    return Promise.reject(error);
  },
);
