import '../App.css'
import API_URL from '../config';
import { Link } from "react-router-dom"
import { TextAnimate } from "@/components/ui/text-animate.jsx"
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ensureCsrfCookie, getCsrfTokenFromCookie } from '@/utils/csrf';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function Main(){
    //Main states
    const [header, setHeader] = useState("Sections")
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    //Profile info
    const [userInfo, setUserInfo] = useState({
        userId: null,
        username: "",
        first_name: "",
        date_joined: "",
        color: "",
        sectionsCount: null,
        urlsCount: null,
        favoritesUrlsCount: null, 
    });
    const [userInfoPageActivate, setUserInfoPageActivate] = useState(false)
    //Edit profile info
    const [editUserInfoActivate, setEditUserInfoActivate] = useState(false)
    const [newUsername, setNewUsername] = useState("")
    const [newFirstname, setNewFirstName] = useState("")
    const [newColor, setNewColor] = useState("")
    //Change password
    const [changePasswordActivate, setChangePasswordActivate] = useState(false)
    const [actualPassword, setActualPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    //Section states
    const [sections, setSections] = useState([])
    const [sectionActivate, setSectionActivate] = useState(false)
    //Create Sections
    const [newSectionName, setNewSectionName] = useState("")
    const [newSectionNameActivate, setNewSectionNameActivate] = useState("")
    //Edit sections
    const [updateSectionNameActivate, setUpdateSectionNameActivate] = useState(false) 
    const [updateSectionName, setUpdateSectionName] = useState("Section")
    const [updateSectionId, setUpdateSectionId] = useState(null)
    //Delete section
    const [deleteSectionId, setDeleteSectionId] = useState(null)
    const [deleteSectionName, setDeleteSectionName] = useState("")
    const [deleteSectionIdActivate, setDeleteSectionIdActivate] = useState(false)
    //Urls states 
    const [allUrls, setAllUrls] = useState([])
    const [keyWord, setKeyWord] = useState("")
    const [searchActivate, setSearchActivate] = useState(false)
    const [urlsBySection, setUrlsBySection] = useState([])
    const [urlsFavorites, setUrlsFavorites] = useState([])
    const [sectionId, setSectionId] = useState(null)
    const [sectionName, setSectionName] = useState("")
    const [favoriteActivate, setFavoriteActivate] = useState(false)
    //Create Url
    const [createUrlActivate, setCreateUrlActivate] = useState(false)
    const [urlName, setUrlName] = useState("")
    const [urlLink, setUrlLink] = useState("")
    //Edit Url
    const [editUrlActivate, setEditUrlActivate] = useState(false)
    const [newUrlName, setNewUrlName] = useState("")
    const [newUrlLink, setNewUrlLink] = useState("")
    const [editUrlId, setEditUrlId] = useState(null)
    //Delete URl
    const [deleteUrlActivate, setDeleteUrlActivate] = useState(false)
    const [deleteUrlId, setDeleteUrlId] = useState(null)
    const [deleteUrlName, setDeleteUrlName] = useState("")
    //Backup Download
    const [downloadBackupJsonActivate, setDownloadBackupJsonAcvivate] = useState(false)
    

    const showSuccess = (message) => {
        setSuccessMessage(message)
        setErrorMessage("")

        setTimeout(() => {
            setSuccessMessage("")
        }, 3000);
    }

    const showError = (message) => {
        setErrorMessage(message)
        setSuccessMessage("")

        setTimeout(() => {
            setErrorMessage("")
        }, 3000);
    }

    const handleLogout = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            fetch(`${API_URL}/api/logout/`,{
                method:"POST",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                }
            })
            
            .then((response) => {
                const data = response.json()
                if (response.ok){
                    showSuccess(data.message)
                    console.log("Logged out succesfully")
                    navigate("/")    
                } else {
                    console.log("Logged out wrong")
                }
            })
        } catch (error) {
            console.log("Error", error)
        }
        
    }

    //Get info of the logged user 
    const getUserInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/api/main/user_info/`,{
                    method:"GET",
                    credentials:"include",
                });
                if (response.ok){
                    const data = await response.json();
                    setUserInfo({
                        userId: data.id,
                        username: data.username,
                        first_name: data.first_name,
                        date_joined: data.date_joined,
                        color: data.color,
                        sectionsCount: data.sections_count,
                        urlsCount: data.urls_count,
                        favoritesUrlsCount: data.favorites_urls_count,
                    })
                } else {
                    console.error("Error fetching user info: ", response.status)
                }
            } catch (error) {
                console.log("Error", error)
            }   
        } 

    //get sections of the logged user
    const getSections = async () => {
            try {
                const response = await fetch(`${API_URL}/api/main/user_sections/`,{
                    method:"GET",
                    credentials:"include",
                    
                });
                if (response.ok){
                    const data = await response.json();
                    setSections(data)
                } 
            } catch (error) {
                console.log("Error", error)
            }   
        };

    const getAllUrls = async () =>{
        try {
            const response = await fetch(`${API_URL}/api/main/all_urls/`, {
                method: 'GET',
                credentials: "include",
                
            })
            if (response.ok) {
                const data = await response.json()
                console.log("API data: ", data)
                console.log("First element: ", data[0])
                setAllUrls(data)
            } else {
                showError(data.error)
            }
        } catch (error) {
            console.log("Error: ", error)
        } 
    }

    useEffect(() => {
        const init = async () => {
            await getUserInfo();   
            await getSections();
            await getAllUrls();
        };
        init();
    }, []);


    useEffect(() =>{
        if (keyWord.trim() !== '') {
            setSearchActivate(true)
        } else {
            setSearchActivate(false)
        }
    }, [keyWord])

    const searchResult = allUrls.filter(item => item.url_name.toLowerCase().includes(keyWord.toLowerCase()))

    const getUrlsBySection = async (section_id, name_section) => {
        setSectionId(section_id)
        setSectionName(name_section)
        try {
            const response = await fetch(`${API_URL}/api/main/urls_by_sections/${section_id}/`,{
                method:"GET",
                credentials: "include",
                
            })        
                if (response.ok){
                    const data = await response.json(); 
                    setUrlsBySection(data)  
                    setSectionActivate(true)
                    setHeader(name_section)      
                    console.log("Name section: ", name_section)
                }  else {
                    console.log("Error", response.status)
                }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handleCreateFunction = () => {
        setNewSectionNameActivate(!newSectionNameActivate)
    }

    const createSectionFunction = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/create_section/`, {
                method:"POST",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ section_name : newSectionName })
            })
            const data = await response.json()
            if (response.ok && data.success) {
                showSuccess(data.message)
                setNewSectionName("")
                setNewSectionNameActivate(false)
                getSections()
            } else {
                showError(data.error || "Something went wrong.")
                console.log("Error", response.status)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handleEditFunction = (section_name, section_id) => {
        setUpdateSectionNameActivate(!updateSectionNameActivate)
        setUpdateSectionName(section_name)
        setUpdateSectionId(section_id)
        console.log("Section: ", section_name ,section_id)
    }

    const updateSectionNameFunction = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/update_section/${updateSectionId}/`,{
                method:"PUT",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_section_name : updateSectionName })
            })
            const data = await response.json()
            if (response.ok){
                showSuccess(data.message)
                setHeader(updateSectionName)
                setUpdateSectionNameActivate(false)
                setUpdateSectionName("")
                setUpdateSectionId(null)
                getSections()
            } else {
                showError(data.error || "Something went wrong.")
                console.log("Error: ". response.status)
            }
            
        } catch (error) {
            console.log("Error: ", error)
        }
    } 

    const handleDeleteFunction = (section_name, section_id) => {
        setDeleteSectionIdActivate(!deleteSectionIdActivate)
        setDeleteSectionName(section_name)
        setDeleteSectionId(section_id)
        console.log("Section: ", section_name ,section_id)
    }

    const deleteSectionFunction = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/delete_section/${deleteSectionId}/`,{
                method:"DELETE",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            if (response.ok){
                showSuccess(data.message)
                setDeleteSectionIdActivate(false)
                setDeleteSectionId(null)
                getSections()
            } else {
                showError(data.error || "Something went wrong")
                console.log("Error: ". response.status)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handleCreateUrlFunction = () => {
        setCreateUrlActivate(!createUrlActivate)
    }

    const createUrlFunction = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/create_url/`, {
                method:'POST',
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    url_name : urlName,
                    url_link : urlLink,
                    section_id : sectionId
                 })
            })
            const data = await response.json()
            if (response.ok){
                showSuccess(data.message)
                getUrlsBySection(sectionId, sectionName)
                setCreateUrlActivate(false)
                setUrlName("")
                setUrlLink("")
            } else {
                showError(data.error || "Something went wrong")
                console.log("Error: ", response.status)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handleEditUrlFunction = (urlId, urlName, urlLink) => {
        setEditUrlActivate(true)
        setEditUrlId(urlId)
        setNewUrlName(urlName)
        setNewUrlLink(urlLink)
    }

    const editUrlFunction = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie(); 
            const response = await fetch(`${API_URL}/api/main/edit_url/${editUrlId}/`,{
                method:"PUT",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    new_url_name : newUrlName,
                    new_url_link : newUrlLink
                 })
            })
            const data = await response.json()
            if (response.ok) {
                showSuccess(data.message)
                if (favoriteActivate) {
                    getAllFavoritesUrls()
                } else {
                    getUrlsBySection(sectionId, sectionName)
                }
                setEditUrlActivate(false)
                setUrlName("")
                setEditUrlId(null)
            } else {
                showError(data.error || "Something went wrong")
                console.log("Error: ", response.status)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handleDeleteUrlFunction = (urlId, urlName) => {
        setDeleteUrlActivate(true)
        setDeleteUrlId(urlId)
        setDeleteUrlName(urlName)
    }

    const deleteUrlFunction = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/delete_url/${deleteUrlId}/`,{
                    method:"DELETE",
                    credentials: "include",
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json()
                if (response.ok) {
                    showSuccess(data.message)
                    getUrlsBySection(sectionId, sectionName)
                    setDeleteUrlActivate(false)
                    setDeleteUrlId(null)
                } else {
                    showError(data.error || "Something went wrong")
                    console.log("Error: ", response.status)
                }    
        } catch (error) {
            console.log("Error: ", error)   
        }
    }

    const handleUserInfoPage = () => {
        setSectionActivate(false)
        setFavoriteActivate(false)
        setUserInfoPageActivate(true)
        setHeader("Profile")
    }

    const handleUserInfoEdit = () => {
        setEditUserInfoActivate(true)
        setNewFirstName(userInfo.first_name)
        setNewUsername(userInfo.username)
        setNewColor(userInfo.color)
    }

    const editUserInfo = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/edit_user_info/`,{
                method:"PUT",
                    credentials: "include",
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        new_first_name : newFirstname,
                        new_username : newUsername,
                        color : newColor,
                    })
            }) 
            const data = await response.json()
            if (response.ok) {
                showSuccess(data.message)
                setEditUserInfoActivate(false)
                getUserInfo()
                setNewFirstName("")
                setNewUsername("")
                setNewColor("")
            } else {
                showError(data.error)
            }
        } catch (error) {
            showError(error)
        }
        
    }

    const handleChangePassword = () => {
        setChangePasswordActivate(true)
    }

    const changePassword = async () => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/change_password/`,{
                method:"PUT",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    actual_password : actualPassword,
                    new_password : newPassword,
                    confirm_new_password: confirmNewPassword,
                    })
            })
            const data = await response.json()
            if (response.ok) {
                showSuccess(data.message)
                setChangePasswordActivate(false)
                setActualPassword("")
                setNewPassword("")
                setConfirmNewPassword("")
            } else {
                showError(data.error || "Something went wrong")
                console.log("Error: ", response.status)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handleFavoriteFunction = () => {
        setUserInfoPageActivate(false)
        setFavoriteActivate(true)
        setHeader("Favorites")
        setSectionActivate(false)
        getAllFavoritesUrls()
    }
    
    const getAllFavoritesUrls = async () => {
        try {
            const response = await fetch(`${API_URL}/api/main/all_favorites/`,{
                method:'GET',
                credentials: "include",
            })
            if (response.ok){
                const data = await response.json();
                setUrlsFavorites(data) 
            } else {
                console.log("Error: ", response.status)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const favoriteFunction = async (urlId, isFavorite) => {
        try {
            await ensureCsrfCookie();
            const csrftoken = getCsrfTokenFromCookie();
            const response = await fetch(`${API_URL}/api/main/favorite/`,{
                    method:"PUT",
                    credentials: "include",
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        url_id : urlId,
                        favorite: !isFavorite
                    })
                })
                const data = await response.json()
                if (response.ok) {
                    setUrlsBySection(prev =>
                        prev.map(url => 
                            url.id === urlId ? {...url, favorite: !isFavorite} : url
                        )
                    )
                    showSuccess(data.message)
                    getAllFavoritesUrls()
                } else {
                    showError(data.error || "Something went wrong ")
                    console.log("Error: ", response.status)
                }
        } catch (error) {
            console.log("Error: ", error)
        }  
    }

    const handleDownloadBackupJson = async () => {
        setDownloadBackupJsonAcvivate(true)
    }

    const downloadBackupJson = async () => {
        await ensureCsrfCookie();
        const csrftoken = getCsrfTokenFromCookie();
        const response = await fetch(`${API_URL}/api/main/backup_json/`,{
            method:"GET",
                    credentials: "include",
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json',
                    },
        })
        
        if (response.ok){
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'backup_sections.json'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            showSuccess("Backup downloaded successfully")
            setDownloadBackupJsonAcvivate(false)
        } else {
            showError("Error downloading backup")
        }
    }

    return(
        <div className='mp-main-container'>
            <div className='mp-side-bar'>
                <div className="mp-side-bar-top-container">
                    <input
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}  
                        className='mp-search-button' 
                        type="text" 
                        placeholder='Search...'/>
                    {searchActivate && (
                        <div className='mp-side-bar-search-result'>  
                            { searchResult.length > 0

                               ? searchResult.map((item, index) => (
                                <div key={index}>
                                    <a href={item.link} target='_blank' rel='noopener noreferrer'>{item.url_name}</a>
                                    <br />
                                </div>
                                ))
                                : <p>No results</p>
                            }      
                                
                        </div>
                    )}
                    <div className='mp-side-bar-nav'>
                        <h5 onClick={() => {
                        setUserInfoPageActivate(false)
                        setSectionActivate(false)
                        setFavoriteActivate(false)
                        setHeader("Sections")}}>
                        Sections
                        </h5>
                        <svg onClick={handleCreateFunction} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>                        </div>

                    <div className='mp-side-bar-sections-container'>
                        <h4 onClick={handleFavoriteFunction}>Favorites</h4>
                       {sections.map((section) => (
                            <div className='mp-side-bar-section-div' key={section.id}>
                                <h5
                                    onClick={() => {
                                        setUserInfoPageActivate(false)
                                        setFavoriteActivate(false)
                                        getUrlsBySection(section.id, section.name_section)
                                        setUpdateSectionNameActivate(false)
                                        setSectionName(section.name_section)
                                        setSectionId(section.id)}}>
                                        {section.name_section}
                                </h5>
                                <div>
                                    <svg 
                                    onClick={() => handleEditFunction(section.name_section, section.id)} 
                                    name="edit_svg" 
                                    xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 21h16M5.666 13.187A2.28 2.28 0 0 0 5 14.797V18h3.223c.604 0 1.183-.24 1.61-.668l9.5-9.505a2.28 2.28 0 0 0 0-3.22l-.938-.94a2.277 2.277 0 0 0-3.222.001z"/></svg>
                                    <svg 
                                    onClick={() => handleDeleteFunction(section.name_section, section.id)} 
                                    name='delete_svg' 
                                    xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"/></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mp-sidebar-urls-container'>
                        <hr></hr>
                        { favoriteActivate && (
                            urlsFavorites 
                            .map((url) => ( 
                                <div key={url.id}>
                                    <a  href={url.link} target='_blank' rel='noopener noreferrer'>
                                        <span>{url.url_name}</span> 
                                    </a>
                                    <div className='mp-sidebar-urls-svgs-container'>
                                        {url.favorite ? (
                                            <svg onClick={() => favoriteFunction(url.id, url.favorite)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z"/></svg>
                                        ) : (
                                            <svg onClick={() => favoriteFunction(url.id, url.favorite)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21.919 10.127a1 1 0 0 0-.845-1.136l-5.651-.826l-2.526-5.147a1.037 1.037 0 0 0-1.795.001L8.577 8.165l-5.651.826a1 1 0 0 0-.556 1.704l4.093 4.013l-.966 5.664a1.002 1.002 0 0 0 1.453 1.052l5.05-2.67l5.049 2.669a1 1 0 0 0 1.454-1.05l-.966-5.665l4.094-4.014a1 1 0 0 0 .288-.567m-5.269 4.05a.5.5 0 0 0-.143.441l1.01 5.921l-5.284-2.793a.5.5 0 0 0-.466 0L6.483 20.54l1.01-5.922a.5.5 0 0 0-.143-.441L3.07 9.98l5.912-.864a.5.5 0 0 0 .377-.275L12 3.46l2.64 5.382a.5.5 0 0 0 .378.275l5.913.863z"/></svg>
                                        )}                                
                                        <svg 
                                        onClick={() => handleEditUrlFunction(url.id ,url.url_name, url.link)}
                                        name="edit_svg" 
                                        xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 21h16M5.666 13.187A2.28 2.28 0 0 0 5 14.797V18h3.223c.604 0 1.183-.24 1.61-.668l9.5-9.505a2.28 2.28 0 0 0 0-3.22l-.938-.94a2.277 2.277 0 0 0-3.222.001z"/></svg>
                                        <svg 
                                        onClick={() => handleDeleteUrlFunction(url.id, url.url_name)}
                                        name='delete_svg' 
                                        xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"/></svg>
                                    </div>  
                                </div> 
                                ))
                        )}
                        {sectionActivate && (
                            urlsBySection.map((url) => (
                                <div key={url.id}>
                                    <a  href={url.link} target='_blank' rel='noopener noreferrer'>
                                        <span>{url.url_name}</span> 
                                    </a>
                                    <div className='mp-sidebar-urls-svgs-container'>
                                        {url.favorite ? (
                                            <svg onClick={() => favoriteFunction(url.id, url.favorite)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z"/></svg>
                                        ) : (
                                            <svg onClick={() => favoriteFunction(url.id, url.favorite)} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21.919 10.127a1 1 0 0 0-.845-1.136l-5.651-.826l-2.526-5.147a1.037 1.037 0 0 0-1.795.001L8.577 8.165l-5.651.826a1 1 0 0 0-.556 1.704l4.093 4.013l-.966 5.664a1.002 1.002 0 0 0 1.453 1.052l5.05-2.67l5.049 2.669a1 1 0 0 0 1.454-1.05l-.966-5.665l4.094-4.014a1 1 0 0 0 .288-.567m-5.269 4.05a.5.5 0 0 0-.143.441l1.01 5.921l-5.284-2.793a.5.5 0 0 0-.466 0L6.483 20.54l1.01-5.922a.5.5 0 0 0-.143-.441L3.07 9.98l5.912-.864a.5.5 0 0 0 .377-.275L12 3.46l2.64 5.382a.5.5 0 0 0 .378.275l5.913.863z"/></svg>
                                        )}
                                        <svg 
                                        onClick={() => handleEditUrlFunction(url.id ,url.url_name, url.link)}
                                        name="edit_svg" 
                                        xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 21h16M5.666 13.187A2.28 2.28 0 0 0 5 14.797V18h3.223c.604 0 1.183-.24 1.61-.668l9.5-9.505a2.28 2.28 0 0 0 0-3.22l-.938-.94a2.277 2.277 0 0 0-3.222.001z"/></svg>
                                        <svg 
                                        onClick={() => handleDeleteUrlFunction(url.id, url.url_name)}
                                        name='delete_svg' 
                                        xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"/></svg>
                                    </div>  
                                </div>  
                                ))
                        )}  
                    </div>
                </div>
                <div className='mp-side-bar-userinfo'>
                    <DropdownMenu className={"mp-dropdownMenu"}>
                        <DropdownMenuTrigger className={"mp-drowpdownmenu-trigger"}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M8 14.5a6.47 6.47 0 0 0 3.25-.87V11.5A2.25 2.25 0 0 0 9 9.25H7a2.25 2.25 0 0 0-2.25 2.25v2.13A6.47 6.47 0 0 0 8 14.5m4.75-3v.937a6.5 6.5 0 1 0-9.5 0V11.5a3.75 3.75 0 0 1 2.486-3.532a3 3 0 1 1 4.528 0A3.75 3.75 0 0 1 12.75 11.5M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M9.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" clipRule="evenodd"/></svg>
                                <span>{userInfo.first_name}</span>
                            </div></DropdownMenuTrigger>
                        <DropdownMenuContent className={"mp-div-drowpdownmenu"}>
                            <DropdownMenuLabel className={"mp-div-drowpdownmenu-item"}>My Account</DropdownMenuLabel>
                            <hr />
                            <DropdownMenuItem className={"mp-div-drowpdownmenu-item"} onClick={handleUserInfoPage}>Profile</DropdownMenuItem>
                            <DropdownMenuItem className={"mp-div-drowpdownmenu-item"} onClick={handleLogout} >Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                </div>
            </div>
            <div className='mp-userinfo-url-manager-container'>
                {successMessage && <div className='mp-success-message'>{successMessage}</div>}
                {errorMessage && <div className='mp-error-message'>{errorMessage}</div>}
                <div className='mp-user-info'>
                    {sectionActivate ? (
                        <div className='mp-header-div'>
                            <div className='mp-button-back-container'>
                                <button 
                                    className="mp-back-button"
                                    onClick={() => {
                                        setSectionActivate(false)
                                        setSectionId(null)
                                        setSectionName("")
                                        setHeader("Sections")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"/></svg>
                                </button>
                            </div>
                            <h1>{header}</h1>
                        </div>
                    ): userInfoPageActivate ?(
                        <div className='mp-header-div'>
                            <div className='mp-button-back-container'>
                                <button 
                                    className="mp-back-button"
                                    onClick={() => {
                                        setUserInfoPageActivate(false)
                                        setHeader("Sections")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"/></svg>
                                </button>
                            </div>
                            <h1>{header}</h1>
                        </div>
                    ) : favoriteActivate ? (
                        <div className='mp-header-div'>
                            <div className='mp-button-back-container'>
                                <button 
                                    className="mp-back-button"
                                    onClick={() => {
                                        setFavoriteActivate(false)
                                        setHeader("Sections")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"/></svg>
                                </button>
                            </div>
                            <h1>{header}</h1>
                        </div>
                    ) : (
                        <h1>{header}</h1>
                    )}
                </div>
                <hr className='mp-hr'/>
                <div className='mp-url-manager'>
                    {userInfoPageActivate ? (        
                        <div className='up-user-info-main-container'>
                            <div className='up-user-info-container'>
                                <div className='up-user-avatar' style={{backgroundColor: userInfo.color}}>{userInfo.first_name[0]}</div>
                                <div className='up-user-info-div'>
                                    <div>
                                        <h2 name="user-firstname">
                                        {userInfo.first_name}
                                        </h2>
                                        <svg 
                                        onClick={handleUserInfoEdit}
                                        name="edit_svg" 
                                        xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 21h16M5.666 13.187A2.28 2.28 0 0 0 5 14.797V18h3.223c.604 0 1.183-.24 1.61-.668l9.5-9.505a2.28 2.28 0 0 0 0-3.22l-.938-.94a2.277 2.277 0 0 0-3.222.001z"/></svg>
                                    </div>
                                    <span name="user-email">{userInfo.username}</span>
                                    <br />
                                    <span className='up-user-joined' name="user-joined">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M1 23h22V4H1zM18 4V0zM6 4V0zM1 8.5h22zM6 14q.834-2 2.5-2c1.3 0 2 1 2 2s-1 2-2 3l-2 2v.5h5.405m5.08 1L17 12h-.5c-.5 1.5-2 2-2.743 2"/></svg>
                                        {userInfo.date_joined}
                                    </span>
                                </div> 
                            </div>
                            <div className='up-stats-container'>
                                <h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M1.75 13.25V1.5H.5v12a1.24 1.24 0 0 0 1.22 1H15.5v-1.25z"/><path fill="currentColor" d="M3.15 8H4.4v3.9H3.15zm3.26-4h1.26v7.9H6.41zm3.27 2h1.25v5.9H9.68zm3.27-3.5h1.25v9.4h-1.25z"/></svg>
                                    Your stats
                                </h3>
                                <div className='up-stats-box-container'>
                                    <div className='up-stats-box'>
                                        <span>
                                            {userInfo.sectionsCount}
                                        </span>
                                        <br/>
                                        <span>Sections</span>
                                    </div>
                                    <div className='up-stats-box'>
                                        <span>{userInfo.urlsCount}</span>
                                        <br/>
                                        <span>Urls</span>
                                    </div>
                                    <div className='up-stats-box'>
                                        <span>{userInfo.favoritesUrlsCount}</span>
                                        <br/>
                                        <span>Favorites</span>
                                    </div>
                                </div>
                            </div>
                            <div></div>
                            <div className='up-options-menu'>
                                <h2>Options</h2>
                                <span onClick={handleChangePassword}>Change password</span>
                                <br />
                                <span onClick={handleDownloadBackupJson}>Export data</span>
                                <br />     
                            </div>
                        </div>
                    ): sectionActivate ? (
                        <>
                            {urlsBySection.map((url) => (
                                <a className='mp-a-urls-container' key={url.id} href={url.link} target='_blank' rel='noopener noreferrer'>
                                    <div className='mp-url-div'>
                                        <img src={url.favicon} alt={`Logo ${url.url_name}`} />    
                                    </div>
                                    <span>{url.url_name}</span>
                                </a>  
                            ))}
                            <div onClick={handleCreateUrlFunction} className='mp-add-url-div'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
                            </div>
                        </> 
                    ): favoriteActivate ? (
                        <>
                            {urlsFavorites.map((url) => (
                                <a className='mp-a-urls-container' key={url.id} href={url.link} target='_blank' rel='noopener noreferrer'>
                                    <div className='mp-url-div'>
                                        <img src={url.favicon} alt={`Logo ${url.url_name}`} />    
                                    </div>
                                    <span>{url.url_name}</span>
                                </a>  
                            ))}
                        </>
                    ):(
                        sections.map((section) => (
                            <div 
                                onClick={() => {
                                    setHeader(section.name_section)
                                    setFavoriteActivate(false)
                                    getUrlsBySection(section.id, section.name_section)
                                    setSectionName(section.name_section)
                                    setSectionId(section.id)}} 
                                className='mp-section-div' 
                                key={section.id}>
                                <h2 >{section.name_section}</h2>
                            </div>                        
                        ))
                    ) 
                }                 
            </div>
                {updateSectionNameActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setUpdateSectionNameActivate(false)}></div>
                        <div className='mp-menu-crudSection'>
                            <h3>Edit section</h3>
                            <span>Name: </span>
                            <input 
                                type="text" 
                                value={updateSectionName}
                                onChange={(e) => setUpdateSectionName(e.target.value)}
                            />
                            <br />
                            <button onClick={() => setUpdateSectionNameActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={updateSectionNameFunction}>Update Section</button>
                        </div>
                    </>
                )}

                {newSectionNameActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setNewSectionNameActivate(false)}></div>
                        <div className='mp-menu-crudSection'>
                            <h3>Create section</h3>
                            <span>Name: </span>
                            <input 
                                type="text" 
                                placeholder='Type a name'
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                            />
                            <br />
                            <button onClick={() => setNewSectionNameActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={createSectionFunction}>Create Section</button>
                        </div>
                    </> 
                )}

                {deleteSectionIdActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setDeleteSectionIdActivate(false)}></div>
                        <div className='mp-menu-crudSection'>
                            <h3>Delete section</h3>
                            <p>Are you sure that you want to delete the "{deleteSectionName}" section? </p>
                            <br />
                            <button onClick={() => setDeleteSectionIdActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={deleteSectionFunction}>Delete Section</button>
                        </div>
                    </> 
                )}
 
                {createUrlActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setCreateUrlActivate(false)}></div>
                        <div className='mp-menu-crudUrl'>
                            <h3>Create Url</h3>
                            <span>Name: </span>
                            <input 
                                type="text" 
                                placeholder='GitHub'
                                value={urlName}
                                onChange={(e) => setUrlName(e.target.value)}
                            />
                            <br />
                            <span>Url: </span>
                            <input 
                                type="url" 
                                placeholder='https://github.com'
                                value={urlLink}
                                onChange={(e) => setUrlLink(e.target.value)}
                            />
                            <br />
                            <button onClick={() => setCreateUrlActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={createUrlFunction}>Create Url</button>
                        </div>
                    </>
                )}

                {editUrlActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setEditUrlActivate(false)}></div>
                        <div className='mp-menu-crudUrl'>
                            <h3>Edit Url</h3>
                            <span>Name: </span>
                            <input 
                                type="text" 
                                placeholder='GitHub'
                                value={newUrlName}
                                onChange={(e) => setNewUrlName(e.target.value)}
                            />
                            <br />
                            <span>Url: </span>
                            <input 
                                type="url" 
                                placeholder='https://github.com'
                                value={newUrlLink}
                                onChange={(e) => setNewUrlLink(e.target.value)}
                            />
                            <br />
                            <button onClick={() => setEditUrlActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={editUrlFunction}>Edit Url</button>
                        </div>
                    </>
                )}
                
                {deleteUrlActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setDeleteUrlActivate(false)}></div>
                        <div className='mp-menu-crudSection'>
                            <h3>Delete Url</h3>
                            <p>Are you sure that you want to delete the "{deleteUrlName}" Url? </p>
                            <br />
                            <button onClick={() => setDeleteUrlActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={deleteUrlFunction}>Delete Url</button>
                        </div>
                    </>
                )}
                {editUserInfoActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => {
                            setEditUserInfoActivate(false)
                            setNewUsername("")
                            setNewFirstName("")
                            setNewColor("")}}></div>
                        <div className='up-change-password-container'>
                            <h3>Edit User Info</h3>
                            <span>Name: </span>
                            <input 
                                type="text" 
                                value={newFirstname}
                                onChange={(e) => setNewFirstName(e.target.value)}
                            />
                            <br />
                            <span>Email: </span>
                            <input 
                                type="email" 
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            <br />
                            <span>Color: </span>
                            <input 
                                className='up-color-input'
                                type="color" 
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                            />
                            <br />
                            <button 
                            onClick={() => {
                            setEditUserInfoActivate(false)
                            setNewUsername("")
                            setNewFirstName("")
                            setNewColor("")}}>
                                Cancel
                            </button>
                            <button className='mp-menu-crud-mainbutton' onClick={editUserInfo}>Edit</button>
                        </div>
                    </>
                )}
                {changePasswordActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setChangePasswordActivate(false)}></div>
                        <div className='up-change-password-container'>
                            <h3>Change your password</h3>
                            <span>Actual password: </span>
                            <input 
                                type="password" 
                                onChange={(e) => setActualPassword(e.target.value)}
                            />
                            <br />
                            <span>New password: </span>
                            <input 
                                type="password" 
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <br />
                            <span>Confirm password: </span>
                            <input 
                                type="password" 
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <br />
                            <button onClick={() => setChangePasswordActivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={changePassword}>Change password</button>
                        </div>
                    </>
                )}
                {downloadBackupJsonActivate && (
                    <>
                        <div className='mp-backdrop' onClick={() => setDownloadBackupJsonAcvivate(false)}></div>
                        <div className='mp-menu-crudSection'>
                            <h3>Download Backup</h3>
                            <p className='mp-menu-DownloadBackup-p'>This file may contain private URLs from conversations. Do not share this file with anyone unless you fully trust them.</p>
                            <br />
                            <button onClick={() => setDownloadBackupJsonAcvivate(false)}>Cancel</button>
                            <button className='mp-menu-crud-mainbutton' onClick={downloadBackupJson}>Download</button>
                        </div>
                    </>
                )}
            </div>      
        </div>
    )
}

export default Main