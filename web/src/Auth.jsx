import React, { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        })
        if (error) throw error
        setMessage('Pendaftaran berhasil. Periksa email untuk konfirmasi jika diminta.')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/AntarYuk/'
      }
    })
    if (error) setMessage(error.message)
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">A</div>
          <div>
            <h1>AntarYuk</h1>
            <span>INDONESIA</span>
          </div>
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">SELAMAT DATANG</span>
          <h2>{isLogin ? 'Masuk ke akunmu' : 'Buat akun baru'}</h2>
          <p>
            {isLogin
              ? 'Lanjutkan perjalanan bersama AntarYuk.'
              : 'Bergabung dan nikmati layanan AntarYuk.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              Nama lengkap
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Kata sandi
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : isLogin ? 'Masuk Sekarang →' : 'Daftar Sekarang →'}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-divider"><span>ATAU</span></div>

        <button
          type="button"
          className="social-button"
          onClick={handleGoogleLogin}
        >
          <span className="google-mark">G</span>
          Lanjutkan dengan Google
        </button>

        <button
          type="button"
          className="social-button"
          onClick={() => setMessage('Login Facebook akan tersedia setelah konfigurasi OAuth selesai.')}
        >
          <span className="facebook-mark">f</span>
          Lanjutkan dengan Facebook
        </button>

        <p className="auth-switch">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}
          >
            {isLogin ? 'Daftar' : 'Masuk'}
          </button>
        </p>

        <p className="auth-footer">© 2026 AntarYuk Indonesia</p>
      </section>
    </main>
  )
}
