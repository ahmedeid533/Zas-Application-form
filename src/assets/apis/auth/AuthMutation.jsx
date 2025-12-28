import toast from "react-hot-toast";
import { LoginAuth, register, updateAccessToken } from "./AuthApi";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

 function AuthMutation() {
    const {login,logout}=useAuthStore();
    const navigate=useNavigate();

    const AskToRegister=useMutation({
       mutationKey:"register",
       mutationFn:(data)=>register(data),
       onMutate:()=>{
           toast.loading("loading...",{id:1});
       },
       onSuccess:()=>{
           toast.success("Request Sent Successfully",{id:1});
       },
       onError:()=>{
           toast.error("Something went wrong",{id:1});
       }
    })

    const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => LoginAuth(data),
    onSuccess: (data) => {
      login(data);
      toast.success("Login successful", { id: 1 });
      navigate("/menu");
    },
    onMutate: () => {
      toast.loading("Loading ...", { id: 1 });
    },
    onError: (res) => {
      if (res?.response?.data == "User Not Found") {
        toast.error("Email or password is incorrect", { id: 1 });
      } else {
        console.log(res);
        toast.error("Failed to login", { id: 1 });
      }
    },
  });

  const loginRefreshMutation = useMutation({
    mutationKey: ["loginRefresh"],
    mutationFn: () => updateAccessToken(),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
    },
    onError: () => {
    //   toast.error("Session expired. Please log in again.", { id: 1 });
    },
  });

    return{
        AskToRegister,
        loginMutation,
        loginRefreshMutation
    }
}
export default AuthMutation