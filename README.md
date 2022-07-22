# InteractiveRubiksCube
An interactive Rubiks Cube made with three.js

To run, use `npm run dev` and view local host in browser.

## Controls
- Click and drag mouse to rotate the entire cube
- Hold shift, click, and drag mouse to pan
- Scroll to zoom

## Rotating Faces
- Hovering over a cube segment will highlight it. Cube segments can be clicked to be selected.
- Keyboard inputs will rotate the face of the rubiks cube containing the selected cube.
  - Clockwise:
    - Q: Rotate about the X-axis
    - W: Rotate about the Y-axis
    - E: Rotate about the Z-axis
  - Counter-clockwise:
    - A: Rotate about the X-axis
    - S: Rotate about the Y-axis
    - D: Rotate about the Z-axis
- Axes are also highlighted as follows:
  - Red: X-axis
  - Green: Y-axis
  - Blue: Z-axis
