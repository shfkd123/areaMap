import React, { useEffect, useState, useRef } from "react";
import { Box, Center } from "@chakra-ui/react";
import SelectButton from "../components/SelectButton";
import axios from "axios";

const Map = () => {
  const [jsonData, setJsonData] = useState([]);
  const [selectedSiDo, setSelectedSiDo] = useState(0);
  const [openIdx, setOpenIdx] = useState(-1);
  //const [selectedSiGunGu, setSelectedSiGunGu] = useState(1);

  //centerFocus, zoomState 또한 각각의 지역이나 위치에 따라 바뀌어야 해서 state로 관리
  const [centerFocus, setCenterFocus] = useState([36.3595704, 127.55399]);
  const [zoomState, setZoomState] = useState(7);
  const [isSiDo, setisSiDo] = useState(false);
  const [isSiGunGu, setisSiGunGu] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;

    const mapOptions = {
      center: new naver.maps.LatLng(centerFocus[0], centerFocus[1]),
      zoom: zoomState,
    };
    const mapData = new window.naver.maps.Map(map, mapOptions);

    callData("./data/sido_test.json", mapData);

    // if (isSiDo && isSiGunGu) {
    //   callData("./data/sigungu_test.json", mapData);
    // }
  }, [selectedSiDo]);

  //calldata
  const callData = (url, mapData) => {
    let json = "";
    axios.get(url).then(function (response) {
      setJsonData(response); // 데이터 props로 넘기기 위해 state 저장
      for (let i in response.data) {
        json = JSON.parse(response.data[i].polygon);
        if (selectedSiDo === 0 || selectedSiDo === "100") {
          polygonDraw(json, mapData);
        } else if (selectedSiDo === response.data[i].code) {
          polygonDraw(json, mapData);
        }
      }
    });
  };

  //polygon 영역 색 칠하는 함수
  const polygonDraw = (json, mapData) => {
    const newPath = [];
    for (let j in json) {
      newPath.push(new naver.maps.LatLng(json[j][1], json[j][0]));
    }

    new naver.maps.Polygon({
      map: mapData,
      paths: newPath,
      fillColor: "#3f5ee9",
      fillOpacity: 0.6,
      strokeColor: "#ffffff",
      strokeOpacity: 0.6,
      strokeWeight: 3,
    });
  };

  //시,도 선택 함수
  const selectSiDo = (e) => {
    setSelectedSiDo(e.target.value);
  };

  //시군구 선택 함수
  // const selectSiGungu = (e) => {
  //   setSelectedSiGunGu(e.target.value);
  // };

  return (
    <Box w="100%" h="85vh">
      <Box ref={mapRef} h="100%" position="relative" />
      <Center>
        <SelectButton
          jsonData={jsonData}
          selectSiDo={selectSiDo}
          isSiDo={isSiDo}
          setisSiDo={setisSiDo}
          isSiGunGu={isSiGunGu}
          setisSiGunGu={setisSiGunGu}
          // selectSiGungu={selectSiGungu}
        />
        {/* <ButtonTest jsonData={jsonData} selectSiDo={selectSiDo} />
        <ButtonTest jsonData={jsonData} selectSiDo={selectSiDo} /> */}
      </Center>
      {openIdx === 0 && <></>}
      {openIdx === 1 && <></>}
      {openIdx === 2 && <></>}
    </Box>
  );
};

export default Map;
