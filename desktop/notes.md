screen.getPrimaryDisplay() will give us this

```js
{
  id: 1,
  label: 'Built-in Retina Display',
  bounds: { x: 0, y: 0, width: 1512, height: 982 }, // full screen of the mac
  workArea: { x: 0, y: 38, width: 1512, height: 887 }, // full screen minus the "top dock"?
  accelerometerSupport: 'unknown',
  monochrome: false,
  colorDepth: 30,
  colorSpace: '{primaries:BT709, transfer:SRGB_HDR, matrix:RGB, range:FULL}',
  depthPerComponent: 10,
  size: { width: 1512, height: 982 },
  displayFrequency: 120,
  workAreaSize: { width: 1512, height: 887 },
  scaleFactor: 2,
  rotation: 0,
  internal: true,
  touchSupport: 'unknown'
}
```

screen.getAllDisplays() will include ALL screens, so the monitor and the macbook pro in my case.
