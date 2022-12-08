import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Footer, ThemeSettings } from "./components";
import {
  Login,
  News,
  Customers,
  Notification,
  Student,
  NavbarMain,
  Faculty,
  EducationProgram,
  EducationProgramSubject
} from "./pages";
import "./App.css";

import { useStateContext } from "./contexts/ContextProvider";
import ProtectedRoute from "./pages/Services/ProtectedRoute";


const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, themeSettings } = useStateContext();
  
  const isAuthenticated = localStorage.getItem("accessToken")
  // useEffect(() => {
   
  //     if (location.protocol === 'https:') {
  //       location.protocol = 'http:';
  //     }
    
  // }, []);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }

  }, []);
 

  return (
    /*
   
    */
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <NavbarMain>
            <div>
              {themeSettings && <ThemeSettings />}
                <Routes>
                  {/* dashboard  */}
                    <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <Customers /> </ProtectedRoute>} />

                  {/* pages  */}
                  <Route path="/Students" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <Student /> </ProtectedRoute>} />
                  <Route path="/Teachers" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <Customers /> </ProtectedRoute>} />

                  {/* apps  */}
                  <Route path="/News" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <News /> </ProtectedRoute>} />
                  <Route path="/Notification" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <Notification /> </ProtectedRoute>} />
                  <Route path="/faculty" element={<ProtectedRoute isAuthenticated={isAuthenticated}> <Faculty /> </ProtectedRoute>} />
                  <Route path="/education-program"element={<ProtectedRoute isAuthenticated={isAuthenticated}><EducationProgram />{" "}</ProtectedRoute>}/>
                  <Route path="/education-program/:id"
                  element={<ProtectedRoute isAuthenticated={isAuthenticated}>
                      <EducationProgramSubject />{" "}
                    </ProtectedRoute>}/>
                      
                  <Route path="/login" element={<Login />} />
                </Routes>
            </div>
            <Footer />
          </NavbarMain>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
