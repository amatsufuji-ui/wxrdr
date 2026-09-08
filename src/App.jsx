import React, { useState, useEffect, useRef } from 'react';

// =========================================================================
// アイコンコンポーネント (外部依存を減らすためSVGをインライン化)
// =========================================================================
const IconCloudRain = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>;
const IconDownloadCloud = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>;
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
const IconLoader2 = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const IconPlane = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.5 3.5-2.5-.5-1.5 1.5 4 1 1 4 1.5-1.5-.5-2.5 3.5-3.5 5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>;
const IconMap = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>;
const IconActivity = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const IconZoomIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
const IconZoomOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;

// =========================================================================
// 日本国内 訓練・制限空域 データ (AIP準拠の正確な座標)
// =========================================================================
const AIRSPACE_DATA = [
  { 
    name: "R-114 (Fuji McNair)", 
    type: "restricted",
    coords: [[35.4511, 138.7622], [35.4528, 138.8833], [35.2828, 138.9219], [35.2178, 138.9242], [35.2206, 138.7689]] 
  },
  { 
    name: "R-116 (Area Charlie)", 
    type: "restricted",
    coords: [[34.5833, 140.2833], [34.5519, 140.3367], [34.3480, 140.6800], [33.7333, 140.3833], [33.9264, 140.3200], [34.3686, 140.1808], [34.5167, 140.1333]] 
  },
  { 
    name: "T-AREA K (Kilo)", 
    type: "training",
    coords: [[37.16, 135.58], [37.58, 136.01], [37.40, 136.80], [36.70, 136.28], [36.21, 135.58], [36.63, 135.10]] 
  },
  { 
    name: "T-AREA G (Golf)", 
    type: "training",
    coords: [[33.00, 133.50], [33.50, 134.50], [32.80, 135.50], [31.50, 134.80], [31.20, 133.00]] 
  },
  { 
    name: "TRA-6", 
    type: "training",
    coords: [[41.00, 140.50], [41.20, 141.80], [40.50, 142.20], [39.50, 142.00], [39.60, 140.80], [40.20, 140.20]]
  },
  // ▼▼ ここから新規追加: 気象回避困難な主要留保空域 (概略座標) ▼▼
  {
    name: "JDAK-1",
    type: "training",
    coords: [[31.5, 127.5], [32.5, 128.5], [31.5, 129.5], [30.5, 128.5]]
  },
  {
    name: "ITRA-N",
    type: "training",
    coords: [[34.8, 131.0], [35.5, 131.5], [35.5, 132.5], [34.5, 132.0]]
  },
  {
    name: "ITRA-E",
    type: "training",
    coords: [[34.1, 132.2], [34.4, 133.5], [33.7, 133.2], [33.5, 132.5]]
  },
  {
    name: "ITRA-S",
    type: "training",
    coords: [[32.8, 132.5], [32.8, 134.5], [31.5, 134.0], [31.5, 132.0]]
  },
  {
    name: "MOOSE-NORTH",
    type: "training",
    coords: [[27.0, 126.5], [28.0, 127.0], [27.5, 128.0], [26.5, 127.5]]
  },
  {
    name: "MOOSE-SOUTH",
    type: "training",
    coords: [[25.8, 127.2], [26.0, 128.2], [25.0, 128.5], [24.8, 127.5]]
  }
];

// =========================================================================
// ジオメトリ・緯度経度変換ヘルパー
// =========================================================================
const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3440.065; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
};

