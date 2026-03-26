
import { useState } from "react";
import SignUpPageOne from "./components/SignUpPageOne";
import SignUpPageTwo from "./components/SignUpPageTwo";
import ProfileMatchPage from "./components/ProfileMatchPage";
import LoginPage from "./components/LoginPage";
import StartUpPage from "./components/StartUpPage";
import { styles } from "./styles";

export default function App() {
  const [page, setPage] = useState("start");
  
  return (
    <div style={styles.phoneScreen}>

      {page === "login" && (
        <LoginPage 
          goBack={() => setPage("start")} 
          onLogin={() => alert("add dashboard link here!")} 
        />
      )}

      {page === "start" && (
        <StartUpPage 
          onSignUp={() => setPage("signup1")} 
          onLogin={() => setPage("login")} 
        />
      )}

      {page === "signup1" && (
        <SignUpPageOne goNext={() => setPage("signup2")} />
      )}

      {page === "signup2" && (
        <SignUpPageTwo
          goBack={() => setPage("signup1")}
          goNext={() => setPage("profile")}
        />
      )}

      {page === "profile" && (
        <ProfileMatchPage goBack={() => setPage("signup2")} />
      )}
    </div>
  );
}