import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

const Map = () => {
  useEffect(() => {
    const mapDiv = document.getElementById("map");
    new window.naver.maps.Map(mapDiv);
  }, []);

  return (
    <Box>
      <Box id="map" w="100%" h="900px" />
    </Box>
  );
};

export default Map;
