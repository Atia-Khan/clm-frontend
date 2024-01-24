import React, { useState,useEffect } from 'react';
import { Typography, Select, MenuItem, Input, Button } from '@mui/material';
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import Header from '../Header/header';
import SideNavbar from '../Sidebar/Sidebar';

function Newdoc() {
    const [selectedOption, setSelectedOption] = useState('');
    const [fileList, setFileList] = useState([]);
    const [owner, setOwner] = useState('');
    const [folder, setFolder] = useState('');
    const [type, setType] = useState('');
    const[user,setuser]=useState({});
    const [privacy, setPrivacy] = useState('');
    const obj = JSON.parse(localStorage.getItem("user"));
    console.log(obj);
    useEffect(() => {
        if (obj) {
        setuser(obj); // Set the 'user' state after component mount
        }
    }, [obj]);
    const handleOwnerChange = (e) => {
        setOwner(e.target.value);
    };
    const navigate=useNavigate();
    const handleCreateBlankDocument=()=>{
        navigate('/wordDocx')
    }

    const handleFolderChange = (e) => {
        setFolder(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handlePrivacyChange = (e) => {
        setPrivacy(e.target.value);
    };

    const handleDropdownChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files) {
            setFileList([...fileList, ...files]);
        }
    };
    return (
        <div id="FIleUpload" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
                        {/* */}
            <div style={{ marginRight: '45%', textAlign: 'center' }}>
                <Typography variant="h4" style={{fontSize:'25px',marginLeft:'12px', marginBottom: '10px', marginTop: '50px', color: 'black' }}>
                    Create New Document
                <hr style={{ border: '1px solid #ccc', width: '90%', marginLeft: '38%',marginTop:'2%',marginBottom:'3%' }} />
                </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ margin: '0 12px',marginRight:'30%',height:'60%',width:'100%' }}>
                    <div style={{ padding: '20px',height:'-10%', overflowX: 'auto' }}>
                        <div style={{ marginLeft: '20px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginTop: '4px', marginLeft: '31%'}}>
                                    <label style={{ fontSize: '18px',marginRight:'63%' }}>Owner</label>
                                    <br />
                                    <Select
                                        value={owner}
                                        onChange={handleOwnerChange}
                                        style={{ height: '30px', border: '1px solid #ccc',width:'200px', backgroundColor: 'white', outline: 'none', marginLeft: '10px' }}
                                    >
                                        <MenuItem value="name">{user.last_name}</MenuItem>
                                    </Select>
                                </div>
                                {/* Folder Work */}
                                <div style={{ marginTop: '4px', marginLeft: '8px' }}>
                                    <label style={{ fontSize: '18px',marginRight:'63%' }}>Folder</label>
                                    <br />
                                    <Select
                                        value={folder}
                                        onChange={handleFolderChange}
                                        style={{ height: '30px', border: '1px solid #ccc',width:'200px', backgroundColor: 'white', outline: 'none', marginLeft: '10px' }}
                                    >
                                        <MenuItem value="---">---</MenuItem>
                                    </Select>
                                </div>
                                <div style={{ marginTop: '4px', marginLeft: '8px' }}>
                                    <label style={{ fontSize: '18px',marginRight:'63%' }}>Type</label>
                                    <br />
                                    <Select
                                        value={type}
                                        onChange={handleTypeChange}
                                        style={{ height: '30px', border: '1px solid #ccc',width:'170px', backgroundColor: 'white', outline: 'none', marginLeft: '10px' }}
                                    >
                                        <MenuItem value="Document">Document</MenuItem>
                                        <MenuItem value="Template">Template</MenuItem>
                                    </Select>
                                </div>
                                <div style={{ marginTop: '4px', marginLeft: '8px' }}>
                                    <label style={{ fontSize: '18px',marginRight:'63%' }}>Privay</label>
                                    <br />
                                    <Select
                                        value={privacy}
                                        onChange={handlePrivacyChange}
                                        style={{ height: '30px', border: '1px solid #ccc',width:'200px', backgroundColor: 'white', outline: 'none', marginLeft: '10px' }}
                                    >
                                        <MenuItem value="public">Public</MenuItem>
                                        <MenuItem value="private">Private</MenuItem>
                                        <MenuItem value="unlisted">Unlisted</MenuItem>
                                    </Select>
                                </div>  
                            </div>
                            <div style={{ marginTop: '5%', height: '60%', backgroundColor: '#ccc', border: '2px dashed gray', width: '60%', borderRadius: '8px', marginLeft: '35%', textAlign: 'center' }}>
                                    <label htmlFor="fileInput" className="cursor-pointer">
                                        <CloudArrowUpIcon style={{ height: '10%',marginTop:'-12%' }} />
                                        <Typography style={{ fontSize: '20px',marginTop:'-13%' }}>Drag and drop your files anywhere<br/>{fileList.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}</Typography>
                                        <input
                                            type="file"
                                            onChange={handleFileInputChange}
                                            style={{ display: 'none' }}
                                            id="fileInput"
                                            multiple
                                        />
                                        <div style={{ marginTop: '10px' }}>
                                            <label htmlFor="fileInput" style={{ padding: '8px 24px', borderRadius: '8px', border: '1px solid #000', cursor: 'pointer', fontSize: '14px' }}>
                                                Upload
                                            </label>
                                        </div>
                                    </label>
                                </div>
                            <div style={{marginTop:'20px'}}>
                            <Button variant="outlined" onClick={handleCreateBlankDocument} style={{ marginLeft: '45%',width:'40%',backgroundColor:'#0E86D4',color:'white' }}>
                                   Create Blank Document
                            </Button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Newdoc;
