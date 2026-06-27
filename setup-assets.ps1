# Copy your book cover into the site (run once)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$coversDir = Join-Path $root "public\covers"
New-Item -ItemType Directory -Force -Path $coversDir | Out-Null

$coverSource = "C:\Users\sanyo\.cursor\projects\empty-window\assets\c__Users_sanyo_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-04_at_9.03.45_AM__1_-d4e4e2b6-6844-4a86-8436-e2afb7e4dc67.png"

if (Test-Path $coverSource) {
  Copy-Item $coverSource (Join-Path $coversDir "aurora-to-starry-nights.png") -Force
  Write-Host "Cover copied."
} else {
  Write-Host "Cover image not found. Copy your book cover to public/covers/aurora-to-starry-nights.png manually."
}

Write-Host "Done."
