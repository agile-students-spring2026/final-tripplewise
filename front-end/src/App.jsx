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
import EditSchedule from "./components/EditSchedule";
import EditStudyLocations from "./components/EditStudyLocations";
import EditStudyMethods from "./components/EditStudyMethods";
import EditAccountDetails from "./components/EditAccountDetails";
import SyncMatch from "./components/SyncMatch";
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
          onLogin={() => setPage("dashboard")} 
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

      {page === "dashboard" && (
        <UserDashboard 
          onLogout={() => setPage("start")}
          onFindMatches={() => setPage("matches")}
          onProfile={() => setPage("userProfile")}
          onOrganizeSyncs={() => setPage("syncmatch")}
        />
      )}

      {page === "userProfile" && (
        <Profile
          goBack={() => setPage("dashboard")}
          onEditSchedule={() => setPage("editSchedule")}
          onEditLocations={() => setPage("editLocations")}
          onEditMethods={() => setPage("editMethods")}
          onEditAccount={() => setPage("editAccount")}
          onLogout={() => setPage("start")}
        />
      )}
      {page === "syncmatch" && (
      <SyncMatch 
      goBack={() => setPage("dashboard")} />
      )}

      {page === "matches" && (
        <StudySyncMatches onBack={() => setPage("dashboard")} />
      )}

      {page === "editSchedule" && (
        <EditSchedule goBack={() => setPage("userProfile")} />
      )}

      {page === "editLocations" && (
        <EditStudyLocations goBack={() => setPage("userProfile")} />
      )}

      {page === "editMethods" && (
        <EditStudyMethods goBack={() => setPage("userProfile")} />
      )}

      {page === "editAccount" && (
        <EditAccountDetails goBack={() => setPage("userProfile")} />
      )}

      {page === "syncCompleted" && (
        <SyncCompleted onBackToDashboard={() => setPage("dashboard")} />
      )}

      {page === "syncMatch" && (
        <StudySyncMeetings 
          onBack={() => setPage("dashboard")} 
          onSendRequest={() => setPage("syncCompleted")} 
        />
      )}

    </div>
  );
}
