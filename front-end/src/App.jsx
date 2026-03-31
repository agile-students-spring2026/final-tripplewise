//App logic
import { useState } from "react";
import SignUpPageOne from "./components/SignUpPageOne";
import SignUpPageTwo from "./components/SignUpPageTwo";
import ProfileMatchPage from "./components/ProfileMatchPage";
import UserDashboard from "./components/UserDashboard";
import LoginPage from "./components/LoginPage";
import StartUpPage from "./components/StartUpPage";
import StudySyncMatches from "./components/StudySyncMatches";
import { styles } from "./styles";

export default function App() {
  const [page, setPage] = useState("start");
  
  return (
    <div style={styles.phoneScreen}>

      {page === "start" && (
        <StartUpPage 
          onSignUp={() => setPage("signup1")} 
          onLogin={() => setPage("dashboard")} 
        />
      )}

      {page === "login" && (
        <LoginPage 
          goBack={() => setPage("start")} 
          onLogin={() => alert("add dashboard link here!")} 
        />
      )}

      {page === "signup1" && (
        <SignUpPageOne 
          goNext={() => setPage("signup2")} 
          goBack={() => setPage("start")}
        />
      )}

      {page === "signup2" && (
        <SignUpPageTwo
          goBack={() => setPage("signup1")}
          goNext={() => setPage("login")}
        />
      )}

      {page === "profile" && (
        <ProfileMatchPage goBack={() => setPage("signup2")} />
      )}

      {page === "dashboard" && (
        <UserDashboard 
          onLogout={() => setPage("start")}
          onFindMatches={() => setPage("matches")}
        />
      )}

      {page === "matches" && (
        <StudySyncMatches onBack={() => setPage("dashboard")} />
      )}
    </div>
  );
}
