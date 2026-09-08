import React, { useState, useEffect, useRef } from 'react';

// =========================================================================
// アイコンコンポーネント
// =========================================================================
const IconDownloadCloud = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>;
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
const IconLoader2 = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const IconPlane = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.5 3.5-2.5-.5-1.5 1.5 4 1 1 4 1.5-1.5-.5-2.5 3.5-3.5 5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>;

// =========================================================================
// 訓練空域・臨時留保空域 (AIRSPACE DATA)
// =========================================================================
const AIRSPACE_DATA = [
    { name: 'ITRA-E', type: 'restricted', alt: 'FL250', coords: [[36.1536, 131.5753], [35.8286, 132.2222], [35.5706, 132.1753], [35.5525, 130.7639]] },
    { name: 'ITRA-N1', type: 'restricted', alt: 'FL180', coords: [[35.5706, 132.1753], [35.3500, 132.1353], [35.3269, 132.2653], [35.1164, 130.1892], [35.5525, 130.7639]] },
    { name: 'ITRA-N2', type: 'restricted', alt: 'FL800', coords: [[35.3269, 132.2653], [35.3014, 132.3139], [35.2919, 132.3372], [35.0375, 131.9897], [34.7236, 131.3769], [34.6864, 130.8808], [34.7253, 130.8669], [34.8531, 130.5850], [34.7697, 130.5253], [34.9953, 130.0311], [35.1164, 130.1892]] },
    { name: 'ITRA-N3', type: 'restricted', alt: 'FL240', coords: [[35.3014, 132.3139], [35.2919, 132.3372], [35.0375, 131.9897], [34.7236, 131.3769], [34.7208, 131.3386], [35.0353, 131.6914], [35.2103, 131.7392], [35.2906, 132.2003]] },
    // ITRA-S のポリゴン自己交差を解消した完全な一筆書き座標
    { name: 'ITRA-S (S10-S25)', type: 'restricted', alt: 'S10: FL800, S11-16: UNL, S20-25: FL450', 
      coords: [
        [30.9519, 131.6467], // (39)
        [31.5119, 132.1558], // (9)
        [32.0036, 132.5808], // (10)
        [32.0536, 132.6308], // (11)
        [32.0822, 132.7872], // (26)
        [32.3019, 133.4381], // (16)
        [32.5667, 133.9397], // (17)
        [32.5897, 133.9867], // (41)
        [32.6200, 134.0475], // (18)
        [32.7803, 134.5333], // (19)
        [32.8981, 135.0139], // (1)
        [32.5911, 135.0139], // (40)
        [32.5536, 135.0139], // (20)
        [32.1533, 135.0094], // (21)
        [31.8147, 134.4939], // (23)
        [31.5056, 134.0289], // (25)
        [31.1425, 133.4906], // (28)
        [30.9178, 133.1606], // (32)
        [30.5222, 132.5867], // (36)
        [29.9272, 131.7381], // (4)
        [30.2008, 131.5011], // (5)
        [30.4875, 131.2867]  // (38)
      ] 
    },
    { name: 'ITRA-S (S30-S33)', type: 'restricted', alt: 'FL250', 
      coords: [
        [29.9272, 131.7381], // (4)
        [30.5222, 132.5867], // (36)
        [30.9178, 133.1606], // (32)
        [31.1425, 133.4906], // (28)
        [31.5056, 134.0289], // (25)
        [31.8147, 134.4939], // (23)
        [32.1533, 135.0094], // (21)
        [31.3019, 135.0000], // (2)
        [30.5547, 133.9217], // (29)
        [30.3222, 133.5889], // (33)
        [29.9183, 133.0250], // (37)
        [29.4689, 132.4039]  // (3)
      ] 
    },
    { name: 'MOOSE NORTH', type: 'training', alt: 'SFC - UNL', coords: [[26.9758, 124.9558], [28.4786, 127.0542], [27.8033, 127.3211], [27.2986, 127.2208], [27.0842, 126.9942], [26.6953, 125.2111]] },
    { name: 'MOOSE SOUTH', type: 'training', alt: 'SFC - UNL', coords: [[26.6953, 125.2111], [27.0842, 126.9942], [26.2675, 126.1431], [26.2389, 125.6219]] },
    { name: 'TIGER WEST', type: 'training', alt: 'SFC - UNL', coords: [[26.7900, 129.0672], [27.4686, 129.5064], [27.6461, 130.5586]] },
    { name: 'TIGER CENTER', type: 'training', alt: 'SFC - UNL', coords: [[26.3692, 128.5783], [26.7900, 129.0672], [27.6461, 130.5586], [27.6431, 130.9317], [27.6281, 132.0375], [27.4436, 131.9947], [26.1822, 130.8433]] },
    { name: 'TIGER EAST', type: 'training', alt: 'SFC - UNL', coords: [[27.4436, 131.9947], [26.7961, 131.8456], [26.4572, 131.5717], [26.1417, 131.2814], [26.1822, 130.8433]] },
    { name: 'LION WEST', type: 'training', alt: 'SFC - UNL', coords: [[25.4625, 128.0600], [24.3797, 127.3061], [24.4653, 127.0953], [25.3761, 127.7264]] },
    { name: 'LION CENTER', type: 'training', alt: 'SFC - UNL', coords: [[25.5186, 128.1647], [24.3911, 129.4597], [23.7003, 128.9464], [24.3797, 127.3061]] },
    { name: 'EAGLE CENTER', type: 'training', alt: 'SFC - UNL', coords: [[25.8931, 128.5000], [25.8103, 129.0386], [25.7375, 129.4311], [25.7458, 130.4036], [25.7397, 130.5003], [24.6639, 129.6653], [24.3911, 129.4597], [25.5186, 128.1647]] },
    { name: 'EAGLE EAST', type: 'training', alt: 'SFC - UNL', coords: [[25.7397, 130.5003], [25.7108, 130.9244], [25.1539, 130.4914], [24.9411, 130.2981], [24.6639, 129.6653]] },
    { name: 'JDA K-1-1', type: 'training', alt: 'SFC - FL240', coords: [[35.1381, 138.6919], [34.8767, 138.7636], [34.8361, 138.3811], [35.1411, 138.5803]] },
    { name: 'JDA K-1-2', type: 'training', alt: 'SFC - FL260', coords: [[34.8767, 138.7636], [34.4089, 138.9328], [34.3314, 138.8353], [34.5083, 138.4550], [34.8361, 138.3811]] },
    { name: 'JDA K-1-3', type: 'training', alt: 'SFC - FL310', coords: [[34.8361, 138.3811], [34.5083, 138.4550], [33.8825, 138.0069], [33.5133, 137.8936], [34.2567, 137.4919]] },
    { name: 'JDA K-2', type: 'training', alt: 'SFC - FL240', coords: [[34.5083, 138.4550], [34.3314, 138.8353], [33.5161, 138.9333], [31.5167, 138.2583], [31.5167, 137.1417], [33.5133, 137.8936], [33.8825, 138.0069]] },
    { name: 'Shizuhama', type: 'training', alt: 'SFC - FL240', coords: [[35.1411, 138.6919], [35.1367, 138.5792], [34.8478, 138.2372], [34.8778, 138.7636], [34.8686, 138.7803]] },
    { name: 'Hyakuri Nr.1-6', type: 'training', alt: 'SFC - FL240', coords: [[36.2517, 142.0592], [36.6786, 142.1753], [37.1564, 142.3581], [37.7733, 142.5850], [38.1697, 142.6883], [38.1697, 142.9908], [37.7794, 142.6861], [37.3200, 142.9908], [36.2500, 142.9908]] }
];

