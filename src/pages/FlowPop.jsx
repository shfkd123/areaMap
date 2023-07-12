import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { COLOR_DATA } from "./colorData";
import axios from "axios";

const FlowPop = () => {
  const [flowPopData, setFlowPopData] = useState([]);
  const [zoomValue, setZoomValue] = useState(17);
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const testRef = useRef(null);
  const { naver } = window;
  const flowLevelIcons = {
    1: '<img src="./icon/yellowDot.png" width="10px" height="10px" alt="유동 인구"/>',
    2: '<img src="./icon/greenDot.png" width="10px" height="10px" alt="유동 인구"/>',
    3: '<img src="./icon/blueDot.png" width="10px" height="10px" alt="유동 인구"/>',
    4: '<img src="./icon/purpleDot.png" width="10px" height="10px" alt="유동 인구"/>',
    5: '<img src="./icon/redDot.png" width="10px" height="10px" alt="유동 인구"/>',
  }; 

  useEffect(() => {
    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.5739662, 126.9883924),
      zoom: zoomValue,
    });

    axios.get("./data/flowpop.json").then(function (response) {
      setFlowPopData(response.data);
    });

    naver.maps.Event.addListener(mapRef.current, "zoom_changed", function () {
      setZoomValue(mapRef.current.getZoom());
      console.log("test");
    });

    return () => {
      
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !flowPopData?.length > 0) return;
    // console.log("zoomlevel이 몇이야", zoomValue);
    if (zoomValue >= 17) {
      testRef.current !== null && testRef.current.setMap(null);
      testRef.current = null;
      positionFunc(mapRef.current);
    } else if (zoomValue < 17) {
      // naver.maps.Marker = null;
      markerRef.current.length > 0 &&
        markerRef.current.map((marker) => marker.setMap(null));
      markerRef.current = [];
      zoomFunc(mapRef.current);
    }
  }, [flowPopData, mapRef, zoomValue]);

  const positionFunc = useCallback(
    (map) => {
      if (flowPopData.length === 0) return;

      // const htmlMarker1 = {
      //     content: [
      //       `<div style='width: 40px; height: 40px; border-radius: 50%;  background: #b08fc5;
      //                  display: flex; align-items: center; justify-content: center'>`,
      //       `<span style='color: white; font-size: 0.875rem'>1</span>`,
      //       `</div>`,
      //     ].join(""),
      //     size: new naver.maps.Size(40, 40),
      //     anchor: new naver.maps.Point(20, 20),
      //   },
      //   htmlMarker2 = {
      //     content: [
      //       `<div style='width: 40px; height: 40px; border-radius: 50%;  background: #cdbdd7;
      //                  display: flex; align-items: center; justify-content: center'>`,
      //       `<span style='color: white; font-size: 0.875rem'>2</span>`,
      //       `</div>`,
      //     ].join(""),
      //     size: new naver.maps.Size(40, 40),
      //     anchor: new naver.maps.Point(20, 20),
      //   };

      for (const i in flowPopData) {
        const marker = new naver.maps.Marker({
          map: map,
          position: new naver.maps.LatLng(
            flowPopData[i].yAxis,
            flowPopData[i].xAxis
          ),
          icon: {
            content: flowLevelIcons[flowPopData[i].flowLv],
          },
        });

        markerRef.current.push(marker);

        // new naver.maps.MarkerClustering({
        //   minClusterSize: 18,
        //   maxZoom: 20,
        //   map: map,
        //   markers: markers,
        //   disableClickZoom: false,
        //   gridSize: 120,
        //   icons: [htmlMarker1, htmlMarker2],
        //   indexGenerator: [10, 100, 200, 500, 1000],
        //   stylingFunction: function (clusterMarker, count) {
        //     clusterMarker.getElement().querySelector("span").textContent =
        //       count;
        //   },
        // });
      }
    },
    [flowPopData]
  );

  const zoomFunc = useCallback(
    (map) => {
      const test = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(37.5739662, 126.9883924),
        icon: {
          content:
            '<img src="./icon/blueDot.png" width=100px" height="100px" alt="전체" style="opacity: 0.4;"/>',
        },
      });

      testRef.current = test;
    },
    [zoomValue]
  );

  return (
    <Box pos="relative">
      <Box
        pos={"absolute"}
        top={"20px"}
        left={"20px"}
        zIndex={"1"}
        bg={"white"}
        border={"1px solid black"}
      >
        <Center>유동인구</Center>
        {COLOR_DATA.map((color) => {
          return (
            <Flex flexDirection={"row"} margin={"5px"} key={color.id}>
              <img
                src={color.src}
                alt={color.alt}
                width={"30px"}
                style={{ marginRight: "3px" }}
              />
              <span>{color.value}</span>
            </Flex>
          );
        })}
      </Box>
      <Box id="map" w={"100%"} h={"100vh"} zIndex={"0"} />
    </Box>
  );
};

export default FlowPop;
