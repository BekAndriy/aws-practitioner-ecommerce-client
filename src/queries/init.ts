import axios from "axios";
import Alerts from "~/utils/alert";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if ([400, 404, 500].includes(status) && error.response?.data?.message) {
      Alerts.instance.show({
        type: "error",
        message: error.response.data.message,
      });
    } else if (status === 401) {
      // for one auth approach here should be the logic with refresh token
      // but it is out of scope for Module-7
      Alerts.instance.show({
        type: "error",
        message: "Unauthorized",
      });
    } else if (status === 403) {
      Alerts.instance.show({
        type: "error",
        message: "Forbidden",
      });
    }

    return Promise.reject(error);
  },
);
