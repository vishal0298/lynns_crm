import React from "react";
import { Link } from "react-router-dom";

export function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return <Link>Previous</Link>;
  }
  if (type === "next") {
    return <Link>Next</Link>;
  }
  return originalElement;
}

export function onShowSizeChange() {}
