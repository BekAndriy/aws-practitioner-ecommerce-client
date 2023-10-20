import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import Alerts from "~/utils/alert";

type CSVFileImportProps = {
  url: string;
  title: string;
  localStorageTokenKey?: string;
};

export default function CSVFileImport({
  url,
  title,
  localStorageTokenKey,
}: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    const token =
      localStorageTokenKey && localStorage.getItem(localStorageTokenKey);
    // Get the presigned URL
    const response = await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file?.name || ""),
      },
      ...(token
        ? {
            headers: {
              Authorization: token,
            },
          }
        : {}),
    });
    await fetch(response.data.url, {
      method: "PUT",
      body: file,
    });
    Alerts.instance.show({
      message: "Successfully uploaded",
      type: "success",
    });
    setFile(null);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
