/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import ReactSelect from "react-select";
import { ApiServiceContext } from "../core/core-index";
import { styles } from "./Selectstyles";

const SelectBank = ({ value, onChange }) => {
  const { getData } = useContext(ApiServiceContext);

  const [bank, setBank] = useState([]);

  const getBankList = async () => {
    const bankList = await getData(BankSettings?.List);

    const newBankList = bankList?.data?.map((item) => {
      return { value: item.userId, label: item.name, id: item.userId };
    });

    setBank(newBankList);
  };

  useEffect(() => {
    getBankList();
  }, []);
  return (
    <ReactSelect
      styles={styles}
      className="w-100"
      options={bank}
      value={bank?.find((item) => item?.id == value)}
      placeholer={"Select Vendor"}
      onChange={(e) => {
        onChange(e);
      }}
    />
  );
};

export default SelectBank;
