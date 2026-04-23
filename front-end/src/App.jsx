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
import ScheduleStudySync from "./components/ScheduleStudySync";
import SyncCompleted from "./components/SyncCompleted";
import { styles } from "./styles";

export default function App() {
  const [page, setPage] = useState("start");
  const [selectedMatchProfile, setSelectedMatchProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [signupUsername, setSignupUsername] = useState("");

  function openMatchProfile(match) {
    setSelectedMatchProfile(match);
    setPage("matchProfile");
  }

  return (
    <div style={styles.phoneScreen}>

      {page === "start" && (
        <StartUpPage
          onSignUp={() => setPage("signup1")}
          onLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <LoginPage
          goBack={() => setPage("start")}
          onLogin={(user) => {
            const normalized =
              typeof user === "string"
                ? { id: Date.now(), username: user }
                : user || { id: Date.now(), username: "user" };
            console.log("App: normalized logged-in user:", normalized);
            setCurrentUser(normalized);
            setPage("dashboard");
          }}
        />
      )}

      {page === "signup1" && (
         <SignUpPageOne
          goNext={(uname) => {
            if (uname) setSignupUsername(uname);
            setPage("signup2");
          }}
          goBack={() => setPage("start")}
        />
      )}

      {page === "signup2" && (
        <SignUpPageTwo
          initialUsername={signupUsername}
          goBack={() => setPage("signup1")}
          onComplete={(user) => {
            setCurrentUser(user);
            setPage("dashboard");
          }}
        />
      )}

      {page === "dashboard" && (
        <UserDashboard
          onLogout={() => setPage("start")}
          onFindMatches={() => setPage("matches")}
          onProfile={() => setPage("userProfile")}
          // FIX: consistent casing — "syncmatch" used everywhere
          onOrganizeSyncs={() => setPage("syncmatch")}
        />
      )}

      {page === "userProfile" && (
        <Profile
          currentUser={currentUser}
          goBack={() => setPage("dashboard")}
          onEditSchedule={() => setPage("editSchedule")}
          onEditLocations={() => setPage("editLocations")}
          onEditMethods={() => setPage("editMethods")}
          onEditAccount={() => setPage("editAccount")}
        onLogout={() => setPage("start")}
        />
      )}

      {page === "syncmatch" && (
        <ScheduleStudySync
          goBack={() => setPage("dashboard")}
        />
      )}

      {page === "matches" && (
        <StudySyncMatches
          onBack={() => setPage("dashboard")}
          onViewProfile={openMatchProfile}
        />
      )}

      {page === "matchProfile" && selectedMatchProfile && (
        <ProfileMatchPage
          profile={selectedMatchProfile}
          goBack={() => setPage("matches")}
          goToDashboard={() => setPage("dashboard")}
        />
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
        <EditAccountDetails
          goBack={() => setPage("userProfile")}
          onLogout={() => setPage("start")}
        />
      )}

      {page === "syncCompleted" && (
        <SyncCompleted onBackToDashboard={() => setPage("dashboard")} />
      )}

    </div>
  );
}