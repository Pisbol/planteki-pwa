import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─────────────────────────────────────────────────────────────────────────────
//  ⚠️  PASTE YOUR FREE PERENUAL API KEY HERE
//  Get it at: https://perenual.com/user/developer (free, 100 req/day)
// ─────────────────────────────────────────────────────────────────────────────
const PERENUAL_KEY = "sk-C0TW69da0bf89a4c016304";
const API_BASE = "https://perenual.com/api/v2";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlantSummary {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name?: string[];
  family?: string | null;
  genus?: string | null;
  cycle?: string;
  watering?: string;
  sunlight?: string[];
  default_image?: {
    medium_url?: string;
    regular_url?: string;
    thumbnail?: string;
  };
}

interface PlantDetail extends PlantSummary {
  type?: string;
  description?: string;
  origin?: string[];
  dimension?: string;
  dimensions?: {
    type?: string;
    min_value?: number;
    max_value?: number;
    unit?: string;
  };
  care_level?: string;
  flowers?: boolean;
  flowering_season?: string;
  color?: string;
  flower_color?: string;
  fruit?: boolean;
  harvest_season?: string;
  indoor?: boolean;
  hardiness?: { min?: string; max?: string };
  hardiness_location?: { full_url?: string };
  growth_rate?: string;
  maintenance?: string;
  medicinal?: boolean;
  poisonous_to_humans?: number;
  poisonous_to_pets?: number;
  drought_tolerant?: boolean;
  salt_tolerant?: boolean;
  thorny?: boolean;
  invasive?: boolean;
  tropical?: boolean;
  cuisine?: boolean;
  pest_susceptibility?: string[];
  leaf?: boolean;
  leaf_color?: string[];
  edible_leaf?: boolean;
  propagation?: string[];
  soil?: string[];
  attracted_wildlife?: string[];
}

