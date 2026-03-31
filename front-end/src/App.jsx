//App logic
import { useState } from "react";
import SignUpPageOne from "./components/SignUpPageOne";
import SignUpPageTwo from "./components/SignUpPageTwo";
import ProfileMatchPage from "./components/ProfileMatchPage";
import UserDashboard from "./components/UserDashboard";
import LoginPage from "./components/LoginPage";
import StartUpPage from "./components/StartUpPage";
import StudySyncMatches from "./components/StudySyncMatches";
import Profile from "./components/Profile"; 
import { styles } from "./styles";

export default function App() {
  const [page, setPage] = useState("start");
    function openProfile(profile) {
    setSelectedProfile(profile);
    setPage("profilePage");
  }
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

      {page === "profilePage" && (
        <Profile 
          profile={selectedProfile}
          goBack={() => setPage("matches")}
        />
      )}

      {page === "dashboard" && (
        <UserDashboard 
          onLogout={() => setPage("start")}
          onFindMatches={() => setPage("matches")}
        />
      )}
      {page === "profilePage" && (
        <Profile 
          profile={selectedProfile}
          goBack={() => setPage("matches")}
        />
      )}

      {page === "matches" && (
        <StudySyncMatches onBack={() => setPage("dashboard")} />
      )}

      {page === "editLocations" && (
        <EditStudyLocations goBack={() => setPage("dashboard")} />
      )}

      {page === "editMethods" && (
        <EditStudyMethods goBack={() => setPage("dashboard")} />
      )}

      {page === "editAccount" && (
        <EditAccountDetails goBack={() => setPage("dashboard")} />
      )}

    </div>
  );
}
