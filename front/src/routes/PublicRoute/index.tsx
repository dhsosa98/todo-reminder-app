import { useContext } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectAuth } from "../../features/authSlice";

export function PublicRoute() {
  const { isAuthenticated } = useSelector(selectAuth);

  return !isAuthenticated ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}
