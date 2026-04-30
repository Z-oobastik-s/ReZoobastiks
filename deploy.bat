@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"

set "GITHUB_OWNER=Z-oobastik-s"
set "GITHUB_REPO=ReZoobastiks"
set "BRANCH=main"
set "REPO_URL=https://github.com/%GITHUB_OWNER%/%GITHUB_REPO%.git"
set "TOKEN_FILE=github-token.txt"

set "STEP=0"

call :next_step "Project structure checks"
if not exist "package.json" (
  call :log_error "package.json not found. Run script from project root."
  goto END_FAIL
)
if not exist "src\" (
  if not exist "app\" (
    call :log_error "Neither src nor app directory found. This is not a frontend project root."
    goto END_FAIL
  )
)
call :log_ok "Project root looks valid"

call :next_step "Check Node.js and npm"
where node >nul 2>&1
if errorlevel 1 (
  call :log_error "Node.js not found in PATH. Install Node.js and retry."
  goto END_FAIL
)
where npm >nul 2>&1
if errorlevel 1 (
  call :log_error "npm not found in PATH. Verify Node.js installation."
  goto END_FAIL
)
call :log_ok "Node.js and npm detected"

call :next_step "Check Git"
where git >nul 2>&1
if errorlevel 1 (
  call :log_error "Git not found in PATH. Install Git for Windows."
  goto END_FAIL
)
call :log_ok "Git detected"

call :next_step "Install npm dependencies"
call npm install --no-audit --no-fund
if errorlevel 1 (
  call :log_error "npm install failed."
  goto END_FAIL
)
call :log_ok "Dependencies installed"

call :next_step "Read GitHub token file"
if not exist "%TOKEN_FILE%" (
  call :log_error "Token file %TOKEN_FILE% was not found."
  goto END_FAIL
)
set "GITHUB_TOKEN="
set /p GITHUB_TOKEN=<"%TOKEN_FILE%"
if not defined GITHUB_TOKEN (
  call :log_error "Token file %TOKEN_FILE% is empty. Put token on first line."
  goto END_FAIL
)
set "AUTH_REPO_URL=https://%GITHUB_TOKEN%@github.com/%GITHUB_OWNER%/%GITHUB_REPO%.git"
call :log_ok "Token loaded"

call :next_step "Initialize and configure Git"
if not exist ".git\" (
  call git init -b %BRANCH%
  if errorlevel 1 (
    call :log_error "Failed to initialize git repository."
    goto END_FAIL
  )
  call :log_ok "Git repository initialized"
) else (
  call :log_warning "Git repository already exists, init skipped"
)

for /f "usebackq delims=" %%i in (`git config user.name 2^>nul`) do set "GIT_USER_NAME=%%i"
if not defined GIT_USER_NAME (
  call git config user.name "Zoobastiks"
)
for /f "usebackq delims=" %%i in (`git config user.email 2^>nul`) do set "GIT_USER_EMAIL=%%i"
if not defined GIT_USER_EMAIL (
  call git config user.email "zoobastiks@example.com"
)
call :log_ok "Git user.name and user.email are set"

call :next_step "Configure origin and EOL"
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  call git remote add origin "%AUTH_REPO_URL%"
  if errorlevel 1 (
    call :log_error "Failed to add remote origin."
    goto END_FAIL
  )
) else (
  call git remote set-url origin "%AUTH_REPO_URL%"
  if errorlevel 1 (
    call :log_error "Failed to update origin URL."
    goto END_FAIL
  )
)
if not exist ".gitattributes" (
  >".gitattributes" echo * text=auto eol=lf
)
call :log_ok "origin configured, .gitattributes ready"

call :next_step "Stage files and security check"
if not exist ".git\" (
  call :log_warning ".git folder is missing before staging. Re-initializing repository."
  git init -b %BRANCH%
  if errorlevel 1 (
    call :log_error "Failed to initialize git repository before staging."
    goto END_FAIL
  )
)
call git rm -r --cached . >nul 2>&1
call git add -A
if errorlevel 1 (
  call :log_error "git add -A failed."
  goto END_FAIL
)
git diff --cached --name-only > "%TEMP%\rzb_staged_files.txt"
findstr /I /R "\.env$" "%TEMP%\rzb_staged_files.txt" >nul 2>&1
if not errorlevel 1 (
  call git reset HEAD . >nul 2>&1
  call :log_error ".env detected in staged files. Commit canceled for security."
  del "%TEMP%\rzb_staged_files.txt" >nul 2>&1
  goto END_FAIL
)
del "%TEMP%\rzb_staged_files.txt" >nul 2>&1
call :log_ok "Security check passed"

call :next_step "Commit and push to GitHub"
git diff --cached --quiet
if errorlevel 1 (
  set "COMMIT_MSG=Deploy ReZoobastiks %date% %time%"
  call git commit -m "!COMMIT_MSG!"
  if errorlevel 1 (
    call :log_error "Failed to create commit."
    goto END_FAIL
  )
  call :log_ok "Commit created"
) else (
  call :log_warning "No changes to commit, commit step skipped"
)

for /f "usebackq delims=" %%i in (`git branch --show-current`) do set "CURRENT_BRANCH=%%i"
if /I not "!CURRENT_BRANCH!"=="%BRANCH%" (
  call git branch -M %BRANCH%
  if errorlevel 1 (
    call :log_error "Failed to rename current branch to %BRANCH%."
    goto END_FAIL
  )
)

call git push -u origin %BRANCH% --force
if errorlevel 1 (
  call :log_error "Push to GitHub failed."
  goto END_FAIL
)
call :log_ok "Push completed"

call :next_step "Remove token from origin URL"
call git remote set-url origin "%REPO_URL%"
if errorlevel 1 (
  call :log_warning "Failed to restore plain origin URL. Check manually with git remote -v"
) else (
  call :log_ok "origin restored to token-free URL"
)
set "GITHUB_TOKEN="
set "AUTH_REPO_URL="

goto END_OK

:next_step
set /a STEP+=1
echo.
echo [%STEP%/10] %~1
exit /b 0

:log_ok
echo [OK] %~1
exit /b 0

:log_warning
echo [WARNING] %~1
exit /b 0

:log_error
echo [ERROR] %~1
exit /b 0

:END_FAIL
echo.
echo [ERROR] Script finished with errors.
pause
exit /b 1

:END_OK
echo.
echo [OK] Deploy completed successfully.
echo [OK] Repository: https://github.com/%GITHUB_OWNER%/%GITHUB_REPO%
pause
exit /b 0