// =========================================================================
// 緯度経度変換ヘルパー
// =========================================================================
const parseWaypointToLatLng = (wpObj) => {
  if (!wpObj) return null;
  const wpName = typeof wpObj === 'string' ? wpObj : wpObj.wp;
  const latLonStr = typeof wpObj === 'string' ? null : wpObj.latLon;

  if (latLonStr) {
      const noDotMatch = latLonStr.match(/^([NS])(\d{2})(\d{3})([EW])(\d{3})(\d{3})$/);
      if (noDotMatch) {
          let lat = parseInt(noDotMatch[2], 10) + parseInt(noDotMatch[3], 10) / 600;
          if (noDotMatch[1] === 'S') lat = -lat;
          let lon = parseInt(noDotMatch[5], 10) + parseInt(noDotMatch[6], 10) / 600;
          if (noDotMatch[4] === 'W') lon = -lon;
          return { lat, lon, name: wpName, isAirport: false };
      }
      const dotMatch = latLonStr.match(/^([NS])(\d{2})(\d{2}(?:\.\d+)?)([EW])(\d{2,3})(\d{2}(?:\.\d+)?)$/);
      if (dotMatch) {
          let lat = parseInt(dotMatch[2], 10) + parseFloat(dotMatch[3]) / 60;
          if (dotMatch[1] === 'S') lat = -lat;
          let lon = parseInt(dotMatch[5], 10) + parseFloat(dotMatch[6]) / 60;
          if (dotMatch[4] === 'W') lon = -lon;
          return { lat, lon, name: wpName, isAirport: false };
      }
  }

  const arincMatch1 = wpName.match(/^(\d{2})([NSWE])(\d{2})$/);
  if (arincMatch1) {
      let lat = parseInt(arincMatch1[1], 10);
      let lon = parseInt(arincMatch1[3], 10);
      const dir = arincMatch1[2];
      if (dir === 'N') { lon = -(lon + 100); } else if (dir === 'E') { lon = lon + 100; } else if (dir === 'W') { lat = -lat; lon = -(lon + 100); } else if (dir === 'S') { lat = -lat; lon = lon + 100; }
      return { lat, lon, name: wpName, isAirport: false };
  }

  const arincMatch2 = wpName.match(/^(\d{4})([NSWE])$/);
  if (arincMatch2) {
      let lat = parseInt(arincMatch2[1].substring(0,2), 10);
      let lon = parseInt(arincMatch2[1].substring(2,4), 10);
      const dir = arincMatch2[2];
      if (dir === 'N') lon = -lon; else if (dir === 'E') lon = lon; else if (dir === 'W') { lat = -lat; lon = -lon; } else if (dir === 'S') { lat = -lat; lon = lon; } 
      return { lat, lon, name: wpName, isAirport: false };
  }

  const coordMatch = wpName.match(/^([NS])(\d{4,5})([EW])(\d{4,5})$/);
  if (coordMatch) {
      let lat = parseInt(coordMatch[2], 10) / 100;
      let lon = parseInt(coordMatch[4], 10) / 100;
      if (coordMatch[1] === 'S') lat = -lat;
      if (coordMatch[3] === 'W') lon = -lon;
      return { lat, lon, name: wpName, isAirport: false };
  }
  return null;
};

// =========================================================================
// ジオメトリ・時間ヘルパー
// =========================================================================
const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;
const getBearing = (lat1, lon1, lat2, lon2) => {
    const rLat1 = toRad(lat1); const rLat2 = toRad(lat2); const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(rLat2);
    const x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};
