import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../lib/theme";

type Props = {
  options: string[];
  active: string;
  onChange: (next: string) => void;
};

export function SegmentControl({ options, active, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={[styles.segment, active === option && styles.active]}
        >
          <Text style={[styles.label, active === option && styles.activeLabel]}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: theme.bgSoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  active: {
    backgroundColor: theme.accent,
  },
  label: {
    color: theme.subtext,
    fontWeight: "600",
  },
  activeLabel: {
    color: "#101523",
  },
});
