# Push this website to GitHub (pavisakthi1699-creator/gaagroups) in one step.
#
# How to use (Windows):
#   1. Unzip the website zip anywhere (for example Downloads).
#   2. Open the unzipped folder, click the address bar, type  powershell  and press Enter.
#   3. Run:   powershell -ExecutionPolicy Bypass -File .\push-to-github.ps1
#
# What it does: downloads the current repository into a temporary folder, replaces its files with
# the ones in this folder (keeping the Git history), commits and pushes to the main branch.
# Vercel then deploys the new version automatically.

param(
  [string]$Repo = "https://github.com/pavisakthi1699-creator/gaagroups.git",
  [string]$Branch = "main",
  [string]$Message = "Website update"
)

$ErrorActionPreference = "Stop"
$src = $PSScriptRoot
$work = Join-Path $env:TEMP ("gaagroups-push-" + (Get-Date -Format "yyyyMMddHHmmss"))

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git is not installed. Install it from https://git-scm.com/download/win and run this again." -ForegroundColor Red
  exit 1
}

Write-Host "Downloading the repository..." -ForegroundColor Cyan
git clone --quiet $Repo $work
if ($LASTEXITCODE -ne 0) { Write-Host "Could not download $Repo. Check your internet connection and GitHub access." -ForegroundColor Red; exit 1 }
Set-Location $work
git checkout --quiet $Branch 2>$null
if ($LASTEXITCODE -ne 0) { git checkout --quiet -b $Branch }

Write-Host "Copying the new website files..." -ForegroundColor Cyan
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -Path $src -Force | Where-Object { @(".git", "node_modules", "dist") -notcontains $_.Name } |
  ForEach-Object { Copy-Item $_.FullName -Destination $work -Recurse -Force }

git add -A
$changes = git status --porcelain
if (-not $changes) { Write-Host "Nothing changed. GitHub already has this version." -ForegroundColor Yellow; exit 0 }

if (-not (git config user.email)) { git config user.email "outreach.highbizz@gmail.com" }
if (-not (git config user.name))  { git config user.name "GAA Group" }
git commit --quiet -m $Message

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin $Branch
if ($LASTEXITCODE -ne 0) { Write-Host "Push failed. Make sure you are signed in to GitHub with access to the repository." -ForegroundColor Red; exit 1 }

Write-Host "Done. Vercel will deploy the new version in a minute or two." -ForegroundColor Green
Set-Location $src
Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
