import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import Home from "../../pages/home/Home";
import Loading from "../../pages/loading/Loading";
import ApplyingForm from "../../pages/ApplyingForm/ApplyingForm";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "../../pages/home/Home";
import Catering from "../../pages/catering/Catering";
import InflightMeal from "../../pages/inflightMeal/inflightMeal";
import Contact from "../../pages/contact/Contact";
import About from "../../pages/about/About";
import PrivacyPolicy from "../../pages/privacyPolicy/privacyPolicy";
import Terms from "../../pages/terms/Terms";

function Main() {



// useCheckAuthUser();
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 relative h-full">
        <Outlet />
        </div>
        <Footer/>
      </main>
    </>
  );
}

// const ProtectedRoute = ({ children }) => {
//   const user = useAuthStore((state) => state.user);
//   const { lang } = useLangStore();

//   if (!user) {
//     toast.error(langText.pleaseLoginFirst[lang], { id: 1 });
//     return <Navigate replace to="/login" />;
//   }

//   return children;
// };


// function AuthChecker() {
//     // 🔥 هنا يتم استدعاء الهوك الذي يحتاج سياق Router
//     useCheckAuthUser();
//     // Outlet يعرض محتوى المسار الفعلي (Home, Cart, إلخ)
//     return <Outlet />;
// }

function Layout() {


    // const {lang} = useLangStore();
    // const {setScreen,screen}=useScreenViewStore();
  // useCheckAuthUser();
//   useEffect(() => {
//     if(lang === 'AR'){
//       document.body.classList.add('rtl');
//     }else{
//       document.body.classList.remove('rtl');
//     }
//   }, [lang]);

// useEffect(() => {
//   const handleResize = () => {
//     setScreen(window.innerWidth < 768 ? "mobile" : "desktop");
//   };

//   window.addEventListener("resize", handleResize);
//   handleResize();

//   return () => window.removeEventListener("resize", handleResize);
// }, []);

  const routes = [
    {
      path: "/",
      element: <Main />,
      children: [
        { index: true, element: <Home /> },
        {path:"/private-jet-aircatering-cairo",element:<Catering/>},
        {path:"/inflight-meal-catering-egypt",element:<InflightMeal/>},
        {path:"/air-catering-cairo-contact",element:<Contact/>},
        {path:"/about-us",element:<About/>},
        {path:"/privacy-policy",element:<PrivacyPolicy/>},
        {path:"/website-terms",element:<Terms/>},
        // {
        //   path:"/job-application",
        //   element:<ApplyingForm/>
        // }
      ],
    },
  ];
  const handleRouterError = (error) => {
    console.error("Router encountered an error:", error);
    if (
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed")
    ) {
      window.location.reload();
    }
    // Optional: Implement additional error handling logic here
    // For example, redirect to a global error page:
    // window.location.href = "/error";
  };
  

  const router = createBrowserRouter(routes, {
    onError: handleRouterError,
  });

  return (
    <Suspense
     fallback={<Loading fullScreen={true} />}
     >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Layout;