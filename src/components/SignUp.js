import React, {useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {removePassword, changeFirstName, changePassword, changeUsername, changeLastName, changeEmail} from "../redux/user";
import {switchSignup} from "../redux/signup";
import {useFormik} from "formik";
import * as Yup from 'yup';

// ** main url for back end **
const URL = 'http://localhost:5432/api'

const SignUp = ()=>{

  // ** redux toolkit stuff **
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {signUp} = useSelector(state => state.signup)

  // ** creating formik for user registration **
  const formik = useFormik({
    initialValues: {
      ...user
    },

    // ** validating parameters **
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(25, 'Must be 25 characters or less').required('First name Required'),
      lastname: Yup.string()
        .max(25, 'Must be 25 characters or less').required('Last name required'),
      email: Yup.string()
        .email('Please enter a valid email').required('email required'),
      username: Yup.string()
        .max(25, 'Must be 50 characters or less').required('username required'),
      password: Yup.string()
        .required("Required")
        .min(12, "Must be 12 characters or more")
        .matches(/[a-z]+/, "One lowercase character")
        .matches(/[A-Z]+/, "One uppercase character")
        .matches(/[@$!%*#?&]+/, "One special character")
        .matches(/\d+/, "One number"),
    }),

    // ** on submit function for form **
    onSubmit: (values)=>{
      axios.post(`${URL}/User`, values)
        .then(res =>{
          console.log(res.data)
        }).catch(err => console.log(err));
    },
  });

  // main register function, posts an axios call to the database
  const handleSubmit = async (e)=> {

    // if(isValid){
    //   if(confirm === user.password){
    //     axios.post(`${URL}/User`, user)
    //       .then(res =>{
    //         console.log(res.data[0])
    //         dispatch(switchSignup())
    //         dispatch(removePassword())
    //         alert('Account successfully created!')
    //       }).catch(err => {
    //       console.log(err.response.data)
    //       alert(err.response.data)
    //     });
    //   } else {
    //     alert("Passwords must match")
    //   }
    // }
  }

  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={formik.handleSubmit}>
        <div className='form-div'>
          <input
            onChange={formik.handleChange}
            className='signup-input'
            type='text'
            name='firstname'
            placeholder='first name'
            value={formik.values.firstname}/>
          <p className='form-div-p'>{formik.errors.firstname}</p>
        </div>
        <div className='form-div'>
          <input
            onChange={formik.handleChange}
            className='signup-input'
            type='text'
            name='lastname'
            placeholder='last name'/>
          <p className='form-div-p'>{formik.errors.lastname}</p>
        </div>
        <div className='form-div'>
          <input
            onChange={formik.handleChange}
            className='signup-input'
            type='email'
            name='email'
            placeholder='email'/>
          <p className='form-div-p'>{formik.errors.email}</p>
        </div>
        <div className='form-div'>
          <input
            onChange={formik.handleChange}
            type='text'
            name='username'
            className='signup-input'
            placeholder='username'/>
          <p className='form-div-p'>{formik.errors.username}</p>
        </div>
        <div className='form-div'>
          <input
            onChange={formik.handleChange}
            className='signup-input'
            type='password'
            name='password'
            placeholder='password'/>
          <p className='form-div-p'>{formik.errors.password}</p>
        </div>
        {/*<div className='form-div'>*/}
        {/*  <input*/}
        {/*    onChange={formik.handleChange}*/}
        {/*    className='signup-input'*/}
        {/*    type='password'*/}
        {/*    name='confirm'*/}
        {/*    placeholder='confirm password'/>*/}
        {/*  <p className='form-div-p'>{}</p>*/}
        {/*</div>*/}
        <button
          className='login-submit-btn'
          type='submit'
        >Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignUp;