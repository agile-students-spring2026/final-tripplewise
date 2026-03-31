//App logic
import { useState } from "react";
import SignUpPageOne from "./components/SignUpPageOne";
import SignUpPageTwo from "./components/SignUpPageTwo";
import ProfileMatchPage from "./components/ProfileMatchPage";
import UserDashboard from "./components/UserDashboard";
import LoginPage from "./components/LoginPage";
import StartUpPage from "./components/StartUpPage";
import EditStudyLocations from "./components/EditStudyLocations";
import EditStudyMethods from "./components/EditStudyMethods";
import EditAccountDetails from "./components/EditAccountDetails";
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
          onLogin={() => setPage("dashboard")} 
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

      {page === "dashboard" && (
        <UserDashboard onLogout={() => setPage("start")} />
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
