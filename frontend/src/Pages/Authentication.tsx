"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LogIn, UserPlus } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  createClientAsync,
  loginClientAsync,
} from "../Redux/Slices/UserAuthSlice";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Authentication() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // fake error message

  const getInitialValues = () => {
    if (isLogin) {
      return { email: "test@example.com", password: "Test@123" };
    } else {
      return { firstName: "", lastName: "", email: "", password: "" };
    }
  };

  const handleSignUpSubmit = async (values, { setSubmitting }) => {
    const fullName = values?.firstName + values?.lastName;
    const actionResult = await dispatch(
      createClientAsync({
        email: values?.email,
        fullName: fullName,
        password: values?.password,
      })
    );

    if (actionResult.payload.msg === "Sign Up Successful") {
      // toast.success(actionResult.payload.msg);
      values.firstName = "";
      values.lastName = "";
      values.email = "";
      values.password = "";
      alert(actionResult.payload.msg);
      // setisLoadingTopProgress(100);
      setSubmitting(false);
      setIsLogin(true);
      // navigate("/signin");
    }

    if (actionResult.payload.msg === "Email Already Exist") {
      values.email = "";
      setSubmitting(false);
      // setisLoadingTopProgress(100);
      // toast.error(actionResult.payload.msg);
      // setSignUpErrors({ email: actionResult.payload.msg });
      alert(actionResult.payload.msg);
    }
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      // console.log("values - ", values);
      // setisLoadingTopProgress(20);
      const actionResult = await dispatch(
        loginClientAsync({
          email: values.email,
          password: values.password,
        })
      );

      if (actionResult.payload?.msg === "Incorrect Email") {
        // toast.error(actionResult.payload.msg);
        // setlogInEmailError(actionResult.payload.msg);
        alert(actionResult.payload?.msg);
        values.email = "";
      }

      if (actionResult.payload?.msg === "Password Wrong") {
        // toast.error(actionResult.payload.msg);
        // setlogInPasswordError(actionResult.payload.msg);
        alert(actionResult.payload.msg);
        values.password = "";
      }

      if (actionResult.payload?.msg === "Logged In Successfull") {
        values.email = "";
        values.password = "";
        alert(actionResult.payload?.msg);

        // toast.success(actionResult.payload.msg);
        localStorage.setItem("clientLoggedToken", actionResult.payload.token);
        window.location.replace("/");
      }

      // setisLoadingTopProgress(100);
      // console.log("actionResult - ", actionResult);
    } catch (error) {
      console.log("Error client login ", error?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              {isLogin ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Sign in to your account to continue"
                : "Join us to manage your projects efficiently"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Formik
            key={isLogin ? "login" : "register"}
            initialValues={getInitialValues()}
            validationSchema={isLogin ? LoginSchema : RegisterSchema}
            onSubmit={isLogin ? handleLoginSubmit : handleSignUpSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    ></button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
