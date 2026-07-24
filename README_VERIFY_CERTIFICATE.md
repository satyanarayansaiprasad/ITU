# Certificate Verification & Belt Rank System Documentation

This document explains the technical implementation of the **Certificate Verification System** and the **Belt Rank Hierarchy** for future maintainers of the Indian Taekwondo Union (ITU) codebase.

---

## 1. Overview

The certificate verification system allows anyone to verify the authenticity of an ITU-issued certificate by scanning a static QR code or navigating directly to `/verify-certificate`. 

The verifier enters the **ITU Player ID** (e.g. `ITU12345678`) and selects the **Belt Rank** listed on the certificate.

---

## 2. Belt Rank Hierarchy (`BELT_RANKS`)

Belt ranks are stored in a strict ordered array in `backend/config/beltRanks.js`:

```js
const BELT_RANKS = [
  "White",               // Index 0  (Lowest)
  "White One",           // Index 1
  "Yellow",              // Index 2
  "Yellow One",          // Index 3
  "Green",               // Index 4
  "Green One",           // Index 5
  "Blue",                // Index 6
  "Blue One",            // Index 7
  "Red",                 // Index 8
  "Red One",             // Index 9
  "1st Dan Black Belt",  // Index 10
  "2nd Dan Black Belt",  // Index 11
  "3rd Dan Black Belt",  // Index 12
  "4th Dan Black Belt",  // Index 13
  "5th Dan Black Belt",  // Index 14
  "6th Dan Black Belt",  // Index 15
  "7th Dan Black Belt",  // Index 16
  "8th Dan Black Belt",  // Index 17
  "9th Dan Black Belt"   // Index 18 (Highest)
];
```

Each player schema record contains a `rankIndex` numeric field corresponding to their position in this hierarchy.

---

## 3. How Verification Matching Works

When a request is submitted to `POST /api/verify-certificate`:

1. **Player Lookup**: The system searches for the player by `playerId` (case-insensitive regex).
2. **Rank Comparison**:
   - `submittedRankIndex`: The numeric index of the belt rank submitted from the certificate.
   - `currentRankIndex`: The numeric index of the player's current belt rank in the database.

3. **Evaluation Cases**:
   - **Exact Match (`currentRankIndex === submittedRankIndex`)**:
     - ✅ **Valid Certificate**: The player's current rank matches the rank on the certificate.
     - Response: `"✅ Congratulations! [Player Name] is a verified ITU player, currently ranked [Belt Rank]."`

   - **Promoted Player (`currentRankIndex > submittedRankIndex`)**:
     - ✅ **Valid Certificate (Historical Issue)**: The player earned this certificate previously and has since advanced to a higher belt rank.
     - Response: `"✅ This is a valid ITU certificate. [Player Name] was awarded [Submitted Rank] at the time of issue and has since progressed to [Current Rank]. Congratulations!"`

   - **Mismatch / Fake Certificate (`currentRankIndex < submittedRankIndex` or Player Not Found)**:
     - ❌ **Invalid**: The submitted rank is higher than what is recorded in the database, or the ITU ID does not exist.
     - Response: `"❌ We couldn't verify this certificate. The ITU ID and belt rank don't match our records."`

---

## 4. Scripts & Utilities

### 1. Generating QR Code
Run the QR code generation script to output a high-res static PNG to the Desktop for certificate template designs:
```bash
node scripts/generateQr.js [optional_target_url]
```
- Output location: `~/Desktop/certificate-verify-qr.png`
- Default Target URL: `https://www.taekwondounion.com/verify-certificate`

### 2. Backfilling Player Rank Index
If new player records are added manually without `rankIndex`, run the backfill script:
```bash
node backend/scripts/backfillRankIndex.js
```

---

## 5. Security & Rate Limiting
- Public verification requests on `POST /api/verify-certificate` are rate-limited to **15 requests per minute per IP** using `express-rate-limit` to prevent brute-force ID scanning.
- Failed verification attempts return generic non-leaking messages.
