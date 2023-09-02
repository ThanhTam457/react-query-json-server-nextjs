'use client'
import { useEffect } from "react";

const ImportBsJS = () => {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
      }, []);

    return null;
}
 
export default ImportBsJS;