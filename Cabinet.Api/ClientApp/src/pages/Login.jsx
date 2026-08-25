/* eslint-disable */
/* global sessionStorage */
import React, { useEffect, useState } from 'react'
import { Eye, EyeOff, TriangleAlert, QrCode, Phone, Mail, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showKickedBanner, setShowKickedBanner] = useState(false)

  useEffect(() => {
    document.body.classList.add('login-page')

    if (sessionStorage.getItem('kicked_out') === '1') {
      setShowKickedBanner(true)
      sessionStorage.removeItem('kicked_out')
    }

    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err === 'unauthorized') {
      setError('Bạn cần đăng nhập để xem nội dung này.')
    } else if (err === 'forbidden') {
      setError(
        'Bạn không có quyền truy cập nội dung này. Vui lòng đăng nhập với tài khoản có thẩm quyền.'
      )
    }

    return () => {
      document.body.classList.remove('login-page')
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_name', data.username)
        localStorage.setItem('user_full_name', data.fullName || data.username)
        localStorage.setItem('user_role', data.role)
        localStorage.setItem('user_id', data.userId)

        if (onLoginSuccess) {
          onLoginSuccess()
        } else {
          window.location.reload()
        }
        return
      }

      const err = await res.json()
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng.')
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#000a29]"
      style={{
        backgroundImage: `url('/assets/tech_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="w-full max-w-[1000px] h-[600px] bg-white rounded-[2rem] shadow-2xl flex overflow-hidden relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Left Side: Image */}
        <div className="hidden md:block w-1/2 h-full relative">
          <img
            src="/assets/cabinet-login.png"
            alt="Meeting Room"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col">
          <div className="flex flex-col items-center mb-10 mt-4">
            <div className="flex items-center justify-center mb-4">
              {/* Cabinet Logo representation */}
              <div className="flex items-center gap-2">
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  className="h-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="text-3xl font-bold tracking-tight text-slate-800">Cabinet</span>
              </div>
            </div>
            <h1 className="text-[#051c48] font-extrabold text-[19px] md:text-[20px] text-center uppercase tracking-wide leading-snug whitespace-nowrap">
              Hệ thống thông tin phục vụ họp
              <br />
              và xử lý công việc
            </h1>
          </div>

          {/* Form */}
          <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
            {showKickedBanner && (
              <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                <div className="flex items-center gap-2.5">
                  <TriangleAlert className="size-4 text-destructive shrink-0" />
                  <p className="text-[11px] font-bold text-destructive leading-tight">
                    Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[13px] font-bold text-slate-700">
                  Tên tài khoản <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="username"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 border-slate-300 focus:border-red-500 focus:ring-red-500/20 rounded-xl px-4"
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-[13px] font-bold text-slate-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-slate-300 focus:border-red-500 focus:ring-red-500/20 rounded-xl px-4 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-12 rounded-xl text-[15px] font-bold transition-all duration-300',
                  isSubmitting
                    ? 'bg-slate-200 text-slate-500'
                    : 'bg-[#e3001b] hover:bg-[#c20017] text-white shadow-md'
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Đang xác thực...</span>
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </Button>

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-bold text-center">
                  {error}
                </div>
              )}
            </form>

            <div className="mt-8 flex flex-col items-center">
              <button
                type="button"
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
              >
                <QrCode className="size-5" />
                <span>Mã QR tải app</span>
              </button>
            </div>
          </div>

          {/* Footer Contacts */}
          <div className="mt-auto pt-6 flex items-center justify-center gap-6 text-[#e3001b] font-bold text-[13px]">
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>18008000-N7</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
