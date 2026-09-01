# Nagrik Radar --- Final Frontend Design & Backend Contract

**Version:** 1.0\
**Status:** FINAL FRONTEND BLUEPRINT\
**Hackathon:** Smart India Hackathon (SIH) Internal Hackathon\
**Team:** 6 people\
**Prototype Build Window:** 5 hours\
**Primary Goal:** Deliver a polished, working end-to-end prototype
demonstrating citizen reporting → AI understanding → complaint
correlation → emerging incident detection → authority action →
resolution monitoring.

------------------------------------------------------------------------

# 1. Product Definition

## 1.1 Product Name

**Nagrik Radar**

## 1.2 Product Positioning

### AI-Powered Civic Incident & Resolution Intelligence

Nagrik Radar is not simply a complaint-management portal.

It transforms individual citizen reports into actionable civic
intelligence by combining:

-   multilingual complaint understanding
-   classification
-   priority estimation
-   semantic similarity
-   geographic correlation
-   temporal correlation
-   incident clustering
-   emerging incident detection
-   evidence-backed explanations
-   recommended response
-   resolution monitoring

## 1.3 Core Product Story

``` text
Citizen reports a problem
        ↓
System understands the report
        ↓
Complaint is classified and prioritized
        ↓
Related reports are identified
        ↓
Multiple reports form an underlying incident
        ↓
Incident growth and geographic concentration are analyzed
        ↓
Authority receives actionable intelligence
        ↓
Authority investigates / resolves
        ↓
New evidence is monitored
        ↓
System can flag a possibly unresolved incident
```

## 1.4 Core Product Principle

> **Simple outside. Sophisticated inside.**

Citizens should not need to understand government departments, complaint
categories, priority systems, or AI.

Authorities need the opposite: dense, structured, evidence-driven
information.

------------------------------------------------------------------------

# 2. Primary Personas

## 2.1 Citizen

Needs:

-   extremely simple reporting
-   local-language support
-   voice input
-   photo input
-   automatic location
-   confirmation
-   complaint tracking
-   understandable status

Citizen should NOT be required to select:

-   department
-   ward
-   technical category
-   priority
-   incident cluster

## 2.2 Authority / Officer

Needs:

-   identify what requires attention now
-   see emerging incidents
-   understand why reports were correlated
-   see affected locations
-   review evidence
-   assign ownership
-   update status
-   resolve incidents
-   monitor post-resolution activity

------------------------------------------------------------------------

# 3. Design Principles

1.  **Citizen-first simplicity**
2.  **Voice and visual accessibility**
3.  **Local-language friendly**
4.  **AI assists; humans decide**
5.  **Evidence before conclusions**
6.  **Incident-first authority workflow**
7.  **Map + list + evidence must work together**
8.  **Do not overwhelm users with cards**
9.  **Use semantic colors with text labels**
10. **No AI gimmicks**
11. **Every important action has a clear state**
12. **Responsive behavior must be intentional**
13. **The interface should communicate uncertainty honestly**
14. **The core workflow must work without optional features**
15. **Demo reliability is more important than architectural complexity**

------------------------------------------------------------------------

# 4. Visual Direction

## 4.1 Overall Tone

-   trustworthy
-   civic
-   modern
-   calm
-   operational
-   accessible
-   Indian public-service context
-   AI-powered without looking futuristic

## 4.2 Color Direction

Primary:

-   Indigo / deep purple family

Surfaces:

-   white / neutral
-   light gray
-   subtle indigo tint for selected states

Semantic:

-   Red = Critical
-   Amber = High / Warning
-   Yellow = Medium
-   Green = Low / Healthy / Resolved
-   Blue/Indigo = Information / AI / Neutral action

Do not rely on color alone. Always pair severity colors with:

-   label
-   icon
-   text
-   shape or position when appropriate

## 4.3 Avoid

-   neon gradients
-   glowing AI effects
-   robot illustrations
-   giant AI chat bubbles
-   excessive glassmorphism
-   excessive rounded cards
-   pie-chart-heavy dashboards
-   decorative animations
-   futuristic sci-fi command center aesthetics

------------------------------------------------------------------------

# 5. Typography

Use a highly readable modern sans-serif.

Recommended:

-   Inter for authority UI
-   Noto Sans / Noto Sans Devanagari where multilingual support is
    needed

Citizen:

-   larger text
-   strong contrast
-   generous line height

Authority:

-   compact but readable
-   dense information hierarchy

Suggested scale:

``` text
Display: 36–44px
H1: 28–32px
H2: 22–24px
H3: 18–20px
Body: 14–16px
Small: 12–13px
Caption: 11–12px
```

------------------------------------------------------------------------

# 6. Responsive Strategy

## Citizen

Mobile-first.

Primary target:

-   360px--430px width

Secondary:

-   tablet
-   desktop

## Authority

Desktop-first.

