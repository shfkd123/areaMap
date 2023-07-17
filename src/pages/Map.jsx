import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  Center,
  Button,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { isSiDoRecoil, isSiGunGuRecoil, region } from "../recoilState";

const Map = () => {
  const [isSiDo, setIsSiDo] = useState(useRecoilValue(isSiDoRecoil));
  const [isSiGunGu, setIsSiGunGu] = useState(useRecoilValue(isSiGunGuRecoil));
  const [regionData, setRegionData] = useState(useRecoilValue(region));
  const [isOpenSelectBox, setIsOpenSelectBox] = useState(false);
  const [isOpenSelectBox2, setIsOpenSelectBox2] = useState(false);
  const [isOpenSelectBox3, setIsOpenSelectBox3] = useState(false);
  const mapRef = useRef(null);
  const { naver } = window;

  useEffect(() => {
    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(35.3595704, 127.55399),
      zoom: 7,
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    let updatedRegionData = [];

    await axios.get("./data/sido_test.json").then(function (response) {
      response.data.forEach((el) => {
        updatedRegionData.push({
          ["code"]: el.code,
          ["name"]: el.name,
          ["parent"]: "00",
          ["type"]: "sido",
          ["polygon"]: el.polygon,
        });
      });
    });

    await axios.get("./data/sigungu_test.json").then(function (response) {
      response.data.forEach((el) => {
        updatedRegionData.push({
          ["code"]: el.code,
          ["name"]: el.name,
          ["parent"]: el.parent,
          ["type"]: el.type,
          ["polygon"]: el.polygon,
        });
      });
    });
    setRegionData(updatedRegionData);
  };

  const polygonDraw = useCallback(() => {
    const temp = regionData?.filter(
      (data) => data.code === "11" || data.code === "41"
    );

    for (let i in temp) {
      const json = JSON.parse(temp[i].polygon);
      const newPath = [];
      for (let j in json) {
        newPath.push(new naver.maps.LatLng(json[j][1], json[j][0]));
      }

      new naver.maps.Polygon({
        map: mapRef.current,
        paths: newPath,
        fillColor: "#3f5ee9",
        fillOpacity: 0.6,
        strokeColor: "#ffffff",
        strokeOpacity: 0.6,
        strokeWeight: 3,
      });
    }
    // temp.forEach((data) => {
    //   const json = JSON.parse(data.polygon);
    //   console.log(json);
    //   for (const j in json) {
    //     newPath.push(new naver.maps.LatLng(json[j][1], json[j][0]));
    //   }
    // });
  }, [regionData]);

  useEffect(() => {
    polygonDraw();
  }, [regionData]);

  return (
    <Box w="100%" h="100vh" position="relative">
      <Box id="map" h="100%" />
      <Center>
        <Box
          w="600px"
          h="200px"
          bg="white"
          position="absolute"
          bottom="100px"
          borderRadius="15px"
          display={
            isOpenSelectBox || isOpenSelectBox2 || isOpenSelectBox3
              ? "block"
              : "none"
          }
        >
          <Flex>
            <Box w="550px" h="200px" bg="white" borderLeftRadius="15px">
              <Box
                h="30px"
                borderBottom="2px solid black"
                fontWeight="600"
                m="5px"
              >
                시/도 선택
              </Box>
              <Box w="300px" h="150px" overflowY="scroll" overflowX="hidden">
                <UnorderedList w="100%" m="5px">
                  {regionData
                    ?.filter((data) => data.type === "sido")
                    .map((data) => (
                      <ListItem
                        key={data.code}
                        w="50%"
                        display="inline-block"
                        borderBottom="1px solid lightgray"
                      >
                        <Button
                          h="15px"
                          w="90%"
                          bg={isSiDo === data.code ? "#A6DBFA" : "white"}
                          fontWeight="500"
                          onClick={() => setIsSiDo(data.code)}
                        >
                          {data.name}
                        </Button>
                      </ListItem>
                    ))}
                </UnorderedList>
              </Box>
            </Box>
            <Box h="200px" bg="white" borderRightRadius="15px">
              <Box
                h="30px"
                borderBottom="2px solid black"
                fontWeight="600"
                m="5px"
              >
                시/군/구 선택
              </Box>
              <Box w="400px" h="150px" overflowY="scroll" overflowX="hidden">
                <UnorderedList w="100%" m="5px">
                  {regionData
                    ?.filter(
                      (data) =>
                        data.type === "sigungu" && data.parent === isSiDo
                    )
                    .map((data) => (
                      <ListItem
                        key={data.code}
                        w="50%"
                        display="inline-block"
                        borderBottom="1px solid lightgray"
                      >
                        <Button
                          h="15px"
                          w="90%"
                          bg={isSiGunGu === data.code ? "#A6DBFA" : "white"}
                          fontWeight="500"
                          onClick={() => setIsSiGunGu(data.code)}
                        >
                          {data.name}
                        </Button>
                      </ListItem>
                    ))}
                </UnorderedList>
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box position="absolute" bottom="30px">
          <Button
            name="btn1"
            variant="btnAttr"
            onClick={() => {
              setIsOpenSelectBox(
                (prev) => !prev,
                setIsOpenSelectBox2(false),
                setIsOpenSelectBox3(false)
              );
            }}
          >
            버튼1
          </Button>
          <Button
            name="btn2"
            variant="btnAttr"
            onClick={() => {
              setIsOpenSelectBox2(
                (prev) => !prev,
                setIsOpenSelectBox(false),
                setIsOpenSelectBox3(false)
              );
            }}
          >
            버튼2
          </Button>
          <Button
            name="btn3"
            variant="btnAttr"
            onClick={() => {
              setIsOpenSelectBox3(
                (prev) => !prev,
                setIsOpenSelectBox(false),
                setIsOpenSelectBox2(false)
              );
            }}
          >
            버튼3
          </Button>
        </Box>
      </Center>
    </Box>
  );
};

export default Map;
