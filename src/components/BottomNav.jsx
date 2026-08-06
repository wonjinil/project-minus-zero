function BottomNav({ activeTab, onChange }) {
  const menus = [
    { id: "home", icon: "🏠", label: "홈" },
    { id: "input", icon: "➕", label: "입력" },
    { id: "daily", icon: "📅", label: "일별" },
    { id: "history", icon: "📜", label: "내역" },
    { id: "settings", icon: "⚙️", label: "설정" },
  ];

  return (
    <nav className="bottom-nav">
      {menus.map((menu) => (
        <button
          key={menu.id}
          className={activeTab === menu.id ? "active" : ""}
          onClick={() => onChange(menu.id)}
        >
          <span>{menu.icon}</span>
          <span>{menu.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;