// ─── Filter categories ────────────────────────────────────────────────────────
const FILTERS = [
  { id: "all", label: "🌿 All", param: {} },
  { id: "indoor", label: "🏠 Indoor", param: { indoor: 1 } },
  { id: "full_sun", label: "☀️ Full Sun", param: { sunlight: "full_sun" } },
  { id: "shade", label: "🌥️ Shade", param: { sunlight: "part_shade" } },
  { id: "low_water", label: "💧 Low Water", param: { watering: "minimum" } },
  { id: "perennial", label: "🌱 Perennial", param: { cycle: "perennial" } },
  { id: "edible", label: "🍃 Edible", param: { edible: 1 } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function capitalize(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

function formatList(arr?: string[]) {
  if (!arr || arr.length === 0) return undefined;
  return arr.map(capitalize).join(", ");
}

function wateringColor(w?: string) {
  if (!w) return "#4A7C59";
  if (w === "frequent") return "#1565C0";
  if (w === "average") return "#2E7D32";
  if (w === "minimum") return "#F57F17";
  if (w === "none") return "#BF360C";
  return "#4A7C59";
}

function wateringLabel(w?: string) {
  const map: Record<string, string> = {
    frequent: "💧💧💧 Frequent",
    average: "💧💧 Average",
    minimum: "💧 Minimum",
    none: "🚫 None",
  };
  return w ? (map[w] ?? capitalize(w)) : undefined;
}

function sunlightLabel(arr?: string[]) {
  if (!arr || arr.length === 0) return undefined;
  const map: Record<string, string> = {
    full_sun: "☀️ Full Sun",
    "sun-part_shade": "⛅ Sun / Part Shade",
    part_shade: "🌥️ Part Shade",
    full_shade: "🌑 Full Shade",
  };
  return arr.map((s) => map[s] ?? capitalize(s)).join(", ");
}

// ─── API Calls ────────────────────────────────────────────────────────────────
async function searchPlants(
  query: string,
  filterParams: Record<string, string | number> = {},
): Promise<PlantSummary[]> {
  const params = new URLSearchParams({
    key: PERENUAL_KEY,
    q: query,
    ...Object.fromEntries(
      Object.entries(filterParams).map(([k, v]) => [k, String(v)]),
    ),
  });
  const res = await fetch(`${API_BASE}/species-list?${params}`);
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  return (json.data ?? []) as PlantSummary[];
}

async function getPlantDetail(id: number): Promise<PlantDetail | null> {
  const res = await fetch(
    `${API_BASE}/species/details/${id}?key=${PERENUAL_KEY}`,
  );
  if (!res.ok) return null;
  return res.json();
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <View style={row.container}>
      <View style={row.iconBox}>
        <Text style={row.icon}>{icon}</Text>
      </View>
      <View style={row.textBox}>
        <Text style={row.label}>{label}</Text>
        <Text style={row.value}>{value}</Text>
      </View>
    </View>
  );
}

const row = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    backgroundColor: "#EAF4E5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 18 },
  textBox: { flex: 1 },
  label: {
    fontSize: 11,
    color: "#6B8F71",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  value: { fontSize: 14, color: "#1E3A2F", fontWeight: "500", lineHeight: 20 },
});

function BoolBadge({
  value,
  trueLabel,
  falseLabel,
}: {
  value?: boolean | number | null;
  trueLabel: string;
  falseLabel?: string;
}) {
  if (value === undefined || value === null) return null;
  const isTrue = value === true || value === 1;
  if (!isTrue && !falseLabel) return null;
  return (
    <View style={[badge.pill, isTrue ? badge.yes : badge.no]}>
      <Text style={[badge.text, isTrue ? badge.yesText : badge.noText]}>
        {isTrue ? trueLabel : falseLabel}
      </Text>
    </View>
  );
}

const badge = StyleSheet.create({
  pill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  yes: { backgroundColor: "#E8F5E9", borderColor: "#A5D6A7" },
  no: { backgroundColor: "#FFEBEE", borderColor: "#EF9A9A" },
  text: { fontSize: 12, fontWeight: "600" },
  yesText: { color: "#2E7D32" },
  noText: { color: "#C62828" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PlantWikiScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlantSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [detail, setDetail] = useState<PlantDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "care" | "taxonomy">(
    "overview",
  );
  const [searchError, setSearchError] = useState("");

  const currentFilterParams =
    FILTERS.find((f) => f.id === activeFilter)?.param ?? {};

  const handleSearch = useCallback(
    async (overrideFilter?: string) => {
      if (!query.trim()) return;
      setSearching(true);
      setSearched(true);
      setResults([]);
      setSearchError("");
      const filterId = overrideFilter ?? activeFilter;
      const filterParams = FILTERS.find((f) => f.id === filterId)?.param ?? {};
      try {
        const data = await searchPlants(query.trim(), filterParams);
        setResults(data);
        if (data.length === 0)
          setSearchError("No plants found. Try a different name or filter.");
      } catch {
        setSearchError(
          "Could not connect to plant database. Check your API key.",
        );
      } finally {
        setSearching(false);
      }
    },
    [query, activeFilter],
  );

  const handleFilterChange = useCallback(
    async (filterId: string) => {
      setActiveFilter(filterId);
      if (!searched || !query.trim()) return;
      setSearching(true);
      setResults([]);
      setSearchError("");
      const filterParams = FILTERS.find((f) => f.id === filterId)?.param ?? {};
      try {
        const data = await searchPlants(query.trim(), filterParams);
        setResults(data);
        if (data.length === 0) setSearchError("No plants match this filter.");
      } catch {
        setSearchError("Search failed. Please try again.");
      } finally {
        setSearching(false);
      }
    },
    [query, searched],
  );

  const handleSelectPlant = useCallback(async (id: number) => {
    setLoadingDetail(true);
    setModalVisible(true);
    setDetail(null);
    setActiveTab("overview");
    try {
      const data = await getPlantDetail(id);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setDetail(null);
  };

  const getImageUrl = (p: PlantSummary) =>
    p.default_image?.medium_url || p.default_image?.thumbnail || null;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F0" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerEmoji}>🌿</Text>
        <Text style={s.headerTitle}>Plant Wiki</Text>
        <Text style={s.headerSub}>Search houseplants & garden plants</Text>
      </View>

      {/* Search bar */}
      <View style={s.searchRow}>
        <TextInput
          style={s.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. Monstera, Lavender, Aloe…"
          placeholderTextColor="#9CAF88"
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={s.searchBtn}
          onPress={() => handleSearch()}
          activeOpacity={0.8}
        >
          <Text style={s.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={s.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[s.filterChip, activeFilter === f.id && s.filterChipActive]}
            onPress={() => handleFilterChange(f.id)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                s.filterChipText,
                activeFilter === f.id && s.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {searching ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color="#4A7C59" />
          <Text style={s.loadingText}>Searching plant database…</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={s.resultsLabel}>
                {results.length} plant{results.length !== 1 ? "s" : ""} found
                for "{query}"
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !searched ? (
              <View style={s.centered}>
                <Text style={s.placeholderEmoji}>🌱</Text>
                <Text style={s.placeholderText}>
                  Search a plant to get started
                </Text>
                <Text style={s.placeholderHint}>
                  Powered by Perenual · 10,000+ species
                </Text>
              </View>
            ) : searchError ? (
              <View style={s.centered}>
                <Text style={s.emptyEmoji}>🌾</Text>
                <Text style={s.emptyText}>{searchError}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const img = getImageUrl(item);
            return (
              <TouchableOpacity
                style={s.resultCard}
                onPress={() => handleSelectPlant(item.id)}
                activeOpacity={0.75}
              >
                {/* Thumbnail */}
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={s.cardThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[s.cardThumb, s.cardThumbPlaceholder]}>
                    <Text style={{ fontSize: 22 }}>🌿</Text>
                  </View>
                )}
                <View style={s.cardBody}>
                  <Text style={s.cardTitle}>{item.common_name}</Text>
                  <Text style={s.cardSci} numberOfLines={1}>
                    {item.scientific_name?.[0] ?? ""}
                  </Text>
                  <View style={s.cardTags}>
                    {item.watering && (
                      <View
                        style={[
                          s.tag,
                          { borderColor: wateringColor(item.watering) },
                        ]}
                      >
                        <Text
                          style={[
                            s.tagText,
                            { color: wateringColor(item.watering) },
                          ]}
                        >
                          💧 {capitalize(item.watering)}
                        </Text>
                      </View>
                    )}
                    {item.cycle && (
                      <View style={s.tag}>
                        <Text style={s.tagText}>
                          🔄 {capitalize(item.cycle)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={s.cardArrow}>›</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* ── Detail Modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={s.modalSafe}>
          {/* Modal top bar */}
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={s.closeBtn}>
              <Text style={s.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
            {detail && (
              <Text style={s.modalHeaderTitle} numberOfLines={1}>
                {detail.common_name}
              </Text>
            )}
          </View>

          {loadingDetail ? (
            <View style={s.centered}>
              <ActivityIndicator size="large" color="#4A7C59" />
              <Text style={s.loadingText}>Loading plant details…</Text>
            </View>
          ) : detail ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Hero image */}
              {detail.default_image?.regular_url ? (
                <View style={s.imageWrapper}>
                  <Image
                    source={{ uri: detail.default_image.regular_url }}
                    style={s.plantImage}
                    resizeMode="cover"
                  />
                  <View style={s.imageOverlay} />
                  <View style={s.imageTitleBox}>
                    <Text style={s.imageTitleCommon}>{detail.common_name}</Text>
                    <Text style={s.imageTitleSci} numberOfLines={1}>
                      {detail.scientific_name?.[0]}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={s.noImageBox}>
                  <Text style={s.noImageEmoji}>🌿</Text>
                  <Text style={s.noImageCommon}>{detail.common_name}</Text>
                  <Text style={s.noImageSci}>
                    {detail.scientific_name?.[0]}
                  </Text>
                </View>
              )}

              {/* Quick badge row */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 14 }}
                contentContainerStyle={s.badgeRow}
              >
                <BoolBadge
                  value={detail.indoor}
                  trueLabel="🏠 Indoor"
                  falseLabel="🌳 Outdoor"
                />
                <BoolBadge value={detail.tropical} trueLabel="🌴 Tropical" />
                <BoolBadge value={detail.medicinal} trueLabel="💊 Medicinal" />
                <BoolBadge
                  value={detail.edible_leaf ?? detail.cuisine}
                  trueLabel="🍃 Edible"
                />
                <BoolBadge
                  value={detail.drought_tolerant}
                  trueLabel="🏜️ Drought Tolerant"
                />
                <BoolBadge
                  value={detail.poisonous_to_humans}
                  trueLabel="☠️ Toxic to Humans"
                />
                <BoolBadge
                  value={detail.poisonous_to_pets}
                  trueLabel="🐾 Toxic to Pets"
                />
                <BoolBadge value={detail.invasive} trueLabel="⚠️ Invasive" />
              </ScrollView>

              {/* Tab switcher */}
              <View style={s.tabRow}>
                {(["overview", "care", "taxonomy"] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[s.tabBtn, activeTab === tab && s.tabBtnActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text
                      style={[
                        s.tabBtnText,
                        activeTab === tab && s.tabBtnTextActive,
                      ]}
                    >
                      {tab === "overview"
                        ? "📋 Overview"
                        : tab === "care"
                          ? "🪴 Care"
                          : "🔬 Taxonomy"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.modalBody}>
                {/* ── OVERVIEW TAB ── */}
                {activeTab === "overview" && (
                  <>
                    {detail.description ? (
                      <>
                        <Text style={s.sectionTitle}>About</Text>
                        <Text style={s.extract}>{detail.description}</Text>
                      </>
                    ) : null}

                    <Text style={[s.sectionTitle, { marginTop: 18 }]}>
                      General Info
                    </Text>
                    <View style={s.infoCard}>
                      <InfoRow
                        icon="🌍"
                        label="Origin"
                        value={formatList(detail.origin)}
                      />
                      <InfoRow
                        icon="🌱"
                        label="Plant Type"
                        value={capitalize(detail.type)}
                      />
                      <InfoRow
                        icon="🔄"
                        label="Cycle"
                        value={capitalize(detail.cycle)}
                      />
                      <InfoRow
                        icon="📏"
                        label="Dimensions"
                        value={
                          detail.dimensions
                            ? `${detail.dimensions.min_value ?? "?"}–${detail.dimensions.max_value ?? "?"} ${detail.dimensions.unit ?? ""}`
                            : (detail.dimension ?? undefined)
                        }
                      />
                      <InfoRow
                        icon="🚀"
                        label="Growth Rate"
                        value={capitalize(detail.growth_rate)}
                      />
                      <InfoRow
                        icon="🛠️"
                        label="Maintenance"
                        value={capitalize(detail.maintenance)}
                      />
                      <InfoRow
                        icon="❤️"
                        label="Care Level"
                        value={capitalize(detail.care_level)}
                      />
                      <InfoRow
                        icon="🌸"
                        label="Flowering"
                        value={
                          detail.flowers
                            ? `Yes · ${capitalize(detail.flowering_season) || "Season varies"}`
                            : undefined
                        }
                      />
                      <InfoRow
                        icon="🎨"
                        label="Flower Color"
                        value={capitalize(detail.flower_color)}
                      />
                      <InfoRow
                        icon="🍂"
                        label="Leaf Color"
                        value={formatList(detail.leaf_color)}
                      />
                      <InfoRow
                        icon="🐛"
                        label="Common Pests"
                        value={formatList(detail.pest_susceptibility)}
                      />
                      <InfoRow
                        icon="🌍"
                        label="Wildlife"
                        value={formatList(detail.attracted_wildlife)}
                      />
                      <InfoRow
                        icon="🔄"
                        label="Propagation"
                        value={formatList(detail.propagation)}
                      />
                    </View>
                  </>
                )}

                {/* ── CARE TAB ── */}
                {activeTab === "care" && (
                  <>
                    <Text style={s.sectionTitle}>Care Guide</Text>
                    <View style={s.infoCard}>
                      <InfoRow
                        icon="💧"
                        label="Watering"
                        value={wateringLabel(detail.watering)}
                      />
                      <InfoRow
                        icon="☀️"
                        label="Sunlight"
                        value={sunlightLabel(detail.sunlight)}
                      />
                      <InfoRow
                        icon="🌡️"
                        label="Hardiness Zone"
                        value={
                          detail.hardiness
                            ? `Zone ${detail.hardiness.min ?? "?"} – ${detail.hardiness.max ?? "?"}`
                            : undefined
                        }
                      />
                      <InfoRow
                        icon="🪨"
                        label="Soil"
                        value={formatList(detail.soil)}
                      />
                      <InfoRow
                        icon="❤️"
                        label="Care Level"
                        value={capitalize(detail.care_level)}
                      />
                      <InfoRow
                        icon="🛠️"
                        label="Maintenance"
                        value={capitalize(detail.maintenance)}
                      />
                      <InfoRow
                        icon="🏜️"
                        label="Drought Tolerant"
                        value={
                          detail.drought_tolerant
                            ? "Yes"
                            : detail.drought_tolerant === false
                              ? "No"
                              : undefined
                        }
                      />
                      <InfoRow
                        icon="🌊"
                        label="Salt Tolerant"
                        value={
                          detail.salt_tolerant
                            ? "Yes"
                            : detail.salt_tolerant === false
                              ? "No"
                              : undefined
                        }
                      />
                    </View>
                  </>
                )}

                {/* ── TAXONOMY TAB ── */}
                {activeTab === "taxonomy" && (
                  <>
                    <Text style={s.sectionTitle}>
                      Scientific Classification
                    </Text>
                    <View style={s.infoCard}>
                      <InfoRow
                        icon="🔖"
                        label="Common Name"
                        value={detail.common_name}
                      />
                      <InfoRow
                        icon="🧬"
                        label="Scientific Name"
                        value={detail.scientific_name?.[0]}
                      />
                      <InfoRow
                        icon="📛"
                        label="Other Names"
                        value={formatList(detail.other_name)}
                      />
                      <InfoRow
                        icon="🌿"
                        label="Family"
                        value={detail.family ?? undefined}
                      />
                      <InfoRow
                        icon="🧪"
                        label="Genus"
                        value={detail.genus ?? undefined}
                      />
                      <InfoRow
                        icon="🔄"
                        label="Cycle"
                        value={capitalize(detail.cycle)}
                      />
                      <InfoRow
                        icon="🌱"
                        label="Type"
                        value={capitalize(detail.type)}
                      />
                    </View>
                  </>
                )}

                <View style={s.sourceBox}>
                  <Text style={s.sourceText}>
                    📖 Data from Perenual Plant API · perenual.com
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={s.centered}>
              <Text style={s.emptyEmoji}>😕</Text>
              <Text style={s.emptyText}>Could not load plant details.</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F0" },

  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 12,
  },
  headerEmoji: { fontSize: 34, marginBottom: 4 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E3A2F",
    letterSpacing: 0.5,
  },
  headerSub: { fontSize: 12, color: "#6B8F71", marginTop: 2 },

  searchRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android" ? 10 : 13,
    fontSize: 15,
    color: "#1E3A2F",
    borderWidth: 1.5,
    borderColor: "#C8DFC1",
    elevation: 2,
  },
  searchBtn: {
    backgroundColor: "#378837",
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
    elevation: 3,
  },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Filters — fixed as a proper horizontal scroll row
  filterScroll: { flexGrow: 0, marginBottom: 12 },
  filterContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: "#C8DFC1",
    // make sure chips never wrap — each is a single row
    flexShrink: 0,
  },
  filterChipActive: { backgroundColor: "#378837", borderColor: "#378837" },
  filterChipText: { fontSize: 13, color: "#378837", fontWeight: "600" },
  filterChipTextActive: { color: "#fff" },

  list: { paddingHorizontal: 16, paddingBottom: 30 },
  resultsLabel: {
    fontSize: 12,
    color: "#6B8F71",
    marginBottom: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  resultCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0EDD9",
    overflow: "hidden",
    alignItems: "center",
    elevation: 2,
  },
  cardThumb: { width: 72, height: 72 },
  cardThumbPlaceholder: {
    backgroundColor: "#EAF4E5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A2F",
    marginBottom: 2,
  },
  cardSci: {
    fontSize: 12,
    color: "#6B8F71",
    fontStyle: "italic",
    marginBottom: 6,
  },
  cardTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#C8DFC1",
    backgroundColor: "#F4F7F0",
  },
  tagText: { fontSize: 11, color: "#4A7C59", fontWeight: "600" },
  cardArrow: { fontSize: 22, color: "#C8DFC1", paddingRight: 12 },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  loadingText: { marginTop: 12, color: "#6B8F71", fontSize: 14 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A2F",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  placeholderEmoji: { fontSize: 60, marginBottom: 14 },
  placeholderText: { fontSize: 15, color: "#4A7C59", fontWeight: "600" },
  placeholderHint: { fontSize: 12, color: "#9CAF88", marginTop: 4 },

  // Modal
  modalSafe: { flex: 1, backgroundColor: "#F4F7F0" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0EDD9",
    gap: 12,
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A2F",
  },
  closeBtn: {
    backgroundColor: "#EAF4E5",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  closeBtnText: { color: "#378837", fontWeight: "700", fontSize: 14 },

  imageWrapper: { position: "relative", height: 230 },
  plantImage: { width: "100%", height: 230 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,35,20,0.4)",
  },
  imageTitleBox: { position: "absolute", bottom: 14, left: 16, right: 16 },
  imageTitleCommon: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  imageTitleSci: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 2,
  },

  noImageBox: {
    backgroundColor: "#EAF4E5",
    alignItems: "center",
    paddingVertical: 30,
    gap: 6,
  },
  noImageEmoji: { fontSize: 50 },
  noImageCommon: { fontSize: 22, fontWeight: "800", color: "#1E3A2F" },
  noImageSci: { fontSize: 13, fontStyle: "italic", color: "#6B8F71" },

  badgeRow: { paddingHorizontal: 16, gap: 8, flexDirection: "row" },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: "#E8F5E1",
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: "#378837" },
  tabBtnText: { fontSize: 12, fontWeight: "600", color: "#378837" },
  tabBtnTextActive: { color: "#fff" },

  modalBody: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E3A2F",
    marginBottom: 10,
    marginTop: 6,
  },
  extract: { fontSize: 14, color: "#2D4A38", lineHeight: 22 },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0EDD9",
    elevation: 1,
  },

  sourceBox: {
    marginTop: 20,
    backgroundColor: "#E8F5E1",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#378837",
  },
  sourceText: { fontSize: 12, color: "#378837", fontWeight: "600" },
});
