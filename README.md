# TRAKIVENT

![Version](https://img.shields.io/badge/version-v0.3.1-brightgreen)
![Status](https://img.shields.io/badge/status-Active%20Development-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Platform](https://img.shields.io/badge/platform-Web-success)

> **Smart Event Operations Platform**

Developed by **Manspace Technologies**

---

## Overview

TRAKIVENT is a modern cloud-based Event Operations Platform built to simplify guest registration, digital invitations, QR code check-in, attendance monitoring and event analytics.

The long-term vision is to provide an enterprise-grade SaaS platform that enables organisations to manage events from invitation to post-event reporting through a single ecosystem.

This repository currently contains the **TRAKIVENT Check-in Agent**, the first operational module of the platform.

---

# Screenshots

> Screenshots will be updated as the platform evolves.

| Home Screen | Successful Check-in |
|-------------|---------------------|
| Coming Soon | Coming Soon |

| Duplicate Detection | Live Dashboard |
|---------------------|----------------|
| Coming Soon | Coming Soon |
---

# Current Module

## TRAKIVENT Check-in Agent

A browser-based QR Code check-in application designed for fast, reliable and professional guest verification.

It supports:

- Device Camera QR Scanning
- USB QR / Barcode Scanner (Hippoint Compatible)
- Manual QR Token Entry
- Live Cloud Verification
- Real-time Check-in Recording
- Duplicate Check-in Detection

---

# Current Features

### Guest Verification

- QR Code Validation
- Live Guest Lookup
- Instant Check-in Confirmation
- Duplicate Check-in Detection
- Invalid QR Detection

### Scanning

- Camera Scanner
- USB QR Scanner Support
- Manual Token Entry
- Continuous Check-in Workflow

### User Experience

- Professional Overlay Confirmation
- Audio Feedback
- Mobile-friendly Interface
- Operator-focused Workflow

### Cloud Integration

- Google Apps Script API
- Google Sheets Database
- Real-time Attendance Updates

---

# Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript (ES6)

Backend

- Google Apps Script

Database

- Google Sheets

QR Engine

- html5-qrcode

Version Control

- Git
- GitHub

---
---

# Local Development

## Requirements

- Visual Studio Code
- Live Server Extension
- Google Chrome (Recommended)

## Running the Project

Clone the repository:

```bash
git clone https://github.com/abiodun-abiodun/trakivent-checkin-agent.git
```

Open the project in **Visual Studio Code**.

Start the application by clicking **Go Live** (Live Server).

The application will open automatically in your default browser.

---

## Backend

The Check-in Agent connects to a Google Apps Script Web App, which communicates with the Google Sheets guest database in real time.

Current Backend:

- Google Apps Script
- Google Sheets

# Current Version

**v0.3.1**

---

# Current Sprint

## v0.3.2 — Professional Operator Experience

Currently implementing:

- Universal Scanner Engine
- Processing Overlay
- Human-friendly Check-in Timestamps
- Professional Audio Feedback
- Performance Optimization

---

# Product Roadmap

## v0.3.2

- Universal Scanner Engine
- Processing Overlay
- Human-friendly Timestamps
- Professional Audio Feedback

---

## v0.4.0

### Live Event Dashboard

- Live Guest Counter
- Attendance Percentage
- VIP Counter
- Real-time Statistics

---

## v0.5.0

### Operational Improvements

- Multi-Station Synchronization
- Offline Check-in Mode
- Automatic Synchronisation
- Performance Improvements

---

## v0.6.0

### Platform Expansion

- Event Management
- Guest Registration
- Digital Invitations
- RSVP Management
- QR Pass Generation

---

## v1.0.0

### Commercial SaaS Release

- Multi-Organisation Support
- Subscription Billing
- Role-Based Access Control
- Analytics Dashboard
- API Integrations

---

# Architecture

## Current MVP

```
Browser
      │
      ▼
Trakivent Check-in Agent
      │
      ▼
Google Apps Script API
      │
      ▼
Google Sheets Database
```

## Future SaaS Architecture

```
TRAKIVENT Platform

        │
        ▼

Authentication

        │
        ▼

Event Management

        │
        ▼

Guest Management

        │
        ▼

QR Check-in Agent

        │
        ▼

Live Dashboard

        │
        ▼

Analytics
```

---

# Planned Platform Modules

- Event Management
- Guest Registration
- Digital Invitations
- RSVP Management
- QR Pass Generation
- Check-in Agent
- Live Dashboard
- Attendance Analytics
- Event Reporting
- Multi-Organization Administration

---

# Repository Status

This repository is under active development.

The current focus is delivering a production-ready MVP for the TRAKIVENT Check-in Agent before expanding into the complete TRAKIVENT SaaS Platform.

---

# Vision

TRAKIVENT exists to modernise event operations by replacing manual guest management with intelligent, cloud-powered automation.

Our long-term vision is to become Africa's leading Event Operations Platform, enabling organisations to manage:

- Event Planning
- Guest Registration
- Digital Invitations
- RSVP Tracking
- QR Check-in
- Attendance Monitoring
- Live Analytics
- Post-event Reporting

...all from one secure and scalable platform.

Every release moves us closer to that vision.

---

# Developed By

**Abiodun Al'Moustapha Abiodun**

Founder, Manspace Technologies

> Smart digital solutions for modern businesses and events.

---

© 2026 Manspace Technologies

All Rights Reserved.