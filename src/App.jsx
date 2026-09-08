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
const IconMap = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
const IconActivity = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconZoomIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;

// =========================================================================
// 空域データ (AIRSPACE_DATA)
// メモ：高度情報はホバー時のツールチップ表示用。
// =========================================================================
const AIRSPACE_DATA = [
    {
        name: 'ITRA-E',
        type: 'restricted',
        alt: 'FL250',
        coords: [
            [36.1536, 131.5753], [35.8286, 132.2222], [35.5706, 132.1753], [35.5525, 130.7639]
        ]
    },
    {
        name: 'ITRA-N1',
        type: 'restricted',
        alt: 'FL180',
        coords: [
            [35.5706, 132.1753], [35.3500, 132.1353], [35.3269, 132.2653], [35.1164, 130.1892], [35.5525, 130.7639]
        ]
    },
    {
        name: 'ITRA-N2',
        type: 'restricted',
        alt: 'FL800',
        coords: [
            [35.3269, 132.2653], [35.3014, 132.3139], [35.2919, 132.3372], [35.0375, 131.9897],
            [34.7236, 131.3769], [34.6864, 130.8808], [34.7253, 130.8669], [34.8531, 130.5850],
            [34.7697, 130.5253], [34.9953, 130.0311], [35.1164, 130.1892]
        ]
    },
    {
        name: 'ITRA-N3',
        type: 'restricted',
        alt: 'FL240',
        coords: [
            [35.3014, 132.3139], [35.2919, 132.3372], [35.0375, 131.9897], [34.7236, 131.3769],
            [34.7208, 131.3386], [35.0353, 131.6914], [35.2103, 131.7392], [35.2906, 132.2003]
        ]
    },
    {
        name: 'ITRA-S (S10-S25)',
        type: 'restricted',
        alt: 'S10: FL800, S11-16: UNL, S20-25: FL450',
        coords: [
            [32.8981, 135.0139], [32.7803, 134.5333], [32.6200, 134.0475], [32.5897, 133.9867],
            [32.5667, 133.9397], [32.3019, 133.4381], [32.0536, 132.6308], [32.0036, 132.5808],
            [31.5119, 132.1558], [30.9519, 131.6467], [30.4875, 131.2867], [30.2008, 131.5011],
            [29.9272, 131.7381], [30.5222, 132.5867], [30.9178, 133.1606], [31.1425, 133.4906],
            [31.5056, 134.0289], [31.8147, 134.4939], [32.1533, 135.0094], [32.5536, 135.0139],
            [32.5911, 135.0139]
        ]
    },
    {
        name: 'ITRA-S (S30-S33)',
        type: 'restricted',
        alt: 'FL250',
        coords: [
            [32.1533, 135.0094], [31.3019, 135.0000], [30.5547, 133.9217], [30.3222, 133.5917],
            [29.9183, 133.0250], [29.4689, 132.4039], [29.9272, 131.7381], [30.5222, 132.5867],
            [30.9178, 133.1606], [31.1425, 133.4906], [31.5056, 134.0289], [31.8147, 134.4939]
        ]
    },
    // 沖縄訓練空域 (AIP SUP 005/26 準拠)
    {
        name: 'MOOSE NORTH',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [26.9758, 124.9558], [28.4786, 127.0542], [27.8033, 127.3211],
            [27.2986, 127.2208], [27.0842, 126.9942], [26.6953, 125.2111]
        ]
    },
    {
        name: 'MOOSE SOUTH (LO/HI)',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [26.6953, 125.2111], [27.0842, 126.9942], [26.2675, 126.1431], [26.2389, 125.6219]
        ]
    },
    {
        name: 'TIGER WEST',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [26.7900, 129.0672], [27.4686, 129.5064], [27.6461, 130.5586], [26.3692, 128.5783]
        ]
    },
    {
        name: 'TIGER CENTER',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [26.3692, 128.5783], [26.7900, 129.0672], [27.6461, 130.5586],
            [27.6431, 130.9317], [27.6281, 132.0375], [27.4436, 131.9947], [26.1822, 130.8433]
        ]
    },
    {
        name: 'TIGER EAST',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [27.4436, 131.9947], [26.7961, 131.8456], [26.4572, 131.5717], [26.1417, 131.2814], [26.1822, 130.8433]
        ]
    },
    {
        name: 'LION WEST',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [25.4597, 128.0600], [24.3797, 127.3061], [24.4653, 127.0953], [25.3761, 127.7264]
        ]
    },
    {
        name: 'LION CENTER',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [25.5186, 128.1592], [24.3911, 129.4583], [23.7003, 128.9464], [24.3797, 127.3061], [25.4597, 128.0600]
        ]
    },
    {
        name: 'EAGLE CENTER',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [25.8931, 128.5000], [25.8103, 129.0386], [25.7375, 129.4256], [25.7458, 130.4036],
            [25.7397, 130.5003], [24.6639, 129.6653], [24.3911, 129.4583], [25.5186, 128.1592]
        ]
    },
    {
        name: 'EAGLE EAST',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [25.7397, 130.5003], [25.7108, 130.9244], [25.1539, 130.4914], [24.9411, 130.2981], [24.6639, 129.6653]
        ]
    },
    {
        name: 'EDIX-TIGER',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [28.2047, 130.9386], [28.1892, 132.0503], [27.6281, 132.0375], [27.6431, 130.9317]
        ]
    },
    {
        name: 'EDIX-LION',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [24.4856, 127.0450], [24.0839, 128.0275], [23.5711, 127.7769], [23.9714, 126.7978]
        ]
    },
    {
        name: 'EDIX-MOOSE',
        type: 'training',
        alt: 'SFC - UNL',
        coords: [
            [28.6919, 126.4278], [28.2922, 126.7886], [27.6767, 125.9225], [28.0700, 125.5647]
        ]
    },
    // 国内その他訓練空域
    {
        name: 'JDA K-1-1',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [35.1372, 138.6872], [34.9222, 138.2611], [34.8750, 138.7667]
        ]
    },
    {
        name: 'JDA K-1-2',
        type: 'training',
        alt: 'SFC - FL260',
        coords: [
            [35.1372, 138.6872], [34.8750, 138.7667], [34.8686, 138.3808], [35.0517, 138.2372]
        ]
    },
    {
        name: 'JDA K-1-3',
        type: 'training',
        alt: 'SFC - FL310',
        coords: [
            [35.0517, 138.2372], [34.8686, 138.3808], [34.1667, 138.0000], [34.2500, 137.5000]
        ]
    },
    {
        name: 'JDA K-2',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [34.1667, 138.0000], [34.8686, 138.3808], [34.8750, 138.7667], [33.5000, 138.5000], [33.5000, 137.5000]
        ]
    },
    {
        name: 'Shizuhama',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [35.1411, 138.6919], [35.1367, 138.5792], [35.0517, 138.2372], [34.9311, 138.2653],
            [34.8686, 138.3808], [34.8750, 138.7667], [34.8389, 138.7803]
        ]
    },
    {
        name: 'Hyakuri Nr.1-6',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [36.2500, 142.0564], [36.7011, 142.3533], [37.7817, 142.6861], [38.1694, 142.6861],
            [38.1697, 142.9908], [36.2500, 142.9908]
        ]
    },
    {
        name: 'West of Kyushu',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [32.0022, 127.3875], [31.6036, 126.3169], [30.0036, 125.4186], [30.0053, 127.3911], [30.3692, 127.9981]
        ]
    },
    {
        name: 'East of Tohoku Nr.1-5',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [38.1697, 142.9908], [39.0000, 144.3333], [40.8333, 144.9833], [41.3333, 142.3333], [40.5000, 142.0000], [38.1694, 142.6861]
        ]
    },
    {
        name: 'Southeast of Tohoku Nr.1-5',
        type: 'training',
        alt: 'SFC - FL240',
        coords: [
            [36.2500, 142.9908], [38.1697, 142.9908], [38.1697, 144.9833], [37.3000, 144.9833], [37.1833, 143.9833], [36.2500, 143.9833]
        ]
    }
];

