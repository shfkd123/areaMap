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
import {
  isSiDoRecoil,
  isSiGunGuRecoil,
  // isSiDoRecoil2,
  // isSiGunGuRecoil2,
  // isSiDoRecoil3,
  // isSiGunGuRecoil3,
  region,
} from "../recoilState";

const Map = () => {
  const [isSiDo, setIsSiDo] = useState(useRecoilValue(isSiDoRecoil));
  const [isSiGunGu, setIsSiGunGu] = useState(useRecoilValue(isSiGunGuRecoil));
  // const [isSiDo2, setIsSiDo2] = useState(useRecoilValue(isSiDoRecoil2));
  // const [isSiGunGu2, setIsSiGunGu2] = useState(
  //   useRecoilValue(isSiGunGuRecoil2)
  // );
  // const [isSiDo3, setIsSiDo3] = useState(useRecoilValue(isSiDoRecoil3));
  // const [isSiGunGu3, setIsSiGunGu3] = useState(
  //   useRecoilValue(isSiGunGuRecoil3)
  // );
  const [regionData, setRegionData] = useState(useRecoilValue(region));
  const [isOpenSelectBox, setIsOpenSelectBox] = useState(false);
  const [isOpenSelectBox2, setIsOpenSelectBox2] = useState(false);
  const [isOpenSelectBox3, setIsOpenSelectBox3] = useState(false);
  const [bgColor, setBgColor] = useState("white");
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const { naver } = window;

  useEffect(() => {
    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(35.3595704, 127.55399),
      zoom: 7,
    });

    fetchData();
  }, [isSiDo, isSiGunGu]);

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

  useEffect(() => {
    const filterData = filterDataCondition(isSiDo, isSiGunGu);
    polygonDraw(filterData);
  }, [regionData, isSiDo, isSiGunGu]);

  const filterDataCondition = (isSiDo, isSiGunGu) => {
    const filterData = regionData?.filter((data) => {
      if (
        isSiDo &&
        !isSiGunGu &&
        data.code === isSiDo &&
        data.type === "sido"
      ) {
        return true;
      } else if (
        isSiGunGu === "0000" &&
        data.parent === isSiDo &&
        data.type === "sigungu"
      ) {
        return true;
      } else if (
        isSiDo &&
        isSiGunGu &&
        data.code === isSiGunGu &&
        data.parent === isSiDo
      ) {
        return true;
      } else if (!isSiDo && !isSiGunGu && data.parent === "00") {
        return true;
      }
      return false;
    });
    return filterData;
  };

  const polygonDraw = useCallback(
    (filterData) => {
      let newPath = [];

      filterData.map((item) => {
        const { polygon } = item;
        const jsonData = JSON.parse(polygon);
        const jsonDataValue = Object.values(jsonData);

        // if (isSiDo !== "28" || isSiDo !== "46") { //인천 : 28 / 전라남도 : 46

        // }
        newPath = jsonDataValue.map(
          (json) => new naver.maps.LatLng(json[1], json[0])
        );

        const polyGon = new naver.maps.Polygon({
          map: mapRef.current,
          paths: newPath,
          // fillColor: "#",
          // fillOpacity: 0.3,
          strokeColor: "#FF4800",
          strokeOpacity: 0.6,
          strokeWeight: 3,
          clickable: true,
        });

        const centerValueY =
          (Object.values(polyGon.getBounds()._min)[0] +
            Object.values(polyGon.getBounds()._max)[0]) /
          2;
        const centerValueX =
          (Object.values(polyGon.getBounds()._min)[2] +
            Object.values(polyGon.getBounds()._max)[2]) /
          2;

        const centerLatLng = new naver.maps.LatLng(centerValueY, centerValueX);

        if (isSiDo && !isSiGunGu) {
          mapRef.current.panTo(centerLatLng);
          mapRef.current.setCenter(centerLatLng);
          mapRef.current.setZoom(9);
        } else if (isSiDo && isSiGunGu) {
          mapRef.current.panTo(centerLatLng);
          mapRef.current.setCenter(centerLatLng);
          mapRef.current.setZoom(11);
        }

        naver.maps.Event.addListener(polyGon, "mouseover", function () {
          polyGon.setOptions({
            fillColor: "#FF4800",
            fillOpacity: 0.3,
            // strokeColor: "#fff",
            // strokeOpacity: 0.6,
          });

          const marker = new naver.maps.Marker({
            map: mapRef.current,
            position: centerLatLng,
            icon: {
              content: `<button style="font-size:1.3rem; font-weight: 600;">${item.name}</button>`,
              size: new naver.maps.Size(100, 100),
              anchor: new naver.maps.Point(20, 40),
            },
          });

          markerRef.current.push(marker);
        });

        naver.maps.Event.addListener(polyGon, "mouseout", function () {
          markerRef.current.forEach((marker) => marker.setMap(null));
          markerRef.current = [];
          polyGon.setOptions({
            fillOpacity: 0,
            strokeColor: "#FF4800",
            strokeOpacity: 0.6,
            strokeWeight: 3,
            clickable: true,
          });
        });

        naver.maps.Event.addListener(polyGon, "click", function () {
          // console.log(item.code);
          //setIsSiDo(item.code);

          const centerValueY =
            (Object.values(polyGon.getBounds()._min)[0] +
              Object.values(polyGon.getBounds()._max)[0]) /
            2;
          const centerValueX =
            (Object.values(polyGon.getBounds()._min)[2] +
              Object.values(polyGon.getBounds()._max)[2]) /
            2;

          const centerLatLng = new naver.maps.LatLng(
            centerValueY,
            centerValueX
          );

          mapRef.current.panTo(centerLatLng);
          mapRef.current.setCenter(centerLatLng);
          mapRef.current.setZoom(9);

          polyGon.setOptions({
            fillColor: "#7ED957",
            fillOpacity: 0.3,
            strokeColor: "#fff",
            strokeOpacity: 0.1,
          });
        });
      });
    },
    [regionData, isSiDo, isSiGunGu]
  );

  useEffect(() => {
    if (isOpenSelectBox) {
      setBgColor("#3f5ee9");
    } else if (isOpenSelectBox2) {
      setBgColor("#7ED957");
    } else if (isOpenSelectBox3) {
      setBgColor("#FFC000");
    }
  }, [isOpenSelectBox, isOpenSelectBox2, isOpenSelectBox3]);

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
              <Flex h="30px" borderBottom="2px solid black" m="5px">
                <Box
                  w="20px"
                  h="20px"
                  bg={bgColor}
                  border="1px solid black"
                  marginTop="2px"
                  marginLeft="5px"
                  marginRight="5px"
                />
                <Box fontWeight="600">시/도 선택</Box>
              </Flex>

              <Box w="300px" h="150px" overflowY="scroll" overflowX="hidden">
                <UnorderedList w="100%" m="5px">
                  <ListItem
                    w="100%"
                    display="inline-block"
                    borderBottom="1px solid lightgray"
                  >
                    <Button
                      h="15px"
                      w="45%"
                      m="2.5px"
                      bg={isSiDo === "00" ? "#A6DBFA" : "white"}
                      fontWeight="500"
                      onClick={() => {
                        setIsSiDo("");
                        setIsSiGunGu("");
                      }}
                    >
                      전체
                    </Button>
                    {regionData
                      ?.filter((data) => data.type === "sido")
                      .map((data) => (
                        <Button
                          key={data.code}
                          h="15px"
                          w="45%"
                          m="2.5px"
                          bg={isSiDo === data.code ? "#A6DBFA" : "white"}
                          fontWeight="500"
                          onClick={() => {
                            setIsSiDo(data.code);
                            setIsSiGunGu("");
                          }}
                        >
                          {data.name}
                        </Button>
                      ))}
                  </ListItem>
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
                  <ListItem
                    w="100%"
                    display="inline-block"
                    borderBottom="1px solid lightgray"
                  >
                    <Button
                      h="15px"
                      w="45%"
                      m="2.5px"
                      bg="white"
                      fontWeight="500"
                      onClick={() => {
                        setIsSiDo((prev) => prev);
                        isSiDo ? setIsSiGunGu("0000") : setIsSiGunGu("");
                      }}
                    >
                      {isSiDo === "00" || isSiDo === ""
                        ? "시/도를 선택하세요"
                        : "전체"}
                    </Button>
                    {regionData
                      ?.filter(
                        (data) =>
                          data.type === "sigungu" && data.parent === isSiDo
                      )
                      .map((data) => (
                        <Button
                          key={data.code}
                          h="15px"
                          w="45%"
                          m="2.5px"
                          bg={isSiGunGu === data.code ? "#A6DBFA" : "white"}
                          fontWeight="500"
                          onClick={() => {
                            setIsSiGunGu(data.code);
                            setIsOpenSelectBox(false);
                            setIsOpenSelectBox2(false);
                            setIsOpenSelectBox3(false);
                          }}
                        >
                          {data.name}
                        </Button>
                      ))}
                  </ListItem>
                </UnorderedList>
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box position="absolute" bottom="30px">
          <Button
            name="btn1"
            variant="btnAttr"
            bg="#3f5ee9"
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
            bg="#7ED957"
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
            bg="#FFC000"
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
