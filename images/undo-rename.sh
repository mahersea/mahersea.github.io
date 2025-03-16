for f in *_thumb.png; do
  mv "$f" "${f%_thumb.png}.png"
done