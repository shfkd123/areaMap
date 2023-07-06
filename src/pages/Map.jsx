import React, { useEffect, useState } from "react";
import { Box, Center } from "@chakra-ui/react";
import Button from "../components/Button";
import axios from "axios";

const Map = () => {
  const [sigungu, setSigungu] = useState([]);

  useEffect(() => {
    const mapDiv = document.getElementById("map");
    const mapOptions = {
      center: new naver.maps.LatLng(36.3595704, 127.55399),
      zoom: 8,
    };
    new window.naver.maps.Map(mapDiv, mapOptions);

    const url = "./data/sigungu_test.json";
    axios.get(url).then((response) => console.log(response));
  }, []);

  return (
    <Box>
      <Box id="map" w="100%" h="90vh" />
      <Center>
        <Button />
      </Center>
    </Box>
  );
};

export default Map;
