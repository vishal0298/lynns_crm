import React from "react";
import ListVendors from "./listVendor";
import { ListvendorComponentController } from "./listVendor.control";

const ListvendorComponent = () => {
    return(
        <>
            <ListvendorComponentController>
                <ListVendors/>
            </ListvendorComponentController>
        </>
    )
}

export default ListvendorComponent;