Primary:

-   1280px+
-   1440px preferred

Tablet:

-   768px+

Mobile:

-   simplified operational view, not a shrunken desktop dashboard

------------------------------------------------------------------------

# 7. Application Structure

## Citizen Routes

``` text
/
 /report
 /report/review
 /report/success
 /track
 /track/[trackingId]
```

## Authority Routes

``` text
/admin
/admin/incidents
/admin/incidents/[incidentId]
/admin/complaints
/admin/hotspots
/admin/resolution
/admin/analytics
```

For the 5-hour prototype, some routes may be implemented as tabs/views
while preserving these conceptual boundaries.

------------------------------------------------------------------------

# 8. Shared Application Shell

## 8.1 Citizen Shell

Header:

``` text
Nagrik Radar
                    [Track]
```

Mobile:

``` text
┌─────────────────────────────┐
│ Nagrik Radar       Track    │
└─────────────────────────────┘
```

Do not expose authority navigation.

## 8.2 Authority Shell

Desktop:

``` text
┌──────────────────────────────────────────────────────┐
│ Nagrik Radar                         Authority Portal │
├───────────────┬──────────────────────────────────────┤
│ Overview      │                                      │
│ Emerging      │              PAGE CONTENT            │
│ Incidents     │                                      │
│ Hotspots      │                                      │
│ Complaints    │                                      │
│ Resolution    │                                      │
│ Analytics     │                                      │
└───────────────┴──────────────────────────────────────┘
```

Sidebar should remain stable.

------------------------------------------------------------------------

# 9. Citizen Experience

# 9.1 Home / Landing Page

Route:

`/`

## Purpose

Immediately communicate:

> You can report a civic problem simply.

## Primary copy

### English

**Report a problem in your area**

**Tell us what happened. We'll figure out the rest.**

### Hindi

**अपने इलाके की समस्या बताएं**

**हमें बताएं क्या हुआ। बाकी हम समझेंगे।**

## Main actions

``` text
🎤 Speak
📷 Take a photo
✍ Type
```

Primary action:

**Speak**

Secondary:

**Take a photo**

Tertiary:

**Type**

Tracking:

**Track my complaint**

## Layout

``` text
NAGRIK RADAR

Report a problem in your area

Tell us what happened.
We'll figure out the rest.

┌──────────────────────────────┐
│              🎤              │
│          Speak to us         │
│        बोलकर बताएं           │
└──────────────────────────────┘

┌──────────────┐ ┌──────────────┐
│      📷      │ │      ✍️      │
│ Take a photo │ │ Type instead │
└──────────────┘ └──────────────┘

📍 Track my complaint
```

## UX requirements

-   no department selection
-   no category selection
-   no priority selection
-   no account requirement for prototype
-   large touch targets
-   simple language
-   audio-friendly labels
-   language can be automatically detected

------------------------------------------------------------------------

# 10. Citizen Voice Reporting

Route:

`/report`

## Screen

``` text
← Back

Tell us what happened

        🎤

      Listening...

Speak naturally in your language.

        [ Stop ]
```

## After recording

``` text
We heard:

"हमारे इलाके में तीन दिन से
पानी नहीं आ रहा है।"

AI is understanding your report...

Language: Hindi
```

Then show structured interpretation.

``` text
We understood:

💧 Water supply problem
📍 Location: Detected
🟠 Priority: High

Is this correct?

[ Yes, submit ]
[ Change ]
```

## Important

If speech recognition is unavailable, fall back to text.

If language confidence is low:

``` text
We are not sure we understood that.

Please try again or type your problem.

[ Speak again ]
[ Type instead ]
```

------------------------------------------------------------------------

# 11. Citizen Text Reporting

## Copy

**What is the problem?**

Placeholder:

**Example: "There has been no water in our area since yesterday."**

Do not ask for category.

Optional:

**Add a photo**

Location:

``` text
📍 Location detected
Andheri East, Mumbai

[ Change ]
```

Submit:

**Submit report**

------------------------------------------------------------------------

# 12. Citizen Photo Reporting

Photo is optional for P0/P1.

Flow:

``` text
Take photo
    ↓
Preview
    ↓
Location
    ↓
Optional short description
    ↓
AI understanding
    ↓
Review
```

Do not force citizens to write a long description if image understanding
is available.

------------------------------------------------------------------------

# 13. AI Understanding / Review Screen

Route:

`/report/review`

This is a critical trust screen.

## Copy

### We understood your report

``` text
💧 Water supply problem

📍 Andheri East, Mumbai

🟠 High priority
```

Optional explanation:

``` text
We identified this as a water-supply issue
based on your description.
```

Actions:

``` text
[ Looks correct ]
[ Edit report ]
```

Do not show technical embedding scores to citizens.

------------------------------------------------------------------------

# 14. Duplicate / Related Complaint Citizen UX

If a likely duplicate exists:

