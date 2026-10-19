import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
// import * as Location from "expo-location";
// import * as LocalAuthentication from "expo-local-authentication";
// import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
/* Audio capability disabled; retained for restoration.
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
*/

type FieldSpec = {
  key: string;
  label: string;
  hint: string;
  props?: TextInputProps;
  clean?: (s: string) => string;
  validate?: (s: string) => string | undefined;
};
const digits = (s: string) => s.replace(/\D/g, "");
const fields: FieldSpec[] = [
  {
    key: "text",
    label: "Single-line text",
    hint: "Your full name",
    validate: (s) => (!s.trim() ? "Enter a name." : undefined),
  },
  {
    key: "multiline",
    label: "Multiline text / textarea",
    hint: "Write a few lines",
    props: { multiline: true, numberOfLines: 4, maxLength: 500 },
  },
  {
    key: "email",
    label: "Email",
    hint: "name@example.com",
    props: {
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoComplete: "email",
    },
    validate: (s) =>
      s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
        ? "Enter a valid email address."
        : undefined,
  },
  {
    key: "password",
    label: "Password with visibility toggle",
    hint: "At least 8 characters",
    props: { autoCapitalize: "none", autoComplete: "new-password" },
    validate: (s) =>
      s && s.length < 8 ? "Use at least 8 characters." : undefined,
  },
  {
    key: "username",
    label: "Username",
    hint: "letters_numbers",
    props: { autoCapitalize: "none", autoCorrect: false },
    validate: (s) =>
      s && !/^\w{3,20}$/.test(s)
        ? "Use 3–20 letters, numbers or underscores."
        : undefined,
  },
  {
    key: "phone",
    label: "Phone number",
    hint: "+27 82 123 4567",
    props: { keyboardType: "phone-pad", autoComplete: "tel" },
    validate: (s) =>
      s && digits(s).length < 7 ? "Enter at least 7 digits." : undefined,
  },
  {
    key: "numeric",
    label: "Numeric input",
    hint: "123",
    props: { keyboardType: "numeric" },
    validate: (s) =>
      s && !Number.isFinite(Number(s)) ? "Enter a number." : undefined,
  },
  {
    key: "decimal",
    label: "Decimal input",
    hint: "12.75",
    props: { keyboardType: "decimal-pad" },
    validate: (s) =>
      s && !/^-?\d+([.,]\d+)?$/.test(s) ? "Enter a decimal number." : undefined,
  },
  {
    key: "integer",
    label: "Integer input",
    hint: "-12",
    props: { keyboardType: "numbers-and-punctuation" },
    validate: (s) =>
      s && !/^-?\d+$/.test(s) ? "Enter a whole number." : undefined,
  },
  {
    key: "url",
    label: "URL",
    hint: "https://example.com",
    props: { keyboardType: "url", autoCapitalize: "none", autoCorrect: false },
    validate: (s) => {
      if (!s) return;
      try {
        const u = new URL(s);
        if (!["http:", "https:"].includes(u.protocol))
          return "Use http or https.";
      } catch {
        return "Enter a complete URL.";
      }
    },
  },
  {
    key: "search",
    label: "Search input",
    hint: "Filter the fruit suggestions below",
    props: {
      returnKeyType: "search",
      autoCapitalize: "none",
      clearButtonMode: "while-editing",
    },
  },
  {
    key: "pin",
    label: "Numeric PIN",
    hint: "4 digits",
    clean: digits,
    props: { keyboardType: "number-pad", maxLength: 4, secureTextEntry: true },
    validate: (s) =>
      s && s.length !== 4 ? "Use exactly 4 digits." : undefined,
  },
  {
    key: "otp",
    label: "One-time verification code",
    hint: "6 digits",
    clean: digits,
    props: {
      keyboardType: "number-pad",
      maxLength: 6,
      autoComplete: "one-time-code",
      textContentType: "oneTimeCode",
    },
    validate: (s) =>
      s && s.length !== 6 ? "Use exactly 6 digits." : undefined,
  },
  {
    key: "postal",
    label: "Postal code",
    hint: "Postal / ZIP code",
    props: {
      autoCapitalize: "characters",
      autoComplete: "postal-code",
      maxLength: 12,
    },
  },
  {
    key: "currency",
    label: "Currency amount (ZAR)",
    hint: "0.00",
    props: { keyboardType: "decimal-pad" },
    validate: (s) =>
      s && !/^\d+([.,]\d{1,2})?$/.test(s)
        ? "Use a positive amount with up to 2 decimal places."
        : undefined,
  },
  {
    key: "readonly",
    label: "Read-only input",
    hint: "Cannot be edited",
    props: { editable: false },
  },
  {
    key: "disabled",
    label: "Disabled input",
    hint: "Unavailable example",
    props: { editable: false },
  },
];
const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Mango",
  "Orange",
  "Pear",
];
function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        {title}
      </Text>
      {children}
    </View>
  );
}
function Showcase() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [consent, setConsent] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [radio, setRadio] = useState("Email");
  const [segment, setSegment] = useState("Daily");
  const [country, setCountry] = useState("ZA");
  const [multi, setMulti] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [slider, setSlider] = useState(50);
  const [low, setLow] = useState(20);
  const [high, setHigh] = useState(80);
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [color, setColor] = useState("#000000");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [picker, setPicker] = useState<"date" | "time" | null>(null);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2026");
  const [photo, setPhoto] = useState<string>();
  const [file, setFile] = useState("No file selected");
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  /* Audio state disabled.
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recording = useAudioRecorderState(recorder);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const player = useAudioPlayer(audioUri);
*/
  const update = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSubmitted(false);
  };
  const run = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : "This capability is unavailable on this device.",
      );
    }
  };
  const pickImage = (camera: boolean) =>
    run(async () => {
      const permission = camera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setStatus(
          "Image permission was denied. You can enable it in device settings.",
        );
        return;
      }
      const result = camera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.5,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.5,
          });
      if (!result.canceled) {
        setPhoto(result.assets[0]?.uri);
        setStatus("Image selected locally.");
      }
    });
  /* Audio handler disabled.
  const toggleRecording = () =>
    run(async () => {
    if (recording.isRecording) {
        await recorder.stop();
        setAudioUri(recorder.uri);
        setStatus("Recording saved locally for playback.");
        return;
      }
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setStatus("Microphone permission denied.");
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
    });

*/
  const errors = fields
    .map((f) => f.validate?.(values[f.key] || ""))
    .filter(Boolean);
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Text accessibilityRole="header" style={styles.title}>
            Form elements showcase
          </Text>
          <Text style={styles.intro}>
            One screen to try mobile form controls. All examples stay on this
            device. All fields are optional; entered values validate when
            filled.
          </Text>
          <Section title="A. Text and keyboard inputs">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                <View style={styles.row}>
                  <TextInput
                    accessibilityLabel={f.label}
                    placeholder={f.hint}
                    placeholderTextColor="#777"
                    value={values[f.key] || ""}
                    onChangeText={(s) =>
                      update(f.key, f.clean ? f.clean(s) : s)
                    }
                    onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                    onSubmitEditing={
                      f.key === "search" ? Keyboard.dismiss : undefined
                    }
                    style={[
                      styles.input,
                      f.props?.multiline && styles.textarea,
                      f.key === "disabled" && styles.disabled,
                    ]}
                    {...f.props}
                    secureTextEntry={
                      f.key === "password" ? !visible : f.props?.secureTextEntry
                    }
                  />
                  {f.key === "password" && (
                    <Button
                      title={visible ? "Hide" : "Show"}
                      onPress={() => setVisible(!visible)}
                    />
                  )}
                </View>
                {touched[f.key] && f.validate?.(values[f.key] || "") ? (
                  <Text accessibilityLiveRegion="polite" style={styles.error}>
                    {f.validate(values[f.key] || "")}
                  </Text>
                ) : null}
                {f.key === "multiline" && (
                  <Text style={styles.hint}>
                    {(values.multiline || "").length}/500 characters
                  </Text>
                )}
                {f.key === "currency" &&
                values.currency &&
                !f.validate?.(values.currency) ? (
                  <Text style={styles.hint}>
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                    }).format(Number(values.currency.replace(",", ".")))}
                  </Text>
                ) : null}
                {f.key === "search" && (
                  <Text style={styles.hint}>
                    {fruits
                      .filter((x) =>
                        x
                          .toLowerCase()
                          .includes((values.search || "").toLowerCase()),
                      )
                      .join(", ") || "No matching fruit"}
                  </Text>
                )}
              </Field>
            ))}
          </Section>
          <Section title="B. Boolean and choice controls">
            <Field label="Checkbox">
              <View style={styles.row}>
                <Checkbox
                  accessibilityLabel="Accept terms"
                  value={checked}
                  onValueChange={setChecked}
                  color="#222"
                />
                <Text onPress={() => setChecked(!checked)}>
                  Accept sample terms
                </Text>
              </View>
            </Field>
            <Field label="Independent checkbox">
              <View style={styles.row}>
                <Checkbox
                  accessibilityLabel="Receive updates"
                  value={consent}
                  onValueChange={setConsent}
                  color="#222"
                />
                <Text onPress={() => setConsent(!consent)}>
                  Receive updates
                </Text>
              </View>
            </Field>
            <Field label="Switch">
              <Switch
                accessibilityLabel="Enable notifications"
                value={enabled}
                onValueChange={setEnabled}
              />
              <Text style={styles.hint}>
                {enabled ? "Enabled" : "Disabled"}
              </Text>
            </Field>
            <Field label="Radio group: contact preference">
              <View accessibilityRole="radiogroup" style={styles.wrap}>
                {["Email", "Phone", "Neither"].map((x) => (
                  <Pressable
                    key={x}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: radio === x }}
                    onPress={() => setRadio(x)}
                    style={styles.button}
                  >
                    <Text>
                      {radio === x ? "◉" : "○"} {x}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>
            <Field label="Segmented choice">
              <View style={styles.wrap}>
                {["Daily", "Weekly", "Monthly"].map((x) => (
                  <Pressable
                    key={x}
                    accessibilityRole="button"
                    accessibilityState={{ selected: segment === x }}
                    onPress={() => setSegment(x)}
                    style={[styles.button, segment === x && styles.selected]}
                  >
                    <Text>
                      {x}
                      {segment === x ? " ✓" : ""}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>
            <Field label="Dropdown / native picker">
              <View style={styles.border}>
                <Picker
                  accessibilityLabel="Country"
                  selectedValue={country}
                  onValueChange={setCountry}
                >
                  <Picker.Item label="South Africa" value="ZA" />
                  <Picker.Item label="United Kingdom" value="GB" />
                  <Picker.Item label="United States" value="US" />
                </Picker>
              </View>
            </Field>
            <Field label="Multi-select chips">
              <View style={styles.wrap}>
                {["Design", "Code", "Testing", "Research"].map((x) => (
                  <Pressable
                    key={x}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: multi.includes(x) }}
                    style={styles.button}
                    onPress={() =>
                      setMulti((m) =>
                        m.includes(x) ? m.filter((v) => v !== x) : [...m, x],
                      )
                    }
                  >
                    <Text>
                      {multi.includes(x) ? "☑" : "☐"} {x}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>
                Selected: {multi.join(", ") || "None"}
              </Text>
            </Field>
            <Field label="Autocomplete">
              <TextInput
                accessibilityLabel="Autocomplete fruit"
                style={styles.input}
                placeholder="Type a fruit"
                value={values.fruit || ""}
                onChangeText={(s) => update("fruit", s)}
              />
              {values.fruit
                ? fruits
                    .filter(
                      (x) =>
                        x
                          .toLowerCase()
                          .startsWith(values.fruit!.toLowerCase()) &&
                        x !== values.fruit,
                    )
                    .slice(0, 4)
                    .map((x) => (
                      <Button
                        key={x}
                        title={x}
                        onPress={() => update("fruit", x)}
                      />
                    ))
                : null}
            </Field>
            <Field
              label="Tag input"
              hint="Add a tag, then tap a tag to remove it."
            >
              <View style={styles.row}>
                <TextInput
                  accessibilityLabel="New tag"
                  style={styles.input}
                  value={tag}
                  onChangeText={setTag}
                  placeholder="New tag"
                />
                <Button
                  title="Add"
                  disabled={!tag.trim()}
                  onPress={() => {
                    setTags((t) => [...new Set([...t, tag.trim()])]);
                    setTag("");
                  }}
                />
              </View>
              <View style={styles.wrap}>
                {tags.map((x) => (
                  <Button
                    key={x}
                    title={`${x} ×`}
                    onPress={() => setTags((t) => t.filter((v) => v !== x))}
                  />
                ))}
              </View>
            </Field>
          </Section>
          <Section title="C. Numeric and visual selectors">
            <Field label={`Slider: ${slider}`}>
              <Slider
                accessibilityLabel="Amount"
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={slider}
                onValueChange={setSlider}
              />
            </Field>
            <Field
              label={`Range: ${low} – ${high}`}
              hint="Two sliders control the lower and upper bounds."
            >
              <Slider
                accessibilityLabel="Lower bound"
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={low}
                onValueChange={(v) => setLow(Math.min(v, high))}
              />
              <Slider
                accessibilityLabel="Upper bound"
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={high}
                onValueChange={(v) => setHigh(Math.max(v, low))}
              />
            </Field>
            <Field label="Quantity stepper (0–10)">
              <View style={styles.row}>
                <Button
                  title="−"
                  disabled={step === 0}
                  onPress={() => setStep((s) => s - 1)}
                />
                <Text accessibilityLiveRegion="polite">{step}</Text>
                <Button
                  title="+"
                  disabled={step === 10}
                  onPress={() => setStep((s) => s + 1)}
                />
              </View>
            </Field>
            <Field label={`Star rating: ${rating}/5`}>
              <View style={styles.wrap}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Button
                    key={n}
                    title={n <= rating ? "★" : "☆"}
                    onPress={() => setRating(n)}
                  />
                ))}
                <Button title="Clear" onPress={() => setRating(0)} />
              </View>
            </Field>
            <Field label="Color swatches and hex input">
              <View style={styles.wrap}>
                {["#000000", "#cf2929", "#228844", "#2255cc", "#8855aa"].map(
                  (c) => (
                    <Pressable
                      key={c}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${c}`}
                      accessibilityState={{ selected: color === c }}
                      onPress={() => setColor(c)}
                      style={[
                        styles.swatch,
                        {
                          backgroundColor: c,
                          borderWidth: color === c ? 4 : 1,
                          borderColor: "#bbb",
                        },
                      ]}
                    />
                  ),
                )}
              </View>
              <TextInput
                accessibilityLabel="Hex color"
                autoCapitalize="none"
                style={styles.input}
                value={color}
                onChangeText={setColor}
              />
              {color !== "" && !/^#[\da-f]{6}$/i.test(color) && (
                <Text style={styles.error}>
                  Enter a six-digit hex color, such as #2255cc.
                </Text>
              )}
            </Field>
          </Section>
          <Section title="D. Date and time pickers">
            <Field label="Date">
              <Button
                title={date.toLocaleDateString()}
                onPress={() => setPicker("date")}
              />
            </Field>
            <Field label="Time">
              <Button
                title={time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                onPress={() => setPicker("time")}
              />
            </Field>
            {picker && Platform.OS !== "web" && (
              <>
                <DateTimePicker
                  value={picker === "date" ? date : time}
                  mode={picker}
                  onChange={(event, value) => {
                    if (value && event.type !== "dismissed")
                      (picker === "date" ? setDate : setTime)(value);
                    if (Platform.OS === "android") setPicker(null);
                  }}
                />
                {Platform.OS === "ios" && (
                  <Button title="Done" onPress={() => setPicker(null)} />
                )}
              </>
            )}
            {picker && Platform.OS === "web" && (
              <Text style={styles.hint}>
                Native date/time dialogs are available on Android and iOS. Try
                the month and year selectors below in web preview.
              </Text>
            )}
            <Field label="Month">
              <View style={styles.border}>
                <Picker
                  accessibilityLabel="Month"
                  selectedValue={month}
                  onValueChange={setMonth}
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <Picker.Item key={m} label={m} value={m} />
                  ))}
                </Picker>
              </View>
            </Field>
            <Field label="Year">
              <View style={styles.border}>
                <Picker
                  accessibilityLabel="Year"
                  selectedValue={year}
                  onValueChange={setYear}
                >
                  {Array.from({ length: 21 }, (_, i) => String(2020 + i)).map(
                    (y) => (
                      <Picker.Item key={y} label={y} value={y} />
                    ),
                  )}
                </Picker>
              </View>
            </Field>
          </Section>
          <Section title="E. Device and local input">
            <Text style={styles.hint}>
              Availability depends on hardware, OS and permissions. Files and
              recordings stay local and are never uploaded. Canceling leaves the
              current selection intact.
            </Text>
            <Field label="Photo library / camera">
              <View style={styles.wrap}>
                <Button title="Choose image" onPress={() => pickImage(false)} />
                <Button title="Take photo" onPress={() => pickImage(true)} />
                <Button
                  title="Clear image"
                  disabled={!photo}
                  onPress={() => setPhoto(undefined)}
                />
              </View>
              {photo && (
                <Image
                  accessibilityLabel="Selected image"
                  source={{ uri: photo }}
                  style={styles.photo}
                />
              )}
            </Field>
            <Field label="Local document picker">
              <Button
                title="Select a document"
                onPress={() =>
                  run(async () => {
                    const r = await DocumentPicker.getDocumentAsync({
                      copyToCacheDirectory: true,
                    });
                    if (!r.canceled)
                      setFile(
                        r.assets
                          .map((a) => `${a.name} (${a.size ?? "?"} bytes)`)
                          .join(", "),
                      );
                  })
                }
              />
              <Text style={styles.hint}>{file}</Text>
            </Field>
            {/* Device controls disabled: location, audio, clipboard paste and biometrics.
            <Field label="Location">
              <Button
                title="Use current location"
                onPress={() =>
                  run(async () => {
                    const p =
                      await Location.requestForegroundPermissionsAsync();
                    if (!p.granted) {
                      setStatus("Location permission denied.");
                      return;
                    }
                    const l = await Location.getCurrentPositionAsync({
                      accuracy: Location.Accuracy.Balanced,
                    });
                    setStatus(
                      `Latitude ${l.coords.latitude.toFixed(5)}, longitude ${l.coords.longitude.toFixed(5)}`,
                    );
                  })
                }
              />
            </Field>
            <Field label="Microphone / audio recording">
              <View style={styles.wrap}>
                <Button
                  title={
                    recording.isRecording ? "Stop recording" : "Record audio"
                  }
                  onPress={toggleRecording}
                />
                <Button
                  title="Play recording"
                  disabled={!audioUri || recording.isRecording}
                  onPress={() =>
                    run(async () => {
                      await setAudioModeAsync({
                        allowsRecording: false,
                        playsInSilentMode: true,
                      });
                      await player.seekTo(0);
                      player.play();
                    })
                  }
                />
              </View>
              <Text style={styles.hint}>
                {recording.isRecording
                  ? `Recording: ${Math.floor(recording.durationMillis / 1000)} seconds`
                  : audioUri
                    ? "Recording ready"
                    : "No recording"}
              </Text>
            </Field>
            <Field label="Clipboard paste">
              <Button
                title="Paste clipboard into text field"
                onPress={() =>
                  run(async () => {
                    update("text", await Clipboard.getStringAsync());
                    setStatus(
                      "Clipboard pasted into the single-line text field.",
                    );
                  })
                }
              />
            </Field>
            <Field label="Biometric confirmation">
              <Button
                title="Try fingerprint / Face ID"
                onPress={() =>
                  run(async () => {
                    if (
                      !(await LocalAuthentication.hasHardwareAsync()) ||
                      !(await LocalAuthentication.isEnrolledAsync())
                    ) {
                      setStatus("Biometrics are unavailable or not enrolled.");
                      return;
                    }
                    const r = await LocalAuthentication.authenticateAsync({
                      promptMessage: "Confirm sample form input",
                    });
                    setStatus(
                      r.success
                        ? "Biometric confirmation succeeded."
                        : `Authentication did not complete: ${r.error}`,
                    );
                  })
                }
              />
            </Field>

*/}
            {/* <Field label="Haptic feedback">
              <Button
                title="Try selection feedback"
                onPress={() =>
                  run(async () => {
                    await Haptics.selectionAsync();
                    setStatus(
                      "Selection feedback requested; supported devices vibrate.",
                    );
                  })
                }
              />
            </Field> */}
            <Field
              label="Touch / signature pad"
              hint="Draw with one finger. This is a simple touch-coordinate demo, not a certified signature."
            >
              <View
                accessibilityLabel="Signature drawing area"
                style={styles.pad}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={(e) =>
                  setPoints((p) => [
                    ...p,
                    { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY },
                  ])
                }
                onResponderMove={(e) => {
                  const { locationX: x, locationY: y } = e.nativeEvent;
                  setPoints((p) => [...p.slice(-1499), { x, y }]);
                }}
              >
                {points.map((p, i) => (
                  <View
                    key={i}
                    pointerEvents="none"
                    style={[styles.dot, { left: p.x, top: p.y }]}
                  />
                ))}
              </View>
              <Button title="Clear drawing" onPress={() => setPoints([])} />
            </Field>
            {!!status && (
              <Text accessibilityLiveRegion="polite" style={styles.status}>
                {status}
              </Text>
            )}
          </Section>
          <Section title="F. Form actions and validation">
            <Text style={styles.hint}>
              Log output prints all current form values to the console,
              including empty fields. Reset clears every control, local
              selection and message. Nothing is sent anywhere.
            </Text>
            <View style={styles.wrap}>
              <Button
                title="Log form output"
                onPress={() => {
                  Keyboard.dismiss();
                  console.log("Form output", {
                    textInputs: {
                      ...Object.fromEntries(
                        fields.map((field) => [field.key, ""]),
                      ),
                      ...values,
                      fruit: values.fruit || "",
                    },
                    choices: {
                      terms: checked,
                      updates: consent,
                      notifications: enabled,
                      contact: radio,
                      frequency: segment,
                      country,
                      interests: multi,
                      tags,
                      pendingTag: tag,
                    },
                    selectors: {
                      slider,
                      range: { min: low, max: high },
                      quantity: step,
                      rating,
                      color,
                    },
                    dateTime: {
                      date: date.toISOString(),
                      time: time.toLocaleTimeString(),
                      month,
                      year,
                    },
                    device: {
                      photoUri: photo ?? null,
                      document: file === "No file selected" ? null : file,
                      // audioUri,
                      // isRecording: recording.isRecording,
                      drawing: points,
                      lastStatus: status,
                    },
                  });
                  setTouched(
                    Object.fromEntries(fields.map((f) => [f.key, true])),
                  );
                  setSubmitted(true);
                }}
              />
              <Button title="Reset all" onPress={reset} />
            </View>
            {submitted && (
              <Text
                accessibilityLiveRegion="polite"
                style={
                  errors.length ||
                  (color !== "" && !/^#[\da-f]{6}$/i.test(color))
                    ? styles.error
                    : styles.status
                }
              >
                {errors.length ||
                (color !== "" && !/^#[\da-f]{6}$/i.test(color))
                  ? "Form output logged. Some entered values have validation messages above."
                  : "Form output logged to the console."}
              </Text>
            )}
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
  function reset() {
    /* Audio reset disabled.
    if (recording.isRecording) {
      setStatus("Stop recording before resetting.");
      return;
    }
    player.pause();
*/
    setValues({});
    setTouched({});
    setVisible(false);
    setChecked(false);
    setConsent(false);
    setEnabled(false);
    setRadio("Email");
    setSegment("Daily");
    setCountry("ZA");
    setMulti([]);
    setTags([]);
    setTag("");
    setSlider(50);
    setLow(20);
    setHigh(80);
    setStep(1);
    setRating(0);
    setColor("#000000");
    setDate(new Date());
    setTime(new Date());
    setPicker(null);
    setMonth("January");
    setYear("2026");
    setPhoto(undefined);
    setFile("No file selected");
    // setAudioUri(null);
    setPoints([]);
    setStatus("");
    setSubmitted(false);
  }
}
export default function App() {
  return (
    <SafeAreaProvider>
      <Showcase />
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: {
    padding: 20,
    paddingBottom: 60,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  title: { fontSize: 26, fontWeight: "600", color: "#111", marginBottom: 10 },
  intro: { fontSize: 14, lineHeight: 21, color: "#444" },
  section: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 18,
  },
  heading: { fontSize: 19, fontWeight: "600", marginBottom: 18 },
  field: { marginBottom: 20, gap: 7 },
  label: { fontSize: 14, fontWeight: "500", color: "#222" },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 11,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fff",
  },
  textarea: { height: 110, textAlignVertical: "top" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 3,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  selected: { borderColor: "#111", backgroundColor: "#eee" },
  border: { borderWidth: 1, borderColor: "#aaa", borderRadius: 3 },
  disabled: { backgroundColor: "#eee", opacity: 0.6 },
  hint: { fontSize: 12, lineHeight: 18, color: "#666" },
  error: { fontSize: 12, color: "#b00020" },
  status: { fontSize: 14, lineHeight: 21, color: "#222", paddingVertical: 10 },
  swatch: { width: 44, height: 44, borderRadius: 3 },
  photo: { width: 180, height: 140, resizeMode: "contain" },
  pad: { height: 170, borderWidth: 1, borderColor: "#aaa", overflow: "hidden" },
  dot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#111",
  },
});
