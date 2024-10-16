// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { customerApi } from "../../../../constans/apiname";
// import { useNavigate } from "react-router-dom";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
// import {addCustomerschema} from './addCustomerschema'


// const AddCustomerContext = createContext({
//   addCustomerschema: addCustomerschema,
//   onSubmit: () => {},
// });

// const AddCustomerComponentController = (props) => {
//   const {
//     setValue,
//     // eslint-disable-next-line no-unused-vars
//     formState: { errors },
//     handleSubmit,
//   } = useForm({
//     resolver: yupResolver(),
//   });

//   const [fileImage, setFileImage] = useState([]);
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();
//   const { postData } = useContext(ApiServiceContext);

//   // const [currencyOptions, setcurrencyOptions] = useState([
//   //   { value: 1, label: "₹" },
//   //   { value: 2, label: "$" },
//   //   { value: 3, label: "£" },
//   //   { value: 4, label: "€" },
//   // ]);
//   // const [copyData, setCopyData] = useState({
//   //   addressLine1: "",
//   //   addressLine2: "",
//   //   city: "",
//   //   country: "",
//   //   name: "",
//   //   pincode: "",
//   //   state: "",
//   // });

//   // const isNullish = Object.values(copyData).every((value) => {
//   //   if (value == "") {
//   //     return true;
//   //   }
//   //   return false;
//   // });

//   const getBase64 = (file) => {
//     return new Promise((resolve) => {
//       // eslint-disable-next-line no-unused-vars
//       let fileInfo;
//       let baseURL = "";
//       let reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         baseURL = reader.result;
//         resolve(baseURL);
//       };
//     });
//   };

//   useEffect(() => {
//     setValue();
//   }, []);
//   const onSubmit = async (datas) => {
//     console.log(data)
//     const data = Object.entries(datas).reduce((acc, [key, value]) => {
//       if (value !== undefined) {
//         acc[key] = value;
//       }
//       return acc;
//     }, {});
//     // ;

//     const image = fileImage?.[0];
//     // ;

//     // ;
//     const formData = new FormData();
//     // formData.append('User', JSON.stringify(data))
//     // formData.append("imageresult", image)
//     // formData.append("image", image);
//     formData.append("image", file == undefined ? "" : file);
//     // ), "parsed");
//     // const finalData = JSON.parse(formData.get('User'));
//     // finalData.image = image;
//     // ;

//     // data["image"] = image

//     // ;

//     const flattenObject = (obj, prefix = "") => {
//       for (const key in obj) {
//         // ;
//         // eslint-disable-next-line no-prototype-builtins
//         if (obj.hasOwnProperty(key) && key != "currency") {
//           const propKey = prefix ? `${prefix}[${key}]` : key;
//           const value = obj[key];
//           // ;
//           if (typeof value === "object" && value !== (null || undefined)) {
//             flattenObject(value, propKey);
//           } else {
//             const finalValue = value !== undefined ? value : "";
//             formData.append(propKey, finalValue);
//           }
//         } else if (key == "currency") {
//           // ;
//           formData.append("currency", obj[key].value);
//         }
//       }
//     };

//     flattenObject(data);

//     try {
//       const response = await postData(customerApi, formData);
//       if (response.code == 200) {
//         successToast("Customer Added  Successfully");
//         navigate("/customers");
//       }else{
//         errorToast(response?.data?.message)
//       }
//     } catch {
//       return false;
//     }
//   };

//   return (
//     <AddCustomerContext.Provider
//       value={{
//         addCustomerschema,
//         fileImage,
//         setFileImage,
//         // currencyOptions,
//         // setcurrencyOptions,
//         // copyData,
//         // setCopyData,
//         // isNullish,
//         getBase64,
//         onSubmit,
//         file,
//         setFile,
//       }}
//     >
//       {props.children}
//     </AddCustomerContext.Provider>
//   );
// };
// export { AddCustomerContext, AddCustomerComponentController };


/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { customerApi } from "../../../../constans/apiname";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import { addCustomerschema } from './addCustomerschema';

const AddCustomerContext = createContext({
  addCustomerschema: addCustomerschema,
  onSubmit: () => {},
});

const AddCustomerComponentController = (props) => {
  const {
    setValue,
    formState: { errors },
    handleSubmit,
    register,
    trigger
  } = useForm({
    resolver: yupResolver(addCustomerschema),
  });

  const [fileImage, setFileImage] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { postData } = useContext(ApiServiceContext);

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const onSubmit = async (datas) => {
    const data = Object.entries(datas).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const image = fileImage?.[0];

    const formData = new FormData();
    formData.append("image", file ?? "");

    const flattenObject = (obj, prefix = "") => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== "currency") {
          const propKey = prefix ? `${prefix}[${key}]` : key;
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            flattenObject(value, propKey);
          } else {
            formData.append(propKey, value ?? "");
          }
        } else if (key === "currency") {
          formData.append("currency", obj[key].value);
        }
      }
    };

    flattenObject(data);

    try {
      const response = await postData(customerApi, formData);
      if (response.code === 200) {
        successToast("Customer Added Successfully");
        navigate("/customers");
      } else {
        errorToast(response?.data?.message);
      }
    } catch (error) {
      errorToast("An error occurred while adding the customer.");
    }
  };

  return (
    <AddCustomerContext.Provider
      value={{
        addCustomerschema,
        fileImage,
        setFileImage,
        getBase64,
        onSubmit,
        file,
        setFile,
      }}
    >
      {props.children}
    </AddCustomerContext.Provider>
  );
};

export { AddCustomerContext, AddCustomerComponentController };
