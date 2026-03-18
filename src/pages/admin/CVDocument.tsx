import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
} from "@react-pdf/renderer";
import type { CVData } from "./CVBuilder";

export type CVTemplate = "classic" | "minimal" | "modern" | "bold" | "elegant";
export type CVPageSize = "A4" | "LETTER";

// ─── Shared helpers ──────────────────────────────────────────────────────────
const meta = (cv: CVData) =>
  [
    cv.email,
    cv.phone ? `· ${cv.phone}` : "",
    cv.location ? `· ${cv.location}` : "",
  ]
    .filter(Boolean)
    .join("  ");

// ─── 1. CLASSIC ─────────────────────────────────────────────────────────────
const classic = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: 0,
  },
  header: {
    backgroundColor: "#0f172a",
    padding: "24 36 20 36",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  photo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    border: "2 solid #3b82f6",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 3,
  },
  title: { fontSize: 10, color: "#93c5fd", marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { fontSize: 7.5, color: "#cbd5e1" },
  body: { flexDirection: "row", flex: 1 },
  sidebar: {
    width: 168,
    backgroundColor: "#f1f5f9",
    padding: "18 14",
    borderRight: "1 solid #e2e8f0",
  },
  main: { flex: 1, padding: "18 26" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#2563eb",
    borderBottom: "1.5 solid #2563eb",
    paddingBottom: 3,
    marginBottom: 9,
  },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#334155", lineHeight: 1.6 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expPeriod: { fontSize: 7.5, color: "#64748b" },
  expCo: { fontSize: 8.5, color: "#2563eb", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#334155", lineHeight: 1.55 },
  expItem: { marginBottom: 11 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  eduSch: { fontSize: 8, color: "#2563eb", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#64748b", marginBottom: 2 },
  eduDesc: { fontSize: 7.5, color: "#475569", lineHeight: 1.5 },
  eduItem: { marginBottom: 9 },
});

function ClassicCV({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Page size={size} style={classic.page}>
      <View style={classic.header}>
        {cv.photo_url ? (
          <Image src={cv.photo_url} style={classic.photo} />
        ) : null}
        <View style={classic.hText}>
          <Text style={classic.name}>{cv.name || "Your Name"}</Text>
          {cv.title ? <Text style={classic.title}>{cv.title}</Text> : null}
          <View style={classic.metaRow}>
            {cv.email ? <Text style={classic.metaItem}>{cv.email}</Text> : null}
            {cv.phone ? (
              <Text style={classic.metaItem}>· {cv.phone}</Text>
            ) : null}
            {cv.location ? (
              <Text style={classic.metaItem}>· {cv.location}</Text>
            ) : null}
            {cv.website ? (
              <Link
                src={cv.website}
                style={{ ...classic.metaItem, color: "#93c5fd" }}
              >
                {cv.website}
              </Link>
            ) : null}
          </View>
        </View>
      </View>
      <View style={classic.body}>
        <View style={classic.sidebar}>
          {cv.skills.length > 0 && (
            <View style={classic.secWrap}>
              <Text style={classic.secTitle}>Skills</Text>
              {cv.skills.map((sg) => (
                <View key={sg.id}>
                  <Text style={classic.skillCat}>{sg.category}</Text>
                  <Text style={classic.skillItems}>{sg.items}</Text>
                </View>
              ))}
            </View>
          )}
          {cv.education.length > 0 && (
            <View style={classic.secWrap}>
              <Text style={classic.secTitle}>Education</Text>
              {cv.education.map((e) => (
                <View key={e.id} style={classic.eduItem}>
                  <Text style={classic.eduDeg}>{e.degree}</Text>
                  <Text style={classic.eduSch}>{e.school}</Text>
                  <Text style={classic.eduPer}>{e.period}</Text>
                  {e.description ? (
                    <Text style={classic.eduDesc}>{e.description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={classic.main}>
          {cv.summary ? (
            <View style={classic.secWrap}>
              <Text style={classic.secTitle}>Summary</Text>
              <Text style={classic.summary}>{cv.summary}</Text>
            </View>
          ) : null}
          {cv.experiences.length > 0 && (
            <View style={classic.secWrap}>
              <Text style={classic.secTitle}>Experience</Text>
              {cv.experiences.map((e) => (
                <View key={e.id} style={classic.expItem}>
                  <View style={classic.expRow}>
                    <Text style={classic.expRole}>{e.role}</Text>
                    <Text style={classic.expPeriod}>{e.period}</Text>
                  </View>
                  <Text style={classic.expCo}>{e.company}</Text>
                  {e.description ? (
                    <Text style={classic.expDesc}>{e.description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

// ─── 2. MINIMAL ─────────────────────────────────────────────────────────────
const minimal = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: "40 48",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  photo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    border: "1 solid #e2e8f0",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  title: { fontSize: 10, color: "#6b7280", marginBottom: 5 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaItem: { fontSize: 7.5, color: "#9ca3af" },
  secTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 8,
  },
  secWrap: { marginBottom: 18 },
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#9ca3af" },
  expCo: { fontSize: 8, color: "#6b7280", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.6 },
  expItem: { marginBottom: 12 },
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  eduSch: { fontSize: 8, color: "#6b7280", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#9ca3af", marginBottom: 2 },
  eduItem: { marginBottom: 8 },
});

function MinimalCV({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Page size={size} style={minimal.page}>
      <View style={minimal.header}>
        {cv.photo_url ? (
          <Image src={cv.photo_url} style={minimal.photo} />
        ) : null}
        <View style={minimal.hText}>
          <Text style={minimal.name}>{cv.name || "Your Name"}</Text>
          {cv.title ? <Text style={minimal.title}>{cv.title}</Text> : null}
          <View style={minimal.metaRow}>
            <Text style={minimal.metaItem}>{meta(cv)}</Text>
            {cv.website ? (
              <Link
                src={cv.website}
                style={{ ...minimal.metaItem, color: "#6b7280" }}
              >
                {cv.website}
              </Link>
            ) : null}
          </View>
        </View>
      </View>
      {cv.summary ? (
        <View style={minimal.secWrap}>
          <Text style={minimal.secTitle}>Summary</Text>
          <Text style={minimal.summary}>{cv.summary}</Text>
        </View>
      ) : null}
      {cv.experiences.length > 0 && (
        <View style={minimal.secWrap}>
          <Text style={minimal.secTitle}>Experience</Text>
          {cv.experiences.map((e) => (
            <View key={e.id} style={minimal.expItem}>
              <View style={minimal.expRow}>
                <Text style={minimal.expRole}>{e.role}</Text>
                <Text style={minimal.expPeriod}>{e.period}</Text>
              </View>
              <Text style={minimal.expCo}>{e.company}</Text>
              {e.description ? (
                <Text style={minimal.expDesc}>{e.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
      <View style={minimal.twoCol}>
        {cv.skills.length > 0 && (
          <View style={minimal.col}>
            <Text style={minimal.secTitle}>Skills</Text>
            {cv.skills.map((sg) => (
              <View key={sg.id}>
                <Text style={minimal.skillCat}>{sg.category}</Text>
                <Text style={minimal.skillItems}>{sg.items}</Text>
              </View>
            ))}
          </View>
        )}
        {cv.education.length > 0 && (
          <View style={minimal.col}>
            <Text style={minimal.secTitle}>Education</Text>
            {cv.education.map((e) => (
              <View key={e.id} style={minimal.eduItem}>
                <Text style={minimal.eduDeg}>{e.degree}</Text>
                <Text style={minimal.eduSch}>{e.school}</Text>
                <Text style={minimal.eduPer}>{e.period}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}

// ─── 3. MODERN ──────────────────────────────────────────────────────────────
const modern = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: 0,
    flexDirection: "row",
  },
  sidebar: { width: 180, backgroundColor: "#1e293b", padding: "32 16 24 16" },
  photoWrap: { alignItems: "center", marginBottom: 18 },
  photo: { width: 72, height: 72, borderRadius: 36, border: "3 solid #38bdf8" },
  sName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 3,
  },
  sTitle: {
    fontSize: 8.5,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 14,
  },
  sMeta: { fontSize: 7.5, color: "#94a3b8", marginBottom: 4, lineHeight: 1.5 },
  sSecTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#38bdf8",
    marginBottom: 7,
    marginTop: 14,
  },
  sSecLine: { height: 1, backgroundColor: "#334155", marginBottom: 8 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#e2e8f0",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#94a3b8",
    lineHeight: 1.5,
    marginBottom: 6,
  },
  eduDeg: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#e2e8f0" },
  eduSch: { fontSize: 7.5, color: "#38bdf8", marginBottom: 1 },
  eduPer: { fontSize: 7, color: "#64748b", marginBottom: 5 },
  main: { flex: 1, padding: "32 28 24 24" },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#0ea5e9",
    marginBottom: 8,
  },
  secLine: { height: 1.5, backgroundColor: "#e0f2fe", marginBottom: 10 },
  secWrap: { marginBottom: 18 },
  summary: { fontSize: 8.5, color: "#334155", lineHeight: 1.65 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#64748b" },
  expCo: { fontSize: 8.5, color: "#0ea5e9", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#334155", lineHeight: 1.55 },
  expItem: { marginBottom: 12 },
});

function ModernCV({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Page size={size} style={modern.page}>
      <View style={modern.sidebar}>
        <View style={modern.photoWrap}>
          {cv.photo_url ? (
            <Image src={cv.photo_url} style={modern.photo} />
          ) : null}
        </View>
        <Text style={modern.sName}>{cv.name || "Your Name"}</Text>
        {cv.title ? <Text style={modern.sTitle}>{cv.title}</Text> : null}
        {cv.email ? <Text style={modern.sMeta}>{cv.email}</Text> : null}
        {cv.phone ? <Text style={modern.sMeta}>{cv.phone}</Text> : null}
        {cv.location ? <Text style={modern.sMeta}>{cv.location}</Text> : null}
        {cv.website ? <Text style={modern.sMeta}>{cv.website}</Text> : null}
        {cv.skills.length > 0 && (
          <>
            <Text style={modern.sSecTitle}>Skills</Text>
            <View style={modern.sSecLine} />
            {cv.skills.map((sg) => (
              <View key={sg.id}>
                <Text style={modern.skillCat}>{sg.category}</Text>
                <Text style={modern.skillItems}>{sg.items}</Text>
              </View>
            ))}
          </>
        )}
        {cv.education.length > 0 && (
          <>
            <Text style={modern.sSecTitle}>Education</Text>
            <View style={modern.sSecLine} />
            {cv.education.map((e) => (
              <View key={e.id}>
                <Text style={modern.eduDeg}>{e.degree}</Text>
                <Text style={modern.eduSch}>{e.school}</Text>
                <Text style={modern.eduPer}>{e.period}</Text>
              </View>
            ))}
          </>
        )}
      </View>
      <View style={modern.main}>
        {cv.summary ? (
          <View style={modern.secWrap}>
            <Text style={modern.secTitle}>About Me</Text>
            <View style={modern.secLine} />
            <Text style={modern.summary}>{cv.summary}</Text>
          </View>
        ) : null}
        {cv.experiences.length > 0 && (
          <View style={modern.secWrap}>
            <Text style={modern.secTitle}>Experience</Text>
            <View style={modern.secLine} />
            {cv.experiences.map((e) => (
              <View key={e.id} style={modern.expItem}>
                <View style={modern.expRow}>
                  <Text style={modern.expRole}>{e.role}</Text>
                  <Text style={modern.expPeriod}>{e.period}</Text>
                </View>
                <Text style={modern.expCo}>{e.company}</Text>
                {e.description ? (
                  <Text style={modern.expDesc}>{e.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}

// ─── 4. BOLD ────────────────────────────────────────────────────────────────
const bold = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#ffffff",
    padding: 0,
  },
  accentBar: { height: 6, backgroundColor: "#7c3aed" },
  header: {
    backgroundColor: "#7c3aed",
    padding: "20 36 18 36",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  photo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    border: "3 solid #ddd6fe",
    flexShrink: 0,
  },
  hText: { flex: 1 },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  title: { fontSize: 10.5, color: "#ddd6fe", marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaItem: { fontSize: 7.5, color: "#ede9fe" },
  body: { flexDirection: "row", flex: 1 },
  sidebar: {
    width: 172,
    backgroundColor: "#faf5ff",
    padding: "18 14",
    borderRight: "1 solid #ede9fe",
  },
  main: { flex: 1, padding: "18 28" },
  secTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#7c3aed",
    paddingBottom: 3,
    borderBottom: "2 solid #7c3aed",
    marginBottom: 9,
  },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.65 },
  expRole: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#1f2937" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#7c3aed", fontFamily: "Helvetica-Bold" },
  expCo: { fontSize: 8.5, color: "#6d28d9", marginBottom: 3 },
  expDesc: { fontSize: 8, color: "#374151", lineHeight: 1.55 },
  expItem: { marginBottom: 12 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#4c1d95",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1f2937" },
  eduSch: { fontSize: 8, color: "#7c3aed", marginBottom: 1 },
  eduPer: { fontSize: 7.5, color: "#9ca3af", marginBottom: 2 },
  eduItem: { marginBottom: 8 },
});

function BoldCV({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Page size={size} style={bold.page}>
      <View style={bold.header}>
        {cv.photo_url ? <Image src={cv.photo_url} style={bold.photo} /> : null}
        <View style={bold.hText}>
          <Text style={bold.name}>{cv.name || "Your Name"}</Text>
          {cv.title ? <Text style={bold.title}>{cv.title}</Text> : null}
          <View style={bold.metaRow}>
            {cv.email ? <Text style={bold.metaItem}>{cv.email}</Text> : null}
            {cv.phone ? <Text style={bold.metaItem}>· {cv.phone}</Text> : null}
            {cv.location ? (
              <Text style={bold.metaItem}>· {cv.location}</Text>
            ) : null}
            {cv.website ? (
              <Link
                src={cv.website}
                style={{ ...bold.metaItem, color: "#ddd6fe" }}
              >
                {cv.website}
              </Link>
            ) : null}
          </View>
        </View>
      </View>
      <View style={bold.body}>
        <View style={bold.sidebar}>
          {cv.skills.length > 0 && (
            <View style={bold.secWrap}>
              <Text style={bold.secTitle}>Skills</Text>
              {cv.skills.map((sg) => (
                <View key={sg.id}>
                  <Text style={bold.skillCat}>{sg.category}</Text>
                  <Text style={bold.skillItems}>{sg.items}</Text>
                </View>
              ))}
            </View>
          )}
          {cv.education.length > 0 && (
            <View style={bold.secWrap}>
              <Text style={bold.secTitle}>Education</Text>
              {cv.education.map((e) => (
                <View key={e.id} style={bold.eduItem}>
                  <Text style={bold.eduDeg}>{e.degree}</Text>
                  <Text style={bold.eduSch}>{e.school}</Text>
                  <Text style={bold.eduPer}>{e.period}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={bold.main}>
          {cv.summary ? (
            <View style={bold.secWrap}>
              <Text style={bold.secTitle}>Profile</Text>
              <Text style={bold.summary}>{cv.summary}</Text>
            </View>
          ) : null}
          {cv.experiences.length > 0 && (
            <View style={bold.secWrap}>
              <Text style={bold.secTitle}>Experience</Text>
              {cv.experiences.map((e) => (
                <View key={e.id} style={bold.expItem}>
                  <View style={bold.expRow}>
                    <Text style={bold.expRole}>{e.role}</Text>
                    <Text style={bold.expPeriod}>{e.period}</Text>
                  </View>
                  <Text style={bold.expCo}>{e.company}</Text>
                  {e.description ? (
                    <Text style={bold.expDesc}>{e.description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

// ─── 5. ELEGANT ─────────────────────────────────────────────────────────────
const elegant = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: "#fffdf9",
    padding: "36 44",
  },
  header: { alignItems: "center", marginBottom: 6, paddingBottom: 14 },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    border: "1.5 solid #d4a96a",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 3,
  },
  title: {
    fontSize: 9.5,
    color: "#a16207",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  divider: { height: 1, backgroundColor: "#d4a96a", marginBottom: 5 },
  dividerThin: { height: 0.5, backgroundColor: "#e7d5b3", marginBottom: 12 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 4,
  },
  metaItem: { fontSize: 7.5, color: "#78716c" },
  body: { flexDirection: "row", gap: 24 },
  sidebar: { width: 155 },
  main: { flex: 1 },
  secTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: "#a16207",
    marginBottom: 5,
  },
  secUnder: { height: 0.75, backgroundColor: "#d4a96a", marginBottom: 8 },
  secWrap: { marginBottom: 16 },
  summary: { fontSize: 8.5, color: "#44403c", lineHeight: 1.7 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#1c1917" },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expPeriod: { fontSize: 7.5, color: "#a16207" },
  expCo: {
    fontSize: 8,
    color: "#78716c",
    marginBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
  expDesc: { fontSize: 8, color: "#44403c", lineHeight: 1.6 },
  expItem: { marginBottom: 11 },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1c1917",
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 7.5,
    color: "#78716c",
    lineHeight: 1.5,
    marginBottom: 7,
  },
  eduDeg: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1c1917" },
  eduSch: {
    fontSize: 8,
    color: "#a16207",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 1,
  },
  eduPer: { fontSize: 7.5, color: "#a8a29e", marginBottom: 2 },
  eduItem: { marginBottom: 9 },
});

function ElegantCV({ cv, size }: { cv: CVData; size: CVPageSize }) {
  return (
    <Page size={size} style={elegant.page}>
      <View style={elegant.header}>
        {cv.photo_url ? (
          <Image src={cv.photo_url} style={elegant.photo} />
        ) : null}
        <Text style={elegant.name}>{cv.name || "Your Name"}</Text>
        {cv.title ? <Text style={elegant.title}>{cv.title}</Text> : null}
        <View style={elegant.metaRow}>
          {cv.email ? <Text style={elegant.metaItem}>{cv.email}</Text> : null}
          {cv.phone ? <Text style={elegant.metaItem}>· {cv.phone}</Text> : null}
          {cv.location ? (
            <Text style={elegant.metaItem}>· {cv.location}</Text>
          ) : null}
          {cv.website ? (
            <Link
              src={cv.website}
              style={{ ...elegant.metaItem, color: "#a16207" }}
            >
              {cv.website}
            </Link>
          ) : null}
        </View>
      </View>
      <View style={elegant.divider} />
      <View style={elegant.dividerThin} />
      <View style={elegant.body}>
        <View style={elegant.sidebar}>
          {cv.skills.length > 0 && (
            <View style={elegant.secWrap}>
              <Text style={elegant.secTitle}>Skills</Text>
              <View style={elegant.secUnder} />
              {cv.skills.map((sg) => (
                <View key={sg.id}>
                  <Text style={elegant.skillCat}>{sg.category}</Text>
                  <Text style={elegant.skillItems}>{sg.items}</Text>
                </View>
              ))}
            </View>
          )}
          {cv.education.length > 0 && (
            <View style={elegant.secWrap}>
              <Text style={elegant.secTitle}>Education</Text>
              <View style={elegant.secUnder} />
              {cv.education.map((e) => (
                <View key={e.id} style={elegant.eduItem}>
                  <Text style={elegant.eduDeg}>{e.degree}</Text>
                  <Text style={elegant.eduSch}>{e.school}</Text>
                  <Text style={elegant.eduPer}>{e.period}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={elegant.main}>
          {cv.summary ? (
            <View style={elegant.secWrap}>
              <Text style={elegant.secTitle}>Profile</Text>
              <View style={elegant.secUnder} />
              <Text style={elegant.summary}>{cv.summary}</Text>
            </View>
          ) : null}
          {cv.experiences.length > 0 && (
            <View style={elegant.secWrap}>
              <Text style={elegant.secTitle}>Experience</Text>
              <View style={elegant.secUnder} />
              {cv.experiences.map((e) => (
                <View key={e.id} style={elegant.expItem}>
                  <View style={elegant.expRow}>
                    <Text style={elegant.expRole}>{e.role}</Text>
                    <Text style={elegant.expPeriod}>{e.period}</Text>
                  </View>
                  <Text style={elegant.expCo}>{e.company}</Text>
                  {e.description ? (
                    <Text style={elegant.expDesc}>{e.description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function CVDocument({
  cv,
  template = "classic",
  pageSize = "A4",
}: {
  cv: CVData;
  template?: CVTemplate;
  pageSize?: CVPageSize;
}) {
  const size = pageSize;
  return (
    <Document title={cv.name ? `${cv.name} — CV` : "CV"}>
      {template === "classic" && <ClassicCV cv={cv} size={size} />}
      {template === "minimal" && <MinimalCV cv={cv} size={size} />}
      {template === "modern" && <ModernCV cv={cv} size={size} />}
      {template === "bold" && <BoldCV cv={cv} size={size} />}
      {template === "elegant" && <ElegantCV cv={cv} size={size} />}
    </Document>
  );
}
