import React, { useState } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MainLayout from "../components/mainLayout";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { connect } from "http2";
import axios from "axios";

const schema = Yup.object().shape({
  name: Yup.string()
    .required("please input name")
    .min(1, "Please input correct name")
    .matches(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/, "Only Korean or English"),
  email: Yup.string()
    .required("please input email")
    .email("Please input vaild Email Address."),
  password: Yup.string()
    .nullable()
    .min(8, "Password should be at least 8 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$#()^!%*?&])[A-Za-z\d$@$#()^!%*?&]{8,}/,
      "Password must contain special characters and uppercase characters."
    ),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "password is not matched"
  ),
});

const Signup = () => {
  const router = useRouter();
  // const { loginByPassword, loginByVcode } = useLoginQuery();

  // const { message } = useMessageDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const connectSubmit = (data: any) => {
    // try {
    //   doLoginByPassword(form);
    //   return;
    // } catch (err: any) {
    //   message.none("error has been occured");
    // }
    // console.log("connectSubmit이다", data);
    axios.post("http://localhost:8000/signup", data).then((res) => {
      console.log(res.data);
    });
  };
  return (
    <MainLayout>
      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign Up
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(connectSubmit)}
            className="mt-8 space-y-6"
            action="#"
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="pb-3">
                <label htmlFor="email-address" className="text-sm">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  autoComplete="name"
                  required
                  className={`relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Name"
                />
                <div className="text-red-500">{errors.name?.message}</div>
              </div>
              <div className="pb-3">
                <label htmlFor="email-address" className="text-sm">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="Email"
                  required
                  className={`relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Email address"
                />
                <div className="text-red-500">{errors.email?.message}</div>
              </div>
              <div className="pb-3">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  autoComplete="current-password"
                  required
                  className={`relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm `}
                  placeholder="Password"
                />
                <div className="text-red-500">{errors.password?.message}</div>
              </div>
              <div className="pb-3">
                <label htmlFor="password" className="text-sm">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  {...register("passwordConfirm")}
                  autoComplete="passwordConfirm"
                  required
                  className={`relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm `}
                  placeholder="Password"
                />
                <div className="text-red-500">
                  {errors.passwordConfirm?.message}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-indigo-600 py-2 px-4 text-sm font-medium text-black hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
              >
                Make an Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
export default Signup;
