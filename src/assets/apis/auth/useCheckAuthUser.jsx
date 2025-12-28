import { useEffect, useRef } from "react";
import useAuthStore from "../../store/authStore";
import useAuthMutation from "./AuthMutation";

function useCheckAuthUser() {
  const logout = useAuthStore((state) => state.logout);
  const { loginRefreshMutation } = useAuthMutation();

  const lastRefreshTime = useRef(0);

  useEffect(() => {
    // let sleepFor = 0;
    // let clicks = 0;

    // function onClickFn() {
    //   clicks += 1;
    //   document.body.style.cursor = "default";
    //   document.body.style.opacity = "1";
    // }

    // document.addEventListener("click", onClickFn);

    const checkAuth = () => {
        console.log("check 1");
    
      if (location.pathname.includes("login")) return;

      let user;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch {
        logout();
        return;
      }

      if (!user) {
        logout();
        return;
      };
        console.log("check 1.2");


    //   /** ============================
    //    *  ⏱ نظام inactivity
    //    * ============================ */
    //   if (clicks > 0) {
    //     clicks = 0;
    //     sleepFor = 0;
    //   } else {
    //     sleepFor += 1;
    //   }

    //   if (sleepFor >= 25) {
    //     logout();
    //     location.reload();
    //     return;
    //   }

      /** ============================
       *   ⏱ زمن صلاحية التوكن
       * ============================ */
      const expiry = new Date(user.validTo).getTime();
      const now = Date.now();
      const minutesLeft = (expiry - now) / 1000 / 60;

      /** 🔥 refresh قبل 3 دقائق فقط من الانتهاء */
      if (minutesLeft <= 3) {
        triggerRefresh();
      }

      /** 🔥 refresh كل 10 دقائق فقط */
      console.log("check 1.3");
      const TEN_MINUTES = 10 * 60 * 1000;
      if (Date.now() - lastRefreshTime.current >= TEN_MINUTES) {
        triggerRefresh();
      }


      function triggerRefresh() {
          console.log("check 2");
        if (loginRefreshMutation.isPending) return;

        lastRefreshTime.current = Date.now();

        loginRefreshMutation.mutate(
          {},
          {
            onSuccess: (newUser) => {
              localStorage.setItem("user", JSON.stringify(newUser));
              console.log("🔄 Token refreshed successfully");
            },
            onError: () => {
              console.log("❌ Refresh failed");
              logout();
              clearCart();
            },
          }
        );
      }
    };

    // تشغيل أول مرة
    checkAuth();

    // تشغيل كل دقيقة
    const interval = setInterval(checkAuth, 60 * 1000);

    return () => {
      clearInterval(interval);
    //   document.removeEventListener("click", onClickFn);
    };
  }, []);
}

export default useCheckAuthUser;
