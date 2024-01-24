import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home/index';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Google from './containers/Google';
import Folder from './pages/fileupload/fileupload/folder/Folder';
import UserProfile from './pages/UserProfile/userprofile'
import "./global.css";
import ManageFolder from './pages/fileupload/fileupload/managefolder/ManageFolder';
import { Provider, } from 'react-redux';
import store from './store';
import Upload from './pages/fileupload/fileupload/upload/Upload';
import Layout from './hocs/Layout';
import image1 from './images/image1.jpg'
import Privateroute from './pages/PrivateRoute/privateroute';
import Pricing from './pages/Pricing/index';
import Features from './pages/Features/features';
import CreateFolder from './pages/fileupload/fileupload/managefolder/createfolder/CreateFolder';
import AddSubFolder from './pages/fileupload/fileupload/managefolder/createfolder/subfolder/AddSubFolder';
import Dashboard from './pages/fileupload/fileupload/Dashboard';
import FileList from './pages/fileupload/fileupload/fileupload';
import DisplayFolder from './pages/fileupload/fileupload/managefolder/DisplayFolder';
import "./global.css";
import Newdoc from './pages/File_upload/FileUpload';
import Docx from './pages/docx/Worddocx';
import SendDoc from './pages/fileupload/fileupload/SendDoc';
import CreateEditTag from './pages/fileupload/fileupload/Tag/CreateEditTag';
import RecieveDoc from './pages/fileupload/fileupload/upload/RecieveDoc';
import Iframe from './pages/fileupload/fileupload/upload/Iframe';
import AfterSigning from './pages/fileupload/fileupload/upload/AfterSigning';
import Signed from './pages/fileupload/fileupload/upload/signed';
import DocuSignComponent from './pages/fileupload/fileupload/upload/DocuSignComponent';
import Inbox from './pages/fileupload/fileupload/upload/Inbox';
import { Toaster, toast } from 'sonner';
import SubFolder from './pages/fileupload/fileupload/managefolder/createfolder/subfolder/SubFolder';
import QuillEditor from './pages/docx/generate';
import EmailSender from './pages/fileupload/fileupload/upload/test';
import SignedDocuments from './pages/fileupload/fileupload/upload/SignedDocuments';

const App = () => {

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path='dashboard' element={<Privateroute><Dashboard /></Privateroute>} />
                    <Route path='/upload' element={<Privateroute><Upload /></Privateroute>} />
                    <Route path='/Userprofile' element={<Privateroute><UserProfile /></Privateroute>} />
                    <Route path='/wordDocx' element={<Privateroute><Docx /></Privateroute>} />
                    <Route path='/file-list' element={<Privateroute><FileList /></Privateroute>} />
                    <Route path='/pricing' element={<Pricing />} />
                    <Route path='/features' element={<Features />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/tag' element={<Privateroute><CreateEditTag /></Privateroute>} />
                    <Route path='/create-tag' element={<Privateroute><CreateEditTag /></Privateroute>} />
                    <Route path='/create_folder' element={<Privateroute><CreateFolder /></Privateroute>} />
                    <Route path='/upload_file' element={<Privateroute><Newdoc /></Privateroute>} />
                    <Route path='/manage-folders' element={<Privateroute><ManageFolder /></Privateroute>} />
                    <Route path='/display-folders' element={<Privateroute><DisplayFolder /></Privateroute>} />
                    <Route path='/folder' element={<Privateroute><Folder /></Privateroute>} />
                    <Route path="/add-subfolder/:folderId" element={<Privateroute><AddSubFolder /></Privateroute>} />
                    <Route path='/home' element={<Home />} />
                    <Route index element={<Home />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/google' element={<Privateroute><Google /></Privateroute>} />
                    <Route path='/reset-password' element={<ResetPassword />} />
                    <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
                    <Route path='/activate/:uid/:token' element={<Activate />} />
                    <Route path='/send-doc' element={<Privateroute><SendDoc /></Privateroute>} />
                    <Route path='/receive-doc' element={<Privateroute><RecieveDoc /></Privateroute>} />
                    <Route path='/sign' element={<Iframe />} />
                    <Route path='/aftersigning' element={<Privateroute><AfterSigning /></Privateroute>} />
                    <Route path='/signed' element={<Privateroute><Signed /></Privateroute>} />
                    <Route path='/generate' element={<QuillEditor/>} />
                    <Route path='/hello' element={<EmailSender  />} />
                    <Route path='/inbox' element={<Privateroute><Inbox /></Privateroute>} />
                    <Route path='/subfolder/:folderId/:subfolderId' element={<Privateroute><SubFolder /></Privateroute>} />
                    <Route path='/signed-doc' element={<Privateroute><SignedDocuments/></Privateroute>} />
                    <Route path='/verify' element={<Activate />} />


                </Routes>
            </Router>
            <Toaster richColors position="top-center" />
        </Provider>
    )
};
export default App;