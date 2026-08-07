export default function Header({
  user,
  onLogout,
}) {
  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Member";

  const initial = displayName
    .slice(0, 1)
    .toUpperCase();

  return (
    <header className="v11-header">
      <div className="v11-header-orb v11-header-orb-one" />
      <div className="v11-header-orb v11-header-orb-two" />

      <div className="v11-header-inner">
        <div className="v11-brand">
          <div className="v11-brand-mark">
            <span>M</span>
            <span>0</span>
          </div>

          <div className="v11-brand-copy">
            <small>PROJECT</small>
            <strong>MINUS ZERO</strong>
            <span>Every Day Counts.</span>
          </div>
        </div>

        <button
          className="v11-profile"
          type="button"
          onClick={onLogout}
          title="로그아웃"
        >
          <span className="v11-profile-avatar">
            {initial}
          </span>

          <span className="v11-profile-copy">
            <strong>{displayName}</strong>
            <small>Sign out</small>
          </span>
        </button>
      </div>
    </header>
  );
}
