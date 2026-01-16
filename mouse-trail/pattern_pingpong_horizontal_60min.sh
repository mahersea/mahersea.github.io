#!/bin/bash

# Horizontal "ping-pong" line pattern
# - Locks the center at the initial mouse position
# - Sweeps left -> right -> left repeatedly
# - Runs for 60 minutes

span=250           # half-width of motion in pixels (total travel = 2 * span)
steps=120         # number of steps per full ping-pong cycle
delay=0.02        # seconds between steps (~50 steps/sec)

# Lock the initial mouse position as the center
pos=$(cliclick p)
cx=$(echo "$pos" | cut -d, -f1)
cy=$(echo "$pos" | cut -d, -f2)

echo "Horizontal ping-pong pattern"
echo "Center locked at: $cx,$cy"
echo "Span: ±$span px horizontally (total width $(($span * 2)) px)"
echo "Running for 60 minutes. Press CTRL+C to stop."
echo

# Precompute some integers
halfSteps=$((steps / 2))
width=$((span * 2))

# Time control: run for 60 minutes
start=$(date +%s)
end=$((start + 60*60))   # 60 minutes from now

while [ "$(date +%s)" -lt "$end" ]; do
  echo "New ping-pong cycle at $(date '+%T')"

  for ((i=0; i<steps; i++)); do
    # Triangular wave phase: 0 -> 1 -> 0 over one cycle
    # First half: left -> right
    # Second half: right -> left
    if [ "$i" -le "$halfSteps" ]; then
      phase=$(echo "scale=6; $i / $halfSteps" | bc -l)
    else
      phase=$(echo "scale=6; ($steps - $i) / $halfSteps" | bc -l)
    fi

    # x moves from (cx - span) to (cx + span) and back
    x=$(echo "$cx - $span + $width * $phase" | bc -l)
    y=$cy

    # Round to integer pixel positions
    xi=$(printf "%.0f" "$x")
    yi=$y

    # Optional: light logging
    # echo "$(date '+%T') step $i: $xi,$yi (phase=$phase)"

    cliclick m:$xi,$yi
    sleep $delay
  done
done
