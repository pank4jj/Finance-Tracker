import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/api';

/* ── Reusable toggle switch ── */
const Toggle = ({ checked, onChange, disabled = false }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className="theme-toggle"
    style={{
      background: checked ? 'var(--rausch)' : 'var(--surface-strong)',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    aria-pressed={checked}
  >
    <div
      className="theme-toggle-thumb"
      style={{ left: checked ? '22px' : '3px' }}
    />
  </button>
);

/* ── Read-only info row ── */
const InfoRow = ({ label, value, mono }) => (
  <div className="py-4 border-b last:border-0" style={{ borderColor: 'var(--hairline)' }}>
    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
    <p className={`text-sm ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--ink)' }}>{value || '—'}</p>
  </div>
);

const Profile = () => {
  const { user, login, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Profile form state
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveOk, setSaveOk]       = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    gender: '',
    dob: '',
    phone: '',
    bio: '',
  });

  // Password change state
  const [showPwForm, setShowPwForm]     = useState(false);
  const [pwData, setPwData]             = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving]         = useState(false);
  const [pwError, setPwError]           = useState('');
  const [pwOk, setPwOk]                 = useState(false);

  // Load full profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileService.get();
        const data = res.data;
        setProfile({
          name:   data.name   || user?.name || '',
          gender: data.gender || '',
          dob:    data.dob    || '',
          phone:  data.phone  || '',
          bio:    data.bio    || '',
        });
      } catch (err) {
        // Fall back to auth context user if API fails
        setProfile((prev) => ({ ...prev, name: user?.name || '' }));
      }
    };
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initials = profile.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  /* ── Profile save ── */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveOk(false);
    try {
      const res = await profileService.update(profile);
      // Update auth context so TopNav + avatar reflect new name immediately
      const token = localStorage.getItem('token');
      login({ ...user, name: res.data.name }, token);
      setSaveOk(true);
      setEditing(false);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  /* ── Password change ── */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwOk(false);
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (pwData.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      await profileService.changePassword(pwData.currentPassword, pwData.newPassword);
      setPwOk(true);
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPwForm(false);
      setTimeout(() => setPwOk(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Manage your account and preferences</p>
      </div>

      <div className="max-w-lg space-y-4">

        {/* ── Avatar + name card ── */}
        <div className="card p-6 flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold text-white shrink-0"
            style={{ background: 'var(--rausch)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold truncate" style={{ color: 'var(--ink)' }}>{profile.name || user?.name}</p>
            <p className="text-sm truncate" style={{ color: 'var(--muted)' }}>{user?.email}</p>
            {profile.bio && (
              <p className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>{profile.bio}</p>
            )}
          </div>
        </div>

        {/* ── Edit profile card ── */}
        <div className="card px-6">
          <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--hairline)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Personal information</h2>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setSaveError(''); setSaveOk(false); }}
                className="text-sm font-medium"
                style={{ color: 'var(--rausch)' }}
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="py-4 space-y-4">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Full name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="airbnb-input"
                  required
                  placeholder="Your full name"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="airbnb-select"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Date of birth
                </label>
                <input
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  className="airbnb-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Phone number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="airbnb-input"
                  placeholder="+1 555 000 0000"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Short bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="airbnb-input"
                  style={{ height: 'auto', minHeight: '80px', resize: 'vertical', padding: '12px' }}
                  placeholder="Tell us a bit about yourself"
                  maxLength={200}
                />
                <p className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>
                  {profile.bio.length}/200
                </p>
              </div>

              {saveError && (
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{saveError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setSaveError(''); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <InfoRow label="Full name" value={profile.name || user?.name} />
              <InfoRow label="Email"     value={user?.email} />
              <InfoRow label="Gender"    value={
                profile.gender === 'male' ? 'Male'
                : profile.gender === 'female' ? 'Female'
                : profile.gender === 'non-binary' ? 'Non-binary'
                : profile.gender === 'prefer-not-to-say' ? 'Prefer not to say'
                : '—'
              } />
              <InfoRow label="Date of birth" value={
                profile.dob
                  ? new Date(profile.dob + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '—'
              } />
              <InfoRow label="Phone" value={profile.phone} />
              <InfoRow label="Bio"   value={profile.bio} />
              <InfoRow label="User ID" value={user?.id} mono />
            </>
          )}

          {saveOk && (
            <div className="py-3 text-sm font-medium" style={{ color: '#10b981' }}>
              ✓ Profile saved successfully
            </div>
          )}
        </div>

        {/* ── Settings card ── */}
        <div className="card px-6">
          <h2 className="text-sm font-semibold py-4 border-b" style={{ color: 'var(--ink)', borderColor: 'var(--hairline)' }}>
            Settings
          </h2>

          {/* Dark mode — LIVE */}
          <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--hairline)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Dark mode</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </p>
            </div>
            <Toggle checked={isDark} onChange={toggleTheme} />
          </div>

          {/* Budget alerts — placeholder */}
          <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--hairline)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Budget alerts</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Notify when near limit</p>
            </div>
            <Toggle checked={true} onChange={() => {}} disabled />
          </div>

          {/* Change password */}
          <div className="py-4 border-b last:border-0" style={{ borderColor: 'var(--hairline)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Password</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Change your login password</p>
              </div>
              <button
                onClick={() => { setShowPwForm((v) => !v); setPwError(''); setPwOk(false); }}
                className="text-sm font-medium"
                style={{ color: 'var(--rausch)' }}
              >
                {showPwForm ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showPwForm && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                    Current password
                  </label>
                  <input
                    type="password"
                    value={pwData.currentPassword}
                    onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
                    className="airbnb-input"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                    New password
                  </label>
                  <input
                    type="password"
                    value={pwData.newPassword}
                    onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                    className="airbnb-input"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={pwData.confirmPassword}
                    onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                    className="airbnb-input"
                    required
                    autoComplete="new-password"
                  />
                </div>
                {pwError && <p className="text-sm" style={{ color: '#ef4444' }}>{pwError}</p>}
                <button type="submit" disabled={pwSaving} className="btn-primary w-full">
                  {pwSaving ? 'Updating…' : 'Update password'}
                </button>
              </form>
            )}
            {pwOk && (
              <p className="text-sm font-medium mt-2" style={{ color: '#10b981' }}>✓ Password updated</p>
            )}
          </div>
        </div>

        {/* ── Quick tips ── */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Quick tips</h2>
          <ul className="space-y-2">
            {[
              'Dashboard gives you a full financial overview',
              'Add transactions to log income and expenses',
              'Set budgets to cap spending by category',
              'Create categories to organise your finances',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                <span style={{ color: 'var(--rausch)' }} className="shrink-0 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Sign out ── */}
        <div className="card p-6" style={{ border: '1px solid #fecdd3' }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Sign out</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            You will need to log in again to access your data.
          </p>
          <button onClick={handleLogout} className="btn-danger w-full">
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
