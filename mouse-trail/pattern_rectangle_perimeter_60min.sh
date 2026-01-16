#!/bin/bash

# Rectangle perimeter pattern (centered, no drift)
# - Locks the center at the initial mouse position
# - Traces a rectangle: top -> right -> bottom -> left -> repeat
# - Runs for 60 minutes

halfWidth=460      # half of rectangle width (total width = 2 * halfWidth)
halfHeight=240     # half of rectangle height (total height = 2 * halfHeight)
steps=160         # steps per full loop (should be divisible by 4)
delay=0.02        # seconds between steps

pi=3.1415926535   # kept around if you want to hack in curves later

# Lock the initial mouse position as the center
pos=$(cliclick p)
cx=$(echo "$pos" | cut -d, -f1)
cy=$(echo "$pos" | cut -d, -f2)

width=$((halfWidth * 2))
height=$((halfHeight * 2))

echo "Rectangle perimeter pattern"
echo "Center locked at: $cx,$cy"
echo "Rectangle size: ${width}x${height} px (W x H)"
echo "Running for 60 minutes. Press CTRL+C to stop."
echo

# Time control: run for 60 minutes
start=$(date +%s)
end=$((start + 60*60))   # 60 minutes from now

while [ "$(date +%s)" -lt "$end" ]; do
  echo "New rectangle loop at $(date '+%T')"

  for ((i=0; i<steps; i++)); do
    # u in [0, 1)
    u=$(echo "scale=6; $i / $steps" | bc -l)

    # s in [0, 4)
    s=$(echo "scale=6; 4 * $u" | bc -l)

    # edge = floor(s) -> 0 (top), 1 (right), 2 (bottom), 3 (left)
    edge=$(echo "$s / 1" | bc)  # integer truncation
    # local in [0,1) along that edge
    local=$(echo "scale=6; $s - $edge" | bc -l)

    # Compute x,y based on which edge we're on
    case "$edge" in
      0)  # top edge: left -> right
          x=$(echo "scale=6; $cx - $halfWidth + $width * $local" | bc -l)
          y=$(echo "scale=6; $cy - $halfHeight" | bc -l)
          ;;
      1)  # right edge: top -> bottom
          x=$(echo "scale=6; $cx + $halfWidth" | bc -l)
          y=$(echo "scale=6; $cy - $halfHeight + $height * $local" | bc -l)
          ;;
      2)  # bottom edge: right -> left
          x=$(echo "scale=6; $cx + $halfWidth - $width * $local" | bc -l)
          y=$(echo "scale=6; $cy + $halfHeight" | bc -l)
          ;;
      3)  # left edge: bottom -> top
          x=$(echo "scale=6; $cx - $halfWidth" | bc -l)
          y=$(echo "scale=6; $cy + $halfHeight - $height * $local" | bc -l)
          ;;
      *)  # safety fallback (shouldn't happen)
          x=$cx
          y=$cy
          ;;
    esac

    # Round to integer pixel positions
    xi=$(printf "%.0f" "$x")
    yi=$(printf "%.0f" "$y")

    # Optional logging:
    # echo "$(date '+%T') step $i edge=$edge local=$local -> $xi,$yi"

    cliclick m:$xi,$yi
    sleep $delay
  done
done