``` text
We found a similar report nearby.

💧 Water supply problem

"Water has stopped in our building."

About 200m away
Reported 15 minutes ago

You can still submit your report.

[ View similar report ]
[ Submit my report ]
```

Important:

Do not block submission.

A citizen may be reporting a genuinely new aspect of the same incident.

Use wording:

-   Similar report
-   Related problem

Avoid:

-   Duplicate! You are not allowed to submit.
-   AI says this is the same.

------------------------------------------------------------------------

# 15. Citizen Success Screen

Route:

`/report/success`

## Copy

# Your report has been submitted

**Thank you for helping improve your area.**

Tracking ID:

`NR-7K4P2`

Status:

``` text
✓ Submitted
✓ Understood by AI
● Being reviewed
```

Primary:

**Track this report**

Secondary:

**Report another problem**

Optional:

**Share tracking ID**

------------------------------------------------------------------------

# 16. Citizen Tracking

Route:

`/track`

## Copy

# Track your report

Enter your tracking ID.

Input:

`NR-7K4P2`

Button:

**Track report**

## Result

``` text
NR-7K4P2

Water supply problem

Andheri East

✓ Report submitted
✓ Classified
✓ Sent for review
● Investigation
○ Resolution
```

Status descriptions must be plain-language.

------------------------------------------------------------------------

# 17. Authority Overview

Route:

`/admin`

## Primary question

> What needs attention now?

## Top summary

``` text
7
Emerging incidents

12
Critical

184
Active reports

5
Needs review
```

Avoid excessive KPI cards. Use only metrics that directly support
action.

## Main layout

``` text
┌──────────────────────────────────────────────────────────┐
│ Overview                                                 │
│ Civic activity and incidents that need attention        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 7 Emerging     12 Critical     184 Active     5 Review  │
│                                                          │
├───────────────────────────────┬──────────────────────────┤
│                               │ NEEDS ATTENTION NOW       │
│          INCIDENT MAP         │                          │
│                               │ 🚨 Water Supply Outage   │
│       🔴 🔴                   │ 47 reports               │
│     🔴 🔴 🔴                  │ ↑ 10.7× baseline        │
│                               │                          │
│          🟠                  │ 🚨 Road Damage           │
│                               │ 31 reports               │
│                               │ ↑ 6.2× baseline         │
└───────────────────────────────┴──────────────────────────┘
```

------------------------------------------------------------------------

# 18. Authority "Needs Attention Now"

This is the primary action queue.

Each incident item should communicate:

-   incident
-   location
-   count
-   severity
-   growth
-   status

Example:

``` text
🚨 Water Supply Outage
Andheri East

47 related reports
↑ 10.7× baseline

HIGH
Emerging
```

Action:

**Review incident**

------------------------------------------------------------------------

# 19. Emerging Incidents Page

Route:

`/admin/incidents`

or `/admin/emerging` conceptually.

## Header

**Emerging incidents**

Subtitle:

**Problems showing unusual growth or concentration.**

Filters:

``` text
[ All ]
[ Critical ]
[ High ]
[ Water ]
[ Roads ]
[ Garbage ]
[ Electricity ]

[ Last 24h ]
```

## Incident cards/list

``` text
🚨 Water Supply Outage
Andheri East

47 reports
↑ 10.7× baseline

High
Emerging

[ Review ]
```

------------------------------------------------------------------------

# 20. Incident Detail --- HERO SCREEN

Route:

`/admin/incidents/[incidentId]`

This is the most important screen in the entire application.

## Header

``` text
← Incidents

🚨 WATER SUPPLY OUTAGE

Emerging Incident
HIGH PRIORITY

Andheri East, Mumbai
Water Department
```

## Summary

``` text
47
Related reports

↑ 10.7×
vs normal activity

4h
Detected window
```

## Evidence section

### Why was this flagged?

``` text
✓ Similar descriptions
✓ Same geographic area
✓ Sudden increase in reports
✓ Multiple independent citizens
```

Optional metrics:

``` text
Semantic similarity     91%
Geographic proximity    94%
Temporal concentration  97%

AI confidence           93%
```

These metrics are for authority users only.

------------------------------------------------------------------------

# 21. Incident Growth Visualization

Title:

**Incident growth**

Show:

-   time
-   report count
-   baseline
-   current activity

Example:

``` text
Reports
 50 |                         ●
 40 |                    ●────
 30 |               ●────
 20 |          ●────
 10 |────●─────
    └──────────────────────────
      8AM  10AM  12PM  2PM  4PM
```

Use a line/area chart rather than a pie chart.

Show baseline as a reference line.

------------------------------------------------------------------------

# 22. Incident Map

Title:

**Affected area**

Map must show:

-   related reports
-   cluster boundary/area if available
-   incident center
-   selected complaint

Map interaction:

