import Head from "next/head";
import { useRouter } from "next/router";
import LoginSignup from "../components/login-signup";

export default function Login() {
  return <LoginSignup type="login" />;
}
