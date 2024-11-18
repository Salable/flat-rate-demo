'use client'
import LoadingSpinner from "@/components/loading-spinner";
import Link from "next/link";
import React from "react";
import {useForm} from "react-hook-form";
import {signIn} from "@/app/actions/sign-in";

export const SignInForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<{
    username: string;
    password: string;
  }>();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const signInAction = await signIn(data)
      if (signInAction.error) {
        setError("root.serverError", {
          type: "400",
          message: signInAction.error.message
        })
      }
    } catch (e) {
      console.log(e)
    }
  });
  return (
    <form onSubmit={onSubmit} className='grid gap-3'>
      <fieldset>
        <input className='p-3 w-full' {...register("username", {
          required: {
            value: true,
            message: 'Username is required'
          },
        })} placeholder="Username"/>
        {errors.username && <p className='text-red-600'>{errors.username.message}</p>}
      </fieldset>

      <fieldset>
        <input type="password" className='p-3 w-full' {...register("password", {
          required: {
            value: true,
            message: 'Password is required'
          },
        })} placeholder="Password"/>
        {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
      </fieldset>

      <div className='mb-4'>
        <button className={`p-4 text-white rounded-md leading-none bg-blue-700`}>{!isSubmitting ? "Sign in" :
          <div className='w-[15px]'><LoadingSpinner fill="white"/></div>}</button>
      </div>

      {errors.root?.serverError ? (
        <div className='bg-red-500 text-white p-2 rounded-sm'>
          {errors.root?.serverError.message}
        </div>
      ) : null}

      <p>Haven't got an account? <Link className='text-blue-500' href="/sign-up">Sign up</Link></p>

    </form>
  )
}