-   click marker → complaint preview
-   click incident → incident selected
-   zoom
-   fit incident
-   category filter
-   time filter

Map and list must remain synchronized.

------------------------------------------------------------------------

# 23. Related Complaints

Title:

**Supporting reports**

Show a compact list:

``` text
NR-7K4P2
"Water has stopped since yesterday."
Hindi
12 min ago
220m away

NR-8A92C
"No water in our building."
English
18 min ago
310m away
```

Actions:

**View report**

Do not overwhelm the authority with full raw complaint text by default.

------------------------------------------------------------------------

# 24. AI Explanation

Title:

**AI assessment**

Copy:

> These reports are likely related because they describe a similar
> water-supply problem, are concentrated within the same area, and
> increased sharply within a short period.

Then evidence bullets.

The explanation must always distinguish:

-   observed evidence
-   AI interpretation
-   recommendation

------------------------------------------------------------------------

# 25. Recommended Action

Title:

**Recommended next step**

Example:

> Inspect the local water-supply network and verify whether the outage
> affects the wider area.

Actions:

``` text
[ Assign department ]
[ Mark investigating ]
```

AI must not silently perform irreversible actions.

------------------------------------------------------------------------

# 26. Incident Status Model

Use:

``` text
Emerging
Investigating
Assigned
Action in progress
Resolved
Possibly unresolved
Reopened
```

For P0, minimum:

``` text
Emerging
Investigating
Resolved
Possibly unresolved
```

------------------------------------------------------------------------

# 27. Incident Resolution

Authority clicks:

**Mark resolved**

Confirmation:

``` text
Resolve incident?

Water Supply Outage

This will mark the incident as resolved.
The system will continue monitoring for related reports.

[ Cancel ]
[ Mark resolved ]
```

This sentence is important because it explains the post-resolution
intelligence.

------------------------------------------------------------------------

# 28. Resolution Monitoring

Route:

`/admin/resolution`

## Header

**Resolution monitoring**

Subtitle:

**Check whether resolved incidents remain quiet after closure.**

Sections:

### Recently resolved

``` text
✓ Road Damage
Resolved 2h ago
No new related reports
```

### Needs attention

``` text
⚠ Water Supply Outage
Resolved 5h ago

8 new related reports
Same area
91% semantic similarity

Possibly unresolved
```

------------------------------------------------------------------------

# 29. Possibly Unresolved Detail

Show:

``` text
⚠ POSSIBLY UNRESOLVED

Water Supply Outage

Original reports:
47

New related reports:
8

Evidence

✓ Same geographic area
✓ Similar descriptions
✓ New reports after closure

AI confidence:
89%

Recommended:

Review the incident again.
```

Actions:

``` text
[ Reopen investigation ]
[ Keep resolved ]
```

Use cautious language.

------------------------------------------------------------------------

# 30. Complaints Page

Route:

`/admin/complaints`

Purpose:

Raw report-level investigation.

Filters:

``` text
Search
Category
Priority
Status
Date
Location
Language
Incident
```

Columns:

``` text
Tracking ID
Issue
Location
Category
Priority
Incident
Status
Created
```

On mobile, convert rows into cards.

------------------------------------------------------------------------

# 31. Complaint Detail

Show:

``` text
NR-7K4P2

Water supply problem

Original report
Language
Location
Timestamp
AI classification
Priority
Related incident
Status
Event history
```

Raw text should remain available for auditability.

------------------------------------------------------------------------

# 32. Hotspots Page

Route:

`/admin/hotspots`

Header:

**Civic hotspots**

Subtitle:

**Areas with unusually high concentrations of reports or incidents.**

Map-first layout.

Modes:

``` text
Complaints
Incidents
Hotspots
```

Filters:

``` text
Category
Time range
Severity
Department
```

Hotspot click:

``` text
Andheri East

47 reports
3 active incidents
↑ 10.7× normal activity

Top issue:
Water supply
```

------------------------------------------------------------------------

# 33. Analytics Page

Route:

`/admin/analytics`

Keep analytics limited for MVP.

Show:

### Reports over time

Line chart.

### Category distribution

Use a bar chart, not a pie chart.

### Resolution performance

``` text
Open
Investigating
Resolved
Reopened
```

### Emerging incident trend

``` text
Emerging incidents this week
```

Avoid building a full BI platform.

------------------------------------------------------------------------

# 34. Navigation Behavior

Authority navigation:

``` text
Overview
Emerging
Incidents
Hotspots
Complaints
Resolution
Analytics
```

The active page should be obvious.

On mobile:

-   bottom navigation or compact menu
-   prioritize Overview, Emerging, Incidents

------------------------------------------------------------------------

# 35. Component Library

Create shared components:

