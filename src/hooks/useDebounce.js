import { useEffect, useState } from "react";

const useDebounce = (value, ms = 400) => {
  const [v, setV] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setV(value), ms);

    return () => clearTimeout(timerId);
  }, [value, ms]);

  return v;
};

export default useDebounce;
