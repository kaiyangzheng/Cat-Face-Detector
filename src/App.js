import React, {useState, useEffect, useRef} from 'react';
import {ClipLoader} from 'react-spinners'
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileImg, setFileImg] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedId, setUploadedId] = useState('');
  const [downloadedImg, setDownloadedImg] = useState('');
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current.click();
  }

  const handleFileChange = (e) => {
    setUploaded(false);
    setUploadedId('');
    setDownloadedImg('');
    const file = e.target.files;
    setSelectedFile(file[0]);
    setFileImg(URL.createObjectURL(file[0]))
  }

  const handleDeleteImg = () => {
    setUploaded(false);
    setSelectedFile(null);
    setUploadedId('');
    setDownloadedImg('');
  }

  const handleUpload = async () => {
    setUploading(true);
    var formdata = new FormData();
    formdata.append("file", selectedFile, selectedFile.name);
    
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    
    fetch("https://cat-face-detector.herokuapp.com/upload", requestOptions)
      .then(response => response.text())
      .then(result => {
        setUploaded(true);
        setUploading(false);
        setUploadedId(JSON.parse(result).ID);
        console.log(result);
      })
      .catch(error => console.log('error', error));
  }

  const handleDownload = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://cat-face-detector.herokuapp.com/download/${uploadedId}`, requestOptions)
      .then(response => response.blob())
      .then(result => {
        const imageUrl = URL.createObjectURL(result);
        setDownloadedImg(imageUrl);
        console.log(imageUrl);
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="App">
      <div className="container">
        <div className="card">
          <h3>Upload Cat Image</h3>
          <div className="drop-box">
            {!selectedFile && <h4>Select Image File</h4>}
            <p>Files Supported: PNG, JPG</p>
            <input type="file" hidden accept=".jpg,.jpeg,.png" ref={inputRef} onChange={handleFileChange}/>
            <button className="btn" onClick={handleClick}>Choose File</button>
          </div>
          {selectedFile && 
          <div className="fileInfoContainer">
            <div className="ImgContainer">
              <img src={fileImg} alt="" className="uploadedImg"/>
              <div className="fileInfo">
                <span>{selectedFile.name}</span>
                <span>{selectedFile.size/1000} KB</span>
              </div>
            </div>
            <div className="loadingContainer">
              <ClipLoader loading={uploading} size={10}/>
            </div>
            <div className="btnContainer">
              <i className="fa fa-times delete" aria-hidden="true" onClick={handleDeleteImg}></i>
              {!uploaded ? 
              <i className="fa-solid fa-cat faceDetect" onClick={handleUpload}></i>    
              :
              <i className="fa fa-download ready" aria-hidden="true" onClick={handleDownload}></i>}    
            </div>
          </div>}
        </div>
      </div>
      {downloadedImg && <div className="modal">
        <div className="modal-button">
          <i className="fa-solid fa-x close-btn" onClick={() => setDownloadedImg('')}></i>
        </div>
        <div className="modal-content">
          <img src={downloadedImg} alt="" className="modal-img"/>
        </div>
      </div>}
    </div>
  );
}

export default App;
