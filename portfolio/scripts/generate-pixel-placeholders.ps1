Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root "public\assets"

function Ensure-Dir([string]$p) {
  if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bmp.SetResolution(96, 96)
  return $bmp
}

function Save-Png($bmp, [string]$path) {
  Ensure-Dir (Split-Path -Parent $path)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$C = @{
  skin   = "#e8b18c"; body = "#f5a524"; dark = "#2b1a08"; visor = "#fbbf24"
  leg    = "#3b2a12"; shoe = "#241a0c"; neon = "#a855f7"; accent = "#22c55e"
  skyA   = "#160f08"; skyB = "#2a1a0c"; cityA = "#3a2410"; cityB = "#2a1b0d"
  win    = "#fde68a"; ground = "#3a3128"; ground2 = "#2a241d"; edge = "#4d4436"
  metal  = "#4a4238"; screen = "#241a10"; ok = "#22c55e"; warn = "#f59e0b"
  trans  = "#00000000"
}

function Br([string]$hex) { New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex)) }

function FillPx($g, [string]$hex, [int]$x, [int]$y, [int]$w, [int]$h) {
  $b = Br $hex
  $g.FillRectangle($b, $x, $y, $w, $h)
  $b.Dispose()
}

function New-Player([string]$name, [int]$frames) {
  $fw = 48; $fh = 48
  $bmp = New-Canvas ($fw * $frames) $fh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($C.trans))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half

  for ($f = 0; $f -lt $frames; $f++) {
    $ox = $f * $fw
    $bob = 0; $armUp = 0; $legOff = 0
    switch ($name) {
      "Idle" { $bob = @(0,0,1,0)[$f % 4] }
      "Run"  { $bob = @(0,1,0,1,0,1)[$f % 6]; $legOff = @(0,2,4,0,-2,-4)[$f % 6] }
      "Jump" { $bob = @(2,0,-1,0)[$f % 4]; $armUp = @(0,2,4,4)[$f % 4] }
      "Use"  { $bob = @(0,0,1,1,0,0)[$f % 6]; $armUp = @(4,6,6,4,4,6)[$f % 6] }
    }

    # jambes
    FillPx $g $C.leg ($ox + 17) (36 + $bob) 5 7
    FillPx $g $C.leg ($ox + 26 + [Math]::Floor($legOff/3)) (36 + $bob) 5 7
    FillPx $g $C.shoe ($ox + 16) (43 + $bob) 7 3
    FillPx $g $C.shoe ($ox + 25 + [Math]::Floor($legOff/3)) (43 + $bob) 7 3

    # corps / veste
    FillPx $g $C.body ($ox + 16) (24 + $bob) 16 13
    FillPx $g $C.dark ($ox + 16) (24 + $bob) 16 2
    FillPx $g $C.neon ($ox + 20) (30 + $bob) 8 2

    # bras
    $armY = 26 + $bob - $armUp
    FillPx $g $C.body ($ox + 12) $armY 4 9
    FillPx $g $C.body ($ox + 32) $armY 4 9
    FillPx $g $C.skin ($ox + 12) ($armY + 9) 4 3
    FillPx $g $C.skin ($ox + 32) ($armY + 9) 4 3

    # tete + visiere
    FillPx $g $C.skin ($ox + 17) (12 + $bob) 14 12
    FillPx $g $C.dark ($ox + 16) (10 + $bob) 16 4
    FillPx $g $C.visor ($ox + 18) (16 + $bob) 12 4
    FillPx $g "#ffffff" ($ox + 19) (17 + $bob) 3 1
  }

  $g.Dispose()
  Save-Png $bmp (Join-Path $assets "player\$name.png")
}

