import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../lib/theme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export function CaptureComposer({ value, onChange, onSubmit, loading }: Props) {
  return (
    <LinearGradient colors={["#7A8CFF", "#5AE2C9"]} style={styles.wrap}>
      <Text style={styles.title}>Capture anything</Text>
      <Text style={styles.subtitle}>Paste text, links, places, events, or screenshots notes. AI will organize them.</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Example: Dinner at Kato this Friday 8pm in LA, book table"
        placeholderTextColor={theme.subtext}
        multiline
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
        <Ionicons name="sparkles" size={18} color={theme.text} />
        <Text style={styles.buttonText}>{loading ? "Processing..." : "Organize with AI"}</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 20, padding: 16, gap: 10 },
  title: { color: "#04111C", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#072130", fontSize: 13, lineHeight: 18 },
  input: {
    minHeight: 110,
    backgroundColor: "rgba(10, 11, 16, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: theme.text,
    fontSize: 15,
    textAlignVertical: "top",
    padding: 12,
  },
  button: {
    marginTop: 2,
    backgroundColor: "rgba(10,11,16,0.85)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: { color: theme.text, fontWeight: "600" },
});