const getBearing = (lat1, lon1, lat2, lon2) => {
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(rLat2);
    const x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

const getDestination = (lat, lon, brng, distNM) => {
    const R = 3440.065; 
    const rLat = toRad(lat);
    const rLon = toRad(lon);
    const rBrng = toRad(brng);
    const dR = distNM / R;
    const rLat2 = Math.asin(Math.sin(rLat) * Math.cos(dR) + Math.cos(rLat) * Math.sin(dR) * Math.cos(rBrng));
    const rLon2 = rLon + Math.atan2(Math.sin(rBrng) * Math.sin(dR) * Math.cos(rLat), Math.cos(dR) - Math.sin(rLat) * Math.sin(rLat2));
    return [toDeg(rLat2), toDeg(rLon2)];
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
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
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
      if (dir === 'N') { lon = -(lon + 100); } 
      else if (dir === 'E') { lon = lon + 100; } 
      else if (dir === 'W') { lat = -lat; lon = -(lon + 100); } 
      else if (dir === 'S') { lat = -lat; lon = lon + 100; }
      return { lat, lon, name: wpName, isAirport: false };
  }

  const arincMatch2 = wpName.match(/^(\d{4})([NSWE])$/);
  if (arincMatch2) {
      let lat = parseInt(arincMatch2[1].substring(0,2), 10);
      let lon = parseInt(arincMatch2[1].substring(2,4), 10);
      const dir = arincMatch2[2];
      if (dir === 'N') lon = -lon; 
      else if (dir === 'E') lon = lon; 
      else if (dir === 'W') { lat = -lat; lon = -lon; } 
      else if (dir === 'S') { lat = -lat; lon = lon; } 
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
// NAVLOG テキスト解析
// =========================================================================
const parseNavlogText = (text) => {
    let newPlan = [];
    const fNoMatch = text.match(/(?:ANA|JAL|NCA|NH|JL)(\d{2,4}[A-Z]?)/);
    let fNo = fNoMatch ? fNoMatch[0] : "UNKNOWN";
    
    const routeMatch = text.match(/([A-Z]{4})\s*-\s*([A-Z]{4})/);
    const depIcao = routeMatch ? routeMatch[1] : null;
    const destIcao = routeMatch ? routeMatch[2] : null;

    let cleanTextForWp = text;
    const logStartIndex = cleanTextForWp.indexOf('WSCP');
    if (logStartIndex !== -1) cleanTextForWp = cleanTextForWp.substring(logStartIndex);

    cleanTextForWp = cleanTextForWp.replace(/\(\s+/g, '(');
    const tokens = cleanTextForWp.split(/\s+/);
    
    let ignoreList = new Set([
        "ELEV", "RDIS", "TMP", "ZWIND", "SAT", "SPOT", "ETO", "ZTME", "ALT", "FUEL", "POS", "ATO", "DIST", "FL", "RMG", 
        "DEC", "CLM", "LRC", "PROG", "STEP", "CLIMB", "MINTMP", "COMPUTED", "COMPANY", "CLEARANCE", "MW/TP", "WSCP", "NONE", 
        "OAT", "INTENTION", "SPEED", "ROUTE", "DATA", "AWY", "OFP", "LOG", "RMK", "NAV", "FOB", "PLN", "ACT", "DIFF", "MEMO", 
        "TIME", "MAX", "WT", "PAGE", "DIS", "WND", "SHR", "TRK", "INFO", "IFR", "VFR", "TC", "GS", "CTME", "MC", "TAS", "RTME", "WP", "LAT", "LONG"
    ]);
    if (fNoMatch) ignoreList.add(fNoMatch[0]);
    if (depIcao) ignoreList.delete(depIcao);
    if (destIcao) ignoreList.delete(destIcao);

    let pendingLat = null; 
    let pendingLatLon = null;
    let currentFl = 0;

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let cleanToken = token.replace(/^-+/, '').replace(/-+$/, '');

        const flMatch = cleanToken.match(/^([1-5]\d{4})$/);
        if (flMatch) {
            let val = parseInt(flMatch[1], 10);
            if (val >= 10000 && val <= 50000) currentFl = val;
        }
        const flTextMatch = cleanToken.match(/^FL(\d{3})$/);
        if (flTextMatch) currentFl = parseInt(flTextMatch[1], 10) * 100;

        const latMatch = cleanToken.match(/^[NS]\d{4,6}(?:\.\d+)?$/);
        if (latMatch) { pendingLat = cleanToken; continue; }
        
        const lonMatch = cleanToken.match(/^[EW]\d{4,7}(?:\.\d+)?$/);
        if (lonMatch) {
            if (pendingLat) {
                pendingLatLon = pendingLat + cleanToken;
                if (newPlan.length > 0 && !newPlan[newPlan.length - 1].latLon) newPlan[newPlan.length - 1].latLon = pendingLatLon;
            }
            pendingLat = null;
            continue;
        }
        
        const latLonMatch = cleanToken.match(/^[NS]\d{4,6}(?:\.\d+)?[EW]\d{4,7}(?:\.\d+)?$/);
        if (latLonMatch) {
            pendingLatLon = cleanToken;
            if (newPlan.length > 0 && !newPlan[newPlan.length - 1].latLon) newPlan[newPlan.length - 1].latLon = pendingLatLon;
            continue;
        }

        const isCoord = /^[NS]\d{4,5}[EW]\d{4,6}$/.test(cleanToken);
        const isAlphaWp = /^[A-Z][A-Z0-9]{1,5}$/.test(cleanToken) && !ignoreList.has(cleanToken);
        const isArincWp = /^\d{2}[NSWE]\d{2}$/.test(cleanToken);
        const isSpecialWp = ["TOC", "TOD"].includes(cleanToken);

        if (!isCoord && (isAlphaWp || isArincWp || isSpecialWp)) {
            if (newPlan.length > 0 && newPlan[newPlan.length - 1].wp === cleanToken) continue;
            pendingLat = null;
            newPlan.push({ wp: cleanToken, latLon: pendingLatLon, fl: currentFl });
            if (destIcao && cleanToken === destIcao) break; 
            pendingLatLon = null;
        }
    }

    if (newPlan.length >= 2) {
        const last = newPlan[newPlan.length - 1];
        const prev = newPlan[newPlan.length - 2];
        if (last.wp === prev.wp) newPlan.pop();
    }

    let cumDist = 0;
    let lastCoord = null;
    newPlan.forEach((wp) => {
        const coord = parseWaypointToLatLng(wp);
        if (coord) {
            if (lastCoord) cumDist += getDistance(lastCoord.lat, lastCoord.lon, coord.lat, coord.lon);
            else if (depIcao) {
                const depCoord = parseWaypointToLatLng(depIcao);
                if (depCoord) cumDist += getDistance(depCoord.lat, depCoord.lon, coord.lat, coord.lon);
            }
            lastCoord = coord;
        }
        wp.cumDist = cumDist;
    });

    return { newPlan, fNo, depIcao, destIcao };
};

// =========================================================================
// 外部気象API（Open-Meteo GFS）による風・温度の取得と補間処理
// =========================================================================
const fetchWeatherForPlan = async (planData) => {
    if (!planData || !planData.newPlan || planData.newPlan.length === 0) return planData;
    
    const plan = [...planData.newPlan];
    const validPoints = [];
    
    plan.forEach((wp, idx) => {
        const coord = parseWaypointToLatLng(wp);
        if (coord) validPoints.push({ idx, lat: coord.lat, lon: coord.lon });
    });

    if (validPoints.length === 0) return planData;

    const pressureLevels = [1000, 850, 700, 500, 400, 300, 250, 200, 150];
    const variables = pressureLevels.map(l => `temperature_${l}hPa,windspeed_${l}hPa,winddirection_${l}hPa`).join(',');

    const chunkSize = 15;
    const fetchPromises = [];

    for (let i = 0; i < validPoints.length; i += chunkSize) {
        const chunk = validPoints.slice(i, i + chunkSize);
        const lats = chunk.map(pt => pt.lat).join(',');
        const lons = chunk.map(pt => pt.lon).join(',');
        const url = `https://api.open-meteo.com/v1/gfs?latitude=${lats}&longitude=${lons}&hourly=${variables}&timezone=UTC`;
        
        fetchPromises.push(
            fetch(url).then(res => res.json()).then(data => {
                return { chunk, dataArray: Array.isArray(data) ? data : [data] };
            }).catch(err => {
                console.error("Open-Meteo API Error:", err);
                return { chunk, dataArray: [] };
            })
        );
    }

    const results = await Promise.all(fetchPromises);
    
    const hpaToAlt = { 1000: 300, 850: 5000, 700: 10000, 500: 18000, 400: 24000, 300: 30000, 250: 34000, 200: 39000, 150: 45000 };
    const baseAlts = [300, 5000, 10000, 18000, 24000, 30000, 34000, 39000, 45000];

    const interpolateWindFromBase = (baseWind, targetAlt) => {
        if (targetAlt <= baseAlts[0]) {
            const b = baseWind[baseAlts[0]];
            const ratio = Math.max(0.3, targetAlt / baseAlts[0]);
            return { dir: b.dir, spd: b.spd * ratio, temp: b.temp + ((baseAlts[0] - targetAlt)/1000)*2 };
        }
        if (targetAlt >= baseAlts[baseAlts.length - 1]) return baseWind[baseAlts[baseAlts.length - 1]];
        
        let lowerAlt = baseAlts[0], upperAlt = baseAlts[baseAlts.length - 1];
        for (let i = 0; i < baseAlts.length - 1; i++) {
            if (targetAlt >= baseAlts[i] && targetAlt <= baseAlts[i+1]) {
                lowerAlt = baseAlts[i]; upperAlt = baseAlts[i+1]; break;
            }
        }
        const lower = baseWind[lowerAlt];
        const upper = baseWind[upperAlt];
        
        const f = (targetAlt - lowerAlt) / (upperAlt - lowerAlt);
        let dDir = upper.dir - lower.dir;
        if (dDir > 180) dDir -= 360;
        if (dDir < -180) dDir += 360;
        const dir = (lower.dir + dDir * f + 360) % 360;
        const spd = lower.spd + (upper.spd - lower.spd) * f;
        const temp = lower.temp + (upper.temp - lower.temp) * f;
        
        return { dir, spd, temp };
    };

    let forecastTimes = [];
    if (results.length > 0 && results[0].dataArray.length > 0) {
        const wd = results[0].dataArray[0];
        if (wd && wd.hourly && wd.hourly.time) {
            const now = new Date();
            let closestIdx = 0;
            let minDiff = Infinity;
            wd.hourly.time.forEach((tStr, idx) => {
                const t = new Date(tStr + "Z");
                const diff = Math.abs(t - now);
                if (diff < minDiff) { minDiff = diff; closestIdx = idx; }
            });
            for (let i = 0; i <= 12; i++) {
                if (closestIdx + i < wd.hourly.time.length) {
                    forecastTimes.push(wd.hourly.time[closestIdx + i] + "Z");
                }
            }
        }
    }

    results.forEach(({ chunk, dataArray }) => {
        chunk.forEach((pt, j) => {
            const wd = dataArray[j];
            if (wd && wd.hourly && wd.hourly.time) {
                const windsByTime = [];
                forecastTimes.forEach(targetTimeStr => {
                    const targetTime = targetTimeStr.substring(0, targetTimeStr.length - 1);
                    const idx = wd.hourly.time.indexOf(targetTime);
                    if (idx !== -1) {
                        const baseWind = {};
                        pressureLevels.forEach(l => {
                            const alt = hpaToAlt[l];
                            const spdKm = wd.hourly[`windspeed_${l}hPa`][idx];
                            const dir = wd.hourly[`winddirection_${l}hPa`][idx];
                            const temp = wd.hourly[`temperature_${l}hPa`][idx];
                            baseWind[alt] = { dir, spd: spdKm / 1.852, temp };
                        });
                        
                        const interpolatedWinds = {};
                        for (let alt = 0; alt <= 46000; alt += 2000) {
                            interpolatedWinds[alt] = interpolateWindFromBase(baseWind, alt);
                        }
                        windsByTime.push({ time: targetTimeStr, interpolatedWinds });
                    }
                });
                plan[pt.idx].windsByTime = windsByTime;
            }
        });
    });

    return { ...planData, newPlan: plan, forecastTimes };
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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) onFileLoad(e.target.files[0]);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                        <span className="text-sky-400"><IconDownloadCloud /></span>
                        Load Flight Plan
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-2xl leading-none">&times;</button>
                </div>
                
                <div className="flex flex-col gap-3">
                    <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isParsing} 
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        {isParsing ? <IconLoader2 className="animate-spin" /> : <IconFileText />}
                        {isParsing ? 'Reading & Fetching WX Data...' : 'Upload NAVLOG PDF'}
                    </button>
                </div>

                <div className="flex items-center gap-3 py-5">
                    <div className="h-px bg-slate-700 flex-1"></div>
                    <span className="text-xs text-slate-500 font-bold uppercase">OR</span>
                    <div className="h-px bg-slate-700 flex-1"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-sky-500 resize-none font-mono text-xs"
                        placeholder="Paste NAVLOG text here..."
                    ></textarea>
                    <button 
                        onClick={() => { onTextLoad(text); setText(""); }} 
                        disabled={!text.trim() || isParsing} 
                        className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        {isParsing ? <IconLoader2 className="animate-spin" /> : <IconClipboard />}
                        {isParsing ? 'Fetching WX Data...' : 'Load from Text'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 断面図 (Cross Section) コンポーネント
// =========================================================================
const CrossSectionView = ({ navlogData }) => {
    const [hoverData, setHoverData] = useState(null);
    const [timeIndex, setTimeIndex] = useState(0);
    const [zoom, setZoom] = useState(1.5);

    if (!navlogData || !navlogData.newPlan || navlogData.newPlan.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono w-full h-full">
                <IconActivity className="w-12 h-12 mb-4 opacity-50" />
                <p>Load a flight plan to view the vertical profile and weather cross-section.</p>
            </div>
        );
    }

    const plan = navlogData.newPlan;
    const forecastTimes = navlogData.forecastTimes || [];
    
    const getCurrentWind = (wp) => {
        if (!wp.windsByTime || wp.windsByTime.length <= timeIndex) return null;
        return wp.windsByTime[timeIndex].interpolatedWinds;
    };

    const totalDist = plan[plan.length - 1].cumDist || 1;
    const minWidth = 1200 * zoom;
    const calculatedWidth = plan.length * 60 * zoom;
    const width = Math.max(minWidth, calculatedWidth);
    const height = 650 * zoom;
    const padding = { top: 40 * zoom, right: 40 * zoom, bottom: 60 * zoom, left: 60 * zoom }; 

    const mapX = (dist) => padding.left + (dist / totalDist) * (width - padding.left - padding.right);
    const mapY = (alt) => height - padding.bottom - (alt / 50000) * (height - padding.top - padding.bottom);

    const turbulenceAreas = [];
    plan.forEach(wp => {
        const winds = getCurrentWind(wp);
        if (winds) {
            for (let alt = 2000; alt <= 46000; alt += 2000) {
                const w1 = winds[alt - 2000];
                const w2 = winds[alt];
                if (w1 && w2) {
                    const u1 = -w1.spd * Math.sin(w1.dir * Math.PI / 180);
                    const v1 = -w1.spd * Math.cos(w1.dir * Math.PI / 180);
                    const u2 = -w2.spd * Math.sin(w2.dir * Math.PI / 180);
                    const v2 = -w2.spd * Math.cos(w2.dir * Math.PI / 180);
                    
                    const vectorDiff = Math.sqrt(Math.pow(u2 - u1, 2) + Math.pow(v2 - v1, 2));
                    const shearPer1000 = vectorDiff / 2;
                    
                    if (shearPer1000 >= 1.5) { 
                        let color = "rgba(74, 222, 128, 0.4)";
                        if (shearPer1000 >= 3.0) color = "rgba(234, 179, 8, 0.45)";
                        if (shearPer1000 >= 5.0) color = "rgba(239, 68, 68, 0.45)";
                        
                        turbulenceAreas.push({ x: mapX(wp.cumDist), y: mapY(alt - 1000), intensity: shearPer1000, color: color });
                    }
                }
            }
        }
    });

    const isotachs = [];
    const thresholds = [40, 60, 80, 100, 120, 140, 160, 180, 200];
    const alts = [];
    for (let alt = 0; alt <= 46000; alt += 2000) alts.push(alt);

    const getSegments = (tl, tr, bl, br, t, x0, x1, y0, y1) => {
        let state = 0;
        if (tl >= t) state |= 8;
        if (tr >= t) state |= 4;
        if (br >= t) state |= 2;
        if (bl >= t) state |= 1;
        if (state === 0 || state === 15) return [];

        const interp = (v1, v2, c1, c2) => c1 + (c2 - c1) * ((t - v1) / (v2 - v1));
        const top = { x: interp(tl, tr, x0, x1), y: y0 };
        const bottom = { x: interp(bl, br, x0, x1), y: y1 };
        const left = { x: x0, y: interp(tl, bl, y0, y1) };
        const right = { x: x1, y: interp(tr, br, y0, y1) };

        switch(state) {
            case 1: return [[left, bottom]];
            case 2: return [[bottom, right]];
            case 3: return [[left, right]];
            case 4: return [[top, right]];
            case 5: return [[left, top], [bottom, right]];
            case 6: return [[top, bottom]];
            case 7: return [[left, top]];
            case 8: return [[left, top]];
            case 9: return [[top, bottom]];
            case 10: return [[left, bottom], [top, right]];
            case 11: return [[top, right]];
            case 12: return [[left, right]];
            case 13: return [[bottom, right]];
            case 14: return [[left, bottom]];
        }
        return [];
    };

    thresholds.forEach(t => {
        const paths = [];
        const labels = [];
        let labelCounter = 0;

        for (let i = 0; i < plan.length - 1; i++) {
            const w1 = getCurrentWind(plan[i]);
            const w2 = getCurrentWind(plan[i+1]);
            if (!w1 || !w2) continue;

            for (let j = 0; j < alts.length - 1; j++) {
                const altTop = alts[j+1];
                const altBottom = alts[j];
                
                const tl = w1[altTop]?.spd || 0;
                const tr = w2[altTop]?.spd || 0;
                const bl = w1[altBottom]?.spd || 0;
                const br = w2[altBottom]?.spd || 0;

                const x0 = mapX(plan[i].cumDist);
                const x1 = mapX(plan[i+1].cumDist);
                const y0 = mapY(altTop);
                const y1 = mapY(altBottom);

                const segs = getSegments(tl, tr, bl, br, t, x0, x1, y0, y1);
                segs.forEach(seg => {
                    paths.push(`M${seg[0].x},${seg[0].y} L${seg[1].x},${seg[1].y}`);
                    labelCounter++;
                    if (labelCounter % 15 === 7) {
                        labels.push({ x: (seg[0].x + seg[1].x)/2, y: (seg[0].y + seg[1].y)/2, value: t });
                    }
                });
            }
        }
        if (paths.length > 0) isotachs.push({ t, pathD: paths.join(' '), labels });
    });

    const profilePoints = plan.map(wp => `${mapX(wp.cumDist)},${mapY(wp.fl || 0)}`).join(' ');

    const formatZuluTime = (isoString) => {
        const d = new Date(isoString);
        return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}Z`;
    };

    return (
        <div className="w-full h-full bg-slate-950 relative">
            {forecastTimes.length > 0 && (
                <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl z-50 flex flex-col gap-2 pointer-events-auto backdrop-blur-sm">
                    <div className="text-sky-400 font-bold text-[10px] border-b border-slate-700 pb-1 mb-1 tracking-wider">WX FORECAST TIME</div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>NOW</span>
                        <span>+12H</span>
                    </div>
                    <input 
                        type="range" min="0" max={forecastTimes.length - 1} 
                        value={timeIndex} onChange={e => setTimeIndex(Number(e.target.value))} 
                        className="w-48 accent-sky-500 cursor-pointer"
                    />
                    <div className="text-center font-bold text-white text-xs bg-slate-950 rounded py-1 border border-slate-800 tracking-wider">
                        {formatZuluTime(forecastTimes[timeIndex])}
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 rounded-lg shadow-xl z-50 flex overflow-hidden pointer-events-auto backdrop-blur-sm">
                <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2.5 hover:bg-slate-800 text-slate-300 border-r border-slate-700 transition-colors">
                    <IconZoomOut />
                </button>
                <div className="p-2 text-xs font-bold text-slate-300 bg-slate-950 flex items-center justify-center w-14">
                    {Math.round(zoom * 100)}%
                </div>
                <button onClick={() => setZoom(Math.min(4, zoom + 0.5))} className="p-2.5 hover:bg-slate-800 text-slate-300 border-l border-slate-700 transition-colors">
                    <IconZoomIn />
                </button>
            </div>

            <div className="w-full h-full overflow-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #0f172a' }}>
                <svg width={width} height={height} className="block min-w-full font-mono select-none">
                    <defs>
                        <filter id="turb-blur" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation={15 * zoom} />
                        </filter>
                    </defs>

                    {[10000, 20000, 30000, 40000, 50000].map(alt => (
                        <g key={alt}>
                            <line x1={padding.left} y1={mapY(alt)} x2={width - padding.right} y2={mapY(alt)} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={padding.left - 10} y={mapY(alt) + 4} fill="#64748b" textAnchor="end" className="text-[10px]">FL{alt/100}</text>
                        </g>
                    ))}

                    <g filter="url(#turb-blur)">
                        {turbulenceAreas.map((area, i) => (
                            <circle key={`turb-${i}`} cx={area.x} cy={area.y} r={(15 + area.intensity * 5) * Math.sqrt(zoom)} fill={area.color} />
                        ))}
                    </g>

                    {isotachs.map((iso) => (
                        <g key={`iso-${iso.t}`}>
                            <path d={iso.pathD} fill="none" stroke="#0ea5e9" strokeWidth={iso.t >= 100 ? 1.5 : 1} strokeDasharray={iso.t >= 100 ? "none" : "4,4"} opacity="0.8" />
                            {iso.labels.map((lbl, lIdx) => (
                                <g key={`lbl-${iso.t}-${lIdx}`} transform={`translate(${lbl.x}, ${lbl.y})`}>
                                    <rect x="-10" y="-7" width="20" height="14" fill="#0f172a" rx="2" opacity="0.85" />
                                    <text x="0" y="3" fill="#38bdf8" textAnchor="middle" className="text-[9px] font-bold">{lbl.value}</text>
                                </g>
                            ))}
                        </g>
                    ))}

                    {plan.map((wp, i) => {
                        const currentWind = getCurrentWind(wp);
                        return (
                        <g key={`wp-${i}`}>
                            <line x1={mapX(wp.cumDist)} y1={padding.top} x2={mapX(wp.cumDist)} y2={height - padding.bottom + 15} stroke="#1e293b" strokeWidth="1" />
                            
                            <text 
                                x={mapX(wp.cumDist)} 
                                y={height - padding.bottom + 25} 
                                fill="#cbd5e1" 
                                textAnchor="end" 
                                transform={`rotate(-45, ${mapX(wp.cumDist)}, ${height - padding.bottom + 25})`}
                                className="font-bold text-[11px]"
                            >
                                {wp.wp}
                            </text>

                            {currentWind && Object.keys(currentWind).map(altStr => {
                                const alt = parseInt(altStr, 10);
                                if (alt > 45000) return null;
                                const data = currentWind[alt];
                                if (!data) return null;
                                
                                const isHovered = hoverData && hoverData.wp === wp.wp && hoverData.alt === alt;
                                
                                return (
                                    <g 
                                        key={`wind-${alt}`} 
                                        transform={`translate(${mapX(wp.cumDist)}, ${mapY(alt)})`}
                                        onMouseEnter={(e) => setHoverData({ wp: wp.wp, alt, wind: data, x: e.clientX, y: e.clientY })}
                                        onMouseMove={(e) => setHoverData({ wp: wp.wp, alt, wind: data, x: e.clientX, y: e.clientY })}
                                        onMouseLeave={() => setHoverData(null)}
                                        className="cursor-pointer pointer-events-auto"
                                    >
                                        <circle cx="0" cy="0" r="14" fill="transparent" />
                                        <g transform={`rotate(${data.dir})`} opacity={isHovered ? "1" : "0.5"}>
                                            <line x1="0" y1="-6" x2="0" y2="6" stroke={isHovered ? "#e0f2fe" : "#94a3b8"} strokeWidth="1.5" />
                                            <polygon points="-3,-2 0,-8 3,-2" fill={isHovered ? "#e0f2fe" : "#94a3b8"} />
                                        </g>
                                    </g>
                                )
                            })}
                        </g>
                    )})}

                    <polyline points={profilePoints} fill="none" stroke="#d946ef" strokeWidth="2.5" />
                    {plan.map((wp, i) => (
                        wp.fl > 0 ? (
                            <polygon 
                                key={`m-${i}`}
                                points={`${mapX(wp.cumDist)},${mapY(wp.fl)-4} ${mapX(wp.cumDist)-4},${mapY(wp.fl)+4} ${mapX(wp.cumDist)+4},${mapY(wp.fl)+4}`}
                                fill="#d946ef"
                            />
                        ) : null
                    ))}
                </svg>

                {hoverData && (
                    <div 
                        className="fixed z-[9999] bg-slate-800/95 border border-slate-600 p-2.5 rounded shadow-xl text-xs pointer-events-none font-mono transition-none"
                        style={{ left: hoverData.x + 15, top: hoverData.y + 15 }}
                    >
                        <div className="font-bold text-sky-400 mb-1.5 border-b border-slate-700 pb-1.5">
                            {hoverData.wp} - {hoverData.alt === 0 ? "SFC" : `FL${String(hoverData.alt/100).padStart(3, '0')}`}
                        </div>
                        <div className="text-slate-200">WIND: {String(Math.round(hoverData.wind.dir)).padStart(3, '0')}° / <span className="text-amber-300 font-bold">{Math.round(hoverData.wind.spd)} kt</span></div>
                        <div className="text-slate-200 mt-0.5">TEMP: <span className={hoverData.wind.temp > 0 ? "text-rose-400" : "text-sky-300"}>{hoverData.wind.temp > 0 ? '+' : ''}{Math.round(hoverData.wind.temp)}°C</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};

// =========================================================================
// メインマップコンポーネント
// =========================================================================
const formatRvTime = (unixTime) => {
  if (!unixTime) return '';
  const d = new Date(unixTime * 1000);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}Z`;
};

const formatJmaTime = (basetime) => {
  if (!basetime || basetime.length < 12) return '';
  return `${basetime.substring(8, 10)}:${basetime.substring(10, 12)}Z`;
};

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
  const [showFIR, setShowFIR] = useState(false);
  const [showTrainingAirspace, setShowTrainingAirspace] = useState(false);
  
  const [opacity, setOpacity] = useState(0.65);
  const [deviationNM, setDeviationNM] = useState(0); 
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [rvRadarFrames, setRvRadarFrames] = useState([]);
  const [rvSatFrames, setRvSatFrames] = useState([]);
  const [jmaFrames, setJmaFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  
  const [globalFIRData, setGlobalFIRData] = useState(null);

  const himawariLayerRef = useRef(null);
  const goesLayerRef = useRef(null); 
  const meteosatLayerRef = useRef(null); 
  const arcticLayerRef = useRef(null);
  const globalIrLayerRef = useRef(null);
  const radarLayerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => { setLastFetchTime(Date.now()); }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showFIR && !globalFIRData) {
      fetch('https://raw.githubusercontent.com/vatsimnetwork/vatspy-data-project/master/Boundaries.geojson')
        .then(res => res.json())
        .then(data => setGlobalFIRData(data))
        .catch(err => console.error("Failed to load FIR GeoJSON", err));
    }
  }, [showFIR, globalFIRData]);

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
          const map = L.map(mapContainerRef.current, { center: [35.0, 135.0], zoom: 3, zoomControl: false, attributionControl: false });
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          const darkBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, subdomains: 'abcd' }).addTo(map);
          mapInstanceRef.current = map;
          layersRef.current.base = darkBase;

          const errImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          const style = document.createElement('style');
          style.innerHTML = `
            .sat-blend { mix-blend-mode: screen; }
            .nav-tooltip { background-color: rgba(15, 23, 42, 0.85) !important; border: 1px solid rgba(56, 189, 248, 0.4) !important; color: #e0f2fe !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; border-radius: 4px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.5) !important; }
            .fir-tooltip { background-color: rgba(15, 23, 42, 0.9) !important; border: 1px solid #fb923c !important; color: #fed7aa !important; font-weight: bold; font-size: 12px; padding: 4px 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.5) !important; }
            .training-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; color: #f43f5e !important; font-weight: bold; font-size: 11px; text-shadow: 1px 1px 2px black; }
            .restricted-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; color: #fde047 !important; font-weight: bold; font-size: 11px; text-shadow: 1px 1px 2px black; }
          `;
          document.head.appendChild(style);

          meteosatLayerRef.current = L.tileLayer.wms('https://view.eumetsat.int/geoserver/ows', { layers: 'msg_fes:ir108,msg_iodc:ir108', format: 'image/png', transparent: true, version: '1.3.0', opacity: opacity, zIndex: 2, className: 'sat-blend' }).addTo(map);
          arcticLayerRef.current = L.tileLayer.wms('https://realearth.ssec.wisc.edu/wms/', { layers: 'globalir', format: 'image/png', transparent: true, opacity: opacity, zIndex: 1, className: 'sat-blend' }).addTo(map);
          himawariLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 2, className: 'sat-blend' }).addTo(map);
          goesLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 2, className: 'sat-blend' }).addTo(map);
          globalIrLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 1, className: 'sat-blend' }).addTo(map);
          radarLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 3 }).addTo(map);
          
          setIsMapLoaded(true);
        }
      } catch (err) { console.error("Map init failed", err); }
    };
    loadLeaflet();
    return () => { isMounted = false; if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
      fetch('https://api.rainviewer.com/public/weather-maps.json', { cache: 'no-store' }).then(res => res.json()).then(data => {
          const host = data.host || 'https://tilecache.rainviewer.com';
          if (data.radar && data.radar.past) setRvRadarFrames(data.radar.past.map(f => ({ ...f, host })));
          if (data.satellite && data.satellite.infrared) setRvSatFrames(data.satellite.infrared.map(f => ({ ...f, host })));
      }).catch(err => console.error(err));

      fetch('https://www.jma.go.jp/bosai/himawari/data/satimg/targetTimes_fd.json', { cache: 'no-store' }).then(res => res.json()).then(data => {
          if (Array.isArray(data) && data.length > 0) setJmaFrames(data.slice(-24));
      }).catch(err => console.error(err));
  }, [lastFetchTime]);

  useEffect(() => {
      setIsPlaying(false);
      let activeLengths = [];
      if (showHimawari) activeLengths.push(jmaFrames.length);
      if (showGlobalIr) activeLengths.push(rvSatFrames.length);
      if (showRadar) activeLengths.push(rvRadarFrames.length);
      const mFrames = activeLengths.length > 0 ? Math.max(...activeLengths, 1) : 1;
      setFrameIndex(mFrames - 1);
  }, [showHimawari, showGlobalIr, showRadar, jmaFrames.length, rvSatFrames.length, rvRadarFrames.length]);

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;
    setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 100);
    const ro = new ResizeObserver(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); });
    if (mapContainerRef.current) ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, [isMapLoaded]);

  let activeLengths = [];
  if (showHimawari) activeLengths.push(jmaFrames.length);
  if (showGlobalIr) activeLengths.push(rvSatFrames.length);
  if (showRadar) activeLengths.push(rvRadarFrames.length);
  const maxFrames = activeLengths.length > 0 ? Math.max(...activeLengths, 1) : 1;
  const safeFrameIndex = Math.max(0, Math.min(frameIndex, maxFrames - 1));
  const getLayerFrameIndex = (len) => (len <= 1 || maxFrames <= 1) ? len - 1 : Math.floor((safeFrameIndex / (maxFrames - 1)) * (len - 1));

  useEffect(() => {
    let timer;
    if (isPlaying) timer = setInterval(() => { setFrameIndex(prev => maxFrames <= 1 ? 0 : (prev + 1) % maxFrames); }, 1000); 
    return () => clearInterval(timer);
  }, [isPlaying, maxFrames]);

  useEffect(() => {
    if (!isMapLoaded || !himawariLayerRef.current) return;
    const errImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    let himawariUrl = errImg;
    if (showHimawari && jmaFrames.length > 0) {
        const frame = jmaFrames[Math.max(0, Math.min(getLayerFrameIndex(jmaFrames.length), jmaFrames.length - 1))];
        if (frame && frame.basetime && frame.validtime) himawariUrl = `https://www.jma.go.jp/bosai/himawari/data/satimg/${frame.basetime}/fd/${frame.validtime}/SND/ETC/{z}/{x}/{y}.jpg`;
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
    if (layersRef.current.firGroup) map.removeLayer(layersRef.current.firGroup);
    if (layersRef.current.trainingGroup) map.removeLayer(layersRef.current.trainingGroup);

    // FIR Layers (Global)
    const firGroup = L.layerGroup();
    if (showFIR && globalFIRData) {
      const firLayer = L.geoJSON(globalFIRData, {
        style: { color: '#fb923c', weight: 1.5, opacity: 0.7, fillOpacity: 0.05, dashArray: '4, 4' },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.id) {
            layer.bindTooltip(`${feature.properties.id} FIR`, { 
              permanent: false, 
              direction: 'center', 
              className: 'fir-tooltip' 
            });
          }
        }
      });
      firLayer.addTo(firGroup);
      firGroup.addTo(map);
    }
    layersRef.current.firGroup = firGroup;

    // Training & Restricted Airspace Layers (Japan)
    const trainingGroup = L.layerGroup();
    if (showTrainingAirspace) {
      AIRSPACE_DATA.forEach(area => {
        const isRestricted = area.type === 'restricted';
        const color = isRestricted ? '#eab308' : '#f43f5e';
        const fillColor = isRestricted ? '#eab308' : '#f43f5e';
        
        L.polygon(area.coords, { 
          color: color, 
          weight: 2, 
          fillColor: fillColor, 
          fillOpacity: 0.15 
        })
        .bindTooltip(area.name, { 
           permanent: true, 
           direction: 'center', 
           className: isRestricted ? 'restricted-tooltip' : 'training-tooltip' 
        })
        .addTo(trainingGroup);
      });
      trainingGroup.addTo(map);
    }
    layersRef.current.trainingGroup = trainingGroup;

    // Navlog Route Layer
    if (!showNavlogRoute || !navlogData || (!navlogData.newPlan && !navlogData.depIcao)) return;

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
        navlogGroup.addLayer(L.circleMarker(latlngs[index], {
          radius: isAp ? 6 : 4, color: isAp ? '#0ea5e9' : '#ffffff', fillColor: isAp ? '#e0f2fe' : '#38bdf8', fillOpacity: 1.0, weight: 2
        }).bindTooltip(pt.name, { permanent: true, direction: 'right', className: 'nav-tooltip' }));
      });

      if (latlngs.length > 1) map.fitBounds(flightPath.getBounds(), { padding: [50, 50] });
      else if (latlngs.length === 1) map.setView(latlngs[0], 6);
    }
    navlogGroup.addTo(map);
    layersRef.current.navlogGroup = navlogGroup;
  }, [isMapLoaded, navlogData, showNavlogRoute, deviationNM, showFIR, globalFIRData, showTrainingAirspace]);

  let currentTimeLabel = "OFF", activeLayerName = "No Layer Selected";
  if (showHimawari && jmaFrames.length > 0) {
      const frame = jmaFrames[Math.max(0, Math.min(getLayerFrameIndex(jmaFrames.length), jmaFrames.length - 1))];
      if (frame) { currentTimeLabel = formatJmaTime(frame.validtime || frame.basetime); activeLayerName = "JMA Himawari-8/9 Cloud Top" + (showGoes || showMeteosat || showArctic ? " & Others" : ""); }
  } else if (showGlobalIr && rvSatFrames.length > 0) {
      const frame = rvSatFrames[Math.max(0, Math.min(getLayerFrameIndex(rvSatFrames.length), rvSatFrames.length - 1))];
      if (frame) { currentTimeLabel = formatRvTime(frame.time); activeLayerName = "RainViewer Global IR"; }
  } else if (showRadar && rvRadarFrames.length > 0) {
      const frame = rvRadarFrames[Math.max(0, Math.min(getLayerFrameIndex(rvRadarFrames.length), rvRadarFrames.length - 1))];
      if (frame) { currentTimeLabel = formatRvTime(frame.time); activeLayerName = "RainViewer Radar Only"; }
  } else if (showGoes || showMeteosat || showArctic) {
      currentTimeLabel = "LIVE"; activeLayerName = [showGoes?"GOES":"", showMeteosat?"Meteosat":"", showArctic?"SSEC(Arctic)":""].filter(Boolean).join(" + ");
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 relative overflow-hidden text-slate-200">
      <div className="w-full flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800 text-xs flex-wrap gap-2 z-[2000] shadow-md relative">
        <div className="flex items-center gap-3 flex-wrap text-[11px] w-full lg:w-auto overflow-x-auto">
          {maxFrames > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-sky-400 hover:text-white flex items-center justify-center w-4 h-4 mr-1" title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <input type="range" min="0" max={maxFrames - 1} value={safeFrameIndex} onChange={(e) => { setIsPlaying(false); setFrameIndex(Number(e.target.value)); }} className="w-24 accent-sky-400 cursor-pointer" />
            </div>
          )}

          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
            <span className="text-slate-400 font-bold">Dev:</span>
            <select value={deviationNM} onChange={(e) => setDeviationNM(Number(e.target.value))} className="bg-transparent text-white font-mono focus:outline-none cursor-pointer">
              <option value={0} className="bg-slate-900">OFF</option><option value={10} className="bg-slate-900">10 NM</option><option value={20} className="bg-slate-900">20 NM</option>
              <option value={30} className="bg-slate-900">30 NM</option><option value={40} className="bg-slate-900">40 NM</option><option value={50} className="bg-slate-900">50 NM</option><option value={60} className="bg-slate-900">60 NM</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
            <span className="text-slate-400 font-bold">Trans:</span>
            <input type="range" min="0.1" max="1.0" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-16 accent-sky-400 cursor-pointer" />
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700 flex-wrap shrink-0">
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showHimawari} onChange={(e) => setShowHimawari(e.target.checked)} className="accent-sky-500 rounded" /><span>HIMAWARI</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showGoes} onChange={(e) => setShowGoes(e.target.checked)} className="accent-sky-500 rounded" /><span>GOES</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showMeteosat} onChange={(e) => setShowMeteosat(e.target.checked)} className="accent-sky-500 rounded" /><span>METEOSAT</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showArctic} onChange={(e) => setShowArctic(e.target.checked)} className="accent-sky-500 rounded" /><span className="font-bold text-sky-200">ARCTIC</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2">
              <input type="checkbox" checked={showGlobalIr} onChange={(e) => setShowGlobalIr(e.target.checked)} className="accent-sky-500 rounded" /><span>RV-IR</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showRadar} onChange={(e) => setShowRadar(e.target.checked)} className="accent-sky-500 rounded" /><span>RADAR</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2">
              <input type="checkbox" checked={showNavlogRoute} onChange={(e) => setShowNavlogRoute(e.target.checked)} className="accent-sky-500 rounded" /><span className="font-bold text-sky-400">Route</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2">
              <input type="checkbox" checked={showFIR} onChange={(e) => setShowFIR(e.target.checked)} className="accent-orange-500 rounded" />
              <span className="font-bold text-orange-400">FIR</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showTrainingAirspace} onChange={(e) => setShowTrainingAirspace(e.target.checked)} className="accent-rose-500 rounded" />
              <span className="font-bold text-rose-400">空域(R/T)</span>
            </label>
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
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [toastData, setToastData] = useState({ message: '', visible: false });
  const [viewMode, setViewMode] = useState('map');

  const showToast = (message) => {
    setToastData({ message, visible: true });
    setTimeout(() => setToastData({ message: '', visible: false }), 4000);
  };

  const processAndFetchWeather = async (parsedData) => {
      if (parsedData.newPlan.length > 0) {
          setIsLoadModalOpen(false);
          showToast(`ルートを読み込みました。風・温度データを取得中...`);
          setIsParsingPdf(true);
          
          try {
              const enhancedData = await fetchWeatherForPlan(parsedData);
              setNavlogData(enhancedData);
              showToast(`データ取得完了: ${parsedData.depIcao} -> ${parsedData.destIcao}`);
          } catch (err) {
              console.error(err);
              setNavlogData(parsedData);
              showToast(`気象データの取得に失敗しました。ルートのみ表示します。`);
          } finally {
              setIsParsingPdf(false);
          }
      } else { 
          setIsParsingPdf(false);
          showToast('フライトプランの読み取りに失敗しました。PDFの形式を確認してください。'); 
      }
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
        const typedarray = new Uint8Array(event.target.result);
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(" ") + "\n";
        }

        const parsedData = parseNavlogText(fullText);
        await processAndFetchWeather(parsedData);
        
      } catch (err) { 
        console.error(err); 
        showToast('PDFの解析に失敗しました。'); 
        setIsParsingPdf(false); 
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTextLoad = async (text) => {
      setIsParsingPdf(true);
      const parsed = parseNavlogText(text);
      if (parsed && parsed.newPlan.length > 0) {
          await processAndFetchWeather(parsed);
      } else {
          showToast('テキストの解析に失敗しました。');
          setIsParsingPdf(false);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
      <Toast message={toastData.message} visible={toastData.visible} onClose={() => setToastData({ ...toastData, visible: false })} />
      
      <LoadDataModal 
        isOpen={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)} 
        isParsing={isParsingPdf}
        onFileLoad={handlePdfUpload}
        onTextLoad={handleTextLoad}
      />

      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sky-400 bg-sky-900/30 p-1.5 rounded-lg border border-sky-800">
            <IconPlane />
          </span>
          <h1 className="text-white font-black text-lg tracking-wide hidden sm:block">GLOBAL WX RADAR</h1>
        </div>

        <div className="flex bg-slate-950/60 p-1 rounded-lg border border-slate-700/50 shadow-inner">
          <button 
            onClick={() => setViewMode('map')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${viewMode === 'map' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <IconMap /> <span className="hidden md:inline">Map</span>
          </button>
          <button 
            onClick={() => setViewMode('xsec')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${viewMode === 'xsec' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <IconActivity /> <span className="hidden md:inline">Cross Section</span>
          </button>
        </div>

        <button 
            onClick={() => setIsLoadModalOpen(true)} 
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg border border-sky-400/30 text-sm shrink-0"
        >
            <IconDownloadCloud />
            <span className="hidden sm:inline">Load Plan</span>
        </button>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className={`w-full h-full absolute inset-0 ${viewMode === 'map' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <WeatherRadarView navlogData={navlogData} />
        </div>
        <div className={`w-full h-full absolute inset-0 ${viewMode === 'xsec' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <CrossSectionView navlogData={navlogData} />
        </div>
      </main>
    </div>
  );
}