``` text
Button
IconButton
Badge
StatusBadge
PriorityBadge
Input
Textarea
Select
SearchBar
FilterChip
Tabs
Card
Metric
EmptyState
LoadingState
ErrorState
Toast
Modal
Drawer
ConfirmationDialog
Timeline
IncidentList
IncidentCard
ComplaintRow
ComplaintCard
MapView
EvidencePanel
AIInsight
RecommendationPanel
ChartCard
LanguageBadge
LocationBadge
```

------------------------------------------------------------------------

# 36. Important Component States

Every important component needs:

-   default
-   hover
-   focus
-   active
-   disabled
-   loading
-   error
-   empty

Forms additionally:

-   invalid
-   submitting
-   success

AI additionally:

-   processing
-   high confidence
-   low confidence
-   unavailable

------------------------------------------------------------------------

# 37. Loading States

Do not show a blank screen.

Citizen:

``` text
Understanding your report...
```

Authority:

Use skeleton rows for:

-   metrics
-   incident list
-   map overlay
-   evidence

Avoid long artificial loading animations.

------------------------------------------------------------------------

# 38. Empty States

Examples:

### No emerging incidents

**No emerging incidents right now.**

**We'll continue monitoring new reports.**

### No related complaints

**No related reports found yet.**

### No resolved incidents needing review

**All recently resolved incidents are currently quiet.**

------------------------------------------------------------------------

# 39. Error States

Citizen:

**We couldn't process your report right now.**

Actions:

``` text
[ Try again ]
[ Type instead ]
```

AI unavailable:

**AI understanding is temporarily unavailable. Your report can still be
submitted for review.**

Prototype can use a deterministic fallback.

------------------------------------------------------------------------

# 40. Low Confidence AI State

Authority:

``` text
AI confidence: 61%

This classification is uncertain.

Reason:
The report contains limited information.

Recommended:
Review manually before routing.
```

Never display an uncertain AI result as a fact.

------------------------------------------------------------------------

# 41. Accessibility

Citizen:

-   large touch targets
-   readable typography
-   high contrast
-   icon + text
-   local-language support
-   audio feedback where possible
-   no color-only meaning
-   minimal form fields
-   simple vocabulary
-   clear confirmation
-   predictable navigation

Authority:

-   keyboard navigation
-   visible focus
-   accessible charts
-   text labels for semantic colors
-   map alternatives through incident list

------------------------------------------------------------------------

# 42. Language Strategy

The UI should support a language selector, but the AI should also detect
the language of the complaint.

Citizen may submit:

-   English
-   Hindi
-   Hinglish
-   Marathi
-   other supported language

Backend should store:

``` text
original_text
detected_language
normalized_text
```

Important:

Never overwrite the original citizen statement.

------------------------------------------------------------------------

# 43. AI Data Contract

Backend should return a structured result similar to:

``` json
{
  "complaintId": "uuid",
  "language": "hi",
  "normalizedText": "Water supply is unavailable in the reported area.",
  "category": "water_supply",
  "categoryLabel": "Water Supply",
  "priority": "high",
  "priorityScore": 78,
  "location": {
    "latitude": 19.076,
    "longitude": 72.877,
    "displayName": "Andheri East, Mumbai"
  },
  "confidence": 0.93
}
```

Frontend should not parse free-form AI text to build the UI.

------------------------------------------------------------------------

# 44. Similarity / Correlation Data Contract

Backend should return structured evidence:

``` json
{
  "incidentId": "uuid",
  "relatedComplaints": [
    {
      "complaintId": "uuid",
      "similarity": 0.91,
      "distanceMeters": 220,
      "timeDifferenceMinutes": 12
    }
  ],
  "correlation": {
    "semanticScore": 0.91,
    "geographicScore": 0.94,
    "temporalScore": 0.97
  }
}
```

------------------------------------------------------------------------

# 45. Incident Data Contract

``` json
{
  "id": "uuid",
  "title": "Water Supply Outage",
  "category": "water_supply",
  "status": "emerging",
  "priority": "high",
  "location": {
    "latitude": 19.076,
    "longitude": 72.877,
    "displayName": "Andheri East, Mumbai"
  },
  "reportCount": 47,
  "growthMultiplier": 10.7,
  "baselineCount": 4,
  "detectedAt": "timestamp",
  "aiConfidence": 0.93,
  "department": {
    "id": "water",
    "name": "Water Department"
  }
}
```

------------------------------------------------------------------------

# 46. Incident Evidence Data Contract

``` json
{
  "incidentId": "uuid",
  "evidence": [
    {
      "type": "semantic",
      "label": "Similar descriptions",
      "score": 0.91
    },
    {
      "type": "geographic",
      "label": "Same geographic area",
      "score": 0.94
    },
    {
      "type": "temporal",
      "label": "Sudden increase in reports",
      "score": 0.97
    }
  ],
  "explanation": "Reports describe a similar issue and are concentrated in the same area within a short period."
}
```

------------------------------------------------------------------------

# 47. Growth Data Contract

