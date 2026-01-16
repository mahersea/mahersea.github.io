#!/bin/bash

# Vertical "ping-pong" line pattern
# - Locks the center at the initial mouse position
# - Sweeps up -> down -> up repeatedly
# - Runs for 60 minutes

span=250           # half-height of motion in pixels (total travel = 2 * span)
steps=120         # number of steps per full ping-pong cycle
delay=0.02        # seconds between steps (~50 steps/sec)

# Lock the initial mouse position as the center
pos=$(cliclick p)
cx=$(echo "$pos" | cut -d, -f1)
cy=$(echo "$pos" | cut -d, -f2)

echo "Vertical ping-pong pattern"
echo "Center locked at: $cx,$cy"
echo "Span: ±$span px vertically (total height $(($span * 2)) px)"
echo "Running for 60 minutes. Press CTRL+C to stop."
echo

# Precompute some integers
halfSteps=$((steps / 2))
height=$((span * 2))

# Time control: run for 60 minutes
start=$(date +%s)
end=$((start + 60*60))   # 60 minutes from now

while [ "$(date +%s)" -lt "$end" ]; do
  echo "New ping-pong cycle at $(date '+%T')"

  for ((i=0; i<steps; i++)); do
    # Triangular wave phase: 0 -> 1 -> 0 over one cycle
    if [ "$i" -le "$halfSteps" ]; then
      phase=$(echo "scale=6; $i / $halfSteps" | bc -l)
    else
      phase=$(echo "scale=6; ($steps - $i) / $halfSteps" | bc -l)
    fi

    # y moves from (cy - span) to (cy + span) and back
    y=$(echo "$cy - $span + $height * $phase" | bc -l)
    x=$cx

    # Round to integer pixel positions
    xi=$x
    yi=$(printf "%.0f" "$y")

    # Optional: light logging
    # echo "$(date '+%T') step $i: $xi,$yi (phase=$phase)"

    cliclick m:$xi,$yi
    sleep $delay
  done
done
