Param(
  [switch]$Commit
)

$root = (Get-Location)
$docs = Join-Path $root 'docs'
$assets = @('blocks','images','js','json')

foreach ($a in $assets) {
  $src = Join-Path $root $a
  $dst = Join-Path $docs $a
  if (Test-Path $src) {
    Write-Host "Copying $a to docs/"
    Copy-Item -Path $src -Destination $dst -Recurse -Force -ErrorAction SilentlyContinue
  } else {
    Write-Host "Source $src not found, skipping."
  }
}

# Replace ../blocks/ ../images/ ../js/ in HTML files in docs
Get-ChildItem -Path $docs -Filter *.html -Recurse | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $new = $content -replace '\.\./blocks/','blocks/' -replace '\.\./images/','images/' -replace '\.\./js/','js/'
  if ($new -ne $content) {
    Set-Content -Path $_.FullName -Value $new -Force
    Write-Host "Updated paths in $($_.FullName)"
  }
}

# create .nojekyll
$noj = Join-Path $root '.nojekyll'
if (-not (Test-Path $noj)) { New-Item -Path $noj -ItemType File -Force | Out-Null; Write-Host ".nojekyll created" }

if ($Commit) {
  Write-Host "Committing changes (git)"
  git add .
  git commit -m "Fix GitHub Pages: move assets into docs and fix paths; add .nojekyll"
  git push
}
