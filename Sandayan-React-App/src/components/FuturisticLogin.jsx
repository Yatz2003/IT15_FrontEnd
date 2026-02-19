import React, { useState, useEffect, useRef } from 'react'
import './FuturisticLogin.css'

export default function FuturisticLogin(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [typing, setTyping] = useState('none')
  const [blinking, setBlinking] = useState(false)
  const blinkTimer = useRef(null)
  const blinkInterval = useRef(null)

  const onUsernameChange = (e) => { setUsername(e.target.value); setTyping('username') }
  const onPasswordChange = (e) => { setPassword(e.target.value); setTyping('password') }
  const onBlur = () => { setTimeout(()=>setTyping('none'), 150) }

  const eyesState = typing === 'password' ? 'closed' : (typing === 'username' ? 'open' : (blinking ? 'closed' : 'neutral'))

  useEffect(()=>{
    function scheduleBlink(){
      const next = 3000 + Math.floor(Math.random()*4000)
      blinkInterval.current = setTimeout(()=>{
        setBlinking(true)
        blinkTimer.current = setTimeout(()=> setBlinking(false), 220)
        scheduleBlink()
      }, next)
    }
    scheduleBlink()
    return ()=>{
      clearTimeout(blinkInterval.current)
      clearTimeout(blinkTimer.current)
    }
  }, [])

  return (
    <div className="login-page">
      <div className="background-grid" />
      <div className="glass-card">
        <div className="card-top">
          <div className="sponge-wrap">
            <svg className={`monkey ${eyesState} ${blinking ? 'blink' : ''} ${typing === 'username' ? 'smile' : ''} ${typing === 'password' ? 'cover' : ''}`} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="monkey logo">
              <defs>
                <mask id="peekMask">
                  <rect x="0" y="0" width="220" height="220" fill="white" />
                  {/* hole over right eye to allow peek */}
                  <circle cx="142" cy="92" r="7" fill="black" />
                </mask>
              </defs>

              {/* face */}
              <circle cx="110" cy="100" r="68" fill="#dca36a" stroke="#b77b45" strokeWidth="3" />
              {/* ears */}
              <circle cx="42" cy="98" r="20" fill="#dca36a" />
              <circle cx="178" cy="98" r="20" fill="#dca36a" />

              {/* cheeks / muzzle */}
              <ellipse cx="110" cy="122" rx="38" ry="28" fill="#f6e0bf" />

              {/* eyes group */}
              <g className="eyes" transform="translate(0,0)">
                <g className="eye left">
                  <ellipse className="eye-open" cx="86" cy="86" rx="12" ry="14" fill="#fff" />
                  <circle className="pupil" cx="86" cy="90" r="4" fill="#2b2b2b" />
                  <rect className="eye-closed" x="74" y="86" width="24" height="6" rx="3" fill="#2b2b2b" />
                </g>
                <g className="eye right">
                  <ellipse className="eye-open" cx="142" cy="86" rx="12" ry="14" fill="#fff" />
                  <circle className="pupil" cx="142" cy="90" r="4" fill="#2b2b2b" />
                  <rect className="eye-closed" x="130" y="86" width="24" height="6" rx="3" fill="#2b2b2b" />
                </g>
              </g>

              {/* mouth: neutral and smile; toggle via .smile */}
              <g className="mouth" transform="translate(0,0)">
                <path className="mouth-neutral" d="M96 118 q14 6 28 0" stroke="#6b3f2a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="1" />
                <path className="mouth-smile" d="M86 118 q24 26 48 0" stroke="#6b3f2a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0" />
              </g>

              {/* hands that slide up to cover eyes when typing password; mask used so right eye can peek */}
              <g className="hands" mask={typing === 'password' ? 'url(#peekMask)' : ''}>
                <rect className="hand left" x="56" y="132" width="60" height="26" rx="12" fill="#b57e4a" />
                <rect className="hand right" x="104" y="132" width="60" height="26" rx="12" fill="#b57e4a" />
              </g>
            </svg>
          </div>
        </div>

        <form className="login-form" onSubmit={(e)=>e.preventDefault()}>
          <label className="field">
            <span>Username</span>
            <input
              value={username}
              onChange={onUsernameChange}
              onFocus={()=>setTyping('username')}
              onBlur={onBlur}
              placeholder="Enter username"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              onFocus={()=>setTyping('password')}
              onBlur={onBlur}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </label>

          <button className="submit">Sign In</button>
        </form>
      </div>
      <div className="attribution">Futuristic Login · playful demo</div>
    </div>
  )
}
