import { useEffect, useState } from "react";

export default function useFilePreview(file, setlogoImgError, field) {
  try {
    const [imgSrc, setImgSrc] = useState(null);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (file && file?.[0]) {
        if (file?.[0]?.type == "image/jpeg" || file?.[0]?.type == "image/png") {
          const newUrl = URL.createObjectURL(file[0]);

          if (newUrl !== imgSrc) {
            setImgSrc(newUrl);
            if (field == "FIRST") setlogoImgError("");
          }
        } else {
          setImgSrc(null);
          if (field == "FIRST")
            setlogoImgError("Please choose followed types png,jpg,jpeg.");
        }
      }
    }, [file]);

    return [imgSrc, setImgSrc];
  } catch (err) {
    /* empty */
  }
}
