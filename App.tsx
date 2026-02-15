import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BrainItemCard } from "./src/components/BrainItemCard";
import { CaptureComposer } from "./src/components/CaptureComposer";
import { SegmentControl } from "./src/components/SegmentControl";
import { processCapture } from "./src/lib/ai";
import { theme } from "./src/lib/theme";
import { loadItems, saveItems } from "./src/lib/storage";
import { BrainItem } from "./src/lib/types";

const FILTERS = ["Feed", "To Dos", "Restaurants", "Reminders", "Events", "Media", "Ideas"];

export default function App() {
  const [capture, setCapture] = useState("");
  const [items, setItems] = useState<BrainItem[]>([]);
  const [filter, setFilter] = useState("Feed");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems().then(setItems);
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const shownItems = useMemo(() => {
    if (filter === "Feed") return items;
    const map: Record<string, string[]> = {
      "To Dos": ["todo"],
      Restaurants: ["restaurant"],
      Reminders: ["reminder"],
      Events: ["event"],
      Media: ["video", "article"],
      Ideas: ["idea"],
    };

    const allowed = map[filter] || [];
    return items.filter((item) => allowed.includes(item.type));
  }, [filter, items]);

  const handleCapture = async () => {
    const input = capture.trim();
    if (!input || loading) return;

    setLoading(true);
    try {
      const result = await processCapture(input);
      setItems((prev) => [result.item, ...prev]);
      setCapture("");
      Alert.alert("Organized", result.reasoning);
    } catch {
      Alert.alert("Processing failed", "Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingWrap}>
          <Text style={styles.eyebrow}>SECOND BRAIN</Text>
          <Text style={styles.title}>Capture once. Let AI organize everything.</Text>
          <Text style={styles.subtitle}>
            One inbox for tasks, restaurants, reminders, events, and content queues—designed for elite execution.
          </Text>
        </View>

        <CaptureComposer value={capture} onChange={setCapture} onSubmit={handleCapture} loading={loading} />

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Knowledge Graph Feed</Text>
          <Text style={styles.sectionSub}>{items.length} total captures</Text>
        </View>

        <SegmentControl options={FILTERS} active={filter} onChange={setFilter} />

        <View style={styles.list}>
          {shownItems.map((item) => (
            <BrainItemCard key={item.id} item={item} />
          ))}
          {!shownItems.length && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No items yet</Text>
              <Text style={styles.emptyText}>Drop your first note, link, event, or screenshot description to build momentum.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  container: { padding: 16, paddingBottom: 48, gap: 16 },
  headingWrap: { gap: 8, marginBottom: 2 },
  eyebrow: { color: theme.accent2, fontWeight: "700", letterSpacing: 1.2, fontSize: 11 },
  title: { color: theme.text, fontSize: 30, fontWeight: "800", lineHeight: 36 },
  subtitle: { color: theme.subtext, fontSize: 15, lineHeight: 21 },
  sectionHead: { marginTop: 6 },
  sectionTitle: { color: theme.text, fontWeight: "700", fontSize: 18 },
  sectionSub: { color: theme.subtext, marginTop: 2 },
  list: { gap: 10 },
  empty: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.bgCard,
    gap: 5,
  },
  emptyTitle: { color: theme.text, fontWeight: "700" },
  emptyText: { color: theme.subtext, lineHeight: 18 },
});
