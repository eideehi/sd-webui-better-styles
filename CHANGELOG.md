# v1.4.1
## Fix
- Fixed an issue where loading more than 32 styles would take a significant amount of time.
- Fixed the display position of the `Checkpoint exclusive` field in the style editing form.

# v1.4.0
## Change
- Redesigned the overall UI. **([#8])**
- Changed the `Save style` button to `Add Style`. Editing styles is now done using a dedicated form instead of a dialog.
- Improved the confirmation dialog for the `Delete styles` button. It now displays a list of styles that are about to be deleted.
- Removed the `replace thumbnail` option and added buttons for editing styles, applying styles, and deleting styles.
- Changed Better Styles' component to be added to an independent container. **([#12])**
## Add
- Added the `all` group to the list of groups. This allows displaying all styles from different groups together. It also enables viewing styles that are specific to certain checkpoints.
- Added a button to switch the style display mode.
- Added the option for `Show the Better Styles by default`.
## Remove
- Removed the `Close Better Styles` button.
- Removed the option for `Hide Better Styles by default`. Better Styles are now hidden by default.

# v1.3.0
## Add
- Added an option to hide Better Styles by default. **([#11])**
- Added a button to reset styles.
- Added a button to filter and display only the parameters with changed values in the style save dialog.
- Added the ability to import styles.csv. **([#10])**
## Change
- Changed the default value of the language setting option to "Auto".
## Fix
- Fixed an issue where the dropdown values could not be set correctly. **([#2])**
- Fixed an issue where the option values were not reflected in the new version of the Web UI.
## Remove
- Removed version change feature.
- Removed update notification feature.

<!-- Issue links -->
[#2]: https://github.com/eideehi/sd-webui-better-styles/issues/2
[#8]: https://github.com/eideehi/sd-webui-better-styles/issues/8
[#10]: https://github.com/eideehi/sd-webui-better-styles/issues/10
[#11]: https://github.com/eideehi/sd-webui-better-styles/issues/11
[#12]: https://github.com/eideehi/sd-webui-better-styles/issues/12
