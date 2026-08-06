import { useState } from "react";
import "./App.css";

import { useAuth } from "./context/AuthContext.jsx";

import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";

import HomePage from "./pages/HomePage.jsx";
import InputPage from "./pages/InputPage.jsx";
import DailyPage from "./pages/DailyPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

export default function App() {
  const {
    user,
    authLoading,
    authError,
    login,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("home");
  const [editingTransaction, setEditingTransaction] =
    useState(null);

  if (authLoading) {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <h1>PROJECT MINUS ZERO</h1>
          <p>로그인 상태를 확인하고 있습니다.</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <p className="auth-eyebrow">
            DEBT RECOVERY PROJECT
          </p>

          <h1>PROJECT MINUS ZERO</h1>

          <p className="auth-description">
            Google 계정으로 로그인하면 맥과 아이폰에서
            같은 데이터를 사용할 수 있습니다.
          </p>

          <button
            className="google-login-btn"
            type="button"
            onClick={login}
          >
            Google로 로그인
          </button>

          {authError && (
            <p className="auth-error">{authError}</p>
          )}
        </section>
      </main>
    );
  }

  function startEdit(transaction) {
    setEditingTransaction(transaction);
    setActiveTab("input");
  }

  function finishInput() {
    setEditingTransaction(null);
    setActiveTab("history");
  }

  function changeTab(tab) {
    setEditingTransaction(null);
    setActiveTab(tab);
  }

  function renderPage() {
    switch (activeTab) {
      case "input":
        return (
          <InputPage
            editingTransaction={editingTransaction}
            onFinished={finishInput}
            onCancel={() => {
              setEditingTransaction(null);
              setActiveTab("history");
            }}
          />
        );

      case "daily":
        return <DailyPage />;

      case "history":
        return <HistoryPage onEdit={startEdit} />;

      case "settings":
        return <SettingsPage />;

      default:
        return <HomePage />;
    }
  }

  return (
    <div className="app">
      <Header />

      <section className="user-bar">
        <div>
          <strong>
            {user.displayName || user.email}
          </strong>

          <small>{user.email}</small>
        </div>

        <button type="button" onClick={logout}>
          로그아웃
        </button>
      </section>

      <main className="main">{renderPage()}</main>

      <BottomNav
        activeTab={activeTab}
        onChange={changeTab}
      />
    </div>
  );
}