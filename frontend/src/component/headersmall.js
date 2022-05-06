
function Headersmall() {
  
  return (
        <div className="small__menu">
          <ul>
            <li>
              <a href="#">Exchange</a>
            </li>
            <li>
              <a href="#">Affiliate</a>
            </li>
            <li>
              <a href="#">Swap Multi Chain</a>
            </li>
            <li>
              <a href="#" className="theme__switcher--button">
                <div className="double__column">
                  <span>Mode</span>
                  <div className="theme__switcher">
                    <div className="dark__switch">
                      <span>
                        <svg className="dark__theme" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. */}<path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z" /></svg>
                        <svg className="light__theme" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. */}<path d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className="double__column">
                  <span>Network</span>
                  <div className="wallet__currency">
                    <div className="wrapper__currency--mobile">
                      <img src="img/logo2.webp" alt="logo" /> BNB
                      <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z" /></svg></span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className="double__column">
                  <span>Wallet</span>
                  <div className="wallet__button">
                    <div>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}><rect width={24} height={24} rx={12} fill="#233447" /><path d="M17.765 5.783L12.77 9.494l.924-2.19 4.072-1.521z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.23 5.783l4.956 3.746-.879-2.225L6.23 5.783zM15.967 14.385l-1.33 2.04 2.847.783.818-2.777-2.335-.046zM5.702 14.43l.814 2.778 2.847-.784-1.33-2.039-2.33.046z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.202 10.94l-.793 1.2 2.827.126-.1-3.038-1.934 1.712zM14.792 10.94l-1.959-1.747-.065 3.073 2.822-.125-.798-1.2zM9.363 16.424l1.697-.828-1.466-1.145-.231 1.973zM12.934 15.596l1.702.828-.236-1.973-1.466 1.145z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.637 16.424l-1.702-.828.135 1.11-.015.467 1.582-.749zM9.364 16.424l1.582.749-.01-.467.125-1.11-1.697.828z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.97 13.717l-1.415-.416 1-.457.416.873zM13.024 13.717l.417-.873 1.005.457-1.422.416z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.364 16.424l.24-2.039-1.571.046 1.33 1.993zM14.396 14.385l.24 2.04 1.331-1.994-1.572-.046zM15.59 12.14l-2.821.126.26 1.451.418-.873 1.004.457 1.14-1.16zM9.554 13.3l1.005-.456.411.873.266-1.45-2.827-.126 1.145 1.16z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.41 12.14l1.184 2.31-.04-1.15-1.145-1.16zM14.45 13.3l-.05 1.15 1.19-2.31-1.14 1.16zM11.236 12.266l-.266 1.451.332 1.713.075-2.255-.14-.909zM12.768 12.266l-.135.904.06 2.26.337-1.713-.262-1.45z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.03 13.717l-.337 1.713.241.166 1.467-1.145.05-1.15-1.421.416zM9.555 13.3l.04 1.15 1.466 1.146.241-.166-.331-1.713-1.416-.416z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.055 17.173l.015-.467-.126-.11h-1.893l-.115.11.01.467-1.582-.749.552.452 1.12.779h1.924l1.124-.779.553-.452-1.582.749z" fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" /><path d="M12.934 15.596l-.24-.166h-1.392l-.24.166-.127 1.11.116-.11h1.893l.126.11-.136-1.11z" fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" /><path d="M17.977 9.735l.427-2.049-.638-1.903-4.831 3.585 1.858 1.572 2.626.769.583-.678-.251-.181.401-.367-.311-.24.402-.307-.266-.2zM5.597 7.686l.427 2.05-.271.2.402.306-.307.241.402.367-.251.18.577.679 2.627-.769 1.858-1.572L6.23 5.783l-.633 1.903z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" /><path d="M17.42 11.709l-2.627-.769.798 1.2-1.19 2.31 1.567-.02h2.335l-.884-2.721zM9.202 10.94l-2.626.769-.874 2.722h2.33l1.562.02-1.185-2.31.793-1.2zM12.768 12.266l.166-2.898.764-2.064h-3.39l.753 2.064.176 2.898.06.914.005 2.25h1.391l.01-2.25.065-.914z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      0x5be6…74b9
                      <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z" /></svg></span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Help</a>
            </li>
            <li>
              <a href="#">Feedback</a>
            </li>
          </ul>
        </div>
  
  );
}

export default Headersmall;
