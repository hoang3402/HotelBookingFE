'use client';

import {useCallback, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {toast} from "react-hot-toast";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import {domain} from "@/app/actions/getRoomById";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import {SaveToken} from "@/app/components/Ultility";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn()

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> =
    (data) => {
      setIsLoading(true);

      fetch(`${domain}api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json().then(data => {
        // console.log(data)
        if (data.error) {
          toast.error(data.error);
          return;
        }

        if (SaveToken(signIn, data)) {
          // Redirect or do-something
          toast.success('Successfully logged in');
        } else {
          //Throw error
          toast.error('Something went wrong');
          loginModal.onClose();
        }

        loginModal.onClose();
      })).catch(error => {
        // toast.error(error);
        console.log(error)
      }).finally(() => {
        setIsLoading(false);
      })
    }

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome back"
        subtitle="Login to your account!"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        optional={
          {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }
        }
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        optional={
          {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Minimum length should be 6'
            }
          }
        }
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
      <div className="
      text-neutral-500 text-center mt-4 font-light">
        <p>First time using Airbnb?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          > Create an account</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;
