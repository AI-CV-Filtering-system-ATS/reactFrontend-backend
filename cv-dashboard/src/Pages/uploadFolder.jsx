import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./uploadFolder.css";
import { FaFileUpload, FaSpinner, FaFilePdf, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import Background from "../Components/Background"; // Import the component


const UploadFolder = () => {
  const [files, setFiles] = useState([]);
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);

  // Fetch already uploaded CVs on component mount
  useEffect(() => {
    fetchUploadedCVs();
  }, []);

  const fetchUploadedCVs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/Esandu/cvs");
      setUploadedCVs(response.data.cvs || []);
    } catch (error) {
      console.error("Failed to fetch CVs", error);
    }
  };

  const onDrop = (acceptedFiles) => {
    // Filter only PDF files
    const pdfFiles = acceptedFiles.filter(file => 
      file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')
    );
    
    setFiles(pdfFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      alert("Please select PDF files to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/Esandu/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setUploadResults(response.data.results || []);
      await fetchUploadedCVs(); // Refresh the list of CVs
      setFiles([]); // Clear the file selection
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed: " + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
    }
  };

  const viewCVDetails = async (cvId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/Esandu/cv/${cvId}`);
      setSelectedCV(response.data);
    } catch (error) {
      console.error("Failed to fetch CV details", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <Background>
    <div className="upload-container">
      
      <hr />
      <hr />
      <hr />
      <div className="content">
        <h2 className="title">CV Processing System</h2>
        
        <div className="upload-section">
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <FaFileUpload className="upload-icon" />
              {isDragActive ? (
                <p>Drop the PDFs here...</p>
              ) : (
                <p>Drag & Drop CV files here or click to select</p>
              )}
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="selected-files">
              <h3>Selected Files ({files.length})</h3>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <FaFilePdf /> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            className="upload-button" 
            onClick={uploadFiles} 
            disabled={uploading || files.length === 0}
          >
            {uploading ? (
              <>
                <FaSpinner className="spinner" /> Processing...
              </>
            ) : (
              <>
                <FaFileUpload /> Upload & Process
              </>
            )}
          </button>
        </div>

        {uploadResults.length > 0 && (
          <div className="upload-results">
            <h3>Upload Results</h3>
            <div className="results-list">
              {uploadResults.map((result, index) => (
                <div key={index} className="result-item">
                  {result.error ? (
                    <>
                      <FaExclamationTriangle className="error-icon" />
                      <span>{result.filename}: {result.error}</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="success-icon" />
                      <span>{result.filename}</span>
                      <div className="possible-roles">
                        {result.possible_roles?.length > 0 ? (
                          <>
                            <strong>Possible roles:</strong>{" "}
                            {result.possible_roles.join(", ")}
                          </>
                        ) : (
                          <em>No specific roles identified</em>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="cv-library">
          <h3>CV Library</h3>
          
          <div className="cv-grid">
            {uploadedCVs.length > 0 ? (
              uploadedCVs.map((cv) => (
                <div 
                  key={cv.cv_id} 
                  className={`cv-card ${selectedCV?.cv_id === cv.cv_id ? 'selected' : ''}`}
                  onClick={() => viewCVDetails(cv.cv_id)}
                >
                  <div className="cv-icon">
                    <FaFilePdf />
                  </div>
                  <div className="cv-info">
                    <h4>{cv.file_name}</h4>
                    <div className="cv-roles">
                      {cv["Possible Job Roles"]?.length > 0 ? 
                        cv["Possible Job Roles"].slice(0, 2).map((role, index) => (
                          <span key={index} className="role-tag">{role.split(' (')[0]}</span>
                        ))
                        : <span className="no-roles">No specific roles</span>
                      }
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-cvs">
                <p>No CVs uploaded yet. Upload some files to get started!</p>
              </div>
            )}
          </div>
        </div>
        
        {selectedCV && (
          <div className="cv-detail-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedCV.file_name}</h3>
                <button className="close-button" onClick={() => setSelectedCV(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="cv-section">
                  <h4>Possible Job Roles</h4>
                  <ul className="roles-list">
                    {selectedCV["Possible Job Roles"]?.map((role, index) => (
                      <li key={index}>{role}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="cv-section">
                  <h4>CV Content</h4>
                  <div className="cv-text-content">
                    {selectedCV["Raw Text"]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Background>
  );
};

export default UploadFolder;