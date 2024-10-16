import React, { forwardRef, useContext, useEffect, useState } from "react";
import ReactSelect from "react-select";
import { ApiServiceContext, dropdown_api } from "../../../core/core-index";

const SelectDropDown = forwardRef((props) => {
  const {
    module,
    value,
    onChange,
    reference,
    setValue,
    name,
    id,
    goto,
    placeholder,
  } = props;
  const { getData, postData, patchData, putData, deleteData } =
    useContext(ApiServiceContext);
  const [dropDown, setDropDown] = useState([]);

  const getVendorList = async () => {
    const SelectList = await getData(
      module == "Customer"
        ? dropdown_api?.customer_api
        : module
        ? dropdown_api?.bank_api
        : dropdown_api?.vendor_api
    );
  
    const newList = SelectList?.data?.map((item) => {
      return prepareLabel(item);
    });
    setDropDown(newList);
    if (id) {
      let result = newList.find((item) => item?.id == id);
      setValue(name, result);
    }
  };

  const prepareLabel = (item) => {
    if (module == "Customer")
      return { value: item._id, label: item.name, id: item._id };
    else if (module)
      return { value: item._id, label: item.bankName, id: item._id };
    else return { value: item._id, label: item.vendor_name, id: item._id };
  };
  useEffect(() => {
    getVendorList();
  }, [id, goto]);

  const findVal = () => {
    return dropDown?.find((item) => item?.id == (id ? value?.id : value));
  };
  return (
    <>
      <ReactSelect
        // styles={styles}
        className={` w-100`}
        options={dropDown}
        value={findVal()}
        placeholder={placeholder}
        classNamePrefix="select_kanakku"
        onChange={(e) => {
          onChange(e);
        }}
        ref={reference}
      />
    </>
  );
});

export default SelectDropDown;
