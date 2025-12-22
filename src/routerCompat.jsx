import React from "react";
import {
  BrowserRouter,
  Routes,
  Route as RouteV6,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";

// Minimal v5-like API built on top of React Router v6 primitives
export function Switch({ children }) {
  return <Routes>{children}</Routes>;
}

function RouteRenderer({ component: Component, render, children }) {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const match = { params };

  const props = { history, location, match };

  if (Component) return <Component {...props} />;
  if (typeof render === "function") return render(props);
  if (typeof children === "function") return children(props);

  return children || null;
}

export function Route({ component, render, children, ...rest }) {
  return (
    <RouteV6
      {...rest}
      element={<RouteRenderer component={component} render={render}>{children}</RouteRenderer>}
    />
  );
}

export function Redirect({ to, push = true }) {
  return <Navigate to={to} replace={!push} />;
}

export function useHistory() {
  const navigate = useNavigate();

  return {
    push: (to) => navigate(to),
    replace: (to) => navigate(to, { replace: true }),
    go: (n) => navigate(n),
    goBack: () => navigate(-1),
    length: 0,
    action: "POP",
    location: useLocation(),
  };
}

export { BrowserRouter, useLocation, useParams };
