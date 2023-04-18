import React, { useState } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MainLayout from "../components/mainLayout";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { connect } from "http2";
import axios from "axios";
import { customAxios } from "../utils/axios";
import { Cookies } from "react-cookie";
import * as jwt from "jsonwebtoken";

const cookies = new Cookies();

const schema = Yup.object().shape({
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
});

const Login = () => {
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
      email: "",
      password: "",
    },
  });

  const accessToken = () => {
    axios.get("http://localhost:8000");
  };

  const connectSubmit = (data: any) => {
    // try {
    //   doLoginByPassword(form);
    //   return;
    // } catch (err: any) {
    //   message.none("error has been occured");
    // }
    console.log("loginSubmit이다", data);
    customAxios
      .post("/login", data)
      .then((res) => {
        const token = res.data.accessToken;
        const refresh = res.data.refreshToken;

        cookies.set("accessToken", `${token}`); //!파라미터값찾아보기
        cookies.set("refreshToken", `${refresh}`); //!파라미터값찾아보기

        const decode = jwt.decode(refresh);
        console.log(decode);
      })
      .catch((error) => {
        console.log("error:", error?.response);
        if (error?.response?.data?.code === 400) {
          alert(error?.response?.data?.message);
        }
      });
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    <MainLayout>
      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(connectSubmit)}
            className="mt-8 space-y-6"
            action="#"
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="Email"
                  required
                  className={`relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Email address"
                />
                <div className="text-red-500">{errors.email?.message}</div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  autoComplete="current-password"
                  required
                  className={`relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm `}
                  placeholder="Password"
                />
                <div className="text-red-500">{errors.password?.message}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
            <div className="flex justify-center">Are you not a member?</div>
            <div>
              <button
                type="button"
                className="group relative flex w-full justify-center rounded-md border border-indigo-600 py-2 px-4 text-sm font-medium text-black hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                onClick={handleSignup}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
export default Login;
