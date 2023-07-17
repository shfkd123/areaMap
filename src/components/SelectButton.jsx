import React from "react";
import { Button, Select, Flex } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { isSiDoRecoil, isSiGunGuRecoil } from "../recoilState";

const SelectButton = (props) => {
  const data = props.jsonData.data;
  const SiDoData = [];
  const SiGunGuData = [];
  const setIsSiDo = useSetRecoilState(isSiDoRecoil);
  const setIsSiGunGu = useSetRecoilState(isSiGunGuRecoil);

  for (let i in data) {
    if (data[i].type) {
      const newItem = {
        code: data[i].code,
        name: data[i].name,
        type: data[i].type,
        parent: data[i].parent,
      };
      SiGunGuData.push(newItem);
    } else {
      const newItem = {
        code: data[i].code,
        name: data[i].name,
      };
      SiDoData.push(newItem);
    }
  }

  return (
    <Flex flexDirection={"row"}>
      {props.isSiDo && (
        <Select
          onChange={(e) => {
            setIsSiGunGu(true);
            props.selectSiDo(e); //시, 도 선택함수 실행
          }}
        >
          <option value="100">전체</option>
          {SiDoData.map((si) => {
            return (
              <option key={si.code} value={si.code}>
                {si.name}
              </option>
            );
          })}
        </Select>
      )}
      {/* {props.isSiDo && props.isSiGunGu && (
        <Select
          onChange={(e) => {
            props.selectSiGungu(e); //시, 도 선택함수 실행
          }}
        >
          <option value="100">전체</option>
          {SiGunGuData.map((si) => {
            return (
              <option key={si.code} value={si.code}>
                {si.name}
              </option>
            );
          })}
        </Select>
        )} */}
      <Button
        variant="btnAttr"
        onClick={() => {
          setIsSiDo((prev) => !prev);
        }}
      >
        지역선택
      </Button>
    </Flex>
  );
};

export default SelectButton;