function New-Teammate() {
  $fw = 48; $fh = 48; $frames = 4
  $bmp = New-Canvas ($fw * $frames) $fh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($C.trans))
  for ($f = 0; $f -lt $frames; $f++) {
    $ox = $f * $fw
    $bob = @(0,0,1,0)[$f % 4]
    FillPx $g "#2b2b3d" ($ox + 17) (36 + $bob) 5 7
    FillPx $g "#2b2b3d" ($ox + 26) (36 + $bob) 5 7
    FillPx $g "#1a1a28" ($ox + 16) (43 + $bob) 7 3
    FillPx $g "#1a1a28" ($ox + 25) (43 + $bob) 7 3
    FillPx $g "#7c3aed" ($ox + 16) (24 + $bob) 16 13
    FillPx $g "#f59e0b" ($ox + 20) (30 + $bob) 8 2
    FillPx $g "#7c3aed" ($ox + 12) (26 + $bob) 4 9
    FillPx $g "#7c3aed" ($ox + 32) (26 + $bob) 4 9
    FillPx $g $C.skin ($ox + 17) (12 + $bob) 14 12
    FillPx $g "#111827" ($ox + 16) (10 + $bob) 16 4
    FillPx $g "#22c55e" ($ox + 18) (16 + $bob) 12 4
  }
  $g.Dispose()
  Save-Png $bmp (Join-Path $assets "npc\teammate-idle.png")
}

function New-BgLayer([string]$name, [int]$w, [int]$h, [string]$top, [string]$bottom, [string]$b1, [string]$b2) {
  $bmp = New-Canvas $w $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $rect = New-Object System.Drawing.Rectangle 0,0,$w,$h
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.ColorTranslator]::FromHtml($top)), ([System.Drawing.ColorTranslator]::FromHtml($bottom)), 90
  $g.FillRectangle($grad, $rect)
  $grad.Dispose()

  $rng = New-Object System.Random 42
  $baseY = [int]($h * 0.55)
  $x = 0
  while ($x -lt $w) {
    $bw = $rng.Next(20, 56)
    $bh = $rng.Next(40, 150)
    $y = $baseY - [int]($bh * 0.6)
    FillPx $g $b1 $x $y $bw ($h - $y)
    # fenetres
    for ($wy = $y + 6; $wy -lt $h - 8; $wy += 9) {
      for ($wx = $x + 4; $wx -lt $x + $bw - 4; $wx += 8) {
        if ($rng.Next(0, 100) -lt 45) {
          $col = if ($rng.Next(0,100) -lt 20) { $C.neon } else { $C.win }
          FillPx $g $col $wx $wy 3 3
        }
      }
    }
    $x += $bw + $rng.Next(2, 12)
  }
  if ($b2) {
    $x = 0
    while ($x -lt $w) {
      $bw = $rng.Next(26, 70)
      $bh = $rng.Next(70, 200)
      $y = $baseY - [int]($bh * 0.35)
      FillPx $g $b2 $x $y $bw ($h - $y)
      $x += $bw
    }
  }
  $g.Dispose()
  Save-Png $bmp (Join-Path $assets "bg\$name.png")
}

function New-GroundTile([int]$w, [int]$h) {
  $bmp = New-Canvas $w $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($C.ground))
  FillPx $g $C.ground2 0 0 $w 10
  FillPx $g $C.edge 0 0 $w 3
  for ($x = 0; $x -lt $w; $x += 16) {
    FillPx $g $C.ground2 $x 10 1 ($h - 10)
  }
  for ($y = 12; $y -lt $h; $y += 8) {
    FillPx $g $C.ground2 0 $y $w 1
  }
  FillPx $g $C.neon 0 1 $w 1
  $g.Dispose()
  Save-Png $bmp (Join-Path $assets "tiles\ground-tile.png")
}

