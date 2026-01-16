#!/bin/bash

# Infinity / figure-eight pattern (sideways 8)
# - Locks the center at the initial mouse position
# - Draws a smooth ∞ path around that center
# - Runs for 60 minutes
#
# Requires: cliclick, bc

# Pattern parameters
ampX=120          # horizontal amplitude (px)
ampY=60           # vertical amplitude (px)
steps=400         # steps per loop of the figure-eight
delay=0.01        # seconds between steps (~100 FPS)

pi=3.1415926535

# Lock the initial mouse position as the center
pos=$(cliclick p)
cx=$(echo "$pos" | cut -d, -f1)
cy=$(echo "$pos" | cut -d, -f2)

echo "Infinity (figure-eight) pattern"
echo "Center locked at: $cx,$cy"
echo "Amplitude: X=$ampX px, Y=$ampY px"
echo "Running for 60 minutes. Press CTRL+C to stop."
echo

# Time control: run for 60 minutes
start=$(date +%s)
end=$((start + 60*60))   # 60 minutes from now

while [ "$(date +%s)" -lt "$end" ]; do
  echo "New infinity loop at $(date '+%T')"

  for ((i=0; i<steps; i++)); do
    # u in [0,1)
    u=$(echo "scale=6; $i / $steps" | bc -l)

    # Parameter t from 0 to 2π
    t=$(echo "scale=10; 2 * $pi * $u" | bc -l)

    # Lissajous-style figure eight:
    # x = A * sin(t)
    # y = B * sin(2t)
    sin_t=$(echo "s($t)" | bc -l)
    sin_2t=$(echo "s(2 * $t)" | bc -l)

    x=$(echo "scale=6; $cx + $ampX * $sin_t" | bc -l)
    y=$(echo "scale=6; $cy + $ampY * $sin_2t" | bc -l)

    # Round to integer pixel positions
    xi=$(printf "%.0f" "$x")
    yi=$(printf "%.0f" "$y")

    cliclick m:$xi,$yi
    sleep $delay
  done
done
