import { useSelector } from "react-redux";
import { Route, Redirect } from "../routerCompat";

// React Router v5 benzeri Protected Route
export default function ProtectedRoute({ component: Component, ...rest }) {
  const user = useSelector((s) => s.client?.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
