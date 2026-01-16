#!/bin/bash

# Archimedean spiral pattern (in & out)
# - Locks the center at the initial mouse position
# - Draws an in-and-out spiral around that center
# - Runs for 60 minutes
#
# Requires: cliclick, bc

# Spiral parameters
rMin=0            # minimum radius (px)
rMax=420          # maximum radius (px)
steps=400         # steps per spiral cycle
turns=3           # how many full rotations per cycle
delay=0.01        # seconds between steps (~100 FPS)

pi=3.1415926535

# Lock the initial mouse position as the center
pos=$(cliclick p)
cx=$(echo "$pos" | cut -d, -f1)
cy=$(echo "$pos" | cut -d, -f2)

echo "Archimedean spiral (in & out) pattern"
echo "Center locked at: $cx,$cy"
echo "Radius: $rMin → $rMax → $rMin px"
echo "Turns per cycle: $turns"
echo "Running for 60 minutes. Press CTRL+C to stop."
echo

# Precompute
halfSteps=$((steps / 2))

# Time control: run for 60 minutes
start=$(date +%s)
end=$((start + 60*60))   # 60 minutes from now

while [ "$(date +%s)" -lt "$end" ]; do
  echo "New spiral cycle at $(date '+%T')"

  for ((i=0; i<steps; i++)); do
    # u in [0,1)
    u=$(echo "scale=6; $i / $steps" | bc -l)

    # Triangular radial phase: 0 -> 1 -> 0 (out then in)
    if [ "$i" -le "$halfSteps" ]; then
      phase=$(echo "scale=6; $i / $halfSteps" | bc -l)
    else
      phase=$(echo "scale=6; ($steps - $i) / $halfSteps" | bc -l)
    fi

    # Radius from rMin to rMax and back
    r=$(echo "scale=6; $rMin + ($rMax - $rMin) * $phase" | bc -l)

    # Angle: multiple turns around the center
    angle=$(echo "scale=10; 2 * $pi * $turns * $u" | bc -l)

    # Spiral coordinates
    x=$(echo "scale=6; $cx + $r * c($angle)" | bc -l)
    y=$(echo "scale=6; $cy + $r * s($angle)" | bc -l)

    # Round to integer pixel positions
    xi=$(printf "%.0f" "$x")
    yi=$(printf "%.0f" "$y")

    cliclick m:$xi,$yi
    sleep $delay
  done
done
