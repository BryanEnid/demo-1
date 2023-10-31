import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Convert the query parameters to an object
  const queryParamsObject = {};
  queryParams.forEach((value, key) => {
    queryParamsObject[key] = value;
  });

  return queryParamsObject;
};