// =========================================================================
// 緯度経度変換・ジオメトリヘルパー
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

const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;

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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3440.065; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const calculateOffsetLine = (latlngs, offsetNM) => {
    if (latlngs.length < 2) return [];
    const offsetPoints = [];
    for (let i = 0; i < latlngs.length; i++) {
        let brng;
        if (i === 0) {
            brng = getBearing(latlngs[i][0], latlngs[i][1], latlngs[i+1][0], latlngs[i+1][1]);
        } else if (i === latlngs.length - 1) {
            brng = getBearing(latlngs[i-1][0], latlngs[i-1][1], latlngs[i][0], latlngs[i][1]);
        } else {
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
        if (prevLon - currLon > 180) {
            offset += 360; currLon += 360;
        } else if (currLon - prevLon > 180) {
            offset -= 360; currLon -= 360;
        }
        latlngs[i][1] = currLon;
    }
    return latlngs;
};

// 180度経線（アンチメリディアン）をまたぐGeoJSONポリゴン・ラインの描画崩れを防ぐ関数
const fixAntiMeridian = (feature) => {
    const fixLine = (coords) => {
        let offset = 0;
        for (let i = 1; i < coords.length; i++) {
            let prevLon = coords[i-1][0];
            let lon = coords[i][0] + offset;
            if (lon - prevLon > 180) {
                offset -= 360; lon -= 360;
            } else if (prevLon - lon > 180) {
                offset += 360; lon += 360;
            }
            coords[i][0] = lon;
        }
    };
    if (feature.geometry) {
        if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach(fixLine);
        } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => polygon.forEach(fixLine));
        } else if (feature.geometry.type === 'LineString') {
            fixLine(feature.geometry.coordinates);
        } else if (feature.geometry.type === 'MultiLineString') {
            feature.geometry.coordinates.forEach(fixLine);
        }
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
    if (logStartIndex !== -1) {
        cleanTextForWp = cleanTextForWp.substring(logStartIndex);
    } 

    cleanTextForWp = cleanTextForWp.replace(/\(\s+/g, '(');
    const tokens = cleanTextForWp.split(/\s+/);
    
    let ignoreList = new Set([
        "ELEV", "RDIS", "TMP", "ZWIND", "SAT", "SPOT", "ETO", "ZTME", "ALT", "FUEL", "POS", "ATO", "DIST", "FL", "RMG", 
        "RJTT", "KJFK", "KEWR", "PANC", "CYVR", "RJCC", "DEC", "CLM", "LRC", "PROG", "STEP", "CLIMB", "MINTMP", 
        "COMPUTED", "COMPANY", "CLEARANCE", "MW/TP", "WSCP", "NONE", "OAT", "INTENTION", "SPEED", "ROUTE", "DATA", 
        "AWY", "OFP", "LOG", "RMK", "NAV", "FOB", "PLN", "ACT", "DIFF", "MEMO", "TIME", "MAX", "WT", "PAGE", "DIS", 
        "WND", "SHR", "TRK", "INFO", "IFR", "VFR", 
        "TC", "GS", "CTME", "MC", "TAS", "RTME", "WP", "LAT", "LONG", "LAT/LONG"
    ]);
    
    if (fNoMatch) ignoreList.add(fNoMatch[0]);
    if (routeMatch) {
        ignoreList.delete(routeMatch[1]);
        ignoreList.delete(routeMatch[2]);
    }

    let pendingLat = null; 
    let pendingLatLon = null;
    let currentFl = 0;

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let cleanToken = token.replace(/^-+/, '').replace(/-+$/, '');

        // 高度 (FL) の抽出
        const flMatch = cleanToken.match(/^(\d{3,5})$/);
        if (flMatch && parseInt(flMatch[1], 10) >= 100 && parseInt(flMatch[1], 10) <= 600) {
            currentFl = parseInt(flMatch[1], 10);
            if (currentFl > 600) currentFl = currentFl / 100;
        }

        const latMatch = cleanToken.match(/^[NS]\d{4,6}(?:\.\d+)?$/);
        if (latMatch) {
            pendingLat = cleanToken;
            continue;
        }
        const lonMatch = cleanToken.match(/^[EW]\d{4,7}(?:\.\d+)?$/);
        if (lonMatch) {
            if (pendingLat) {
                pendingLatLon = pendingLat + cleanToken;
                if (newPlan.length > 0 && !newPlan[newPlan.length - 1].latLon) {
                    newPlan[newPlan.length - 1].latLon = pendingLatLon;
                }
            }
            pendingLat = null;
            continue;
        }
        const latLonMatch = cleanToken.match(/^[NS]\d{4,6}(?:\.\d+)?[EW]\d{4,7}(?:\.\d+)?$/);
        if (latLonMatch) {
            pendingLatLon = cleanToken;
            if (newPlan.length > 0 && !newPlan[newPlan.length - 1].latLon) {
                newPlan[newPlan.length - 1].latLon = pendingLatLon;
            }
            continue;
        }

        const isCoord = /^[NS]\d{4,5}[EW]\d{4,6}$/.test(cleanToken);
        const isAlphaWp = /^[A-Z][A-Z0-9]{1,5}$/.test(cleanToken) && !ignoreList.has(cleanToken);
        const isArincWp = /^\d{2}[NSWE]\d{2}$/.test(cleanToken);
        const isSpecialWp = ["TOC", "TOD"].includes(cleanToken);

        if (!isCoord && (isAlphaWp || isArincWp || isSpecialWp)) {
            if (newPlan.length > 0 && newPlan[newPlan.length - 1].wp === cleanToken) {
                if (currentFl > 0) newPlan[newPlan.length - 1].fl = currentFl;
                continue;
            }
            pendingLat = null;
            newPlan.push({ 
              wp: cleanToken, 
              latLon: pendingLatLon,
              fl: currentFl
            });
            
            if (destIcao && cleanToken === destIcao) break; 
            pendingLatLon = null;
        }
    }

    if (newPlan.length >= 2) {
        const last = newPlan[newPlan.length - 1];
        const prev = newPlan[newPlan.length - 2];
        if (last.wp === prev.wp) newPlan.pop();
    }

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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileLoad(e.target.files[0]);
        }
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
                        {isParsing ? 'Reading PDF...' : 'Upload NAVLOG PDF'}
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
                        disabled={!text.trim()} 
                        className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        <span><IconClipboard /></span>
                        Load from Text
                    </button>
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

  // 衛星とレーダーのトグル状態
  const [showHimawari, setShowHimawari] = useState(true);
  const [showGoes, setShowGoes] = useState(true); 
  const [showMeteosat, setShowMeteosat] = useState(true); 
  const [showArctic, setShowArctic] = useState(true); 
  const [showGlobalIr, setShowGlobalIr] = useState(false); 
  const [showRadar, setShowRadar] = useState(true);
  const [showNavlogRoute, setShowNavlogRoute] = useState(true);
  const [showAirspace, setShowAirspace] = useState(true);
  const [showFir, setShowFir] = useState(false);
  
  const [opacity, setOpacity] = useState(0.65);
  const [deviationNM, setDeviationNM] = useState(0); 
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // タイムスライダー用ステート
  const [rvRadarFrames, setRvRadarFrames] = useState([]);
  const [rvSatFrames, setRvSatFrames] = useState([]);
  const [jmaFrames, setJmaFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // レイヤー参照
  const himawariLayerRef = useRef(null);
  const goesLayerRef = useRef(null); 
  const meteosatLayerRef = useRef(null); 
  const arcticLayerRef = useRef(null);
  const globalIrLayerRef = useRef(null);
  const radarLayerRef = useRef(null);

  // 5分おきにAPIを再取得
  useEffect(() => {
    const interval = setInterval(() => {
        setLastFetchTime(Date.now());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // マップの初期化
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      try {
        if (!window.L) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);

          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (isMounted && mapContainerRef.current && !mapInstanceRef.current) {
          const L = window.L;
          const map = L.map(mapContainerRef.current, {
            center: [35.0, 135.0],
            zoom: 3,
            zoomControl: false,
            attributionControl: false
          });

          L.control.zoom({ position: 'bottomright' }).addTo(map);

          const darkBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
            subdomains: 'abcd'
          }).addTo(map);

          mapInstanceRef.current = map;
          layersRef.current.base = darkBase;

          // スタイルタグを挿入 (dangerouslySetInnerHTML エラー回避のためJSで生成)
          const style = document.createElement('style');
          style.innerHTML = `
            .sat-blend { mix-blend-mode: screen; }
            .nav-tooltip { background-color: rgba(15, 23, 42, 0.85) !important; border: 1px solid rgba(56, 189, 248, 0.4) !important; color: #e0f2fe !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; border-radius: 4px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.5) !important; }
            .airspace-tooltip { background-color: rgba(0, 0, 0, 0.7) !important; border: 1px solid #f87171 !important; color: #fecaca !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; border-radius: 4px !important; }
            .fir-tooltip { background-color: transparent !important; border: none !important; box-shadow: none !important; color: #fdba74 !important; font-size: 12px !important; font-weight: bold !important; text-shadow: 1px 1px 2px black !important; }
          `;
          document.head.appendChild(style);

          meteosatLayerRef.current = L.tileLayer.wms('https://view.eumetsat.int/geoserver/ows', {
            layers: 'msg_fes:ir108,msg_iodc:ir108',
            format: 'image/png',
            transparent: true,
            version: '1.3.0',
            opacity: opacity,
            zIndex: 2,
            className: 'sat-blend'
          }).addTo(map);

          arcticLayerRef.current = L.tileLayer.wms('https://realearth.ssec.wisc.edu/wms/', {
            layers: 'globalir',
            format: 'image/png',
            transparent: true,
            opacity: opacity,
            zIndex: 1,
            className: 'sat-blend'
          }).addTo(map);

          const errImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          himawariLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 2, className: 'sat-blend' }).addTo(map);
          goesLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 2, className: 'sat-blend' }).addTo(map);
          globalIrLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxNativeZoom: 5, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 1, className: 'sat-blend' }).addTo(map);
          radarLayerRef.current = L.tileLayer(errImg, { opacity: opacity, maxZoom: 16, noWrap: false, errorTileUrl: errImg, zIndex: 3 }).addTo(map);

          setIsMapLoaded(true);
        }
      } catch (err) {
        console.error("Map initialization failed", err);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // JMA/RV API データ取得
  useEffect(() => {
      fetch('https://api.rainviewer.com/public/weather-maps.json', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          const host = data.host || 'https://tilecache.rainviewer.com';
          if (data.radar && data.radar.past) {
            setRvRadarFrames(data.radar.past.map(f => ({ ...f, host })));
          }
          if (data.satellite && data.satellite.infrared) {
            const satData = data.satellite.infrared.map(f => ({ ...f, host }));
            setRvSatFrames(satData);
          }
        })
        .catch(err => console.error("RainViewer API load error:", err));

      fetch('https://www.jma.go.jp/bosai/himawari/data/satimg/targetTimes_fd.json', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const recentFrames = data.slice(-24);
            setJmaFrames(recentFrames);
          }
        })
        .catch(err => console.error("JMA API load error:", err));
  }, [lastFetchTime]);

  // レイヤー更新
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
    if (!isMapLoaded || !himawariLayerRef.current || !goesLayerRef.current || !meteosatLayerRef.current || !arcticLayerRef.current || !globalIrLayerRef.current || !radarLayerRef.current) return;
    const errImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    let himawariUrl = errImg;
    if (showHimawari && jmaFrames.length > 0) {
        const idx = Math.max(0, Math.min(getLayerFrameIndex(jmaFrames.length), jmaFrames.length - 1));
        const frame = jmaFrames[idx];
        if (frame && frame.basetime && frame.validtime) {
            himawariUrl = `https://www.jma.go.jp/bosai/himawari/data/satimg/${frame.basetime}/fd/${frame.validtime}/SND/ETC/{z}/{x}/{y}.jpg`;
        }
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
        const idx = Math.max(0, Math.min(getLayerFrameIndex(rvSatFrames.length), rvSatFrames.length - 1));
        const frame = rvSatFrames[idx];
        if (frame) globalIrUrl = `${frame.host}${frame.path}/256/{z}/{x}/{y}/0/0_0.png`;
    }
    if (globalIrLayerRef.current._url !== globalIrUrl) globalIrLayerRef.current.setUrl(globalIrUrl);
    globalIrLayerRef.current.setOpacity(showGlobalIr ? opacity : 0);

    let radarUrl = errImg;
    if (showRadar && rvRadarFrames.length > 0) {
        const idx = Math.max(0, Math.min(getLayerFrameIndex(rvRadarFrames.length), rvRadarFrames.length - 1));
        const frame = rvRadarFrames[idx];
        if (frame) radarUrl = `${frame.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    }
    if (radarLayerRef.current._url !== radarUrl) radarLayerRef.current.setUrl(radarUrl);
    radarLayerRef.current.setOpacity(showRadar ? opacity : 0);

  }, [isMapLoaded, frameIndex, opacity, showHimawari, showGoes, showMeteosat, showArctic, showGlobalIr, showRadar, jmaFrames, rvSatFrames, rvRadarFrames, maxFrames]);

  // ルート描画
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (layersRef.current.navlogGroup) {
      map.removeLayer(layersRef.current.navlogGroup);
    }

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
        if (coord && (!routePoints.length || routePoints[routePoints.length - 1].name !== coord.name)) {
            routePoints.push(coord);
        }
      });
    }

    if (navlogData.destIcao) {
        const destCoord = parseWaypointToLatLng(navlogData.destIcao);
        if (destCoord && (!routePoints.length || routePoints[routePoints.length - 1].name !== destCoord.name)) {
            routePoints.push(destCoord);
        }
    }

    if (routePoints.length > 0) {
      const latlngs = routePoints.map(pt => [pt.lat, pt.lon]);
      normalizeLongitudes(latlngs); 
      
      const flightPath = L.polyline(latlngs, { color: '#38bdf8', weight: 3, opacity: 0.9 });
      navlogGroup.addLayer(flightPath);

      if (deviationNM > 0) {
          const rightOffset = calculateOffsetLine(latlngs, deviationNM);
          const leftOffset = calculateOffsetLine(latlngs, -deviationNM);
          const rightPath = L.polyline(rightOffset, { color: '#8b5cf6', weight: 2, opacity: 0.8, dashArray: '6, 6' });
          const leftPath = L.polyline(leftOffset, { color: '#8b5cf6', weight: 2, opacity: 0.8, dashArray: '6, 6' });
          navlogGroup.addLayer(rightPath);
          navlogGroup.addLayer(leftPath);
      }

      routePoints.forEach((pt, index) => {
        const isAp = pt.isAirport || pt.name === navlogData.depIcao || pt.name === navlogData.destIcao;
        const marker = L.circleMarker(latlngs[index], {
          radius: isAp ? 6 : 4,
          color: isAp ? '#0ea5e9' : '#ffffff',
          fillColor: isAp ? '#e0f2fe' : '#38bdf8',
          fillOpacity: 1.0,
          weight: 2
        }).bindTooltip(pt.name, { permanent: true, direction: 'right', className: 'nav-tooltip' });
        navlogGroup.addLayer(marker);
      });

      if (latlngs.length > 1) {
          map.fitBounds(flightPath.getBounds(), { padding: [50, 50] });
      } else if (latlngs.length === 1) {
          map.setView(latlngs[0], 6);
      }
    }

    navlogGroup.addTo(map);
    layersRef.current.navlogGroup = navlogGroup;
  }, [isMapLoaded, navlogData, showNavlogRoute, deviationNM]);

  // 空域描画 (AIRSPACE)
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (layersRef.current.airspaceGroup) {
      map.removeLayer(layersRef.current.airspaceGroup);
    }

    if (!showAirspace) return;

    const airspaceGroup = L.layerGroup();

    AIRSPACE_DATA.forEach(airspace => {
        const color = airspace.type === 'restricted' ? '#eab308' : '#f43f5e';
        const polygon = L.polygon(airspace.coords, {
            color: color,
            fillColor: color,
            fillOpacity: 0.15,
            weight: 1.5,
            dashArray: airspace.type === 'training' ? '' : ''
        });

        const tooltipContent = `
            <div class="text-center">
                <div class="font-bold border-b border-red-400/50 pb-1 mb-1">${airspace.name}</div>
                <div class="text-xs text-red-200">${airspace.alt}</div>
            </div>
        `;
        polygon.bindTooltip(tooltipContent, { className: 'airspace-tooltip', direction: 'center' });
        airspaceGroup.addLayer(polygon);
    });

    airspaceGroup.addTo(map);
    layersRef.current.airspaceGroup = airspaceGroup;

  }, [isMapLoaded, showAirspace]);

  // FIR 描画
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (layersRef.current.firGroup) {
      map.removeLayer(layersRef.current.firGroup);
    }

    if (!showFir) return;

    const firGroup = L.layerGroup();
    
    // 全世界の大まかなFIR GeoJSONデータを非同期ロード
    fetch('https://raw.githubusercontent.com/vatsimnetwork/vatspy-data-project/master/FIRs.geojson')
      .then(res => res.json())
      .then(data => {
          L.geoJSON(data, {
              style: function (feature) {
                  // 小さな内陸のARTCCは薄く、太平洋などの巨大なFIRは濃く
                  const isOceanic = ['PAZA', 'KZAK', 'RJJJ', 'NZZO', 'YBBB'].includes(feature.properties.id);
                  return {
                      color: '#fb923c',
                      weight: isOceanic ? 2 : 0.5,
                      opacity: isOceanic ? 0.8 : 0.2,
                      fillOpacity: 0,
                      dashArray: isOceanic ? '' : '2, 4'
                  };
              },
              onEachFeature: function (feature, layer) {
                  layer = fixAntiMeridian(layer.feature); // E180問題の修正
                  if (feature.properties && feature.properties.id) {
                      layer.bindTooltip(feature.properties.id, { className: 'fir-tooltip', sticky: true });
                  }
              }
          }).addTo(firGroup);
      })
      .catch(err => console.error("FIR load failed:", err));

    firGroup.addTo(map);
    layersRef.current.firGroup = firGroup;

  }, [isMapLoaded, showFir]);

  let currentTimeLabel = "LIVE";
  let activeLayerName = "JMA Himawari-8/9 Cloud Top";
  if (showHimawari && jmaFrames.length > 0) {
      const idx = Math.max(0, Math.min(getLayerFrameIndex(jmaFrames.length), jmaFrames.length - 1));
      if (jmaFrames[idx]) {
          currentTimeLabel = formatJmaTime(jmaFrames[idx].validtime || jmaFrames[idx].basetime);
      }
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 relative overflow-hidden text-slate-200">
      <div className="w-full flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800 text-xs flex-wrap gap-2 z-[2000] shadow-md relative">
        <div className="flex items-center gap-3 flex-wrap text-[11px] w-full lg:w-auto overflow-x-auto">
          {maxFrames > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className="text-sky-400 hover:text-white flex items-center justify-center w-4 h-4 mr-1"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <input 
                type="range" 
                min="0" 
                max={maxFrames - 1} 
                value={safeFrameIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setFrameIndex(Number(e.target.value));
                }}
                className="w-24 accent-sky-400 cursor-pointer"
              />
            </div>
          )}

          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
            <span className="text-slate-400 font-bold">Dev:</span>
            <select
              value={deviationNM}
              onChange={(e) => setDeviationNM(Number(e.target.value))}
              className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
            >
              <option value={0}>OFF</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => (
                  <option key={val} value={val} className="bg-slate-900">{val} NM</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700 flex-wrap shrink-0">
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showHimawari} onChange={(e) => setShowHimawari(e.target.checked)} className="accent-sky-500 rounded" />
              <span>HIMAWARI</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showGoes} onChange={(e) => setShowGoes(e.target.checked)} className="accent-sky-500 rounded" />
              <span>GOES</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showMeteosat} onChange={(e) => setShowMeteosat(e.target.checked)} className="accent-sky-500 rounded" />
              <span>METEOSAT</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2">
              <input type="checkbox" checked={showNavlogRoute} onChange={(e) => setShowNavlogRoute(e.target.checked)} className="accent-sky-500 rounded" />
              <span className="font-bold text-sky-400">Route</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white border-l border-slate-600 pl-2">
              <input type="checkbox" checked={showAirspace} onChange={(e) => setShowAirspace(e.target.checked)} className="accent-rose-500 rounded" />
              <span className="font-bold text-rose-400">空域(R/T)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-slate-300 hover:text-white">
              <input type="checkbox" checked={showFir} onChange={(e) => setShowFir(e.target.checked)} className="accent-orange-500 rounded" />
              <span className="font-bold text-orange-400">FIR</span>
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
          <div className="leading-tight">
            {activeLayerName}
          </div>
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
// 断面図コンポーネント (Cross Section View)
// =========================================================================
const CrossSectionView = ({ navlogData }) => {
    const [windData, setWindData] = useState(null);
    const [timeIndex, setTimeIndex] = useState(0);
    const [isLoadingWx, setIsLoadingWx] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // 気象データの取得 (Open-Meteo API)
    useEffect(() => {
        if (!navlogData || !navlogData.newPlan || navlogData.newPlan.length === 0) return;

        const fetchWeatherData = async () => {
            setIsLoadingWx(true);
            try {
                // ウェイポイントの緯度経度を抽出
                const coords = [];
                navlogData.newPlan.forEach(wp => {
                    const coord = parseWaypointToLatLng(wp);
                    if (coord) coords.push(coord);
                });

                if (coords.length === 0) return;

                const lats = coords.map(c => c.lat).join(',');
                const lons = coords.map(c => c.lon).join(',');

                // GFSモデルから各気圧面（1000hPa ~ 150hPa）の風向、風速、温度を取得
                // 時間範囲は現在から12時間後まで
                const apiUrl = `https://api.open-meteo.com/v1/gfs?latitude=${lats}&longitude=${lons}&hourly=temperature_1000hPa,windspeed_1000hPa,winddirection_1000hPa,temperature_850hPa,windspeed_850hPa,winddirection_850hPa,temperature_700hPa,windspeed_700hPa,winddirection_700hPa,temperature_500hPa,windspeed_500hPa,winddirection_500hPa,temperature_400hPa,windspeed_400hPa,winddirection_400hPa,temperature_300hPa,windspeed_300hPa,winddirection_300hPa,temperature_250hPa,windspeed_250hPa,winddirection_250hPa,temperature_200hPa,windspeed_200hPa,winddirection_200hPa,temperature_150hPa,windspeed_150hPa,winddirection_150hPa&wind_speed_unit=kn&forecast_hours=12`;

                const response = await fetch(apiUrl);
                const data = await response.json();
                
                // 複数地点のレスポンス処理
                const parsedData = Array.isArray(data) ? data : [data];
                setWindData(parsedData);
                setTimeIndex(0); // リセット
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
            } finally {
                setIsLoadingWx(false);
            }
        };

        fetchWeatherData();
    }, [navlogData]);

    if (!navlogData || !navlogData.newPlan) {
        return <div className="w-full h-full flex items-center justify-center text-slate-500">Please load a flight plan.</div>;
    }

    const routePoints = [];
    let cumulativeDist = 0;
    
    // ウェイポイントの距離と高度の計算
    navlogData.newPlan.forEach((wp, i) => {
        const coord = parseWaypointToLatLng(wp);
        if (coord) {
            let distToNext = 0;
            if (i < navlogData.newPlan.length - 1) {
                const nextCoord = parseWaypointToLatLng(navlogData.newPlan[i+1]);
                if (nextCoord) {
                    distToNext = calculateDistance(coord.lat, coord.lon, nextCoord.lat, nextCoord.lon);
                }
            }
            routePoints.push({
                name: coord.name,
                dist: cumulativeDist,
                fl: wp.fl || 0,
                index: i
            });
            cumulativeDist += distToNext;
        }
    });

    if (routePoints.length === 0) return null;

    const totalDist = cumulativeDist;
    const maxFl = 450; 
    
    // SVG描画用のスケール計算
    const svgWidth = Math.max(800, window.innerWidth * zoomLevel);
    const svgHeight = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;

    const getX = (dist) => margin.left + (dist / totalDist) * innerWidth;
    const getY = (fl) => margin.top + innerHeight - (fl / maxFl) * innerHeight;

    // 気圧面から高度への近似マッピング
    const pressureLevels = [
        { hPa: 1000, fl: 0 },
        { hPa: 850, fl: 50 },
        { hPa: 700, fl: 100 },
        { hPa: 500, fl: 180 },
        { hPa: 400, fl: 240 },
        { hPa: 300, fl: 300 },
        { hPa: 250, fl: 340 },
        { hPa: 200, fl: 390 },
        { hPa: 150, fl: 450 }
    ];

    // 風向・風速・温度の線形補間ロジック
    const interpolateWind = (wpIndex, targetFl) => {
        if (!windData || !windData[wpIndex] || !windData[wpIndex].hourly) return null;
        
        const hourly = windData[wpIndex].hourly;
        
        // ターゲット高度を挟む2つの気圧面を探す
        let lower = pressureLevels[0];
        let upper = pressureLevels[pressureLevels.length - 1];

        for (let i = 0; i < pressureLevels.length - 1; i++) {
            if (targetFl >= pressureLevels[i].fl && targetFl <= pressureLevels[i+1].fl) {
                lower = pressureLevels[i];
                upper = pressureLevels[i+1];
                break;
            }
        }

        const tLower = hourly[`temperature_${lower.hPa}hPa`][timeIndex];
        const wsLower = hourly[`windspeed_${lower.hPa}hPa`][timeIndex];
        let wdLower = hourly[`winddirection_${lower.hPa}hPa`][timeIndex];

        const tUpper = hourly[`temperature_${upper.hPa}hPa`][timeIndex];
        const wsUpper = hourly[`windspeed_${upper.hPa}hPa`][timeIndex];
        let wdUpper = hourly[`winddirection_${upper.hPa}hPa`][timeIndex];

        if (tLower === undefined || tUpper === undefined) return null;

        // 高度が完全に一致する場合
        if (lower.fl === upper.fl || targetFl === lower.fl) return { t: tLower, ws: wsLower, wd: wdLower };
        if (targetFl === upper.fl) return { t: tUpper, ws: wsUpper, wd: wdUpper };

        // 風向の補間（350度と10度など、0度またぎの処理）
        if (Math.abs(wdUpper - wdLower) > 180) {
            if (wdUpper < wdLower) wdUpper += 360;
            else wdLower += 360;
        }

        const ratio = (targetFl - lower.fl) / (upper.fl - lower.fl);
        const tInterp = tLower + (tUpper - tLower) * ratio;
        const wsInterp = wsLower + (wsUpper - wsLower) * ratio;
        let wdInterp = wdLower + (wdUpper - wdLower) * ratio;
        wdInterp = (wdInterp + 360) % 360;

        return { t: tInterp, ws: wsInterp, wd: wdInterp };
    };

    // グリッドに基づく風・揺れ・等風速線の生成
    const flSteps = [];
    for (let fl = 0; fl <= 450; fl += 20) {
        flSteps.push(fl);
    }

    const gridData = [];
    const isotachData = [];

    routePoints.forEach(wp => {
        let prevWind = null;
        const wpColumn = [];

        flSteps.forEach(fl => {
            const wind = interpolateWind(wp.index, fl);
            if (wind) {
                // シアー（揺れ）の計算 (Knots per 1000ft)
                let shear = 0;
                if (prevWind) {
                    // 風向風速からU/V成分を分解してベクトル差分を計算
                    const u1 = prevWind.ws * Math.sin(toRad(prevWind.wd));
                    const v1 = prevWind.ws * Math.cos(toRad(prevWind.wd));
                    const u2 = wind.ws * Math.sin(toRad(wind.wd));
                    const v2 = wind.ws * Math.cos(toRad(wind.wd));
                    
                    const du = u2 - u1;
                    const dv = v2 - v1;
                    const vectorDiff = Math.sqrt(du*du + dv*dv);
                    // 2000ft (FL20) ごとの差分なので、1000ftあたりに換算
                    shear = vectorDiff / 2.0; 
                }

                wpColumn.push({
                    x: getX(wp.dist),
                    y: getY(fl),
                    wd: wind.wd,
                    ws: wind.ws,
                    t: wind.t,
                    shear: shear,
                    fl: fl,
                    name: wp.name
                });
                
                isotachData.push({ x: getX(wp.dist), y: getY(fl), ws: wind.ws });

                prevWind = wind;
            }
        });
        if(wpColumn.length > 0) gridData.push(wpColumn);
    });

    // タイムスライダー用のラベル
    let validTimeLabel = "";
    if (windData && windData[0] && windData[0].hourly && windData[0].hourly.time) {
        const isoTime = windData[0].hourly.time[timeIndex];
        const date = new Date(isoTime);
        validTimeLabel = `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}Z`;
    }

    return (
        <div className="flex flex-col w-full h-full bg-slate-950 relative overflow-hidden">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800 text-xs shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                        <IconActivity /> CROSS SECTION
                    </span>
                    <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        <IconZoomIn className="text-slate-400" />
                        <input type="range" min="1" max="3" step="0.1" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} className="w-24 accent-sky-400" />
                        <span className="text-slate-400 font-mono w-8">{Math.round(zoomLevel * 100)}%</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isLoadingWx ? (
                        <span className="text-emerald-400 flex items-center gap-2 animate-pulse"><IconLoader2 className="animate-spin" /> Fetching Weather Data...</span>
                    ) : (
                        windData && (
                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                <span className="text-slate-400 font-bold">FORECAST TIME (ZULU):</span>
                                <input type="range" min="0" max="11" step="1" value={timeIndex} onChange={(e) => setTimeIndex(parseInt(e.target.value))} className="w-32 accent-emerald-400" />
                                <span className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-emerald-900">{validTimeLabel}</span>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* SVG Canvas Container */}
            <div className="flex-1 overflow-auto relative custom-scrollbar">
                <svg width={svgWidth} height={svgHeight} className="bg-slate-950 block min-w-full">
                    {/* Y-Axis Grid Lines */}
                    {[100, 200, 300, 400].map(fl => (
                        <g key={`grid-y-${fl}`}>
                            <line x1={margin.left} y1={getY(fl)} x2={svgWidth - margin.right} y2={getY(fl)} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={margin.left - 10} y={getY(fl)} fill="#64748b" fontSize="10" textAnchor="end" alignmentBaseline="middle">FL{fl}</text>
                        </g>
                    ))}

                    {/* Turbulence / Shear Blur Effect */}
                    {gridData.map((column, colIdx) => (
                        column.map((pt, ptIdx) => {
                            if (pt.shear > 3) {
                                let color = "rgba(74, 222, 128, 0.2)"; // Green (Light)
                                if (pt.shear > 6) color = "rgba(250, 204, 21, 0.3)"; // Yellow (Moderate)
                                if (pt.shear > 9) color = "rgba(248, 113, 113, 0.4)"; // Red (Severe)
                                
                                return (
                                    <circle key={`shear-${colIdx}-${ptIdx}`} cx={pt.x} cy={pt.y} r={30} fill={color} filter="blur(8px)" />
                                );
                            }
                            return null;
                        })
                    ))}

                    {/* Wind Arrows & Hover Targets */}
                    {gridData.map((column, colIdx) => (
                        column.map((pt, ptIdx) => {
                            // 矢印の描画
                            const isHovered = hoveredPoint && hoveredPoint.colIdx === colIdx && hoveredPoint.ptIdx === ptIdx;
                            return (
                                <g key={`wind-${colIdx}-${ptIdx}`} 
                                   onMouseEnter={() => setHoveredPoint({ ...pt, colIdx, ptIdx })}
                                   onMouseLeave={() => setHoveredPoint(null)}
                                   className="cursor-crosshair"
                                >
                                    {/* 透明な当たり判定用の円 */}
                                    <circle cx={pt.x} cy={pt.y} r={15} fill="transparent" />
                                    
                                    <g transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.wd})`}>
                                        <line x1="0" y1="10" x2="0" y2="-10" stroke={isHovered ? "#fff" : "#94a3b8"} strokeWidth="1.5" />
                                        <polyline points="-3,-5 0,-10 3,-5" fill="none" stroke={isHovered ? "#fff" : "#94a3b8"} strokeWidth="1.5" />
                                    </g>
                                    
                                    {/* Hover Tooltip (SVG内テキスト) */}
                                    {isHovered && (
                                        <g transform={`translate(${pt.x + 15}, ${pt.y - 15})`}>
                                            <rect x="0" y="0" width="90" height="40" fill="rgba(15, 23, 42, 0.9)" rx="4" stroke="#38bdf8" strokeWidth="1" />
                                            <text x="5" y="14" fill="#38bdf8" fontSize="10" fontWeight="bold">FL{pt.fl} ({pt.name})</text>
                                            <text x="5" y="26" fill="#f8fafc" fontSize="10">{Math.round(pt.wd)}° / {Math.round(pt.ws)} kt</text>
                                            <text x="5" y="36" fill={pt.t < 0 ? "#93c5fd" : "#fca5a5"} fontSize="10">Temp: {pt.t > 0 ? '+' : ''}{Math.round(pt.t)}°C</text>
                                        </g>
                                    )}
                                </g>
                            );
                        })
                    ))}

                    {/* Flight Profile Line */}
                    {routePoints.length > 1 && (
                        <polyline
                            points={routePoints.map(wp => `${getX(wp.dist)},${getY(wp.fl)}`).join(' ')}
                            fill="none"
                            stroke="#d946ef"
                            strokeWidth="2"
                        />
                    )}

                    {/* Waypoints on Profile Line */}
                    {routePoints.map((wp, i) => (
                        <g key={`wp-${i}`}>
                            <circle cx={getX(wp.dist)} cy={getY(wp.fl)} r="3" fill="#fdf4ff" stroke="#d946ef" strokeWidth="1.5" />
                            <text x={getX(wp.dist)} y={getY(wp.fl) - 10} fill="#fdf4ff" fontSize="10" textAnchor="middle" fontWeight="bold">{wp.name}</text>
                            
                            {/* X-Axis Labels */}
                            <line x1={getX(wp.dist)} y1={margin.top} x2={getX(wp.dist)} y2={svgHeight - margin.bottom} stroke="#334155" strokeWidth="1" opacity="0.3" />
                            <text x={getX(wp.dist)} y={svgHeight - margin.bottom + 15} fill="#94a3b8" fontSize="9" textAnchor="middle" transform={`rotate(-45, ${getX(wp.dist)}, ${svgHeight - margin.bottom + 15})`}>{wp.name}</text>
                        </g>
                    ))}
                </svg>
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
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'crossSection'

  const showToast = (message) => {
    setToastData({ message, visible: true });
    setTimeout(() => setToastData({ message: '', visible: false }), 4000);
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
        
        if (parsedData.newPlan.length > 0) {
            setNavlogData(parsedData); 
            setIsLoadModalOpen(false);
            showToast(`ルートを読み込みました: ${parsedData.depIcao} -> ${parsedData.destIcao}`);
        } else { 
            showToast('フライトプランの読み取りに失敗しました。PDFの形式を確認してください。'); 
        }
      } catch (err) { 
        console.error(err); 
        showToast('PDFの解析に失敗しました。'); 
      } finally { 
        setIsParsingPdf(false); 
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTextLoad = (text) => {
      const parsed = parseNavlogText(text);
      if (parsed && parsed.newPlan.length > 0) {
          setNavlogData(parsed);
          setIsLoadModalOpen(false);
          showToast(`ルートを読み込みました: ${parsed.depIcao} -> ${parsed.destIcao}`);
      } else {
          showToast('テキストの解析に失敗しました。');
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

      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sky-400 bg-sky-900/30 p-1.5 rounded-lg border border-sky-800">
            <IconPlane />
          </span>
          <h1 className="text-white font-black text-lg tracking-wide hidden sm:block">GLOBAL WX RADAR</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
                onClick={() => setActiveTab('map')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'map' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <IconMap /> Map
            </button>
            <button 
                onClick={() => setActiveTab('crossSection')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'crossSection' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <IconActivity /> Cross Section
            </button>
        </div>

        <button 
            onClick={() => setIsLoadModalOpen(true)} 
            className="bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700 text-sm"
        >
            <IconDownloadCloud />
            <span className="hidden sm:inline">Load Plan</span>
        </button>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <WeatherRadarView navlogData={navlogData} />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'crossSection' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <CrossSectionView navlogData={navlogData} />
        </div>
      </main>
    </div>
  );
}