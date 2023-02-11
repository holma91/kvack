STEPS when adding a integration:

1. create extension and add to extensions map
2. create a group including the extension
3. add the group to the settings
4. add necessary things to forge.config.ts
5. create preload file
6. add necessary things to Search.tsx
7. study the html/css and add stuff to the preload (css and js)

## TODO

Create bang support.

from user POV:

- cmd+m to show app
- !g to get google
  - fe sends !g to main who saves it
  - main change group to the one specified by the bang
- "how to do x" in google search
  - fe sends "how to do x" to main
  - main has saved !g, and know that it's a google search

## Bug lists

- when focus is not on mainWindow and tabbing, the focus doesn't land on the input bar in the new tab
