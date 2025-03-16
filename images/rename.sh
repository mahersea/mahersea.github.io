#!/bin/bash
for f in *.png; do
  mv "$f" "${f%.png}_thumb.png"
done