``` json
{
  "incidentId": "uuid",
  "baseline": 4,
  "current": 47,
  "growthMultiplier": 10.7,
  "points": [
    {
      "timestamp": "timestamp",
      "count": 3
    },
    {
      "timestamp": "timestamp",
      "count": 8
    },
    {
      "timestamp": "timestamp",
      "count": 21
    },
    {
      "timestamp": "timestamp",
      "count": 47
    }
  ]
}
```

------------------------------------------------------------------------

# 48. Resolution Intelligence Data Contract

``` json
{
  "incidentId": "uuid",
  "originalReportCount": 47,
  "newRelatedReportCount": 8,
  "sameAreaScore": 0.94,
  "semanticSimilarity": 0.91,
  "status": "possibly_unresolved",
  "confidence": 0.89,
  "recommendation": "Review the incident again."
}
```

------------------------------------------------------------------------

# 49. Map Data Contract

Frontend should receive GeoJSON or an equivalent structured format.

Example concept:

``` json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [72.877, 19.076]
      },
      "properties": {
        "complaintId": "uuid",
        "incidentId": "uuid",
        "category": "water_supply",
        "priority": "high",
        "status": "active"
      }
    }
  ]
}
```

Backend owns spatial querying.

Frontend owns rendering.

------------------------------------------------------------------------

# 50. Recommended Backend Responsibilities

Backend team must provide:

## Complaint

-   create complaint
-   retrieve complaint
-   update status
-   retrieve tracking information

## AI

-   normalize
-   classify
-   prioritize
-   generate embedding
-   explain

## Similarity

-   semantic search
-   geographic filtering
-   combined similarity

## Incident

-   create/update incident
-   retrieve incidents
-   calculate growth
-   retrieve supporting reports

## Resolution

-   resolve incident
-   detect post-resolution related reports
-   reopen/flag incident

## Dashboard

-   overview metrics
-   emerging incidents
-   hotspot data
-   analytics

------------------------------------------------------------------------

# 51. API Contract

Suggested endpoints:

``` text
POST   /api/complaints
GET    /api/complaints/:id
GET    /api/complaints/track/:trackingId

POST   /api/ai/analyze
GET    /api/complaints/:id/related

GET    /api/incidents
GET    /api/incidents/:id
GET    /api/incidents/:id/evidence
GET    /api/incidents/:id/growth
GET    /api/incidents/:id/reports

PATCH  /api/incidents/:id/status
POST   /api/incidents/:id/resolve

GET    /api/resolution
GET    /api/resolution/:incidentId

GET    /api/map/complaints
GET    /api/map/incidents
GET    /api/map/hotspots

GET    /api/dashboard/overview
GET    /api/analytics
```

Actual implementation may use Next.js Route Handlers / Server Actions,
but the frontend contract should remain conceptually equivalent.

------------------------------------------------------------------------

# 52. Database Concept

Minimum entities:

``` text
Complaint
ComplaintEvent
Incident
IncidentEvidence
Department
Authority
```

Important complaint fields:

``` text
id
tracking_id
original_text
normalized_text
detected_language
category
priority
priority_score
latitude
longitude
location
embedding
incident_id
status
created_at
updated_at
```

Important incident fields:

``` text
id
title
category
department_id
status
priority
latitude
longitude
report_count
baseline_count
growth_multiplier
ai_confidence
detected_at
resolved_at
created_at
updated_at
```

------------------------------------------------------------------------

# 53. Technical Architecture

Recommended MVP:

``` text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
        │
        ▼
Next.js API / Server Actions
        │
        ├──────── AI API
        │
        ├──────── PostgreSQL
        │              ├── PostGIS
        │              └── pgvector
        │
        └──────── Map Provider
```

Recommended hosted setup:

``` text
Vercel
   +
Supabase PostgreSQL
   +
Mapbox
   +
LLM API
```

Do not introduce microservices for this prototype.

------------------------------------------------------------------------

# 54. Agent Architecture

The project can present two specialized AI agents.

## Agent 1 --- Citizen Understanding Agent

Input:

-   text
-   transcript
-   optional image
-   location

Output:

-   normalized text
-   language
-   category
-   priority
-   extracted entities
-   confidence

## Agent 2 --- Incident Investigation Agent

Input:

-   structured complaint
-   similar complaints
-   geographic data
-   timestamps

Output:

-   related reports
-   incident cluster
-   incident confidence
-   growth assessment
-   evidence
-   recommendation
-   possible unresolved flag

Simple orchestration:

``` text
Citizen input
     ↓
Understanding Agent
     ↓
Structured complaint
     ↓
Investigation Agent
     ↓
Incident intelligence
     ↓
Authority dashboard
```

No complicated agent framework is required for the MVP.

------------------------------------------------------------------------

# 55. Security / Trust UX

Do not expose:

-   internal AI prompts
-   API keys
-   database IDs as primary identifiers
-   raw internal system errors

