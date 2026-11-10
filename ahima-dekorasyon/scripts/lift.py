"""Lift the exposure of the anthracite configurator renders (dark tile swallows the same light).
  python3 scripts/lift.py IN.png OUT.png [stops]"""
import sys
import numpy as np
from PIL import Image
a = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32) / 255
stops = float(sys.argv[3]) if len(sys.argv) > 3 else 0.9
lin = a ** 2.2 * 2 ** stops
out = (lin / (1 + lin * 0.18)) ** (1 / 2.2) * 1.08   # soft shoulder so the LED and mirror don't clip
Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8)).save(sys.argv[2])
