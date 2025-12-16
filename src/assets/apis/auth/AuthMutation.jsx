import { useMutation } from "@tanstack/react-query";
import { LoginAuth, Register, updateAccessToken } from "./AuthApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function useAuthMutation() {
  const navigate = useNavigate();
  const {login}= useAuthStore();

 const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (data) => Register(data),
    onSuccess: () => {
      toast.success("Account created successfully", { id: 1 });
      navigate("/login");
    },
    onMutate: () => {
      toast.loading("Loading ...", { id: 1 });
    },
    onError: () => {
      toast.error("Failed to create account", { id: 1 });
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => LoginAuth(data),
    onSuccess: (data) => {
      login(data);
      navigate("/");
    }
  });

  const loginRefreshMutation = useMutation({
    mutationKey: ["loginRefresh"],
    mutationFn: () => updateAccessToken(),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
    },
    onError: () => {
      toast.error("Session expired. Please log in again.", { id: 1 });
    },
  });


    return {
      registerMutation,
      loginMutation,
      loginRefreshMutation

  }
}
export default useAuthMutation