Use:

-   human-readable tracking IDs
-   role-based authority views
-   audit events for status changes
-   clear AI confidence
-   human confirmation for important actions

------------------------------------------------------------------------

# 56. Demo Data Strategy

For the 3-minute demo, use seeded deterministic data.

Create approximately:

``` text
50–100 complaints
5–8 incidents
3–5 categories
multiple languages
multiple locations
at least one emerging incident
at least one resolved incident
at least one possibly unresolved incident
```

Recommended demo incident:

### Water Supply Outage

``` text
47 reports
10.7× baseline
Andheri East
High priority
93% AI confidence
```

Recommended resolution scenario:

``` text
Incident resolved
        ↓
8 new related reports
        ↓
same location
        ↓
same issue
        ↓
Possibly Unresolved
```

------------------------------------------------------------------------

# 57. Demo Reliability Rule

The live AI should not control the entire demo.

Use:

``` text
Live:
Citizen voice/text input
AI understanding
classification
```

Use seeded data for:

-   historical reports
-   incident cluster
-   growth chart
-   map distribution
-   resolution scenario

Reliability is more important than unpredictability.

------------------------------------------------------------------------

# 58. Exact 3-Minute Demo Flow

## 0:00--0:20

Open citizen home.

Say:

> "Citizens shouldn't have to understand government departments to
> report a problem."

## 0:20--0:45

Use voice:

> "Hamare area mein teen din se paani nahi aa raha."

Show:

``` text
Water Supply
High Priority
Location detected
```

Submit.

## 0:45--1:15

Open authority dashboard.

Show:

``` text
47 related reports
↑ 10.7× baseline
```

## 1:15--2:00

Open Emerging Incident Detail.

Show:

-   evidence
-   growth
-   map
-   supporting reports
-   recommendation

## 2:00--2:35

Mark resolved.

Show post-resolution reports.

``` text
8 new related reports
same area
91% similarity
```

System:

**POSSIBLY UNRESOLVED**

## 2:35--3:00

Close with:

> **Nagrik Radar doesn't just count complaints. It turns citizen signals
> into actionable civic intelligence --- and keeps watching after
> resolution.**

------------------------------------------------------------------------

# 59. P0 --- Must Work

Citizen:

-   home
-   voice/text
-   AI understanding
-   location
-   review
-   submit
-   tracking

AI:

-   classification
-   priority
-   embeddings/similarity
-   correlation
-   incident generation
-   evidence explanation

Authority:

-   overview
-   emerging incidents
-   incident detail
-   map
-   evidence
-   recommended action
-   status update

Resolution:

-   resolve
-   seeded new reports
-   possibly unresolved state

------------------------------------------------------------------------

# 60. P1 --- If Stable

-   multilingual UI
-   photo input
-   richer map filters
-   analytics
-   realtime refresh
-   downloadable incident report
-   richer complaint detail
-   audio confirmation

------------------------------------------------------------------------

# 61. P2 --- Only If Time

-   advanced image understanding
-   sophisticated voice conversation
-   advanced GIS layers
-   notification system
-   department management
-   advanced role permissions
-   complex analytics
-   full citizen account system

------------------------------------------------------------------------

# 62. P3 --- Do Not Build

-   native mobile applications
-   microservices
-   custom ML training
-   Kubernetes
-   production-scale notification infrastructure
-   complex government administration
-   full enterprise IAM
-   advanced computer vision
-   elaborate workflow builder

------------------------------------------------------------------------

# 63. 5-Hour Development Plan

## Hour 0--1 --- Foundation

-   project setup
-   shared design tokens
-   Supabase
-   schema
-   routing
-   seed data
-   base components

## Hour 1--2 --- Citizen

-   home
-   text/voice
-   review
-   submission
-   tracking

## Hour 1--3 --- AI / Backend

Parallel:

-   classification
-   embeddings
-   similarity
-   clustering
-   incident generation

## Hour 2--4 --- Authority

-   dashboard
-   emerging incidents
-   incident detail
-   map

## Hour 3--4 --- Resolution

-   resolve
-   post-resolution evidence
-   possibly unresolved

## Hour 4--5 --- Freeze

No major features.

Only:

-   integration
-   bug fixing
-   responsive polish
-   loading/error states
-   visual consistency
-   demo rehearsal

------------------------------------------------------------------------

# 64. Six-Person Team Division

## Developer 1 --- Citizen Experience

Own:

-   home
-   report
-   voice/text
-   review
-   success
-   tracking

## Developer 2 --- AI Understanding

Own:

-   language detection
-   normalization
-   classification
-   priority
-   structured AI output

## Developer 3 --- Correlation / Incident Engine

Own:

-   embeddings
-   pgvector
-   semantic similarity
-   geographic correlation
-   temporal correlation
-   incident clustering