function New-Prop([string]$name) {
  $w = 96; $h = 128
  $bmp = New-Canvas $w $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($C.trans))
  switch ($name) {
    "server-rack" {
      FillPx $g $C.metal 22 8 52 120
      FillPx $g $C.dark 26 14 44 108
      for ($y = 20; $y -lt 116; $y += 18) {
        FillPx $g "#20262f" 30 $y 36 12
        FillPx $g $C.ok 32 ($y + 3) 3 3
        FillPx $g $C.warn 37 ($y + 3) 3 3
        FillPx $g $C.neon 42 ($y + 3) 3 3
        for ($x = 50; $x -lt 64; $x += 4) { FillPx $g "#3d4350" $x ($y + 2) 2 8 }
      }
    }
    "control-screen" {
      FillPx $g $C.metal 10 44 76 60
      FillPx $g $C.screen 15 49 66 50
      FillPx $g $C.ok 19 54 30 3
      FillPx $g $C.neon 19 60 44 3
      FillPx $g "#1f4b63" 19 68 56 3
      FillPx $g "#1f4b63" 19 74 40 3
      FillPx $g $C.visor 19 82 20 6
      FillPx $g "#20262f" 40 104 16 14
      FillPx $g $C.metal 30 118 36 8
    }
    "security-cam" {
      FillPx $g $C.metal 44 8 8 30
      FillPx $g $C.metal 30 34 36 26
      FillPx $g "#20262f" 24 38 14 18
      FillPx $g "#111827" 22 40 8 14
      FillPx $g "#e11d48" 30 44 3 3
      FillPx $g $C.dark 40 60 26 6
    }
    "telecom-tower" {
      FillPx $g $C.metal 30 118 36 8
      FillPx $g $C.metal 44 30 8 88
      FillPx $g $C.metal 34 60 28 4
      FillPx $g $C.metal 38 78 20 4
      FillPx $g $C.metal 42 96 12 4
      FillPx $g $C.neon 46 14 4 18
      FillPx $g "#e11d48" 47 8 2 6
      FillPx $g $C.visor 30 44 36 3
      FillPx $g $C.visor 34 52 28 3
    }
    "arcade-terminal" {
      FillPx $g "#3b0764" 16 16 64 108
      FillPx $g "#1b0a33" 24 24 48 56
      FillPx $g $C.visor 30 30 36 4
      FillPx $g $C.neon 30 38 36 4
      FillPx $g $C.ok 30 46 24 4
      FillPx $g "#e11d48" 30 54 30 4
      FillPx $g "#f59e0b" 30 62 20 4
      FillPx $g "#20262f" 24 86 48 30
      FillPx $g $C.win 30 94 8 8
      FillPx $g "#e11d48" 44 94 8 8
      FillPx $g $C.ok 58 94 8 8
      FillPx $g "#f59e0b" 30 106 36 4
    }
    "floating-platform" {
      FillPx $g $C.metal 8 48 80 18
      FillPx $g $C.edge 8 44 80 4
      FillPx $g $C.neon 8 63 80 2
      FillPx $g "#20262f" 20 66 8 8
      FillPx $g "#20262f" 68 66 8 8
      FillPx $g $C.visor 30 44 10 4
      FillPx $g $C.visor 56 44 10 4
    }
  }
  $g.Dispose()
  Save-Png $bmp (Join-Path $assets "props\$name.png")
}

function New-Icon([string]$name) {
  $w = 64; $h = 64
  $bmp = New-Canvas $w $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($C.trans))
  FillPx $g "#ffffff" 0 0 0 0
  if ($name -eq "mouse-scroll") {
    FillPx $g "#ffffff" 24 6 16 34
    FillPx $g $C.trans 28 10 8 10
    FillPx $g $C.trans 28 24 8 12
    FillPx $g "#05060d" 30 24 4 6
    FillPx $g "#ffffff" 30 44 4 12
    FillPx $g "#ffffff" 28 54 8 4
  } else {
    FillPx $g "#ffffff" 32 14 8 28
    FillPx $g "#ffffff" 36 42 4 8
    FillPx $g "#ffffff" 8 30 24 8
    FillPx $g "#ffffff" 12 34 4 8
    FillPx $g "#ffffff" 44 30 12 8
  }
  $g.Dispose()
  Save-Png $bmp (Join-Path $assets "ui\$name.png")
}

# --- generation ---
New-Player "Idle" 4
New-Player "Run" 6
New-Player "Jump" 4
New-Player "Use" 6
New-Teammate
New-BgLayer "layer-1-sky" 1024 320 $C.skyA $C.skyB $C.cityA $C.cityB
New-BgLayer "layer-2-far-city" 1024 320 $C.trans $C.trans $C.cityB ""
New-BgLayer "layer-3-mid-buildings" 1024 320 $C.trans $C.trans "#0e1230" ""
New-GroundTile 512 64
foreach ($p in @("server-rack","control-screen","security-cam","telecom-tower","arcade-terminal","floating-platform")) {
  New-Prop $p
}
New-Icon "mouse-scroll"
New-Icon "arrow-keys"

Write-Output "Assets generes dans $assets"
