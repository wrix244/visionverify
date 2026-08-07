# 🛡️ VerifyFlow - AI-Powered Payment Proof Verification & Fraud Prevention Platform

**VerifyFlow** is an enterprise-grade SaaS platform designed for e-commerce merchants and financial platforms to instantly validate Indian UPI payment screenshots (Google Pay, PhonePe, Paytm, BHIM, Amazon Pay) and detect visual tampering using Extensible OCR and Computer Vision engines.

---

## ✨ Short GitHub Repository Description
> **VerifyFlow** — Enterprise AI Payment Proof Verification SaaS. Auto-extracts UPI payment details (UTR, Amount, Name, Bank) via OCR, inspects 9 visual fraud tampering vectors, reconciles parameters across 7 validation rules, and meters API usage with a Razorpay-inspired merchant dashboard.

---

## ⚡ Core Features & Capabilities

### 1. 🔍 Extensible Strategy Pattern OCR Engine
- **Multi-App Parsers**: Built-in parsers for **Google Pay**, **PhonePe**, **Paytm**, **BHIM**, **Amazon Pay**, and **Generic UPI**.
- **Field Extractions**: Automatically extracts Transaction Amount (₹), Payee/Payer Name, Bank Name, UTR Number, Timestamp, and Completion Status.

### 2. 🛡️ 9-Point Visual Fraud Detection Engine
Performs deep visual inspection across 9 forensic tampering vectors:
1. **Photoshop Edits**: EXIF software metadata traces (Photoshop, GIMP, Canva, PicsArt).
2. **Text Overlays**: Floating text boxes, unnatural background patches, and baseline misalignments.
3. **Cloned Regions**: Duplicate pixel patch blocks from copy-paste stamp tools.
4. **Aspect / Cropping**: Truncated status bar boundaries and non-mobile screen aspect ratios.
5. **Low Resolution**: Downsampling pixelation & small file size anomalies (< 15KB).
6. **Compression Anomalies**: Double JPEG compression headers & noise variance.
7. **Font Inconsistencies**: Typeface, font weight, or line spacing mismatches within digits.
8. **Blurred Values**: Selective gaussian blurring applied over payment amounts or UTR numbers.
9. **Nested Screenshots**: Inner device frames, double status bars, or nested borders.

### 3. ⚖️ 7-Point Rule-Based Validation Engine
Reconciles extracted OCR parameters against merchant expected parameters:
1. **Amount Check**: Exact numeric matching with shortfall/surplus discrepancy reporting.
2. **Recipient Check**: Payee entity recipient matching.
3. **UPI ID Check**: Matches extracted `payeeUpiId` against expected merchant handle.
4. **Time Window Check**: Verifies timestamp freshness within merchant allowed window.
5. **Status Check**: Confirms payment completion status is `'SUCCESS'`.
6. **Name Check**: Normalized fuzzy string matching for merchant business names.
7. **Bank Check**: Verifies bank name validity and formatting.

### 4. 🔑 API Key Management & Metering
- **Key Pairs**: Generates `pk_live_...` (Public Key) and `sk_live_...` (Secret Key).
- **Hashed Secrets**: Stores secret keys as SHA-256 hashes.
- **Key Rotation & Expiration**: Configurable policies (Never, 30 Days, 90 Days, 1 Year).
- **Audit Logs**: Logs request endpoint, method, IP address, status code, and latency ms.

### 5. 📊 Merchant Analytics Dashboard (Razorpay UI)
- **Live Statistics**: Today's requests, successful verifications, rejected counts, average confidence %.
- **API Usage Gauge**: Visual quota progress bar showing used vs remaining verifications.
- **Proof Lightbox Viewer**: High-resolution screenshot preview modal directly from audit table.
- **Advanced Filtering**: Date range selector (Today, 7 Days, 30 Days) and Confidence score threshold filter.

### 6. 💳 Subscription & Metering Engine
- **4 Plan Tiers**: FREE (100/mo), STARTER (1k/mo), PRO (10k/mo), ENTERPRISE (100k/mo).
- **Real-Time Metering Guard**: Rejects requests exceeding monthly quota with `429 Quota Exceeded`.
- **Automated Monthly Reset**: Auto-evaluator resets used quota every 30 days.
- **Stripe-Ready Architecture**: Supports Stripe Checkout Sessions and Webhooks.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, Axios, React Router v6, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), Tesseract.js OCR, Cloudinary SDK, JWT, bcryptjs, Helmet, Express Rate Limit.

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
# Configure backend/.env with your MongoDB Atlas URI
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License
Licensed under the [MIT License](LICENSE).