## Developer 4 --- Authority Workspace

Own:

-   sidebar
-   overview
-   emerging incident list
-   complaints
-   analytics

## Developer 5 --- GIS + Incident Detail

Own:

-   Mapbox
-   hotspots
-   incident map
-   incident detail
-   evidence
-   growth chart
-   resolution UI

## Developer 6 --- Integration / Demo / QA

Own:

-   shared components
-   API integration
-   seed data
-   final states
-   report/export if time
-   responsive QA
-   demo preparation

------------------------------------------------------------------------

# 65. Definition of Done

The prototype is considered complete when:

### Citizen

-   A citizen can submit a report in natural language.
-   The system can show AI understanding.
-   Location is associated.
-   A tracking ID is generated.
-   The citizen can track status.

### AI

-   A category is generated.
-   Priority is generated.
-   Related reports can be identified.
-   Evidence can be shown.
-   An incident can be represented.

### Authority

-   Dashboard shows active/emerging incidents.
-   Incident can be opened.
-   Map displays relevant reports.
-   Evidence is visible.
-   Growth is visible.
-   Recommended action is visible.

### Resolution

-   Incident can be marked resolved.
-   Post-resolution reports can appear.
-   System can represent "Possibly Unresolved."

### UX

-   No broken navigation.
-   No dead-end actions.
-   Loading and error states exist for critical flows.
-   Citizen UI works on mobile.
-   Authority UI works on desktop.
-   Visual language is consistent.

------------------------------------------------------------------------

# 66. Final Product Language

Use these terms consistently.

### Prefer

-   Report
-   Incident
-   Related reports
-   Emerging incident
-   Supporting evidence
-   AI assessment
-   Confidence
-   Recommended action
-   Possibly unresolved
-   Under investigation
-   Resolved

### Avoid

-   AI magic
-   Guaranteed detection
-   Duplicate! (unless technically certain)
-   AI decided
-   Problem solved forever
-   Automatic punishment
-   Officer failure

------------------------------------------------------------------------

# 67. Final Homepage Copy

## English

**Report a problem in your area**

**Tell us what happened. We'll figure out the rest.**

**Speak**\
Tell us in your own words.

**Take a photo**\
Show us the problem.

**Type**\
Describe what happened.

**Track my complaint**

## Hindi

**अपने इलाके की समस्या बताएं**

**हमें बताएं क्या हुआ। बाकी हम समझेंगे।**

**बोलकर बताएं**

**फोटो लें**

**लिखकर बताएं**

**मेरी शिकायत ट्रैक करें**

------------------------------------------------------------------------

# 68. Final Authority Copy

Dashboard heading:

**What needs attention now?**

Subheading:

**Emerging civic problems detected from citizen reports.**

Emerging incident:

**Why was this flagged?**

AI:

**AI assessment**

Recommendation:

**Recommended next step**

Resolution:

**Resolution monitoring**

Possible recurrence:

**Possibly unresolved**

------------------------------------------------------------------------

# 69. Final Product Architecture in One Diagram

``` text
                         NAGRIK RADAR
                              │
              ┌───────────────┴───────────────┐
              │                               │
           CITIZEN                         AUTHORITY
              │                               │
       🎤 Voice / Text                    Overview
       📷 Photo                           Emerging
       📍 Location                        Incidents
              │                           Hotspots
              │                           Complaints
              │                           Resolution
              │                           Analytics
              │                               │
              └──────────────┬────────────────┘
                             │
                        AI PIPELINE
                             │
                    ┌────────┴────────┐
                    │                 │
              Understanding     Investigation
                 Agent              Agent
                    │                 │
                    └────────┬────────┘
                             │
                    Complaint Intelligence
                             │
              ┌──────────────┼──────────────┐
              │              │              │
          Semantic       Geographic      Temporal
          Similarity     Correlation     Correlation
              │              │              │
              └──────────────┼──────────────┘
                             ↓
                       CIVIC INCIDENT
                             │
                    ┌────────┴────────┐
                    │                 │
                 Growth           Evidence
                    │                 │
                    └────────┬────────┘
                             ↓
                       AUTHORITY ACTION
                             ↓
                          RESOLVED
                             ↓
                     POST-RESOLUTION
                       MONITORING
                             ↓
                 POSSIBLY UNRESOLVED
```

------------------------------------------------------------------------

# 70. Final Design Decision

Nagrik Radar should be built as:

> **A simple, inclusive citizen reporting experience connected to a
> sophisticated AI-powered civic incident intelligence workspace.**

The citizen sees:

> **"Tell us what happened."**

The AI sees:

> **Language + category + priority + similarity + geography + time.**

The authority sees:

> **"What is happening, where is it happening, how fast is it growing,
> why do we believe these reports are related, and what should we do?"**

The system continues after resolution:

> **"Did the evidence actually stop?"**

This is the final frontend product definition for the hackathon.