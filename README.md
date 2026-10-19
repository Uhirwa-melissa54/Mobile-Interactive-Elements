# React Native form elements showcase

A plain, single-screen Expo + TypeScript application. Start with `npm install`, then `npx expo install --fix` and `npm start`. Press `a` for Android, `i` for an iOS simulator on macOS, or scan the terminal QR code with compatible Expo Go. Use `npm run web` for a browser preview. Run `npm run typecheck` to check TypeScript.

## Included examples

- Text, textarea, email, password visibility, username, phone, numeric, decimal, integer, URL, live search, PIN, one-time code, postal code and formatted ZAR currency.
- Read-only and disabled fields, character counter, inline validation, autocomplete and editable tags.
- Independent checkboxes, switch, radio group, segmented choice, native country picker and multiple-choice chips.
- Slider, paired range sliders, quantity stepper, star rating, color swatches and hex input.
- Native date/time dialogs, month and year selectors.
- Photo library, camera, document selection, location, microphone recording and playback, clipboard, biometric confirmation, haptics and a touch drawing pad.
- Local validation and reset actions.

## Platform notes

Native date/time dialogs are Android/iOS controls; web displays an explanation. Camera, microphone and location require permission and actual hardware or simulator support. Web device APIs can require localhost or HTTPS. Biometrics need enrolled hardware; Face ID requires an iOS development build with the configured usage description. Voice dictation is available through the device keyboard where supported; there is no speech-to-text service. The drawing pad is a simple bounded dot trace.

No backend, API service, database or uploads are used. Document/image pickers and audio recording may create temporary device files. Reset clears form references; OS-managed temporary files may remain until cache cleanup. Values are in React state and disappear when the app restarts. Never enter a real password or PIN in a demo. All fields are optional. Entered values still show format validation messages. Press Log form output to print every current form value, including empty fields, to the developer console.

## Editing

`App.tsx` contains the screen, small reusable wrappers and styles. Add text examples to the `fields` array; add standalone native controls in the relevant section. The `run` helper displays permission and capability failures inline. Expo dependency versions should stay aligned using `npx expo install --fix` when upgrading.
