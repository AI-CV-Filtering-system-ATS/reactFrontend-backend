import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Navbar from "../../components/navbar/navbar"; // Import Navbar
import "./uploadFolder.css"; // Import the CSS file

const UploadFolder = () => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    directory: true,
  });

  return (
    <div className="upload-container">
      <Navbar /> {/* Navbar will now be positioned above the background */}
      <div className="content">
        <h2>Upload CV Folder</h2>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} webkitdirectory="" directory="" />
          <p>Drag & Drop folder here or click to select folder</p>
        </div>
        <button className="upload-button" onClick={uploadFiles}>Upload</button>
      </div>
    </div>
  );
};

export default UploadFolder;