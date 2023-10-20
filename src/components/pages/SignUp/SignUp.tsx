import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alerts from "~/utils/alert";
import Auth from "~/utils/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    let redirectUrl = Promise.resolve("/");
    if (code) {
      redirectUrl = Auth.instance
        .initUserByCode(code)
        .then(() => "/admin/products")
        .catch(() => {
          Alerts.instance.show({
            type: "error",
            message: "Failed to authorize.",
          });
          return "/";
        });
    }
    redirectUrl.then(navigate);
  }, []);

  return null;
}
