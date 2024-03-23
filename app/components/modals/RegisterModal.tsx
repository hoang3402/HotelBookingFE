'use client';

import {AiFillGithub} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {useCallback, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {toast} from "react-hot-toast";

import {domain} from "@/app/actions/getRoomById";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import {jwtDecode} from "jwt-decode";
import {SaveToken} from "@/app/components/Ultility";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    fetch(`${domain}api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "first_name": data.firstName,
        "last_name": data.lastName,
        "email": data.email,
        "password": data.password,
        "number_phone": data.phone,
      }),
    }).then(res => res.json()
      .then(data => {
        if (SaveToken(signIn, data)) {
          // Redirect or do-something
          toast.success('Register successfully');
          loginModal.onClose();
        } else {
          //Throw error
          toast.error('Something went wrong');
          loginModal.onClose();
        }

        loginModal.onClose();
      }))
      .catch(error => {
        console.log(error)
        toast.error('Something went wrong');
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to Airbnb"
        subtitle="Create an account!"
      />
      <Input
        id="email"
        label="Email"
        type={'email'}
        disabled={isLoading}
        register={register}
        errors={errors}
        optional={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
      />
      <div className={'flex gap-4'}>
        <Input
          id="firstName"
          label="First Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          optional={{
            required: true
          }}
        />
        <Input
          id="lastName"
          label="Last Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          optional={{
            required: "Last name is required"
          }}
        />
      </div>
      <Input
        id="phone"
        label="Phone"
        type={'number'}
        disabled={isLoading}
        register={register}
        errors={errors}
        optional={{
          required: "Phone is required",
          minLength: {
            value: 10,
            message: 'Minimum length should be 10'
          }
        }}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        optional={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: 'Minimum length should be 6'
          }
        }}
      />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr/>
      {/*<Button*/}
      {/*  outline*/}
      {/*  label="Continue with Google"*/}
      {/*  icon={FcGoogle}*/}
      {/*  onClick={() => {*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Button*/}
      {/*  outline*/}
      {/*  label="Continue with Github"*/}
      {/*  icon={AiFillGithub}*/}
      {/*  onClick={() => {*/}
      {/*  }}*/}
      {/*/>*/}
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Already have an account?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          > Log in</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
