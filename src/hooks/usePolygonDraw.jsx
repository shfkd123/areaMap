import { useState } from "react";

const usePolygonDraw = (initialValue) => {
  const [inputData, setInputData] = useState(initialValue);

  const handleState = ({ target }) => {
    const { name, value } = target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const initState = () => {
    setInputData(initialValue);
  };

  return [inputData, handleState, initState];
};

export default usePolygonDraw;
