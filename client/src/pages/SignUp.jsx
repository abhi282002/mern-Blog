import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill out all fields");
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setError(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to={"/"} className="font-bold text-4xl dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-50 via-purple-500 to-pink-500 rounded-lg text-white ">
              Abhi's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            A Project using MERN Stack. You can sign up with your email and
            password or with Google. Where You Can Post Your Blog
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="abhi07"
                id="username"
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="abhishek.sharma07@gmail.com"
                id="email"
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="* * * * * * *"
                id="password"
                disabled={loading}
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={loading}
            >
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-blue-500">
              Sign In
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color={"failure"}>
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
