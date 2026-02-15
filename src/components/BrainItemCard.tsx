import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../lib/theme";
import { BrainItem } from "../lib/types";
import { formatDate } from "../lib/utils";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  todo: "checkmark-circle-outline",
  restaurant: "restaurant-outline",
  reminder: "alarm-outline",
  event: "calendar-outline",
  video: "play-circle-outline",
  article: "newspaper-outline",
  idea: "bulb-outline",
};

type Props = { item: BrainItem };

export function BrainItemCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <Ionicons name={iconMap[item.type] || "ellipse-outline"} size={18} color={theme.accent2} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.confidence}>{Math.round(item.confidence * 100)}%</Text>
      </View>

      <Text style={styles.summary}>{item.summary}</Text>

      <View style={styles.metaWrap}>
        {Object.entries(item.metadata).slice(0, 4).map(([key, value]) => (
          <View key={key} style={styles.pill}>
            <Text style={styles.pillText}>{key}: {value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 10,
  },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleRow: { flexDirection: "row", gap: 8, alignItems: "center", flex: 1 },
  title: { color: theme.text, fontWeight: "700", fontSize: 16, flexShrink: 1 },
  confidence: { color: theme.accent2, fontWeight: "700", fontSize: 12 },
  summary: { color: theme.subtext, lineHeight: 19 },
  metaWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    backgroundColor: theme.bgSoft,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  pillText: { color: theme.subtext, fontSize: 12 },
  timestamp: { color: "#7D859F", fontSize: 12 },
});
