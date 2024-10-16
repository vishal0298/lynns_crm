/* eslint-disable react/prop-types */

import React from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

// eslint-disable-next-line react/prop-types
const TableRows = ({
  rowsData,
  deleteTableRows,
  myRefs,
  editModal,
  register,
  handleChange,
}) => {

  return (
    <>
      {
        rowsData.map((data, index) => {
          const { quantity, productInfo } = data;
          return productInfo && Object.keys(productInfo).length != 0 ? (
            <tr key={index}>
              <td>
                {productInfo?.text}
                <input
                  {...register(`items.${index}.productId`)}
                  type="hidden"
                  value={productInfo?.id}
                  onChange={(evnt) => handleChange(index, evnt)}
                />
              </td>
              <td>
                <input
                  {...register(`items.${index}.quantity`)}
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => {
                    handleChange(index, e);
                  }}
                />
              </td>
              <td>Pcs</td>
              <td>
                {productInfo?.rate}
                <input
                  {...register(`items.${index}.rate`)}
                  ref={(el) => (myRefs.current[`${index}_rate`] = el)}
                  type="text"
                  onChange={(evnt) => handleChange(index, evnt)}
                  value={productInfo?.rate}
                />
              </td>
              <td>
                {productInfo?.discount}
                <input
                  {...register(`items.${index}.discount`)}
                  type="hidden"
                  onChange={(evnt) => handleChange(index, evnt)}
                  value={productInfo?.discount}
                />
              </td>
              <td>
                {productInfo?.tax}
                <input
                  {...register(`items.${index}.tax`)}
                  type="hidden"
                  value={productInfo?.tax}
                  onChange={(evnt) => handleChange(index, evnt)}
                />
              </td>
              <td>$122.00</td>
              <td className="d-flex align-items-center">
                <Link
                  to="#"
                  className="btn-action-icon me-2"
                  onClick={() => editModal(index, productInfo)}
                  data-bs-toggle="modal"
                  data-bs-target="#add_discount"
                >
                  <span>
                    <FeatherIcon icon="edit" />
                  </span>
                </Link>
                <Link
                  to="#"
                  className="btn-action-icon"
                  onClick={() => deleteTableRows(index)}
                >
                  <span>
                    <FeatherIcon icon="trash-2" />
                  </span>
                </Link>
              </td>
            </tr>
          ) : (
            <></>
          );
        })
      }
    </>
  );
};
export default TableRows;
