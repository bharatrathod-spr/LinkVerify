import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes from "../../helpers/routes";
import NotFound from "../../pages/Error/NotFound";
import Loader from "../../components/Common/Loader";
import MetaTags from "../../components/Meta/MetaTags";
import { useAuth } from "../../hooks/useAuth";

const AppRoutes = () => {
  const { token, user, logout, error } = useAuth();

  useEffect(() => {
    if (error && !token && !user) {
      logout();
    }
  }, [token, user, error]);

  return (
    <Routes>
      {routes.map((route) => {
        if (!route.component) {
          route.component = NotFound;
        }

        return (
          <Route
            key={route.layout}
            path={route.layout}
            element={
              route.component ? (
                <route.component token={token} user={user} error={error} />
              ) : (
                <NotFound />
              )
            }
          >
            {route.pages.map((page, index) => {
              if (!page.component) {
                page.component = NotFound;
              }
              return (
                <Route
                  key={index}
                  path={page.path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <MetaTags title={page.title || ""} />
                      <page.component token={token} user={user} error={error} />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        );
      })}
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};

export default AppRoutes;
