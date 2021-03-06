import React, { useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faEye} from "@fortawesome/free-solid-svg-icons";
import {faPencil, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {switchEdit, switchHidden} from "../../redux/showCard";
import axios from "axios";
import CryptoJS from "crypto-js";
import {setOldSite, changeName, changeNotes, changeSitePassword, changeSiteUrl, changeSiteUsername} from "../../redux/card";


const URL = 'http://localhost:5432/api'

const Card = ()=>{
  const dispatch = useDispatch();
  const card = useSelector(state => state.card);
  const key = useSelector(state => state.key)
  const [hide, setHide] = useState(false)

  const handleDelete = () =>{
    const confirm = window.confirm('Are you sure you want to delete Card?')

    if(confirm){
      const body = {
        ...card,
        username: localStorage.getItem('username')
      }

      //** delete method for database **
      axios.post(`${URL}/deleteCard`, body)
        .catch(err => console.log(err))

      dispatch(switchHidden(false))
    } else {

    }
  }

  // ** function to show/hide password
  const handleDecrypt = ()=>{
    const decrypted = CryptoJS.AES.decrypt(card.sitePassword, key.password || localStorage.getItem('userKey'));
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  // ** handles edit button click
  const handleEdit = async ()=>{
    const body = {
      ...card,
      username: localStorage.getItem('username')
    }

    await axios.post(`${URL}/getCardInfo`, body)
      .then(res => {
        const decrypted = CryptoJS.AES.decrypt(res.data.site_password, key.password)
        const pass = decrypted.toString(CryptoJS.enc.Utf8)
        dispatch(changeName(res.data.site_name))
        dispatch(changeSiteUsername(res.data.site_username))
        dispatch(changeSitePassword(pass))
        dispatch(changeSiteUrl(res.data.site_url))
        dispatch(changeNotes(res.data.notes))
        dispatch(setOldSite(card.siteName))
      }).catch(err => console.log(err));

    dispatch(switchHidden(false))
    dispatch(switchEdit(true))
  }

  return (
    <div className='card-page'>
      <div className='card'>
        <FontAwesomeIcon
          className='card-exit'
          onClick={() => dispatch(switchHidden(false))} icon={faCircleXmark}/>
        <FontAwesomeIcon
          className='card-delete'
          onClick={handleDelete}
          icon={faTrashCan}/>
        <FontAwesomeIcon
          className='card-edit'
          onClick={handleEdit}
          icon={faPencil}/>
        <FontAwesomeIcon
          className='card-info-eye'
          onClick={() => setHide(!hide)}
          icon={faEye}/>
        <h1 className='card-name card-info'>{card.siteName}</h1>
        <h2 className='card-username card-info'>{card.siteUsername}</h2>
        <h2 className='card-info'>{hide ? handleDecrypt() : '*************'}</h2>
        <h2 className='card-url card-info'>{card.siteUrl}</h2>
        <p className='card-notes card-info'>{card.notes}</p>
      </div>
    </div>
  )
}

export default Card;