const getDestination = (lat, lon, brng, distNM) => {
    const R = 3440.065; const rLat = toRad(lat); const rLon = toRad(lon); const rBrng = toRad(brng); const dR = distNM / R;
    const rLat2 = Math.asin(Math.sin(rLat) * Math.cos(dR) + Math.cos(rLat) * Math.sin(dR) * Math.cos(rBrng));
    const rLon2 = rLon + Math.atan2(Math.sin(rBrng) * Math.sin(dR) * Math.cos(rLat), Math.cos(dR) - Math.sin(rLat) * Math.sin(rLat2));
    return [toDeg(rLat2), toDeg(rLon2)];
};
const getDistanceNM = (lat1, lon1, lat2, lon2) => {
    const R = 3440.065; const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const calculateOffsetLine = (latlngs, offsetNM) => {
    if (latlngs.length < 2) return [];
    const offsetPoints = [];
    for (let i = 0; i < latlngs.length; i++) {
        let brng;
        if (i === 0) brng = getBearing(latlngs[i][0], latlngs[i][1], latlngs[i+1][0], latlngs[i+1][1]);
        else if (i === latlngs.length - 1) brng = getBearing(latlngs[i-1][0], latlngs[i-1][1], latlngs[i][0], latlngs[i][1]);
        else {
            const b1 = getBearing(latlngs[i-1][0], latlngs[i-1][1], latlngs[i][0], latlngs[i][1]);
            const b2 = getBearing(latlngs[i][0], latlngs[i][1], latlngs[i+1][0], latlngs[i+1][1]);
            let diff = b2 - b1;
            if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
            brng = (b1 + diff / 2 + 360) % 360;
        }
        const rightBrng = (brng + 90) % 360;
        offsetPoints.push(getDestination(latlngs[i][0], latlngs[i][1], rightBrng, offsetNM));
    }
    return offsetPoints;
};

const normalizeLongitudes = (latlngs) => {
    let offset = 0;
    for (let i = 1; i < latlngs.length; i++) {
        let prevLon = latlngs[i-1][1];
        let currLon = latlngs[i][1] + offset;
        if (prevLon - currLon > 180) { offset += 360; currLon += 360; } 
        else if (currLon - prevLon > 180) { offset -= 360; currLon -= 360; }
        latlngs[i][1] = currLon;
    }
    return latlngs;
};

const fixAntiMeridian = (feature) => {
    const fixLine = (coords) => {
        if (!coords || !coords.length) return;
        let offset = 0;
        for (let i = 1; i < coords.length; i++) {
            if (!coords[i-1] || !coords[i]) continue;
            let prevLon = coords[i-1][0];
            let lon = coords[i][0] + offset;
            if (lon - prevLon > 180) { offset -= 360; lon -= 360; } 
            else if (prevLon - lon > 180) { offset += 360; lon += 360; }
            coords[i][0] = lon;
        }
    };
    if (feature && feature.geometry && feature.geometry.coordinates) {
        try {
            if (feature.geometry.type === 'Polygon') feature.geometry.coordinates.forEach(fixLine);
            else if (feature.geometry.type === 'MultiPolygon') feature.geometry.coordinates.forEach(polygon => polygon.forEach(fixLine));
            else if (feature.geometry.type === 'LineString') fixLine(feature.geometry.coordinates);
            else if (feature.geometry.type === 'MultiLineString') feature.geometry.coordinates.forEach(fixLine);
        } catch (e) { console.warn("Anti-Meridian fix skipped", e); }
    }
    return feature;
};

const formatRvTime = (unixTime) => {
  if (!unixTime) return '';
  const d = new Date(unixTime * 1000);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}Z`;
};

const formatJmaTime = (basetime) => {
  if (!basetime || basetime.length < 12) return '';
  return `${basetime.substring(8, 10)}:${basetime.substring(10, 12)}Z`;
};

// =========================================================================
// NAVLOG テキスト解析 (高度のStep Up/Downの完全追従)
// =========================================================================
const parseNavlogText = (text) => {
    let newPlan = [];
    const fNoMatch = text.match(/(?:ANA|JAL|NCA|NH|JL)(\d{2,4}[A-Z]?)/);
    let fNo = fNoMatch ? fNoMatch[0] : "UNKNOWN";
    
    const routeMatch = text.match(/([A-Z]{4})\s*-\s*([A-Z]{4})/);
    const depIcao = routeMatch ? routeMatch[1] : null;
    const destIcao = routeMatch ? routeMatch[2] : null;

    let currentFl = 350;
    const globalFlMatch = text.match(/FL\s*([1-4]\d{2})/i) || text.match(/F([1-4]\d{2})\b/i);
    if (globalFlMatch) currentFl = parseInt(globalFlMatch[1], 10);

    let cleanTextForWp = text;
    const logStartIndex = cleanTextForWp.indexOf('WSCP');
    if (logStartIndex !== -1) cleanTextForWp = cleanTextForWp.substring(logStartIndex);
    cleanTextForWp = cleanTextForWp.replace(/\(\s+/g, '(');
    
    const tokens = cleanTextForWp.split(/\s+/);
    let ignoreList = new Set(["ELEV","RDIS","TMP","ZWIND","SAT","SPOT","ETO","ZTME","ALT","FUEL","POS","ATO","DIST","FL","RMG","COMPANY","CLEARANCE","WSCP","NONE","OAT","INTENTION","SPEED","ROUTE","DATA","AWY","OFP","LOG","RMK","NAV","FOB","PLN","ACT","DIFF","MEMO","TIME","MAX","WT","PAGE","DIS","WND","SHR","TRK","INFO","IFR","VFR","TC","GS","CTME","MC","TAS","RTME","WP","LAT","LONG","LAT/LONG"]);
    
    let pendingLat = null; 
    let pendingLatLon = null;

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let cleanToken = token.replace(/^-+/, '').replace(/-+$/, '');

        // 高度変更の即時反映 (39000, F390, FL390 など、明確なものだけ抽出)
        let foundFl = 0;
        if (cleanToken === "FL" && tokens[i+1] && tokens[i+1].match(/^[1-4]\d{2}$/)) {
            foundFl = parseInt(tokens[i+1], 10);
        } else if (cleanToken.match(/^F([1-4]\d{2})$/i)) {
            foundFl = parseInt(cleanToken.match(/^F([1-4]\d{2})$/i)[1], 10);
        } else if (cleanToken.match(/^FL([1-4]\d{2})$/i)) {
            foundFl = parseInt(cleanToken.match(/^FL([1-4]\d{2})$/i)[1], 10);
        } else if (cleanToken.match(/^([1-4]\d{2})00$/)) {
            foundFl = parseInt(cleanToken.substring(0, 3), 10);
        }
        if (foundFl >= 100 && foundFl <= 600) currentFl = foundFl;

        // スラッシュ付き（例: 54N150W/M084F390）からの抽出
        let wpNameCandidate = cleanToken;
        if (cleanToken.includes('/')) {
            const parts = cleanToken.split('/');
            wpNameCandidate = parts[0];
            const speedAlt = parts[1];
            if (speedAlt) {
                const altMatch = speedAlt.match(/F([1-4]\d{2})$/i);
                if (altMatch) currentFl = parseInt(altMatch[1], 10);
            }
        }

        const latMatch = wpNameCandidate.match(/^[NS]\d{4,6}(?:\.\d+)?$/);
        if (latMatch) { pendingLat = wpNameCandidate; continue; }
        const lonMatch = wpNameCandidate.match(/^[EW]\d{4,7}(?:\.\d+)?$/);
        if (lonMatch) {
            if (pendingLat) {
                pendingLatLon = pendingLat + wpNameCandidate;
                if (newPlan.length > 0 && !newPlan[newPlan.length - 1].latLon) newPlan[newPlan.length - 1].latLon = pendingLatLon;
            }
            pendingLat = null; continue;
        }
        const latLonMatch = wpNameCandidate.match(/^[NS]\d{4,6}(?:\.\d+)?[EW]\d{4,7}(?:\.\d+)?$/);
        if (latLonMatch) {
            pendingLatLon = wpNameCandidate;
            if (newPlan.length > 0 && !newPlan[newPlan.length - 1].latLon) newPlan[newPlan.length - 1].latLon = pendingLatLon;
            continue;
        }

        const isCoord = /^[NS]\d{4,5}[EW]\d{4,6}$/.test(wpNameCandidate);
        const isAlphaWp = /^[A-Z][A-Z0-9]{1,5}$/.test(wpNameCandidate) && !ignoreList.has(wpNameCandidate);
        const isArincWp = /^\d{2}[NSWE]\d{2}$/.test(wpNameCandidate);
        const isSpecialWp = ["TOC", "TOD"].includes(wpNameCandidate);

        if (!isCoord && (isAlphaWp || isArincWp || isSpecialWp)) {
            if (newPlan.length > 0 && newPlan[newPlan.length - 1].wp === wpNameCandidate) continue;

            // 周辺（少し後方）に高度指定がないか探す
            let wpFl = currentFl;
            for (let j = i; j <= Math.min(tokens.length - 1, i + 8); j++) {
                let t = tokens[j].replace(/^-+/, '').replace(/-+$/, '');
                if (t === "FL" && tokens[j+1] && tokens[j+1].match(/^[1-4]\d{2}$/)) {
                    wpFl = parseInt(tokens[j+1], 10);
                    break;
                } else if (t.match(/^F([1-4]\d{2})$/i)) {
                    wpFl = parseInt(t.match(/^F([1-4]\d{2})$/i)[1], 10);
                    break;
                } else if (t.match(/^FL([1-4]\d{2})$/i)) {
                    wpFl = parseInt(t.match(/^FL([1-4]\d{2})$/i)[1], 10);
                    break;
                } else if (t.match(/^([1-4]\d{2})00$/)) {
                    wpFl = parseInt(t.substring(0, 3), 10);
                    break;
                }
            }
            
            currentFl = wpFl; 

            pendingLat = null;
            newPlan.push({ wp: wpNameCandidate, latLon: pendingLatLon, fl: currentFl });
            if (destIcao && wpNameCandidate === destIcao) break; 
            pendingLatLon = null;
        }
    }

    if (newPlan.length >= 2 && newPlan[newPlan.length - 1].wp === newPlan[newPlan.length - 2].wp) newPlan.pop();
    return { newPlan, fNo, depIcao, destIcao };
};

// =========================================================================
// UI コンポーネント (Modal & Toast)
// =========================================================================
const Toast = ({ message, visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded shadow-2xl flex items-center gap-3">
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
    </div>
  );
};

const LoadDataModal = ({ isOpen, onClose, onFileLoad, onTextLoad, isParsing }) => {
    const [text, setText] = useState("");
    const fileInputRef = useRef(null);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2 text-lg"><span className="text-sky-400"><IconDownloadCloud /></span>Load Flight Plan</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-2xl leading-none">&times;</button>
                </div>
                <div className="flex flex-col gap-3">
                    <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={(e) => { if(e.target.files[0]) onFileLoad(e.target.files[0]); }} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isParsing} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
                        {isParsing ? <IconLoader2 className="animate-spin" /> : <IconFileText />}{isParsing ? 'Reading PDF...' : 'Upload NAVLOG PDF'}
                    </button>
                </div>
                <div className="flex items-center gap-3 py-5"><div className="h-px bg-slate-700 flex-1"></div><span className="text-xs text-slate-500 font-bold uppercase">OR</span><div className="h-px bg-slate-700 flex-1"></div></div>
                <div className="flex flex-col gap-3">
                    <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-sky-500 resize-none font-mono text-xs" placeholder="Paste NAVLOG text here..."></textarea>
                    <button onClick={() => { onTextLoad(text); setText(""); }} disabled={!text.trim()} className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
                        <span><IconClipboard /></span>Load from Text
                    </button>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// CROSS SECTION VIEW (矢羽対応・ステップダウン追従・マウスズーム対応)
// =========================================================================
const CrossSectionView = ({ routeData, weatherData, timeIndex }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    if (!routeData || routeData.length === 0) {
        return <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-sm bg-slate-950">No Route Data</div>;
    }

    let totalDist = 0;
    const pointsWithDist = routeData.map((wp, idx) => {
        if (idx === 0) return { ...wp, accDist: 0 };
        const prev = routeData[idx - 1];
        const dist = getDistanceNM(prev.lat, prev.lon, wp.lat, wp.lon);
        totalDist += dist;
        return { ...wp, accDist: totalDist };
    });

    const PADDING_X = 50; const PADDING_Y_TOP = 40; const PADDING_Y_BOTTOM = 60;
    const innerWidth = (dimensions.width * zoomLevel) - PADDING_X * 2;
    const innerHeight = dimensions.height - PADDING_Y_TOP - PADDING_Y_BOTTOM;
    const MAX_FL = 450; const FL_STEP = 20; 

    const getX = (dist) => PADDING_X + (dist / (totalDist || 1)) * innerWidth;
    const getY = (fl) => PADDING_Y_TOP + innerHeight - (fl / MAX_FL) * innerHeight;

    const currentWeatherData = weatherData[timeIndex] || {};

    const drawWindBarb = (wp, fl, x, y, windData) => {
        if (!windData || windData.ws === undefined) return null;
        const { wd, ws, temp } = windData;
        if (ws < 5) return (
            <g key={`wind-${wp.name}-${fl}`} transform={`translate(${x},${y})`} className="group cursor-crosshair">
                <circle r="2" fill="#94a3b8" />
            </g>
        ); 

        const length = 20; 
        const speed = Math.round(ws);
        const num50 = Math.floor(speed / 50);
        const rem50 = speed % 50;
        const num10 = Math.floor(rem50 / 10);
        const rem10 = rem50 % 10;
        const num5 = Math.floor(rem10 / 5);

        let currentY = -length;
        const barbElements = [];

        for (let i = 0; i < num50; i++) {
            barbElements.push(<polygon key={`50-${i}`} points={`0,${currentY} 8,${currentY} 0,${currentY+4}`} fill="#e2e8f0" />);
            currentY += 5;
        }
        for (let i = 0; i < num10; i++) {
            barbElements.push(<line key={`10-${i}`} x1="0" y1={currentY} x2="8" y2={currentY - 3} stroke="#e2e8f0" strokeWidth="1.5" />);
            currentY += 4;
        }
        if (num5 > 0) {
            if (num50 === 0 && num10 === 0) currentY += 3;
            barbElements.push(<line key={`5`} x1="0" y1={currentY} x2="4" y2={currentY - 1.5} stroke="#e2e8f0" strokeWidth="1.5" />);
        }

        return (
            <g key={`wind-${wp.name}-${fl}`} transform={`translate(${x},${y})`} className="group cursor-crosshair">
                <g transform={`rotate(${wd})`}>
                    <line x1="0" y1="0" x2="0" y2={-length} stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
                    {barbElements}
                </g>
                <g className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    <rect x="10" y="-30" width="80" height="40" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" rx="4" opacity="0.9" />
                    <text x="15" y="-15" fontSize="10" fill="#e0f2fe" fontWeight="bold">FL{String(fl).padStart(3, '0')}</text>
                    <text x="15" y="-3" fontSize="10" fill="#bae6fd">{wd}° / {speed}kt</text>
                    <text x="65" y="-15" fontSize="10" fill="#fca5a5">{temp > 0 ? '+' : ''}{temp}℃</text>
                </g>
            </g>
        );
    };

    const windArrows = []; const shearRects = []; const windSpeedGrid = [];

    for (let fl = 0; fl <= MAX_FL; fl += FL_STEP) {
        const row = [];
        pointsWithDist.forEach(wp => {
            const wind = (currentWeatherData[wp.name] || {})[fl];
            row.push(wind ? wind.ws : 0);
        });
        windSpeedGrid.push(row);
    }

    for (let i = 0; i < pointsWithDist.length - 1; i++) {
        const wp = pointsWithDist[i];
        const nextWp = pointsWithDist[i+1];
        const wpWeather = currentWeatherData[wp.name] || {};
        
        const x1 = getX(wp.accDist); const x2 = getX(nextWp.accDist);
        const cellWidth = x2 - x1;

        for (let fl = 0; fl <= MAX_FL; fl += FL_STEP) {
            const wind = wpWeather[fl];
            const windUpper = wpWeather[fl + FL_STEP];
            const y = getY(fl); const yUpper = getY(fl + FL_STEP);
            const cellHeight = Math.abs(yUpper - y);

            if (wind) {
                windArrows.push(drawWindBarb(wp, fl, x1, y, wind));
                if (windUpper) {
                    const u1 = -wind.ws * Math.sin(toRad(wind.wd)); const v1 = -wind.ws * Math.cos(toRad(wind.wd));
                    const u2 = -windUpper.ws * Math.sin(toRad(windUpper.wd)); const v2 = -windUpper.ws * Math.cos(toRad(windUpper.wd));
                    const vectorShear = Math.sqrt((u2-u1)**2 + (v2-v1)**2);
                    const shearPer1000ft = vectorShear / (FL_STEP / 10);
                    let shearColor = null, opacity = 0;
                    if (shearPer1000ft >= 6) { shearColor = '#ef4444'; opacity = 0.5; }
                    else if (shearPer1000ft >= 4) { shearColor = '#eab308'; opacity = 0.3; }
                    else if (shearPer1000ft >= 2) { shearColor = '#22c55e'; opacity = 0.15; }

                    if (shearColor) shearRects.push(<rect key={`shear-${wp.name}-${fl}`} x={x1} y={yUpper} width={cellWidth} height={cellHeight} fill={shearColor} opacity={opacity} />);
                }
            }
        }
    }

    const isotachLines = [];
    const drawIsotach = (threshold) => {
        let pathData = ""; const lines = []; 
        for (let r = 0; r < windSpeedGrid.length - 1; r++) {
            for (let c = 0; c < windSpeedGrid[r].length - 1; c++) {
                const x1 = getX(pointsWithDist[c].accDist), x2 = getX(pointsWithDist[c+1].accDist);
                const y1 = getY(r * FL_STEP), y2 = getY((r + 1) * FL_STEP);
                const v0 = windSpeedGrid[r][c], v1 = windSpeedGrid[r][c+1], v2 = windSpeedGrid[r+1][c+1], v3 = windSpeedGrid[r+1][c];
                let cellType = (v0 >= threshold ? 1 : 0) | (v1 >= threshold ? 2 : 0) | (v2 >= threshold ? 4 : 0) | (v3 >= threshold ? 8 : 0);

                if (cellType === 0 || cellType === 15) continue;
                const interp = (valA, valB, posA, posB) => posA + (posB - posA) * ((threshold - valA) / (valB - valA || 1));
                let p = [];
                if ((cellType & 1) !== ((cellType & 2) >> 1)) p.push([interp(v0, v1, x1, x2), y1]);
                if (((cellType & 2) >> 1) !== ((cellType & 4) >> 2)) p.push([x2, interp(v1, v2, y1, y2)]);
                if (((cellType & 8) >> 3) !== ((cellType & 4) >> 2)) p.push([interp(v3, v2, x1, x2), y2]);
                if ((cellType & 1) !== ((cellType & 8) >> 3)) p.push([x1, interp(v0, v3, y1, y2)]);

                if (p.length === 2) {
                    pathData += `M ${p[0][0]},${p[0][1]} L ${p[1][0]},${p[1][1]} `;
                    lines.push({ x: (p[0][0]+p[1][0])/2, y: (p[0][1]+p[1][1])/2 });
                } else if (p.length === 4) {
                     pathData += `M ${p[0][0]},${p[0][1]} L ${p[1][0]},${p[1][1]} M ${p[2][0]},${p[2][1]} L ${p[3][0]},${p[3][1]} `;
                }
            }
        }
        return { path: pathData, labelPts: lines };
    };

    [40, 60, 80, 100, 120, 140, 160, 180, 200].forEach(speed => {
        const { path, labelPts } = drawIsotach(speed);
        if (path) {
            isotachLines.push(<path key={`iso-${speed}`} d={path} fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />);
            labelPts.filter((_, idx) => idx % 10 === 0).forEach((pt, idx) => {
                 isotachLines.push(<text key={`iso-lbl-${speed}-${idx}`} x={pt.x} y={pt.y} fill="#0ea5e9" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="bg-slate-900">{speed}</text>);
            });
        }
    });

    const profilePath = pointsWithDist.map(wp => `${getX(wp.accDist)},${getY(wp.fl || 0)}`).join(' L ');

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; 
        e.preventDefault();
        
        const zoomSensitivity = 0.05;
        let delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
        
        setZoomLevel(prevZoom => Math.max(1, Math.min(5, prevZoom + delta)));
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-950 relative">
            <div className="absolute top-2 right-4 z-10 flex gap-2">
                <div className="bg-slate-900/80 border border-slate-700 rounded px-2 py-1 flex items-center gap-2 backdrop-blur">
                    <span className="text-xs font-bold text-slate-400">ZOOM:</span>
                    <button onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))} className="text-sky-400 hover:text-white px-2 bg-slate-800 rounded">-</button>
                    <span className="text-xs text-white w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(Math.min(5, zoomLevel + 0.5))} className="text-sky-400 hover:text-white px-2 bg-slate-800 rounded">+</button>
                </div>
            </div>

            <div className="absolute top-2 left-4 z-10 bg-slate-900/80 border border-slate-700 rounded p-2 backdrop-blur text-[10px] text-slate-300 pointer-events-none">
                <div className="font-bold text-sky-400 border-b border-slate-700 mb-1 pb-1">Turbulence (Vertical Shear)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 opacity-50 inline-block"></span> SEVERE (≥ 6kt/1000ft)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500 opacity-50 inline-block"></span> MODERATE (≥ 4kt/1000ft)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 opacity-50 inline-block"></span> LIGHT (≥ 2kt/1000ft)</div>
            </div>

            <div 
                className="flex-1 overflow-x-auto overflow-y-hidden relative" 
                ref={containerRef}
                onWheel={handleWheel}
            >
                <div style={{ width: Math.max(dimensions.width, innerWidth + PADDING_X * 2), height: '100%' }}>
                    <svg width="100%" height="100%" className="block">
                        {[0, 100, 200, 300, 400].map(fl => (
                            <g key={`grid-fl-${fl}`}>
                                <line x1={PADDING_X} y1={getY(fl)} x2={PADDING_X + innerWidth} y2={getY(fl)} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                                <text x={PADDING_X - 5} y={getY(fl) + 3} fill="#64748b" fontSize="10" textAnchor="end">FL{String(fl).padStart(3, '0')}</text>
                            </g>
                        ))}
                        <g style={{ filter: 'blur(8px)' }}>{shearRects}</g>
                        <g>{isotachLines}</g>
                        <g>{windArrows}</g>
                        
                        <path d={`M ${profilePath}`} fill="none" stroke="#d946ef" strokeWidth="2.5" />
                        
                        {pointsWithDist.map((wp, idx) => (
                            <g key={`wp-${idx}`} transform={`translate(${getX(wp.accDist)}, ${innerHeight + PADDING_Y_TOP})`}>
                                <line x1="0" y1="0" x2="0" y2="5" stroke="#94a3b8" strokeWidth="1" />
                                <text x="0" y="20" fill="#e2e8f0" fontSize="10" textAnchor="middle" transform="rotate(45, 0, 20)">{wp.name}</text>
                                <circle cx="0" cy={-(innerHeight * ((wp.fl || 0) / MAX_FL))} r="3.5" fill="#fdf4ff" stroke="#d946ef" strokeWidth="2" />
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// メインマップコンポーネント
// =========================================================================
const WeatherRadarView = ({ navlogData }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});

  const [showHimawari, setShowHimawari] = useState(true);
  const [showGoes, setShowGoes] = useState(true); 
  const [showMeteosat, setShowMeteosat] = useState(true); 
  const [showArctic, setShowArctic] = useState(true); 
  const [showGlobalIr, setShowGlobalIr] = useState(false); 
  const [showRadar, setShowRadar] = useState(true);
  const [showNavlogRoute, setShowNavlogRoute] = useState(true);
  const [showAirspace, setShowAirspace] = useState(true);
  const [showFIR, setShowFIR] = useState(true);
  
  const [opacity, setOpacity] = useState(0.65);
  const [deviationNM, setDeviationNM] = useState(0); 
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [rvRadarFrames, setRvRadarFrames] = useState([]);
  const [rvSatFrames, setRvSatFrames] = useState([]);
  const [jmaFrames, setJmaFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const himawariLayerRef = useRef(null);
  const goesLayerRef = useRef(null); 
  const meteosatLayerRef = useRef(null); 
  const arcticLayerRef = useRef(null);
  const globalIrLayerRef = useRef(null);
  const radarLayerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setLastFetchTime(Date.now()), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadLeaflet = async () => {
      try {
        if (!window.L) {
          const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
          const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; document.head.appendChild(script); });
        }

        if (isMounted && mapContainerRef.current && !mapInstanceRef.current) {
          const L = window.L;
          const map = L.map(mapContainerRef.current, { center: [35.0, 135.0], zoom: 3, zoomControl: false, attributionControl: false, worldCopyJump: true });
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          const darkBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, subdomains: 'abcd' }).addTo(map);
          mapInstanceRef.current = map;
          layersRef.current.base = darkBase;

          const style = document.createElement('style');
          style.innerHTML = `
            .sat-blend { mix-blend-mode: screen; }
            .nav-tooltip { background-color: rgba(15, 23, 42, 0.85) !important; border: 1px solid rgba(56, 189, 248, 0.4) !important; color: #e0f2fe !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; border-radius: 4px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.5) !important; }
            .airspace-tooltip { background-color: rgba(0, 0, 0, 0.7) !important; border: 1px solid #f87171 !important; color: #fecaca !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; border-radius: 4px !important; }
            .fir-tooltip { background-color: rgba(255, 255, 255, 0.8) !important; border: 1px solid #f97316 !important; color: #c2410c !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; border-radius: 4px !important; }
          `;
          document.head.appendChild(style);

          meteosatLayerRef.current = L.tileLayer.wms('https://view.eumetsat.int/geoserver/ows', { layers: 'msg_fes:ir108,msg_iodc:ir108', format: 'image/png', transparent: true, version: '1.3.0', opacity: opacity, zIndex: 2, className: 'sat-blend' }).addTo(map);
          arcticLayerRef.current = L.tileLayer.wms('https://realearth.ssec.wisc.edu/wms/', { layers: 'globalir', format: 'image/png', transparent: true, opacity: opacity, zIndex: 1, className: 'sat-blend' }).addTo(map);

          const errImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          himawariLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 2, className: 'sat-blend' }).addTo(map);
          goesLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 2, className: 'sat-blend' }).addTo(map);
          globalIrLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 1, className: 'sat-blend' }).addTo(map);
          radarLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 3 }).addTo(map);

          setIsMapLoaded(true);
        }
      } catch (err) { console.error("Map initialization failed", err); }
    };
    loadLeaflet();
    return () => { isMounted = false; if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
      fetch('https://api.rainviewer.com/public/weather-maps.json', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          const host = data.host || 'https://tilecache.rainviewer.com';
          if (data.radar?.past) setRvRadarFrames(data.radar.past.map(f => ({ ...f, host })));
          if (data.satellite?.infrared) setRvSatFrames(data.satellite.infrared.map(f => ({ ...f, host })));
        }).catch(err => console.error(err));

      fetch('https://www.jma.go.jp/bosai/himawari/data/satimg/targetTimes_fd.json', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data) && data.length > 0) setJmaFrames(data.slice(-24)); })
        .catch(err => console.error(err));
  }, [lastFetchTime]);

  useEffect(() => {
      setIsPlaying(false);
      let activeLengths = [];
      if (showHimawari) activeLengths.push(jmaFrames.length);
      if (showGlobalIr) activeLengths.push(rvSatFrames.length);
      if (showRadar) activeLengths.push(rvRadarFrames.length);
      const mFrames = activeLengths.length > 0 ? Math.max(...activeLengths, 1) : 1;
      setFrameIndex(mFrames - 1); 
  }, [jmaFrames.length, rvSatFrames.length, rvRadarFrames.length, showHimawari, showGlobalIr, showRadar]);

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;
    const resizeObserver = new ResizeObserver(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); });
    if (mapContainerRef.current) resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [isMapLoaded]);

  let activeLengths = [];
  if (showHimawari) activeLengths.push(jmaFrames.length);
  if (showGlobalIr) activeLengths.push(rvSatFrames.length);
  if (showRadar) activeLengths.push(rvRadarFrames.length);
  const maxFrames = activeLengths.length > 0 ? Math.max(...activeLengths, 1) : 1;
  const safeFrameIndex = Math.max(0, Math.min(frameIndex, maxFrames - 1));

  const getLayerFrameIndex = (layerFramesLength) => {
      if (layerFramesLength <= 1 || maxFrames <= 1) return layerFramesLength - 1;
      return Math.floor((safeFrameIndex / (maxFrames - 1)) * (layerFramesLength - 1));
  };

  useEffect(() => {
    let timer;
    if (isPlaying) { timer = setInterval(() => setFrameIndex(prev => (maxFrames <= 1) ? 0 : (prev + 1) % maxFrames), 1000); }
    return () => clearInterval(timer);
  }, [isPlaying, maxFrames]);

  useEffect(() => {
    if (!isMapLoaded || !himawariLayerRef.current) return;
    const errImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    let himawariUrl = errImg;
    if (showHimawari && jmaFrames.length > 0) {
        const frame = jmaFrames[Math.max(0, Math.min(getLayerFrameIndex(jmaFrames.length), jmaFrames.length - 1))];
        if (frame?.basetime && frame?.validtime) himawariUrl = `https://www.jma.go.jp/bosai/himawari/data/satimg/${frame.basetime}/fd/${frame.validtime}/SND/ETC/{z}/{x}/{y}.jpg`;
    }
    if (himawariLayerRef.current._url !== himawariUrl) himawariLayerRef.current.setUrl(himawariUrl);
    himawariLayerRef.current.setOpacity(showHimawari ? opacity : 0);

    let goesUrl = errImg;
    if (showGoes) goesUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-ir-4km-900913/{z}/{x}/{y}.png`;
    if (goesLayerRef.current._url !== goesUrl) goesLayerRef.current.setUrl(goesUrl);
    goesLayerRef.current.setOpacity(showGoes ? opacity : 0);

    meteosatLayerRef.current.setOpacity(showMeteosat ? opacity : 0);
    arcticLayerRef.current.setOpacity(showArctic ? opacity : 0);

    let globalIrUrl = errImg;
    if (showGlobalIr && rvSatFrames.length > 0) {
        const frame = rvSatFrames[Math.max(0, Math.min(getLayerFrameIndex(rvSatFrames.length), rvSatFrames.length - 1))];
        if (frame) globalIrUrl = `${frame.host}${frame.path}/256/{z}/{x}/{y}/0/0_0.png`;
    }
    if (globalIrLayerRef.current._url !== globalIrUrl) globalIrLayerRef.current.setUrl(globalIrUrl);
    globalIrLayerRef.current.setOpacity(showGlobalIr ? opacity : 0);

    let radarUrl = errImg;
    if (showRadar && rvRadarFrames.length > 0) {
        const frame = rvRadarFrames[Math.max(0, Math.min(getLayerFrameIndex(rvRadarFrames.length), rvRadarFrames.length - 1))];
        if (frame) radarUrl = `${frame.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    }
    if (radarLayerRef.current._url !== radarUrl) radarLayerRef.current.setUrl(radarUrl);
    radarLayerRef.current.setOpacity(showRadar ? opacity : 0);
  }, [isMapLoaded, frameIndex, opacity, showHimawari, showGoes, showMeteosat, showArctic, showGlobalIr, showRadar, jmaFrames, rvSatFrames, rvRadarFrames, maxFrames]);

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (layersRef.current.navlogGroup) map.removeLayer(layersRef.current.navlogGroup);
    if (showNavlogRoute && navlogData && (navlogData.newPlan || navlogData.depIcao)) {
        const navlogGroup = L.layerGroup();
        const routePoints = [];

        if (navlogData.depIcao) {
            const depCoord = parseWaypointToLatLng(navlogData.depIcao);
            if (depCoord) routePoints.push(depCoord);
        }
        if (navlogData.newPlan) {
          navlogData.newPlan.forEach(wp => {
            if (!wp || !wp.wp) return;
            const coord = parseWaypointToLatLng(wp);
            if (coord && (!routePoints.length || routePoints[routePoints.length - 1].name !== coord.name)) routePoints.push(coord);
          });
        }
        if (navlogData.destIcao) {
            const destCoord = parseWaypointToLatLng(navlogData.destIcao);
            if (destCoord && (!routePoints.length || routePoints[routePoints.length - 1].name !== destCoord.name)) routePoints.push(destCoord);
        }

        if (routePoints.length > 0) {
          const latlngs = routePoints.map(pt => [pt.lat, pt.lon]);
          normalizeLongitudes(latlngs); 
          const flightPath = L.polyline(latlngs, { color: '#38bdf8', weight: 3, opacity: 0.9 });
          navlogGroup.addLayer(flightPath);

          if (deviationNM > 0) {
              const rightOffset = calculateOffsetLine(latlngs, deviationNM);
              const leftOffset = calculateOffsetLine(latlngs, -deviationNM);
              navlogGroup.addLayer(L.polyline(rightOffset, { color: '#8b5cf6', weight: 2, opacity: 0.8, dashArray: '6, 6' }));
              navlogGroup.addLayer(L.polyline(leftOffset, { color: '#8b5cf6', weight: 2, opacity: 0.8, dashArray: '6, 6' }));
          }

          routePoints.forEach((pt, index) => {
            const isAp = pt.isAirport || pt.name === navlogData.depIcao || pt.name === navlogData.destIcao;
            const marker = L.circleMarker(latlngs[index], { radius: isAp ? 6 : 4, color: isAp ? '#0ea5e9' : '#ffffff', fillColor: isAp ? '#e0f2fe' : '#38bdf8', fillOpacity: 1.0, weight: 2 });
            marker.bindTooltip(pt.name, { permanent: true, direction: 'right', className: 'nav-tooltip' });
            navlogGroup.addLayer(marker);
          });
          if (latlngs.length > 1) map.fitBounds(flightPath.getBounds(), { padding: [50, 50] }); 
          else if (latlngs.length === 1) map.setView(latlngs[0], 6);
        }
        navlogGroup.addTo(map);
        layersRef.current.navlogGroup = navlogGroup;
    }

    if (layersRef.current.airspaceGroup) map.removeLayer(layersRef.current.airspaceGroup);
    if (showAirspace) {
        const airspaceGroup = L.layerGroup();
        AIRSPACE_DATA.forEach(airspace => {
            const color = airspace.type === 'restricted' ? '#eab308' : '#f43f5e';
            const poly = L.polygon(airspace.coords, { color: color, weight: 2, fillColor: color, fillOpacity: 0.15 });
            poly.bindTooltip(`<div class="text-center font-bold"><div class="border-b border-slate-600/50 pb-0.5 mb-0.5">${airspace.name}</div><div class="text-[10px] text-red-200">${airspace.alt}</div></div>`, { sticky: true, className: 'airspace-tooltip' });
            airspaceGroup.addLayer(poly);
        });
        airspaceGroup.addTo(map);
        layersRef.current.airspaceGroup = airspaceGroup;
    }
  }, [isMapLoaded, navlogData, showNavlogRoute, deviationNM, showAirspace]);

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (layersRef.current.firGroup) {
      map.removeLayer(layersRef.current.firGroup);
      layersRef.current.firGroup = null;
    }

    if (!showFIR) return;
    const firGroup = L.layerGroup();
    layersRef.current.firGroup = firGroup;
    firGroup.addTo(map);

    const loadFIRs = async () => {
        try {
            const res = await fetch('https://raw.githubusercontent.com/vatsimnetwork/vatspy-data-project/master/Boundaries.geojson');
            if (!res.ok) {
                console.warn(`FIR Fetch Failed: ${res.status}`);
                return; 
            }
            
            const data = await res.json();
            
            if (data && data.features) {
                data.features.forEach(feature => { fixAntiMeridian(feature); });
            }

            const firLayer = L.geoJSON(data, {
                style: function (feature) {
                    const isOceanic = feature.properties?.name?.toLowerCase().includes('oceanic') || feature.properties?.name?.toLowerCase().includes('pacific');
                    return { color: '#f97316', weight: isOceanic ? 2.0 : 1.0, dashArray: '', fillOpacity: 0 };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties?.name) {
                        layer.bindTooltip(feature.properties.name, { sticky: true, className: 'fir-tooltip' });
                    }
                }
            });
            firGroup.addLayer(firLayer);
        } catch (err) { console.error("Failed to load FIR data", err); }
    };
    loadFIRs();
  }, [isMapLoaded, showFIR]);


  let currentTimeLabel = "LIVE";
  let activeLayerName = "No Layer Selected";

  if (showHimawari && jmaFrames.length > 0) {
      const idx = Math.max(0, Math.min(getLayerFrameIndex(jmaFrames.length), jmaFrames.length - 1));
      if (jmaFrames[idx]) { currentTimeLabel = formatJmaTime(jmaFrames[idx].validtime || jmaFrames[idx].basetime); activeLayerName = "JMA Himawari-8/9 Cloud Top" + (showGoes || showMeteosat || showArctic ? " & Others" : ""); }
  } else if (showGlobalIr && rvSatFrames.length > 0) {
      const idx = Math.max(0, Math.min(getLayerFrameIndex(rvSatFrames.length), rvSatFrames.length - 1));
      if (rvSatFrames[idx]) { currentTimeLabel = formatRvTime(rvSatFrames[idx].time); activeLayerName = "RainViewer Global IR"; }
  } else if (showRadar && rvRadarFrames.length > 0) {
      const idx = Math.max(0, Math.min(getLayerFrameIndex(rvRadarFrames.length), rvRadarFrames.length - 1));
      if (rvRadarFrames[idx]) { currentTimeLabel = formatRvTime(rvRadarFrames[idx].time); activeLayerName = "RainViewer Radar Only"; }
  } else if (showGoes || showMeteosat || showArctic) {
      currentTimeLabel = "LIVE";
      let parts = [];
      if (showGoes) parts.push("GOES");
      if (showMeteosat) parts.push("Meteosat");
      if (showArctic) parts.push("SSEC(Arctic)");
      activeLayerName = parts.join(" + ");
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 relative overflow-hidden text-slate-200">
      <div className="w-full flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800 text-xs flex-wrap gap-2 z-[2000] shadow-md relative">
        <div className="flex items-center gap-3 flex-wrap text-[11px] w-full lg:w-auto overflow-x-auto">
          {maxFrames > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-sky-400 hover:text-white flex items-center justify-center w-4 h-4 mr-1">
                {isPlaying ? "⏸" : "▶"}
              </button>
              <input type="range" min="0" max={maxFrames - 1} value={safeFrameIndex} onChange={(e) => { setIsPlaying(false); setFrameIndex(Number(e.target.value)); }} className="w-24 accent-sky-400 cursor-pointer" />
            </div>
          )}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
            <span className="text-slate-400 font-bold">Dev:</span>
            <select value={deviationNM} onChange={(e) => setDeviationNM(Number(e.target.value))} className="bg-transparent text-white font-mono focus:outline-none cursor-pointer">
              <option value={0} className="bg-slate-900">OFF</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => ( <option key={val} value={val} className="bg-slate-900">{val} NM</option> ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
            <span className="text-slate-400 font-bold">Trans:</span>
            <input type="range" min="0.1" max="1.0" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-16 accent-sky-400 cursor-pointer" />
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700 flex-wrap shrink-0">
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white"><input type="checkbox" checked={showHimawari} onChange={(e) => setShowHimawari(e.target.checked)} className="accent-sky-500 rounded" /><span>HIMAWARI</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white"><input type="checkbox" checked={showGoes} onChange={(e) => setShowGoes(e.target.checked)} className="accent-sky-500 rounded" /><span>GOES</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white"><input type="checkbox" checked={showMeteosat} onChange={(e) => setShowMeteosat(e.target.checked)} className="accent-sky-500 rounded" /><span>METEOSAT</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white"><input type="checkbox" checked={showArctic} onChange={(e) => setShowArctic(e.target.checked)} className="accent-sky-500 rounded" /><span className="font-bold text-sky-200">ARCTIC</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2"><input type="checkbox" checked={showGlobalIr} onChange={(e) => setShowGlobalIr(e.target.checked)} className="accent-sky-500 rounded" /><span>RV-IR</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white"><input type="checkbox" checked={showRadar} onChange={(e) => setShowRadar(e.target.checked)} className="accent-sky-500 rounded" /><span>RADAR</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2"><input type="checkbox" checked={showNavlogRoute} onChange={(e) => setShowNavlogRoute(e.target.checked)} className="accent-sky-500 rounded" /><span className="font-bold text-sky-400">Route</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2"><input type="checkbox" checked={showAirspace} onChange={(e) => setShowAirspace(e.target.checked)} className="accent-rose-500 rounded" /><span className="font-bold text-rose-400">空域(R/T)</span></label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2"><input type="checkbox" checked={showFIR} onChange={(e) => setShowFIR(e.target.checked)} className="accent-orange-500 rounded" /><span className="font-bold text-orange-400">FIR</span></label>
          </div>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full z-0">
        <div ref={mapContainerRef} className="absolute inset-0 bg-slate-900" />
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 backdrop-blur-sm text-xs text-slate-300 font-mono pointer-events-none space-y-1 shadow-xl min-w-[220px]">
          <div className="flex items-center justify-between text-sky-400 font-bold border-b border-slate-700 pb-2 mb-2">
            <span>RADAR & SAT SYNC</span>
            <span className="text-[10px] bg-sky-950 border border-sky-800 text-sky-300 px-1.5 py-0.5 rounded ml-2">{currentTimeLabel}</span>
          </div>
          <div className="leading-tight">{activeLayerName}</div>
          {navlogData && (navlogData.fNo || navlogData.depIcao || navlogData.destIcao) && (
            <div className="text-amber-300 font-bold border-t border-slate-800 pt-2 mt-2 flex justify-between gap-4">
              <span>{navlogData.fNo || 'ROUTE'} : {navlogData.depIcao || 'DEP'} &rarr; {navlogData.destIcao || 'ARR'}</span>
              {deviationNM > 0 && <span className="text-violet-400">DEV ±{deviationNM}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// メインアプリケーション
// =========================================================================
export default function App() {
  const [navlogData, setNavlogData] = useState(null);
  const [routeWps, setRouteWps] = useState([]); 
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [toastData, setToastData] = useState({ message: '', visible: false });

  const [activeTab, setActiveTab] = useState('map');
  const [weatherData, setWeatherData] = useState([]);
  const [weatherTimes, setWeatherTimes] = useState([]); 
  const [timeIndex, setTimeIndex] = useState(0);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const showToast = (message) => {
    setToastData({ message, visible: true });
    setTimeout(() => setToastData({ message: '', visible: false }), 4000);
  };

  const processParsedData = async (parsedData) => {
      if (parsedData && parsedData.newPlan.length > 0) {
          setNavlogData(parsedData);
          
          const wps = [];
          if (parsedData.depIcao) {
              const depCoord = parseWaypointToLatLng(parsedData.depIcao);
              if (depCoord) wps.push({ ...depCoord, fl: 0 });
          }
          parsedData.newPlan.forEach(wp => {
              if (!wp || !wp.wp) return;
              const coord = parseWaypointToLatLng(wp);
              if (coord) wps.push({ ...coord, fl: wp.fl || 350 });
          });
          if (parsedData.destIcao) {
              const destCoord = parseWaypointToLatLng(parsedData.destIcao);
              if (destCoord) wps.push({ ...destCoord, fl: 0 });
          }
          setRouteWps(wps);
          setIsLoadModalOpen(false);
          showToast(`ルートを読み込みました: ${parsedData.depIcao} -> ${parsedData.destIcao}`);

          if (wps.length > 0) fetchWeatherDataForRoute(wps);
      } else {
          showToast('ルートの解析に失敗しました。');
      }
  };

  const fetchWeatherDataForRoute = async (wps) => {
      setIsLoadingWeather(true);
      showToast('気象データを取得・解析中...');
      try {
          const lats = wps.map(wp => wp.lat).join(',');
          const lons = wps.map(wp => wp.lon).join(',');
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=temperature_1000hPa,windspeed_1000hPa,winddirection_1000hPa,temperature_850hPa,windspeed_850hPa,winddirection_850hPa,temperature_700hPa,windspeed_700hPa,winddirection_700hPa,temperature_500hPa,windspeed_500hPa,winddirection_500hPa,temperature_400hPa,windspeed_400hPa,winddirection_400hPa,temperature_300hPa,windspeed_300hPa,winddirection_300hPa,temperature_250hPa,windspeed_250hPa,winddirection_250hPa,temperature_200hPa,windspeed_200hPa,winddirection_200hPa,temperature_150hPa,windspeed_150hPa,winddirection_150hPa&windspeed_unit=kn&forecast_days=2`;

          const res = await fetch(url);
          const data = await res.json();
          const results = Array.isArray(data) ? data : [data];

          const now = new Date();
          const currentHourStr = now.toISOString().substring(0, 13) + ":00";
          let startIndex = results[0].hourly.time.findIndex(t => t.startsWith(currentHourStr));
          if (startIndex === -1) startIndex = 0;
          const targetIndices = Array.from({length: 12}, (_, i) => startIndex + i);
          
          const times = targetIndices.map(i => {
              const d = new Date(results[0].hourly.time[i] + 'Z');
              return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}Z`;
          });
          setWeatherTimes(times);

          const levelMap = { 1000: { fl: 0 }, 850: { fl: 50 }, 700: { fl: 100 }, 500: { fl: 180 }, 400: { fl: 240 }, 300: { fl: 300 }, 250: { fl: 340 }, 200: { fl: 390 }, 150: { fl: 450 } };

          const wData = [];
          for (let tIdx = 0; tIdx < targetIndices.length; tIdx++) {
              const dataIndex = targetIndices[tIdx];
              const timeSlice = {};

              wps.forEach((wp, wpIdx) => {
                  const wpData = results[wpIdx] || results[0]; 
                  const profile = []; 
                  [1000, 850, 700, 500, 400, 300, 250, 200, 150].forEach(p => {
                      const temp = wpData.hourly[`temperature_${p}hPa`][dataIndex];
                      const ws = wpData.hourly[`windspeed_${p}hPa`][dataIndex];
                      const wd = wpData.hourly[`winddirection_${p}hPa`][dataIndex];
                      if (temp !== null && ws !== null && wd !== null) profile.push({ fl: levelMap[p].fl, wd, ws: Math.round(ws), temp: Math.round(temp) });
                  });

                  const interpolated = {};
                  for (let fl = 0; fl <= 450; fl += 20) {
                      let below = profile[0], above = profile[profile.length - 1];
                      for (let i = 0; i < profile.length - 1; i++) {
                          if (profile[i].fl <= fl && profile[i+1].fl >= fl) { below = profile[i]; above = profile[i+1]; break; }
                      }
                      if (below.fl === above.fl) interpolated[fl] = { wd: below.wd, ws: below.ws, temp: below.temp };
                      else {
                           const ratio = (fl - below.fl) / (above.fl - below.fl);
                           let diff = above.wd - below.wd;
                           if (diff > 180) diff -= 360;
                           if (diff < -180) diff += 360;
                           interpolated[fl] = { wd: Math.round((below.wd + diff * ratio + 360) % 360), ws: Math.round(below.ws + (above.ws - below.ws) * ratio), temp: Math.round(below.temp + (above.temp - below.temp) * ratio) };
                      }
                  }
                  timeSlice[wp.name] = interpolated;
              });
              wData.push(timeSlice);
          }
          setWeatherData(wData);
          setTimeIndex(0); 
          showToast('気象データを反映しました。');
      } catch (err) { console.error(err); showToast('気象データの取得に失敗しました。'); } 
      finally { setIsLoadingWeather(false); }
  };

  const handlePdfUpload = (file) => {
    if (!file) return;
    setIsParsingPdf(true);
    showToast('PDFを解析しています...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          await new Promise(res => { script.onload = res; document.head.appendChild(script); });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const pdf = await window.pdfjsLib.getDocument(new Uint8Array(event.target.result)).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          fullText += (await (await pdf.getPage(i)).getTextContent()).items.map(item => item.str).join(" ") + "\n";
        }
        processParsedData(parseNavlogText(fullText));
      } catch (err) { console.error(err); showToast('PDFの解析に失敗しました。'); } 
      finally { setIsParsingPdf(false); }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
      <Toast message={toastData.message} visible={toastData.visible} onClose={() => setToastData({ ...toastData, visible: false })} />
      <LoadDataModal isOpen={isLoadModalOpen} onClose={() => setIsLoadModalOpen(false)} isParsing={isParsingPdf} onFileLoad={handlePdfUpload} onTextLoad={(text) => processParsedData(parseNavlogText(text))} />

      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <span className="text-sky-400 bg-sky-900/30 p-1.5 rounded-lg border border-sky-800"><IconPlane /></span>
          <h1 className="text-white font-black text-lg tracking-wide hidden sm:flex items-end gap-2">GLOBAL WX RADAR <span className="text-[10px] text-sky-400 font-mono font-normal">v1.2.0</span></h1>
          <h1 className="text-white font-black text-lg tracking-wide sm:hidden flex items-end gap-2">WX RADAR <span className="text-[10px] text-sky-400 font-mono font-normal">v1.2.0</span></h1>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 absolute left-1/2 transform -translate-x-1/2">
            <button onClick={() => setActiveTab('map')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'map' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>MAP</button>
            <button onClick={() => setActiveTab('section')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'section' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>CROSS SECTION</button>
        </div>

        <button onClick={() => setIsLoadModalOpen(true)} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg border border-sky-400/30 text-sm">
            <IconDownloadCloud /><span>Load Plan</span>
        </button>
      </header>

      {activeTab === 'section' && weatherTimes.length > 0 && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-4 text-xs z-20">
              <span className="font-bold text-sky-400 shrink-0">WIND/TEMP FCST TIME:</span>
              <input type="range" min="0" max={weatherTimes.length - 1} value={timeIndex} onChange={e => setTimeIndex(Number(e.target.value))} className="flex-1 accent-sky-400 cursor-pointer" />
              <span className="font-mono bg-slate-950 px-2 py-1 rounded border border-slate-700 w-16 text-center text-sky-300 font-bold shrink-0">{weatherTimes[timeIndex]}</span>
          </div>
      )}

      <main className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 ${activeTab === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <WeatherRadarView navlogData={navlogData} />
        </div>
        {activeTab === 'section' && (
            <div className="absolute inset-0 z-10 bg-slate-950">
                {isLoadingWeather ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-sky-400 gap-3"><IconLoader2 className="animate-spin w-8 h-8" /><span className="font-bold">Fetching Weather Data...</span></div>
                ) : (
                    <CrossSectionView routeData={routeWps} weatherData={weatherData} timeIndex={timeIndex} />
                )}
            </div>
        )}
      </main>
    </div>
  );
}