"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Nav from "./components/Nav";
import DateRangePicker from "./components/DateRangePicker";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8"
};

const HERO_INFO = {
  what: {
    label: "What do we do?",
    body: "We design fully personalised, bespoke holiday itineraries: real flights, real accommodation and hand-picked activities matched to your exact budget and taste. No templates and no generic packages, just a trip built around your brief by Jen herself.",
  },
  how: {
    label: "How does it work?",
    body: "Tell us where you're dreaming of and a few essentials about your trip. You'll get an instant, free first-look preview while we get started. Once you're happy to proceed, Jen personally researches and builds your full itinerary, complete with direct booking links, ready within 48 hours.",
  },
};

const DESTINATIONS = {
  somewhere_else: { name:"Somewhere else", flag:"🌍",
    general:["🏖️ Beach & relaxation","🏔️ Hiking & trekking","🍽️ Local food & cuisine","🏛️ History & culture","🤿 Water sports","🌿 Nature & wildlife","🎭 Arts & entertainment","🛍️ Shopping","🧘 Wellness & spa","🎉 Festivals & events","🚴 Cycling & adventure","📸 Photography"],
    landmarks:[],
    regions:[] }
};

const CONTINENTS_COUNTRIES = {
  "Europe":        ["Albania","Andorra","Austria","Belgium","Bosnia & Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","Ireland","Kosovo","Latvia","Lithuania","Luxembourg","Malta","Moldova","Montenegro","Netherlands","North Macedonia","Norway","Poland","Portugal","Romania","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom"],
  "Asia":          ["Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei","Cambodia","China","Georgia","Hong Kong","India","Indonesia","Japan","Jordan","Kazakhstan","Kyrgyzstan","Laos","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar","Saudi Arabia","Singapore","South Korea","Sri Lanka","Taiwan","Tajikistan","Thailand","UAE","Uzbekistan","Vietnam"],
  "Africa":        ["Algeria","Angola","Benin","Botswana","Cameroon","Cape Verde","Egypt","Ethiopia","Ghana","Kenya","Madagascar","Malawi","Morocco","Mozambique","Namibia","Nigeria","Rwanda","Senegal","Seychelles","South Africa","Tanzania","Tunisia","Uganda","Zambia","Zimbabwe"],
  "North America": ["Bahamas","Barbados","Canada","Cuba","Dominican Republic","Haiti","Jamaica","Mexico","Puerto Rico","Trinidad & Tobago","USA"],
  "Central America":["Belize","Costa Rica","El Salvador","Guatemala","Honduras","Nicaragua","Panama"],
  "South America": ["Argentina","Bolivia","Brazil","Chile","Colombia","Ecuador","Paraguay","Peru","Suriname","Uruguay","Venezuela"],
  "Oceania":       ["Australia","Cook Islands","Fiji","French Polynesia","New Caledonia","New Zealand","Papua New Guinea","Samoa","Solomon Islands","Tonga","Vanuatu"],
  "Middle East":   ["Bahrain","Iran","Iraq","Israel","Jordan","Kuwait","Lebanon","Oman","Qatar","Saudi Arabia","UAE","Yemen"]
};

const COUNTRY_ISO = {
  "Albania":"AL","Andorra":"AD","Austria":"AT","Belgium":"BE","Bosnia & Herzegovina":"BA","Bulgaria":"BG","Croatia":"HR","Cyprus":"CY","Czech Republic":"CZ","Denmark":"DK","Estonia":"EE","Finland":"FI","France":"FR","Germany":"DE","Greece":"GR","Hungary":"HU","Iceland":"IS","Ireland":"IE","Kosovo":"XK","Latvia":"LV","Lithuania":"LT","Luxembourg":"LU","Malta":"MT","Moldova":"MD","Montenegro":"ME","Netherlands":"NL","North Macedonia":"MK","Norway":"NO","Poland":"PL","Portugal":"PT","Romania":"RO","Serbia":"RS","Slovakia":"SK","Slovenia":"SI","Spain":"ES","Sweden":"SE","Switzerland":"CH","Turkey":"TR","Ukraine":"UA","United Kingdom":"GB",
  "Armenia":"AM","Azerbaijan":"AZ","Bahrain":"BH","Bangladesh":"BD","Bhutan":"BT","Brunei":"BN","Cambodia":"KH","China":"CN","Georgia":"GE","Hong Kong":"HK","India":"IN","Indonesia":"ID","Japan":"JP","Jordan":"JO","Kazakhstan":"KZ","Kyrgyzstan":"KG","Laos":"LA","Lebanon":"LB","Malaysia":"MY","Maldives":"MV","Mongolia":"MN","Myanmar":"MM","Nepal":"NP","Oman":"OM","Pakistan":"PK","Philippines":"PH","Qatar":"QA","Saudi Arabia":"SA","Singapore":"SG","South Korea":"KR","Sri Lanka":"LK","Taiwan":"TW","Tajikistan":"TJ","Thailand":"TH","UAE":"AE","Uzbekistan":"UZ","Vietnam":"VN",
  "Algeria":"DZ","Angola":"AO","Benin":"BJ","Botswana":"BW","Cameroon":"CM","Cape Verde":"CV","Egypt":"EG","Ethiopia":"ET","Ghana":"GH","Kenya":"KE","Madagascar":"MG","Malawi":"MW","Morocco":"MA","Mozambique":"MZ","Namibia":"NA","Nigeria":"NG","Rwanda":"RW","Senegal":"SN","Seychelles":"SC","South Africa":"ZA","Tanzania":"TZ","Tunisia":"TN","Uganda":"UG","Zambia":"ZM","Zimbabwe":"ZW",
  "Bahamas":"BS","Barbados":"BB","Canada":"CA","Cuba":"CU","Dominican Republic":"DO","Haiti":"HT","Jamaica":"JM","Mexico":"MX","Puerto Rico":"PR","Trinidad & Tobago":"TT","USA":"US",
  "Belize":"BZ","Costa Rica":"CR","El Salvador":"SV","Guatemala":"GT","Honduras":"HN","Nicaragua":"NI","Panama":"PA",
  "Argentina":"AR","Bolivia":"BO","Brazil":"BR","Chile":"CL","Colombia":"CO","Ecuador":"EC","Paraguay":"PY","Peru":"PE","Suriname":"SR","Uruguay":"UY","Venezuela":"VE",
  "Australia":"AU","Cook Islands":"CK","Fiji":"FJ","French Polynesia":"PF","New Caledonia":"NC","New Zealand":"NZ","Papua New Guinea":"PG","Samoa":"WS","Solomon Islands":"SB","Tonga":"TO","Vanuatu":"VU",
  "Iran":"IR","Iraq":"IQ","Israel":"IL","Kuwait":"KW","Yemen":"YE"
};

function flagEmoji(country) {
  const iso = COUNTRY_ISO[country];
  if (!iso) return "🌍";
  return [...iso].map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
}

function continentForCountry(country) {
  for (const [continent, list] of Object.entries(CONTINENTS_COUNTRIES)) {
    if (list.includes(country)) return continent;
  }
  return null;
}

function countryKnownFor(country) {
  if (!country) return [];
  const specific = COUNTRY_DATA[country]?.landmarks;
  if (specific?.length) return specific.slice(0, 3);
  return (CONTINENT_DATA[continentForCountry(country)]?.landmarks || []).slice(0, 3);
}

const ALL_COUNTRIES = [...new Set(Object.values(CONTINENTS_COUNTRIES).flat())].sort((a, b) => a.localeCompare(b));

const OTHER_AIRPORT = "Other (not listed)";

const COUNTRY_AIRPORTS = {
  // ── Europe ──────────────────────────────────────────────────────────────────
  "Albania": ["Tirana"],
  "United Kingdom": ["London Heathrow","London Gatwick","Manchester","Birmingham","Edinburgh","Glasgow","Bristol","Newcastle"],
  "Ireland": ["Dublin","Cork","Shannon"],
  "Austria": ["Vienna"],
  "Belgium": ["Brussels"],
  "Bosnia & Herzegovina": ["Sarajevo"],
  "Bulgaria": ["Sofia"],
  "Croatia": ["Zagreb","Split","Dubrovnik"],
  "Cyprus": ["Larnaca","Paphos"],
  "Czech Republic": ["Prague"],
  "Denmark": ["Copenhagen"],
  "Estonia": ["Tallinn"],
  "Finland": ["Helsinki"],
  "Germany": ["Frankfurt","Munich","Berlin"],
  "France": ["Paris Charles de Gaulle","Nice","Lyon"],
  "Greece": ["Athens","Thessaloniki"],
  "Hungary": ["Budapest"],
  "Iceland": ["Reykjavik (Keflavik)"],
  "Kosovo": ["Pristina"],
  "Latvia": ["Riga"],
  "Lithuania": ["Vilnius"],
  "Luxembourg": ["Luxembourg"],
  "Malta": ["Malta (Luqa)"],
  "Moldova": ["Chisinau"],
  "Montenegro": ["Podgorica","Tivat"],
  "Netherlands": ["Amsterdam Schiphol"],
  "North Macedonia": ["Skopje"],
  "Norway": ["Oslo","Bergen"],
  "Poland": ["Warsaw","Krakow"],
  "Portugal": ["Lisbon","Porto","Faro"],
  "Romania": ["Bucharest"],
  "Serbia": ["Belgrade"],
  "Slovakia": ["Bratislava"],
  "Slovenia": ["Ljubljana"],
  "Spain": ["Madrid","Barcelona","Malaga","Palma de Mallorca"],
  "Sweden": ["Stockholm","Gothenburg"],
  "Switzerland": ["Zurich","Geneva"],
  "Turkey": ["Istanbul","Antalya"],
  "Ukraine": ["Kyiv"],
  // ── Asia ────────────────────────────────────────────────────────────────────
  "Armenia": ["Yerevan"],
  "Azerbaijan": ["Baku"],
  "Bahrain": ["Bahrain (Manama)"],
  "Bangladesh": ["Dhaka"],
  "Bhutan": ["Paro"],
  "Brunei": ["Bandar Seri Begawan"],
  "Cambodia": ["Phnom Penh","Siem Reap"],
  "China": ["Beijing","Shanghai","Guangzhou"],
  "Georgia": ["Tbilisi"],
  "Hong Kong": ["Hong Kong"],
  "India": ["Delhi","Mumbai","Bangalore"],
  "Indonesia": ["Jakarta","Bali (Denpasar)"],
  "Japan": ["Tokyo Narita","Tokyo Haneda","Osaka Kansai"],
  "Jordan": ["Amman"],
  "Kazakhstan": ["Almaty","Astana"],
  "Kyrgyzstan": ["Bishkek"],
  "Laos": ["Vientiane"],
  "Lebanon": ["Beirut"],
  "Malaysia": ["Kuala Lumpur"],
  "Maldives": ["Malé"],
  "Mongolia": ["Ulaanbaatar"],
  "Myanmar": ["Yangon"],
  "Nepal": ["Kathmandu"],
  "Oman": ["Muscat"],
  "Pakistan": ["Karachi","Lahore","Islamabad"],
  "Philippines": ["Manila","Cebu"],
  "Qatar": ["Doha"],
  "Saudi Arabia": ["Riyadh","Jeddah"],
  "Singapore": ["Singapore Changi"],
  "South Korea": ["Seoul Incheon"],
  "Sri Lanka": ["Colombo"],
  "Taiwan": ["Taipei"],
  "Tajikistan": ["Dushanbe"],
  "Thailand": ["Bangkok","Phuket"],
  "UAE": ["Dubai","Abu Dhabi"],
  "Uzbekistan": ["Tashkent"],
  "Vietnam": ["Hanoi","Ho Chi Minh City"],
  // ── Africa ──────────────────────────────────────────────────────────────────
  "Algeria": ["Algiers"],
  "Angola": ["Luanda"],
  "Benin": ["Cotonou"],
  "Botswana": ["Gaborone"],
  "Cameroon": ["Douala"],
  "Cape Verde": ["Sal"],
  "Egypt": ["Cairo","Hurghada"],
  "Ethiopia": ["Addis Ababa"],
  "Ghana": ["Accra"],
  "Kenya": ["Nairobi"],
  "Madagascar": ["Antananarivo"],
  "Malawi": ["Lilongwe"],
  "Morocco": ["Casablanca","Marrakech"],
  "Mozambique": ["Maputo"],
  "Namibia": ["Windhoek"],
  "Nigeria": ["Lagos","Abuja"],
  "Rwanda": ["Kigali"],
  "Senegal": ["Dakar"],
  "Seychelles": ["Mahé (Victoria)"],
  "South Africa": ["Johannesburg","Cape Town","Durban"],
  "Tanzania": ["Dar es Salaam","Kilimanjaro","Zanzibar"],
  "Tunisia": ["Tunis"],
  "Uganda": ["Entebbe"],
  "Zambia": ["Lusaka"],
  "Zimbabwe": ["Harare"],
  // ── North America ───────────────────────────────────────────────────────────
  "Bahamas": ["Nassau"],
  "Barbados": ["Bridgetown"],
  "Canada": ["Toronto Pearson","Vancouver","Montreal","Calgary"],
  "Cuba": ["Havana"],
  "Dominican Republic": ["Punta Cana","Santo Domingo"],
  "Haiti": ["Port-au-Prince"],
  "Jamaica": ["Kingston","Montego Bay"],
  "Mexico": ["Mexico City","Cancun"],
  "Puerto Rico": ["San Juan"],
  "Trinidad & Tobago": ["Port of Spain"],
  "USA": ["New York JFK","Los Angeles","Chicago O'Hare","Miami","San Francisco","Boston","Atlanta","Dallas Fort Worth","Orlando"],
  // ── Central America ─────────────────────────────────────────────────────────
  "Belize": ["Belize City"],
  "Costa Rica": ["San José","Liberia"],
  "El Salvador": ["San Salvador"],
  "Guatemala": ["Guatemala City"],
  "Honduras": ["Tegucigalpa","San Pedro Sula"],
  "Nicaragua": ["Managua"],
  "Panama": ["Panama City"],
  // ── South America ───────────────────────────────────────────────────────────
  "Argentina": ["Buenos Aires"],
  "Bolivia": ["La Paz","Santa Cruz"],
  "Brazil": ["São Paulo","Rio de Janeiro"],
  "Chile": ["Santiago"],
  "Colombia": ["Bogotá","Cartagena"],
  "Ecuador": ["Quito","Guayaquil"],
  "Paraguay": ["Asunción"],
  "Peru": ["Lima"],
  "Suriname": ["Paramaribo"],
  "Uruguay": ["Montevideo"],
  "Venezuela": ["Caracas"],
  // ── Oceania ─────────────────────────────────────────────────────────────────
  "Australia": ["Sydney","Melbourne","Brisbane","Perth"],
  "Cook Islands": ["Rarotonga"],
  "Fiji": ["Nadi"],
  "French Polynesia": ["Papeete (Tahiti)"],
  "New Caledonia": ["Nouméa"],
  "New Zealand": ["Auckland","Wellington","Christchurch"],
  "Papua New Guinea": ["Port Moresby"],
  "Samoa": ["Apia"],
  "Solomon Islands": ["Honiara"],
  "Tonga": ["Nuku'alofa"],
  "Vanuatu": ["Port Vila"],
  // ── Middle East ─────────────────────────────────────────────────────────────
  "Iran": ["Tehran"],
  "Iraq": ["Baghdad","Erbil"],
  "Israel": ["Tel Aviv"],
  "Kuwait": ["Kuwait City"],
  "Yemen": ["Sana'a"],
};

function airportOptionsFor(country) {
  return [...(COUNTRY_AIRPORTS[country] || []), OTHER_AIRPORT];
}

const CONTINENT_DATA = {
  "Europe":         { general:["🏛️ Historic city walking tour","🍷 Wine & food tasting","🎨 Art gallery & museum visit","🚴 Countryside cycling","⛵ Coastal sailing","🏔️ Mountain hiking","🎭 Theatre & live music","🍽️ Local market tour","🏖️ Beach & coastline","🎿 Skiing & snowboarding","🚂 Scenic rail journey","🧖 Spa & thermal baths"], landmarks:["🏰 Medieval castles & fortresses","⛪ Gothic cathedrals","🏛️ Roman & ancient ruins","🌊 Dramatic coastal scenery","🏔️ Alpine mountain landscapes","🌿 Historic gardens & parks","🎨 World-class art museums","🏙️ UNESCO Old Towns","🌉 Iconic bridges & waterways","🛶 Scenic river & canal cruises"], regions:[] },
  "Asia":           { general:["🍜 Street food & night market","🛕 Temple & heritage tour","🧘 Yoga & wellness retreat","🤿 Island snorkelling & diving","🏯 Ancient ruins & archaeology","🌿 Jungle & nature trek","🎎 Cultural experience & workshop","🍵 Tea ceremony","🛶 River cruise","🏄 Water sports","🚴 Bicycle tour","🌸 Garden & landscape walk"], landmarks:["🛕 Ancient temples & pagodas","🏯 Historic palaces & forts","🌾 Rice terraces & rural landscapes","🌋 Volcanoes & craters","🏝️ Tropical islands & beaches","🌊 Turquoise bays & lagoons","🐘 Wildlife sanctuaries","🌿 Tropical rainforests","🏙️ Modern skylines & city markets","🚂 Scenic mountain railways"], regions:[] },
  "Africa":         { general:["🦁 Safari game drive","🐘 Wildlife spotting","👥 Cultural village visit","🏖️ Beach & coastal holiday","🏔️ Mountain trekking","🦩 Birdwatching","🤿 Snorkelling & diving","🌿 Nature reserve walk","🎭 Local music & dance","🛶 River cruise","🍽️ Traditional cuisine tour","🌅 Sundowner in the bush"], landmarks:["🦁 Big Five game reserves","🏔️ Iconic mountain peaks","🌊 Pristine beaches & reefs","🌋 Volcanic landscapes","🏛️ Ancient ruins & rock art","🦩 Flamingo lakes","🌿 Tropical rainforests","🏜️ Desert dunes","🕌 Historic medinas & markets","🦒 Open savannah plains"], regions:[] },
  "North America":  { general:["🏙️ City exploration & food tour","🏔️ National park hiking","🎸 Live music & nightlife","🌊 Coastal road trip","🍔 Local food culture","🤿 Snorkelling & diving","🌿 Wildlife & nature","🚴 Cycling","🏄 Surfing","🎭 Shows & entertainment","🛶 Kayaking & water sports","🍷 Winery tour"], landmarks:["🏙️ Iconic city skylines","🏔️ National parks & canyons","🌊 Pacific & Atlantic coastlines","🗽 World-famous monuments","🌲 Ancient forests","🏖️ Caribbean & tropical beaches","🏛️ Historic districts & museums","🌉 Famous bridges","🌵 Desert landscapes","🎪 Entertainment districts"], regions:[] },
  "Central America":{ general:["🌿 Rainforest guided tour","🌋 Volcano hike","🤿 Snorkelling & diving","💧 Waterfall trek","🦋 Wildlife watching","🏄 Surfing","🧘 Yoga & wellness retreat","☕ Coffee plantation visit","🏯 Ancient Mayan ruins","🚣 White water rafting","🐦 Birdwatching","🏖️ Beach holiday"], landmarks:["🌋 Active volcanoes","🌿 Cloud & rainforests","🏯 Mayan archaeological sites","💧 Jungle waterfalls","🐊 Wildlife reserves & parks","🏖️ Pacific & Caribbean beaches","🌊 Lagoons & mangroves","⛵ Island archipelagos","🦋 Butterfly gardens","☕ Coffee highlands"], regions:[] },
  "South America":  { general:["🏔️ Trekking & hiking","🌿 Amazon jungle expedition","🍷 Wine & food tour","🐧 Wildlife watching","💃 Salsa & dance class","🏖️ Beach holiday","🏯 Ancient ruins tour","🌊 Waterfall visit","🛶 River cruise","🎭 Cultural festival","⛰️ Volcano & crater trek","🦙 Wildlife & nature"], landmarks:["🏔️ Andes mountain peaks","🌿 Amazon Rainforest","🌊 Iguazú / Angel Falls","🏛️ Inca & pre-Columbian ruins","🐧 Galápagos & wildlife islands","🌵 Atacama & desert landscapes","🏙️ Colonial city centres","🌅 Salt flats","⛵ Patagonian glaciers","🍷 Wine valleys"], regions:[] },
  "Oceania":        { general:["🏖️ Beach & snorkelling","🤿 Scuba diving","🌿 Rainforest & nature walk","🐠 Marine wildlife tour","🌋 Volcano visit","🌴 Island hopping","🐢 Turtle watching","🎣 Fishing & water sports","🚣 Sea kayaking","🌊 Surfing","🦜 Birdwatching","🥾 Jungle trekking"], landmarks:["🏖️ Pristine tropical beaches","🤿 Coral reefs & marine parks","🌋 Active volcanoes","🌴 Remote island chains","🌿 Ancient rainforests","🐠 Colourful reef systems","🌅 Dramatic coastal cliffs","🐢 Turtle nesting beaches","🏝️ Lagoon & atoll islands","🌊 Surf breaks"], regions:[] },
  "Middle East":    { general:["🕌 Mosque & heritage tour","🏜️ Desert safari","🧖 Traditional hammam","🛍️ Bazaar & souk shopping","🍽️ Traditional cuisine tour","🐪 Camel ride","🏊 Beach & resort","⛵ Dhow sunset cruise","🏛️ Ancient ruins & archaeology","🎨 Arts & culture tour","🌅 Desert sunrise","🏙️ Modern city & architecture"], landmarks:["🕌 Grand mosques & minarets","🏜️ Vast desert landscapes","🏛️ Nabataean & ancient ruins","🌊 Red Sea & Gulf reefs","🏙️ Ultra-modern skylines","🛍️ Historic bazaars & medinas","🐪 Bedouin camps","⛵ Traditional dhow ports","🌹 Ancient oasis towns","🏰 Historic forts & citadels"], regions:[] }
};

const COUNTRY_DATA = {
  // ── Europe ──────────────────────────────────────────────────────────────────
  "France":          { general:["🗼 Eiffel Tower & Paris highlights","🍷 Wine & cheese tasting","🥐 Patisserie & cooking class","🚴 Cycling Loire Valley châteaux","🏖️ French Riviera beach","🎨 World-class museum tour","🌿 Provence lavender fields","🍾 Champagne tasting","🏔️ Skiing in the Alps","🌸 Monet's garden, Giverny","🚂 Scenic rail journey","👜 Paris fashion & shopping"], landmarks:["🗼 Eiffel Tower, Paris","🏛️ Louvre Museum","🏰 Palace of Versailles","⛩️ Mont Saint-Michel","🌸 Provence Lavender Fields","🏯 Loire Valley Châteaux","🌊 French Riviera (Côte d'Azur)","🏰 Carcassonne","🏖️ D-Day Beaches, Normandy","💧 Gorges du Verdon","🍷 Alsace Wine Route","🌉 Pont du Gard"], regions:["🏙️ Paris & Île-de-France","🏰 Loire Valley","🌊 French Riviera & Provence","❄️ Alps & Chamonix","🌾 Normandy & Brittany","🍷 Burgundy & Bordeaux"] },
  "Germany":         { general:["🎠 Christmas market visit","🍺 Oktoberfest & beer hall","🏰 Fairytale castle tour","🌿 Black Forest hiking","🚴 Cycling Rhine & Moselle","🏛️ Second World War history","🎵 Classical music concert","🍽️ German food tour","🧖 Spa in Baden-Baden","🛻 Autobahn road trip","🎭 Cabaret & theatre","🏔️ Bavarian Alpine hike"], landmarks:["🏰 Neuschwanstein Castle","🌉 Brandenburg Gate, Berlin","⛪ Cologne Cathedral","🏯 Heidelberg Castle","🌿 Black Forest","🌊 Rhine Valley Vineyards","🏛️ Berlin Wall Memorial","🏔️ Bavarian Alps","🏘️ Rothenburg ob der Tauber","🏙️ Hamburg Historic Port","🏛️ Dresden Old Town","🚗 Nürburgring"], regions:["🏔️ Bavaria & Munich","🏙️ Berlin & Brandenburg","🍷 Rhine Valley & Moselle","🌊 Hamburg & North","🌿 Black Forest & Baden","🏛️ Dresden & Saxony"] },
  "Spain":           { general:["🥘 Tapas & wine tour","💃 Flamenco show","🚶 Camino de Santiago walk","🏖️ Beach hopping","🎨 Gaudí architecture tour","⛵ Mediterranean sailing","🍷 Rioja wine tasting","🍳 Paella cooking class","🎉 La Tomatina festival","🌊 Surf lessons","🎭 Live flamenco tablaos","🌄 Pyrenees hiking"], landmarks:["⛪ Sagrada Família, Barcelona","🏰 Alhambra, Granada","🌿 Park Güell, Barcelona","🎨 Prado Museum, Madrid","🏰 Alcázar of Seville","🏛️ Guggenheim Bilbao","⛰️ Montserrat","🌋 Teide Volcano, Tenerife","🏙️ Ibiza Old Town","🚶 Santiago de Compostela","🌉 Ronda Gorge","🏰 Segovia Aqueduct"], regions:["🏙️ Barcelona & Catalonia","🏛️ Madrid & Castile","💃 Andalusia (Seville/Granada)","🍴 Basque Country","🌊 Valencia & Costa Blanca","🌴 Canary & Balearic Islands"] },
  "Portugal":        { general:["🍷 Wine tasting","🎵 Fado music evening","🏄 Surf lessons","🏰 Sintra day trip","🍮 Pastel de nata tour","🎨 Azulejo tile workshop","🌊 Algarve boat trip","🚢 Douro Valley river cruise","🐦 Birdwatching","🚋 Lisbon tram tour","🌿 Cork forest walk","⛵ Sailing"], landmarks:["🏰 Pena Palace, Sintra","⛪ Jerónimos Monastery, Lisbon","🍷 Douro Valley Vineyards","🌊 Benagil Sea Cave, Algarve","🏙️ Porto Ribeira","🌊 Cape St Vincent","🏛️ Évora Roman Temple","🏰 Óbidos Castle","🏡 Quinta da Regaleira","🌆 Alfama District, Lisbon","⛪ Torre de Belém","🍮 Pastéis de Belém"], regions:["🌆 Lisbon & Sintra","🍷 Porto & Douro Valley","🌊 Algarve Coast","🌿 Alentejo","🌺 Madeira Island","🌋 Azores"] },
  "Greece":          { general:["🏝️ Island hopping","🍷 Wine tasting","🏛️ Ancient ruins tour","⛵ Sailing the Aegean","🌅 Santorini sunset","🧀 Greek food & market tour","🫒 Olive oil tasting","🍳 Greek cooking class","🤿 Snorkelling","🎭 Minoan archaeology","🏊 Cliff diving","🚶 Byzantine trail walk"], landmarks:["🏛️ Acropolis, Athens","🌋 Santorini Caldera","🏯 Palace of Knossos, Crete","⛩️ Delphi Oracle","⛰️ Meteora Monasteries","🏰 Rhodes Old Town","🏙️ Mykonos Town","🏟️ Ancient Olympia","🌊 Navagio Beach, Zakynthos","🏛️ Cape Sounion","🏰 Corfu Old Town","🌊 Blue Caves, Zakynthos"], regions:["🏙️ Athens & Attica","🌋 Santorini & Cyclades","🏖️ Mykonos","🌿 Crete","🏰 Rhodes & Dodecanese","⛰️ Northern Greece & Meteora"] },
  "Croatia":         { general:["🏝️ Island hopping","⛵ Sailing","🚣 Sea kayaking, Dubrovnik","🎬 Game of Thrones tour","🍷 Wine tasting","🐟 Fresh seafood dining","🏊 Cave swimming","🪂 Cliff jumping","🥾 National park hiking","🍄 Truffle hunting, Istria","🤿 Scuba diving","🌊 Windsurfing"], landmarks:["🏰 Dubrovnik City Walls","💧 Plitvice Lakes","🏛️ Diocletian's Palace, Split","🌸 Hvar Old Town","🏘️ Rovinj Old Town","💧 Krka Waterfalls","🏝️ Korčula Island","🔵 Blue Cave, Biševo","🏛️ Trogir Historic Core","🌿 Mljet National Park","⛪ Šibenik Cathedral","🎵 Zadar Sea Organ"], regions:["🏰 Dubrovnik & South Dalmatia","🏛️ Split & Central Dalmatia","🌸 Hvar & Brač Islands","🏘️ Istria","💧 Plitvice & National Parks","🎵 Zadar & North Dalmatia"] },
  "Iceland":         { general:["🌌 Northern Lights viewing","🧊 Glacier hiking","🐋 Whale watching","♨️ Hot spring bathing","🐦 Puffin watching","🕳️ Lava tube cave tour","🏍️ Snowmobile ride","🧊 Ice cave tour","🐴 Icelandic horse riding","🌅 Midnight sun","💧 Waterfall chasing","📸 Aurora photography"], landmarks:["♨️ Blue Lagoon","🌌 Northern Lights","💧 Geysir & Strokkur","💧 Gullfoss Waterfall","💧 Seljalandsfoss Waterfall","🧊 Vatnajökull Glacier","💎 Diamond Beach","🏞️ Jökulsárlón Glacier Lagoon","🌿 Þingvellir National Park","🏔️ Landmannalaugar","⛪ Kirkjufell Mountain","🌋 Eyjafjallajökull"], regions:["🏙️ Reykjavík & Golden Circle","🌊 South Coast","🏔️ Westfjords","🐳 Akureyri & North Iceland","🌋 East Iceland","🌿 Snæfellsnes Peninsula"] },
  "Italy":           { general:["🍕 Pizza & pasta class","🍷 Wine tasting","🛶 Venice gondola","🚴 Countryside cycling","🏊 Amalfi boat trip","🎨 Art & museum tours","🧀 Food market tour","🏛️ Roman archaeology","⛵ Mediterranean sailing","🌋 Mount Etna hike","🍦 Gelato trail","🚂 Cinque Terre walk"], landmarks:["🏛️ Colosseum, Rome","🎨 Uffizi Gallery, Florence","🚣 Canals of Venice","🌸 Amalfi Coast","🏙️ Pompeii & Vesuvius","⛪ Vatican & Sistine Chapel","🏰 Cinque Terre","🌊 Lake Como","🍷 Chianti, Tuscany","🌋 Mount Etna, Sicily","🏛️ Pantheon, Rome","🎭 Verona Arena"], regions:["🏛️ Rome & Lazio","🌸 Tuscany & Florence","🚣 Venice & the North","☀️ Amalfi & Naples","🍋 Sicily","🏔️ Italian Lakes"] },
  "Turkey":          { general:["🎈 Hot air balloon, Cappadocia","🧖 Turkish hammam","⛵ Turquoise Coast boat cruise","🏺 Bazaar shopping","🥙 Turkish cooking class","🌀 Whirling dervish ceremony","🪂 Paragliding, Ölüdeniz","🏛️ Ancient ruins tour","⛵ Gulet sailing","🍷 Cappadocia wine tasting","🕳️ Cave hotel stay","🏺 Carpet weaving workshop"], landmarks:["🕌 Hagia Sophia, Istanbul","🕌 Blue Mosque, Istanbul","🏔️ Cappadocia Fairy Chimneys","🏛️ Ephesus Ancient City","💧 Pamukkale Cotton Castle","🏯 Topkapı Palace","🏬 Grand Bazaar, Istanbul","🏛️ Troy Archaeological Site","🏙️ Antalya Old Town","⛰️ Nemrut Dağ","⛪ Sumela Monastery","🌊 Ölüdeniz Blue Lagoon"], regions:["🕌 Istanbul","🏔️ Cappadocia","🌊 Aegean Coast (Bodrum/İzmir)","⛵ Turkish Riviera (Antalya/Fethiye)","🏛️ Central Anatolia","🌿 Black Sea & Eastern Turkey"] },
  "Norway":          { general:["🌌 Northern Lights viewing","🚢 Fjord cruise","🥾 Hiking trails","🐕 Dog sledding","🌅 Midnight sun experience","🚣 Kayaking fjords","🐋 Whale watching","📸 Aurora photography","🏛️ Viking history","🎿 Skiing","🎣 Salmon fishing","🦌 Reindeer encounter"], landmarks:["🌊 Geirangerfjord (UNESCO)","🌊 Aurlandsfjord & Nærøyfjord","🌌 Tromsø Northern Lights","🪨 Preikestolen (Pulpit Rock)","🚂 Flåm Railway","🏙️ Bergen Bryggen","🏝️ Lofoten Islands","⛰️ Jotunheimen National Park","🏙️ Ålesund Art Nouveau","🌊 Atlantic Road","🏛️ Viking Ship Museum, Oslo","🌿 Hardangerfjord"], regions:["🏙️ Oslo & South Norway","🌊 Bergen & Fjords","🌌 Tromsø & Arctic North","🏝️ Lofoten Islands","🚂 Flåm & Sognefjord","🏔️ Jotunheimen & Inland"] },
  "Austria":         { general:["🎵 Classical music concert","🎠 Christmas market visit","🎿 Skiing & snowboarding","☕ Vienna coffee house culture","🚴 Cycling the Danube","🏛️ Art & architecture tour","🎬 Sound of Music tour","🏊 Lake swimming","🐎 Spanish Riding School","🍷 Wine tasting","🏔️ Alpine gliding","🧖 Spa & wellness"], landmarks:["🏰 Schönbrunn Palace, Vienna","🏘️ Hallstatt Lake Village","🏙️ Salzburg Old Town","🏙️ Innsbruck Old Town","⛪ St Stephen's Cathedral, Vienna","🖼️ Belvedere Palace","⛪ Melk Abbey","🏔️ Grossglockner Mountain","🏛️ Hofburg Palace, Vienna","🎭 Vienna State Opera","🌊 Wachau Valley","🏔️ Dachstein Glacier"], regions:["🏙️ Vienna","🎵 Salzburg & Mozart Country","🏔️ Tyrol & Innsbruck","🏘️ Hallstatt & Salzkammergut","🍷 Styria & Graz","🌊 Carinthia & Lakes"] },
  "Switzerland":     { general:["🎿 Skiing & snowboarding","🧀 Chocolate & cheese tour","🚂 Scenic mountain train","🥾 Alpine hiking","🪂 Paragliding","⛵ Lake Geneva cruise","⌚ Watchmaking tour","🌸 Alpine flower walk","🫕 Fondue evening","🏔️ Jungfraujoch visit","🧊 Glacier walk","🚴 Cycle tour"], landmarks:["🏔️ Matterhorn, Zermatt","🏔️ Jungfraujoch, Top of Europe","🌊 Lake Geneva","🏙️ Interlaken","💧 Rhine Falls","🌉 Chapel Bridge, Lucerne","🏘️ Grindelwald","🚂 Glacier Express Route","🏰 Chillon Castle","🏙️ Bern Old Town (UNESCO)","🌿 Swiss National Park","🏔️ St Moritz"], regions:["🏔️ Bernese Oberland (Interlaken)","🏔️ Valais & Zermatt","🌊 Lake Geneva & Lausanne","🌉 Lucerne & Central","🏔️ Graubünden & St Moritz","🏙️ Zurich & North"] },
  "Czech Republic":  { general:["🍺 Beer tasting & brewery tour","🏰 Castle & fortress visit","🎵 Classical music evening","🍽️ Prague food market tour","🚴 Cycling Bohemian countryside","🧖 Spa in Karlovy Vary","👻 Ghost tour, Prague","🏛️ Jewish history walk","🎿 Giant Mountains skiing","🛶 River rafting","🎭 Folk festival","🥃 Absinthe tasting"], landmarks:["🏙️ Prague Old Town Square","🏯 Prague Castle","🌉 Charles Bridge","🏘️ Český Krumlov (UNESCO)","💀 Kutná Hora Bone Church","🌿 Bohemian Paradise","🧖 Karlovy Vary Colonnades","🍺 Pilsner Urquell Brewery","🏛️ Terezín Memorial","⛪ Olomouc Holy Column","🏘️ Telč Old Town","🏛️ Brno Cathedral"], regions:["🏙️ Prague & Central Bohemia","🏘️ South Bohemia & Krumlov","🧖 Karlovy Vary & West Bohemia","🍷 Moravia & Brno","🏔️ Giant Mountains","🌿 Bohemian Switzerland"] },
  "Ireland":         { general:["🍺 Pub culture & traditional music","🍺 Guinness Storehouse tour","🥾 Cliffside hiking","🏰 Castles & manor houses","🥃 Whiskey distillery visit","🏛️ Celtic heritage tour","⛳ Golf on links course","🦅 Falconry experience","🚴 Cycling the Wild Atlantic","📚 Literary Dublin tour","🐑 Sheep herding","🏊 Wild swimming"], landmarks:["🌊 Cliffs of Moher","🌿 Ring of Kerry","⛰️ Giant's Causeway","🏰 Rock of Cashel","🏰 Blarney Castle","🌿 Killarney National Park","🏝️ Skellig Michael","🏯 Dublin Castle","🌿 Glendalough","🏰 Bunratty Castle","🏝️ Aran Islands","🌊 Wild Atlantic Way"], regions:["🏙️ Dublin & East Coast","🌿 Kerry & Wild Atlantic Way","🎨 Galway & Connemara","⛰️ Northern Ireland & Causeway","🌊 Cork & South Coast","🏰 Shannon & Midlands"] },
  "Netherlands":     { general:["⛵ Canal boat tour","🌷 Tulip fields visit","🚴 Cycling countryside","🎨 Rijksmuseum art","🧀 Cheese market tour","🥃 Genever gin tasting","🌬️ Windmill visit","🌸 Flower auction tour","🍽️ Food market walk","🏺 Delft pottery workshop","🏖️ Beach at Zandvoort","👑 Royal palace visit"], landmarks:["🌊 Amsterdam Canals (UNESCO)","🌷 Keukenhof Tulip Gardens","🌬️ Kinderdijk Windmills (UNESCO)","🎨 Rijksmuseum, Amsterdam","📖 Anne Frank House","🏘️ Delft Old Town","🏛️ The Hague & Binnenhof","🌳 Zaanse Schans","🏙️ Maastricht Old Town","🏛️ Utrecht Dom Tower","🏖️ Scheveningen Beach","🚲 Haarlem Cycling Route"], regions:["🏙️ Amsterdam & North Holland","🏛️ The Hague & South Holland","🏰 Utrecht & Central","🌊 Zeeland & Delta","🍺 Maastricht & South","🌷 Haarlem & Flower Region"] },
  // ── Asia ────────────────────────────────────────────────────────────────────
  "Thailand":        { general:["🤿 Snorkelling","🐠 Scuba diving","🧘 Yoga & wellness","🍜 Thai cooking class","🐘 Elephant sanctuary","🛶 River kayaking","🌿 Jungle trekking","🧖 Thai massage","🌅 Island hopping","🥊 Muay Thai","🎣 Deep sea fishing","🏍️ Motorbike touring"], landmarks:["🏯 Grand Palace, Bangkok","🛕 Wat Pho (Reclining Buddha)","🌟 Golden Buddha (Wat Traimit)","🏝️ Ko Phi Phi","🪨 Railay Beach","🌊 Similan Islands","🌸 Chiang Mai Old City","💧 Erawan Waterfalls","🌉 Chiang Rai White Temple","⛵ Phang Nga Bay","🌴 Koh Samui","🏙️ Chatuchak Market"], regions:["🏙️ Bangkok","🌴 Southern Islands","🏔️ Chiang Mai & North","🌊 Andaman Coast","🌅 Gulf of Thailand"] },
  "Japan":           { general:["🍣 Sushi & ramen food tour","🎌 Tea ceremony","🏯 Samurai experience","♨️ Onsen (hot springs)","🌸 Cherry blossom viewing","🎎 Ryokan stay","⛷️ Skiing","🎋 Bamboo forest walk","🏔️ Mount Fuji hike","🎮 Anime & pop culture","🥋 Martial arts","🚅 Shinkansen bullet train"], landmarks:["⛩️ Fushimi Inari, Kyoto","🏯 Osaka Castle","🗼 Tokyo Tower","🦌 Nara Deer Park","🎋 Arashiyama Bamboo Grove","⛩️ Meiji Shrine, Tokyo","🏔️ Hakone (Mt Fuji views)","🏯 Himeji Castle","🛕 Senso-ji, Asakusa","🌊 Miyajima Island","🌉 Akihabara","🌿 Kenroku-en Garden"], regions:["🏙️ Tokyo","🎎 Kyoto & Nara","🍜 Osaka & Kobe","🏔️ Hakone & Fuji","❄️ Hokkaido","🌊 Hiroshima & Miyajima"] },
  "Sri Lanka":       { general:["🐘 Wildlife safari","🐢 Turtle watching","🤿 Snorkelling & diving","🍵 Tea plantation tour","🚂 Scenic train journey","🧘 Ayurveda wellness","🏄 Surfing","🐋 Whale watching","🌿 Rainforest trekking","🍛 Cooking class","🏄 Kitesurfing","🎣 Deep sea fishing"], landmarks:["🪨 Sigiriya Rock Fortress","🏛️ Polonnaruwa","🛕 Temple of the Tooth, Kandy","🌿 Sinharaja Rainforest","🌊 Galle Dutch Fort","🐘 Yala National Park","⛰️ Adam's Peak","🏖️ Mirissa Beach","🌅 Tangalle","🐊 Bundala National Park","💧 Ravana Falls","🌸 Udawalawe Elephant Transit"], regions:["🏙️ Colombo & Negombo","🪨 Cultural Triangle","🍵 Hill Country & Ella","🌊 South Coast","🐘 Yala & Safari Belt","🏰 Galle & the Fort"] },
  "Vietnam":         { general:["🍜 Street food tour","🏍️ Motorbike adventure","🍳 Cooking class","⛵ Ha Long Bay boat trip","🏮 Lantern making, Hoi An","☕ Vietnamese coffee culture","🚴 Cycling rice fields","🦇 Cave exploring","🚣 Kayaking","🏜️ Sand dune buggy","🛶 Mekong Delta cruise","🌊 Sea kayaking"], landmarks:["⛵ Ha Long Bay","🏮 Hoi An Ancient Town","🏛️ My Son Sanctuary","🏯 Hue Imperial City","🦇 Phong Nha Caves","🛶 Mekong Delta","🏛️ Ho Chi Minh Mausoleum","🌾 Sa Pa Rice Terraces","⛵ Ninh Binh","🪖 Cu Chi Tunnels","🪨 Marble Mountains","🏜️ Mui Ne Sand Dunes"], regions:["🏙️ Hanoi & North Vietnam","⛵ Ha Long Bay","🏮 Hue, Hoi An & Da Nang","🏙️ Ho Chi Minh City & South","🛶 Mekong Delta","🌾 Sa Pa & Highlands"] },
  "India":           { general:["🏯 Golden Triangle tour","🧘 Yoga & meditation retreat","🐯 Tiger safari","🚣 Kerala backwaters","🛕 Varanasi spiritual experience","🎨 Rajasthan palace stays","🍛 Spice market & cooking class","🎈 Hot air balloon, Jaipur","🌸 Holi festival","🎬 Bollywood tour","🍵 Tea plantation walk","🐘 Elephant conservation"], landmarks:["🕌 Taj Mahal, Agra","🏯 Amber Fort, Jaipur","🛕 Varanasi Ghats","🏛️ Hampi Ruins","🚣 Kerala Backwaters","🐯 Ranthambore Tiger Reserve","⛪ Golden Temple, Amritsar","🏜️ Jaisalmer Desert Fort","🏛️ Mysore Palace","🗿 Ellora Caves","🌸 Hawa Mahal, Jaipur","🏛️ Udaipur City Palace"], regions:["🏙️ Delhi & Golden Triangle","🏯 Rajasthan","🌴 Kerala & South India","🏙️ Mumbai & Maharashtra","🏖️ Goa","🏔️ North India & Himalayas"] },
  "Cambodia":        { general:["🌅 Angkor Wat sunrise tour","🍳 Khmer cooking class","⛵ Boat trip on Tonlé Sap","🚴 Cycling temple ruins","🧵 Silk weaving workshop","🛺 Tuk-tuk city tour","🚂 Bamboo train ride","🎭 Traditional dance show","🌿 Jungle trek","🚣 River kayaking","🍽️ Food market tour","🐘 Elephant sanctuary"], landmarks:["🛕 Angkor Wat","🗿 Bayon Temple, Angkor Thom","🌿 Ta Prohm (Tomb Raider Temple)","🏛️ Phnom Penh Royal Palace","🕊️ Killing Fields Memorial","🌊 Tonlé Sap Lake","🏛️ Preah Vihear","🏙️ Siem Reap Night Market","🌶️ Kampot Pepper Farms","🐬 Irrawaddy Dolphins","🏝️ Koh Rong Islands","🚂 Battambang Bamboo Train"], regions:["🛕 Siem Reap & Angkor","🏙️ Phnom Penh & South","🏖️ Sihanoukville & Coast","🚂 Battambang & Northwest","🌿 Kampot & South Coast","🌊 Mekong Northeast"] },
  "Nepal":           { general:["🏔️ Everest Base Camp trek","🌄 Himalayan sunrise viewing","🚣 White water rafting","🐯 Jungle safari, Chitwan","🚵 Mountain biking","🧘 Meditation & yoga retreat","🛕 Buddhist monastery tour","🪂 Paragliding over Pokhara","🏔️ Annapurna Circuit trek","🛶 Trishuli river rafting","🦏 Wildlife safari","🏛️ Cultural tour, Kathmandu"], landmarks:["🏔️ Everest Base Camp","🏔️ Annapurna Circuit","🏛️ Kathmandu Durbar Square","🛕 Pashupatinath Temple","🛕 Boudhanath Stupa (UNESCO)","🌊 Pokhara & Phewa Lake","🐊 Chitwan National Park","🏛️ Patan Durbar Square","🛕 Swayambhunath (Monkey Temple)","🕊️ Lumbini (Buddha's birthplace)","🏘️ Namche Bazaar","🏔️ Langtang Valley"], regions:["🏛️ Kathmandu Valley","🏔️ Everest & Khumbu Region","🏔️ Annapurna & Pokhara","🐊 Chitwan & Terai","🏜️ Mustang","🏔️ Langtang & Helambu"] },
  "Singapore":       { general:["🍜 Hawker centre food tour","🌿 Gardens by the Bay visit","🛍️ Orchard Road shopping","🚢 Singapore River cruise","🎢 Universal Studios","🏛️ Heritage quarter walk","🍳 Singaporean cooking class","🦁 Night safari","🍸 Rooftop bar evening","🎨 Museum tour","🐼 Zoo visit","🎰 Marina Bay Sands"], landmarks:["🌿 Gardens by the Bay","🏙️ Marina Bay Sands","🏝️ Sentosa Island","🏛️ Chinatown Heritage Centre","🕌 Little India & Sri Mariamman","🍺 Clarke Quay","🐘 Singapore Zoo","🎢 Universal Studios Singapore","🌸 Botanic Gardens (UNESCO)","🏨 Raffles Hotel","🦁 Merlion Park","🍜 Maxwell Food Centre"], regions:["🏙️ Marina Bay & CBD","🏝️ Sentosa & South","🛍️ Orchard & Civic District","🕌 Chinatown & Little India","🌊 East Coast","🌿 Northern Singapore & Zoo"] },
  "South Korea":     { general:["🎤 K-culture & K-pop tour","🥩 Korean BBQ food tour","🛕 Temple stay experience","🥾 Hiking national parks","🏯 Palace & heritage walk","🥬 Kimchi making class","💄 Skincare & beauty shopping","🏮 Lantern festival","✈️ Jeju Island day trip","🥋 Taekwondo experience","🎨 Craft & pottery workshop","🌃 Night market"], landmarks:["🏯 Gyeongbokgung Palace, Seoul","🏘️ Bukchon Hanok Village","🚧 DMZ (Demilitarized Zone)","🌋 Jeju Island & Hallasan","📡 Namsan Tower, Seoul","🛕 Haeinsa Temple","🏖️ Haeundae Beach, Busan","🌿 Boseong Green Tea Fields","🏘️ Andong Hahoe Village","🎨 Gamcheon Culture Village, Busan","🏔️ Seoraksan National Park","🌸 Changdeokgung Secret Garden"], regions:["🏙️ Seoul & Gyeonggi","🌋 Jeju Island","🌊 Busan & South Coast","🏛️ Gyeongju & Silla Heritage","🏔️ Gangwon & Mountains","🌿 Jeonju & Southwest"] },
  "UAE":             { general:["🏜️ Desert safari & dune bashing","🏙️ Burj Khalifa observation deck","⛵ Dhow sunset cruise","🛍️ Gold & spice souk shopping","🐪 Camel ride & falconry","🚁 Helicopter city tour","🏖️ Beach & resort","🎿 Indoor ski slope","🍽️ Traditional cuisine tour","🏛️ Abu Dhabi cultural day","🚤 Speed boat tour","🌅 Desert sunrise camp"], landmarks:["🏙️ Burj Khalifa, Dubai","🏝️ Palm Jumeirah","🛍️ Dubai Mall","🕌 Sheikh Zayed Grand Mosque, Abu Dhabi","🏛️ Dubai Museum","🛒 Gold & Spice Souks, Deira","🏨 Burj Al Arab","🏜️ Desert Safari Dunes","🏎️ Ferrari World, Abu Dhabi","🪟 Dubai Frame","🎨 Louvre Abu Dhabi","🏖️ Jumeirah Beach"], regions:["🏙️ Dubai City","🕌 Abu Dhabi","🏜️ Dubai Desert & Safari","🎨 Sharjah & Culture","🏔️ Ras Al Khaimah & Mountains","🌊 Fujairah & East Coast"] },
  "Maldives":        { general:["🤿 Snorkelling","🌊 Scuba diving","🏝️ Overwater bungalow stay","🦈 Whale shark spotting","🐬 Sunset dolphin cruise","🛥️ Seaplane transfer","🍽️ Private island dining","💫 Bioluminescent beach walk","🪁 Kitesurfing","🎣 Reef fishing","🛶 Water sports","💆 Overwater spa"], landmarks:["🐠 Underwater Coral Reefs","🐟 Malé Fish Market","🤿 Banana Reef","🐟 Manta Point","🌟 Vaadhoo Bioluminescent Beach","🏙️ Malé City","🌿 Hulhumalé Beach","🕌 Old Friday Mosque","🌊 Emboodhoo Lagoon","🏝️ Rangali Island","🌴 Fulhadhoo Island","⛵ Dhoni Sunset Cruise"], regions:["🌊 North Malé Atoll","🏝️ South Malé Atoll","🐠 Ari Atoll","🌿 Baa Atoll & Biosphere Reserve","🤿 Lhaviyani Atoll","🌴 Southern Atolls"] },
  "Indonesia":       { general:["🌾 Rice terrace trekking","🛕 Temple ceremonies","🏄 Surfing","🧘 Yoga retreat","🍳 Cooking class","💧 Waterfall chasing","🤿 Snorkelling","🎭 Traditional dance show","🏖️ Beach club day","🚣 White water rafting","🚴 Cycling tour","🌊 Scuba diving"], landmarks:["🌊 Uluwatu Temple, Bali","🌾 Tegalalang Rice Terraces, Bali","🐒 Sacred Monkey Forest, Ubud","🌋 Mount Batur Volcano","💧 Tirta Empul Holy Spring","🌅 Tanah Lot, Bali","🏝️ Nusa Penida","🌿 Borobudur Temple, Java","🏞️ Komodo National Park","🌺 Lombok & Gili Islands","🏔️ Mount Rinjani, Lombok","⛵ Raja Ampat, Papua"], regions:["🌿 Ubud & Cultural Bali","🏖️ Seminyak & South Bali","🌊 Uluwatu & Bukit Peninsula","🏝️ Lombok & Gili Islands","🌋 Java & Yogyakarta","🐊 Komodo & East Indonesia"] },
  "Philippines":     { general:["🏝️ Island hopping","🌊 Scuba diving","🤿 Snorkelling","🏄 Surfing","🦈 Whale shark swimming","💧 Waterfall trekking","🌋 Volcano hiking","🌾 Rice terrace walk","🍽️ Food tour, Manila","🏛️ Colonial heritage walk","🌿 Mangrove kayaking","🌅 Sunset beach"], landmarks:["⛰️ Chocolate Hills, Bohol","🤿 Tubbataha Reef (UNESCO)","🌾 Rice Terraces, Ifugao (UNESCO)","🕳️ Puerto Princesa Underground River","🌋 Mayon Volcano","🏰 Intramuros, Manila","🏖️ Boracay White Beach","🏄 Siargao Cloud 9 Surf","⛵ Coron Islands, Palawan","🌾 Batad Rice Terraces","🌋 Taal Volcano","🏝️ El Nido, Palawan"], regions:["🏝️ Palawan & El Nido","🌊 Visayas & Cebu","🏄 Siargao & Mindanao","🏙️ Metro Manila & Luzon","⛰️ Bohol & Chocolate Hills","🌋 Batangas & South Luzon"] },
  "Bhutan":          { general:["🏯 Dzong fortress tour","🥾 Tiger's Nest hike","🧘 Buddhist monastery retreat","🎭 Tshechu festival","🏔️ Himalayan trekking","🌿 Butterfly Valley walk","♟️ Archery experience","🍲 Traditional Bhutanese meal","🚵 Mountain biking","🧶 Weaving workshop","📸 Photography tour","🐦 Rare bird watching"], landmarks:["🏯 Tiger's Nest (Paro Taktsang)","🏯 Punakha Dzong","🏯 Rinpung Dzong, Paro","🏔️ Dochula Pass & Chortens","🌿 Phobjikha Valley (Cranes)","🏛️ National Museum of Bhutan","🏘️ Thimphu Memorial Chorten","🕌 Buddha Dordenma Statue","🌲 Bumthang Sacred Valley","🏔️ Gangkhar Puensum (Highest Peak)","⛩️ Kyichu Lhakhang","🌿 Jigme Dorji National Park"], regions:["🏯 Paro & West Bhutan","🏙️ Thimphu","🌿 Punakha & Central","🦅 Bumthang & Sacred Valleys","🏔️ Trekking Regions","🌄 East Bhutan"] },
  "Malaysia":        { general:["🍜 Street food & hawker trail","🌿 Rainforest canopy walk","🏄 Beach holiday","🤿 Diving & snorkelling","🐘 Wildlife safari","🏯 Colonial heritage walk","🛕 Temple tour","🛍️ Kuala Lumpur shopping","☕ Cameron Highlands tea","🌊 Island hopping","🦧 Orangutan sanctuary","🚵 Jungle mountain biking"], landmarks:["🏙️ Petronas Twin Towers, KL","🌿 Bako National Park, Sarawak","🦧 Sepilok Orangutan Sanctuary","🌊 Perhentian Islands","🤿 Sipadan Island Diving","🏯 George Town (UNESCO), Penang","🏞️ Kinabalu National Park (UNESCO)","🌿 Taman Negara Rainforest","🏝️ Langkawi Geopark","🌺 Cameron Highlands Tea","🐘 Borneo Elephant Sanctuary","🏙️ Malacca Old Town (UNESCO)"], regions:["🏙️ Kuala Lumpur & West Coast","🏝️ Langkawi & Penang","🌊 Perhentian & East Coast","🦧 Sabah & Borneo","🌿 Sarawak & Rainforest","🏖️ Tioman & South"] },
  "Laos":            { general:["🛶 Mekong river cruise","🐘 Elephant sanctuary visit","🛕 Temple & Buddhist tour","🍳 Lao cooking class","🚴 Cycling countryside","🏄 Vang Vieng kayaking","💧 Kuang Si waterfall swim","🌿 Jungle trekking","🏛️ Ancient plain of jars","🎭 Traditional performance","⛵ Slow boat journey","🧘 Meditation retreat"], landmarks:["🛕 Luang Prabang (UNESCO World Heritage)","💧 Kuang Si Waterfalls","🛕 Pha That Luang, Vientiane","🏛️ Plain of Jars, Xieng Khouang","🌊 Mekong River Sunset","⛵ Si Phan Don (Four Thousand Islands)","🕌 Patuxai Monument, Vientiane","🌿 Nam Et-Phou Louey National Park","🏯 Vang Vieng Landscape","🌾 Bolaven Plateau Coffee","🛕 Wat Xieng Thong, Luang Prabang","🐘 Elephant Conservation Centre"], regions:["🛕 Luang Prabang","🏙️ Vientiane & Central","🏄 Vang Vieng & North","🌿 Bolaven Plateau & South","⛵ Si Phan Don (4000 Islands)","🏔️ Phonsavan & Jars"] },
  // ── Africa ──────────────────────────────────────────────────────────────────
  "Kenya":           { general:["🦁 Big Five safari","🎈 Hot air balloon, Masai Mara","👥 Maasai village visit","🦬 Great Migration viewing","🏖️ Beach holiday","🤿 Snorkelling & diving","🦩 Flamingo lake tour","🏔️ Mount Kenya hike","🦜 Birdwatching","🌅 Bush sundowner","🌙 Night game drive","📸 Wildlife photography"], landmarks:["🦁 Masai Mara National Reserve","🏔️ Amboseli (Kilimanjaro views)","🐘 Tsavo National Park","🦩 Lake Nakuru Flamingos","🦏 Nairobi National Park","🏘️ Lamu Old Town (UNESCO)","🏖️ Diani Beach","🏔️ Mount Kenya (UNESCO)","🐘 Ol Pejeta Conservancy","🌊 Watamu Marine Park","🌋 Great Rift Valley","🦒 Giraffe Centre, Nairobi"], regions:["🦁 Masai Mara & Rift Valley","🐘 Amboseli & Tsavo","🏙️ Nairobi & Central Kenya","🏖️ Kenyan Coast & Lamu","🏜️ Northern Kenya","🏔️ Mount Kenya Region"] },
  "Tanzania":        { general:["🏔️ Kilimanjaro climb","🦁 Serengeti safari","🏖️ Zanzibar beach","🦬 Wildebeest migration","⛵ Dhow sunset cruise","🌋 Ngorongoro Crater safari","🤿 Zanzibar snorkelling","🌿 Spice farm tour","👥 Village cultural visit","🦜 Birdwatching","🌊 Diving, Pemba Island","👥 Maasai encounter"], landmarks:["🦁 Serengeti National Park (UNESCO)","🏔️ Kilimanjaro Summit (UNESCO)","🌋 Ngorongoro Crater (UNESCO)","🏘️ Zanzibar Stone Town (UNESCO)","🌿 Selous Game Reserve (UNESCO)","🐘 Tarangire National Park","🦩 Lake Manyara","🦧 Mahale Mountains (chimpanzees)","🏝️ Pemba Island","🌶️ Spice Farms, Zanzibar","🦧 Gombe Stream (Jane Goodall)","🌿 Ruaha National Park"], regions:["🦁 Serengeti & Ngorongoro","🏖️ Zanzibar & Coast","🏔️ Kilimanjaro & Arusha","🌿 Southern Tanzania & Selous","🦧 Western Parks (Mahale/Gombe)","🏙️ Dar es Salaam & North Coast"] },
  "South Africa":    { general:["🦁 Safari game drive","🍷 Cape wine tasting","🦈 Shark cage diving","🥾 Table Mountain hike","🏛️ Robben Island tour","🐋 Whale watching","🪂 Bungee jumping","🐧 Penguin beach visit","🌊 Cape Point scenic drive","🏛️ Soweto township tour","🏄 Surfing","🎻 Township jazz evening"], landmarks:["🏔️ Table Mountain, Cape Town","🌊 Cape of Good Hope","🦁 Kruger National Park","🏛️ Robben Island (UNESCO)","🍷 Cape Winelands (Stellenbosch)","🌿 Garden Route","🐧 Boulders Penguin Colony","🏔️ Drakensberg Mountains (UNESCO)","🌊 Blyde River Canyon","⛵ Victoria & Alfred Waterfront","🌄 Panorama Route","🦏 Hluhluwe-iMfolozi Game Reserve"], regions:["🏔️ Cape Town & Western Cape","🌿 Garden Route","🦁 Kruger & Mpumalanga","🏙️ Johannesburg & Gauteng","🌊 Durban & KwaZulu-Natal","🌵 Northern Cape & Kalahari"] },
  "Egypt":           { general:["🏛️ Pyramid & Sphinx visit","🚢 Nile cruise","🤿 Red Sea snorkelling","🏛️ Luxor temple tour","🐪 Camel ride at Giza","🌟 Sound & light show","🍳 Egyptian cooking class","🛒 Khan el-Khalili souk","⛵ Felucca sailing","🎈 Hot air balloon over Luxor","🤿 Scuba diving, Dahab","🎵 Traditional music evening"], landmarks:["🏛️ Pyramids of Giza & Great Sphinx","🏛️ Abu Simbel Temples","🛕 Luxor Temple","🏛️ Valley of the Kings","🛕 Karnak Temple Complex","🏛️ Egyptian Museum, Cairo","🚢 Nile River Cruise","🌊 Red Sea Coral Reefs","🌿 White Desert National Park","🌴 Siwa Oasis","🏛️ Philae Temple, Aswan","🛒 Khan el-Khalili Bazaar"], regions:["🏛️ Cairo & Giza","🛕 Luxor & Upper Egypt","🌊 Aswan & Nubia","🤿 Red Sea & Hurghada","🏜️ Sinai & Dahab","🌊 Alexandria & Mediterranean"] },
  "Morocco":         { general:["🐪 Sahara camel trek","🏺 Medina souk exploration","🍵 Mint tea ceremony","🏄 Surfing, Taghazout","🧖 Traditional hammam","🏔️ Atlas Mountains hike","🎨 Ceramics workshop","🍲 Moroccan cooking class","🌊 Essaouira kite surfing","🎸 Gnawa music evening","🌿 Argan oil cooperative","🏇 Horse riding in dunes"], landmarks:["🕌 Jemaa el-Fna, Marrakech","🌹 Majorelle Garden","🏰 Aït Benhaddou Kasbah (UNESCO)","🏙️ Fes el-Bali Medina (UNESCO)","🔵 Chefchaouen Blue City","🏜️ Erg Chebbi Sand Dunes","🌊 Essaouira Medina (UNESCO)","🕌 Hassan II Mosque, Casablanca","⛰️ Toubkal Summit","🌿 Ourika Valley","🏛️ Meknes & Volubilis","🌅 Draa Valley"], regions:["🌺 Marrakech","🏙️ Fes & Meknes","🌊 Essaouira & Atlantic Coast","🏜️ Sahara & South","🏔️ Atlas Mountains","🔵 Chefchaouen & North"] },
  "Seychelles":      { general:["🤿 Snorkelling","🌊 Scuba diving","🏝️ Island hopping by ferry","🏖️ Beach relaxation","🦜 Birdwatching","⛵ Sailing catamaran","🥾 Nature trail hiking","🐢 Giant tortoise encounter","🚣 Kayaking","🐬 Dolphin watching","🎣 Deep sea fishing","🌅 Sunset cruise"], landmarks:["🏖️ Anse Source d'Argent, La Digue","🌿 Vallée de Mai, Praslin (UNESCO)","🏙️ Victoria Market & Clock Tower","🏝️ Aldabra Atoll (UNESCO)","🌊 Beau Vallon Beach, Mahé","🌿 Morne Seychellois National Park","🐦 Bird Island","🏖️ Anse Intendance, Mahé","🌺 Moyenne Island","🦜 Cousin Island Bird Sanctuary","🏘️ La Digue L'Union Estate","🏝️ Silhouette Island"], regions:["🌊 Mahé & Victoria","🏖️ Praslin & Anse Lazio","🚴 La Digue & Inner Islands","🏝️ Outer Islands","🏔️ North Mahé","🌿 South Mahé & Wilderness"] },
  "Rwanda":          { general:["🦍 Gorilla trekking","🐒 Golden monkey tracking","⛵ Lake Kivu boat trip","🥾 Volcano hiking","🦜 Birdwatching","🏛️ Genocide memorial visit","🚴 Cycling tea country","☕ Coffee plantation tour","🌿 Nyungwe rainforest walk","🐊 Akagera safari","🎭 Cultural village visit","🍽️ Rwandan food experience"], landmarks:["🦍 Volcanoes National Park (Gorillas)","🐒 Golden Monkeys, Virungas","🌿 Nyungwe Forest National Park","🐊 Akagera National Park","🌊 Lake Kivu","🏛️ Kigali Genocide Memorial","🏛️ Presidential Palace Museum","🌋 Mount Bisoke Volcano","⛩️ King's Palace Museum, Nyanza","☕ Gisenyi & Lake Shore","🌿 Gishwati Forest Reserve","🐦 Bird Sanctuary, Rubavu"], regions:["🌋 Volcanoes & Gorilla Country","🌿 Nyungwe & Southwest","🐊 Akagera & East","🌊 Lake Kivu & Gisenyi","🏙️ Kigali","🌲 Northern Province"] },
  "Namibia":         { general:["🌵 Desert dune climb","🦁 Safari game drive","🐘 Desert-adapted wildlife","🌅 Sossusvlei sunrise","🏛️ Colonial history walk","🤿 Skeleton Coast","🚵 Quad biking dunes","🦒 Etosha wildlife drive","⭐ Stargazing (darkest skies)","🏔️ Fish River Canyon hike","👥 San Bushman culture","🚗 Self-drive road trip"], landmarks:["🌵 Sossusvlei & Dead Vlei (UNESCO)","🦁 Etosha National Park","🌊 Skeleton Coast","🏛️ Lüderitz & Kolmanskop Ghost Town","🐘 Damaraland Rock Engravings","⛰️ Fish River Canyon","🌿 Caprivi Strip (Bwabwata)","🌊 Cape Cross Seal Colony","🏙️ Swakopmund","🌿 Waterberg Plateau","👥 Himba Cultural Village","🌵 Namib Desert (Oldest Desert)"], regions:["🌵 Sossusvlei & Namib Desert","🦁 Etosha National Park","🌊 Skeleton Coast & Damaraland","🏙️ Swakopmund & Coast","⛰️ Fish River Canyon & South","🌿 Caprivi Strip & North"] },
  // ── Americas ────────────────────────────────────────────────────────────────
  "USA":             { general:["🏔️ National parks road trip","🏙️ City food & culture tour","🎸 Live music venue","🏖️ Beach holiday","🎢 Theme park","🍷 Wine & craft beer tasting","🐋 Whale watching","🎿 Ski resort","🏛️ Museum tour","⚾ Baseball game","🚣 Kayaking & outdoor adventure","🎭 Broadway show"], landmarks:["🌋 Grand Canyon National Park","🗽 Statue of Liberty, New York","🌋 Yellowstone National Park","🌉 Golden Gate Bridge, San Francisco","🏙️ Times Square, New York","🎢 Walt Disney World, Florida","💧 Niagara Falls","🌿 Yosemite Valley","🏙️ Las Vegas Strip","🌺 Hawaii Volcanoes National Park","🎬 Hollywood Walk of Fame","⛵ Miami South Beach"], regions:["🗽 New York & East Coast","🌊 California & West Coast","🌴 Florida & South","🤠 Texas & Southwest","🍁 New England","🌺 Hawaii & Pacific"] },
  "Canada":          { general:["🐋 Whale watching","🌌 Northern Lights viewing","🚣 Canoeing & kayaking","🏔️ Rocky Mountain hiking","🍁 Maple syrup tasting","🏙️ City food tour","🎿 Skiing & snowboarding","🦌 Wildlife watching","💧 Niagara Falls","🥊 Ice hockey game","🌊 Coastal sailing","🦅 Eagle watching"], landmarks:["💧 Niagara Falls","🏔️ Banff National Park (UNESCO)","🏙️ CN Tower, Toronto","🏘️ Quebec Old City (UNESCO)","🎿 Whistler Ski Resort","🌌 Northern Lights, Yukon","🌿 Cabot Trail, Nova Scotia","🏛️ Parliament Hill, Ottawa","🌿 Stanley Park, Vancouver","🏔️ Icefields Parkway","🏝️ Prince Edward Island","🌿 Algonquin Provincial Park"], regions:["🌲 British Columbia & Vancouver","🏔️ Alberta & Rockies","🏙️ Ontario & Toronto","🍁 Quebec & French Canada","🌊 Maritime Provinces","❄️ Yukon & Northern Canada"] },
  "Mexico":          { general:["🏛️ Ancient ruins tour","🍳 Mexican cooking class","🥃 Tequila & mezcal tasting","💧 Cenote swimming","🐋 Whale watching","🤿 Scuba diving","🎭 Lucha Libre show","💀 Day of the Dead","🏄 Surfing","💃 Salsa dancing","🌮 Street taco tour","🌿 Jungle zip-lining"], landmarks:["🏛️ Chichen Itza (UNESCO)","🏛️ Teotihuacán Pyramids","🌊 Tulum Ruins","🌿 Palenque Ruins (UNESCO)","💧 Cenote Dos Ojos","⛰️ Copper Canyon","🏙️ Mexico City Zócalo","🎨 Frida Kahlo Museum","🏛️ Monte Albán (UNESCO)","💙 Bacalar Lagoon","💧 Hierve el Agua","⛪ San Cristóbal de las Casas"], regions:["🏙️ Mexico City","🌊 Yucatán & Riviera Maya","🎨 Oaxaca","🌿 Chiapas","🌊 Pacific Coast (Puerto Vallarta)","🌵 Baja California"] },
  "Costa Rica":      { general:["🌿 Rainforest canopy tour","🌋 Volcano hike","🚣 White water rafting","🐢 Turtle nesting watch","🏄 Surfing","🦜 Wildlife spotting","🪂 Zip-lining","♨️ Hot spring bathing","☕ Coffee plantation visit","🚣 Sea kayaking","🤿 Snorkelling","💧 Waterfall swim"], landmarks:["🌋 Arenal Volcano","🌿 Manuel Antonio National Park","🌫️ Monteverde Cloud Forest","🌿 Corcovado National Park","🌋 Poás Volcano","🐊 Tortuguero Canals (Turtles)","🌿 Carara National Park","🏖️ Tamarindo Beach","💧 Rio Celeste & Tenorio Volcano","🦜 La Paz Waterfall Gardens","🏝️ Osa Peninsula","🌿 Sarapiquí Rainforest"], regions:["🌋 Arenal & La Fortuna","🌫️ Monteverde & Cloud Forest","🌿 Manuel Antonio & Pacific South","🏖️ Guanacaste & Pacific North","🐊 Caribbean Coast (Tortuguero)","🏙️ San José & Central Valley"] },
  "Peru":            { general:["🏔️ Inca Trail trek","🚂 Train to Machu Picchu","🌿 Amazon jungle expedition","🍽️ Lima food & ceviche tour","🚣 Lake Titicaca boat trip","🦙 Alpaca & llama encounter","🏛️ Archaeology & ruins","✈️ Nazca Lines flight","🎭 Peruvian folklore show","⛰️ Colca Canyon condors","🛶 Reed island visit","🏄 Surfing, Máncora"], landmarks:["🏔️ Machu Picchu (UNESCO)","🌿 Amazon Rainforest","🌊 Lake Titicaca","🏛️ Cusco Old City (UNESCO)","🦅 Colca Canyon","✈️ Nazca Lines (UNESCO)","🏙️ Lima Historic Centre","🏯 Sacsayhuamán Fortress","🌄 Rainbow Mountain","🌿 Manu National Park (UNESCO)","🏺 Larco Museum, Lima","💧 Huacachina Oasis"], regions:["🏙️ Lima","🏔️ Cusco & Sacred Valley","🌿 Amazon Basin","🌊 Lake Titicaca","🦅 Arequipa & Colca","🏖️ Northern Coast"] },
  "Brazil":          { general:["🎭 Carnival celebrations","🌿 Amazon jungle tour","🌊 Iguazú Falls visit","🏖️ Beach volleyball, Copacabana","💃 Samba dancing class","🍹 Food & caipirinha tour","🐊 Pantanal wildlife","🏔️ Christ the Redeemer","🏘️ Favela tour","🤿 Scuba diving","🏄 Surfing","🏛️ Colonial heritage walk"], landmarks:["🏔️ Christ the Redeemer, Rio","🌊 Iguazú Falls (UNESCO)","🌿 Amazon Rainforest","🏖️ Copacabana Beach","⛰️ Sugarloaf Mountain","🐊 Pantanal Wetlands (UNESCO)","🏝️ Fernando de Noronha","🏛️ Salvador Pelourinho (UNESCO)","🌿 Lençóis Maranhenses","🌊 Bonito Ecotourism","🏛️ Ouro Preto (UNESCO)","🏘️ Olinda (UNESCO)"], regions:["🏖️ Rio de Janeiro","🌿 Amazon (Manaus)","🌊 Iguazú & South","🏛️ Salvador & Northeast","🏙️ São Paulo","🐊 Pantanal & Midwest"] },
  "Argentina":       { general:["💃 Tango dancing lesson","🍷 Malbec wine tasting","🏔️ Patagonia trekking","🌊 Iguazú Falls visit","🥩 Steak & BBQ asado","🧊 Glacier visit","⚽ Football match","🐎 Gaucho ranch stay","🐋 Whale watching","🎿 Ski resort","🏇 Polo match","🏙️ Buenos Aires food tour"], landmarks:["🧊 Perito Moreno Glacier (UNESCO)","🌊 Iguazú Falls (UNESCO)","🏘️ Buenos Aires San Telmo","🌈 Quebrada de Humahuaca (UNESCO)","🌿 Bariloche & Nahuel Huapi","🍷 Mendoza Wine Region","🏙️ Ushuaia (End of the World)","🌊 Tigre Delta","🏔️ El Calafate & Los Glaciares","🐧 Valdés Peninsula (UNESCO)","🍷 Cafayate Wine Route","🌿 Iberá Wetlands"], regions:["🏙️ Buenos Aires & Pampas","🧊 Patagonia & El Calafate","🍷 Mendoza & Wine Country","🌊 Iguazú & Northeast","🌿 Bariloche & Lake District","🏔️ Ushuaia & Tierra del Fuego"] },
  "Cuba":            { general:["🚗 Classic car tour, Havana","💃 Salsa dancing class","🚬 Cigar factory visit","🥃 Rum tasting","🏛️ Colonial architecture walk","🤿 Snorkelling & diving","🏖️ Beach holiday","🎵 Jazz & live music evening","🌆 Vintage Havana walk","🌾 Tobacco plantation","🚴 Cycling countryside","🎣 Deep sea fishing"], landmarks:["🏙️ Havana Old City (UNESCO)","🌿 Viñales Tobacco Valley (UNESCO)","🏘️ Trinidad (UNESCO)","🌊 Bay of Pigs","🏛️ El Capitolio, Havana","🏝️ Cayo Santa María","🌆 Malecón, Havana","⛰️ Sierra Maestra","🏘️ Santiago de Cuba","🏛️ Cienfuegos Colonial (UNESCO)","🏖️ Varadero Beach","🌿 Topes de Collantes"], regions:["🏙️ Havana & West","🌿 Viñales & Pinar del Río","🏘️ Trinidad & Central Cuba","🏝️ Cayo Santa María & North","🎵 Santiago & East Cuba","🏖️ Varadero & Beach Resorts"] },
  // ── Oceania ─────────────────────────────────────────────────────────────────
  "New Zealand":     { general:["🪂 Skydiving","🏔️ Glacier hiking","🎬 Hobbiton tour","🎭 Māori cultural experience","🍷 Wine tasting","🚣 Kayaking Fiordland","🐋 Whale watching","⛷️ Skiing & snowboarding","♨️ Geothermal spa","🪲 Glowworm cave tour","🌊 Sandboarding","🏄 Surfing"], landmarks:["🌊 Milford Sound","🎬 Hobbiton, Matamata","🏔️ Tongariro Alpine Crossing","♨️ Rotorua Geothermal","🏖️ Bay of Islands","🧊 Franz Josef Glacier","🏙️ Queenstown","🌿 Abel Tasman National Park","🪲 Waitomo Glowworm Caves","🦅 Fiordland National Park","🌁 Auckland Sky Tower","🦜 Kaikōura Coast"], regions:["🌆 Auckland & Northland","♨️ Rotorua & Bay of Plenty","🏛️ Wellington & Wairarapa","🍷 Marlborough & Nelson","🏔️ Queenstown & Fiordland","🧊 West Coast & Glaciers"] },
  "Fiji":            { general:["🤿 Snorkelling & scuba diving","🏝️ Island hopping","🏖️ Beach relaxation","👥 Village kava ceremony","🚣 Sea kayaking","🏄 Surfing","🌊 Coral reef walk","🎣 Deep sea fishing","🎭 Meke cultural show","🐋 Whale watching","⛵ Catamaran sailing","💧 Jungle waterfall trek"], landmarks:["🤿 Great Astrolabe Reef","🏝️ Mamanuca Islands","🏝️ Yasawa Islands","🌊 Coral Coast, Viti Levu","🌺 Garden of the Sleeping Giant","🏜️ Sigatoka Sand Dunes (UNESCO)","🏘️ Navala Traditional Village","🤿 Taveuni Rainbow Reef","🏛️ Suva Cultural Centre","🏖️ Natadola Beach","🌿 Bouma Heritage Park, Taveuni","🤿 Beqa Lagoon (Shark Dive)"], regions:["🌊 Viti Levu & Coral Coast","🏝️ Mamanuca Islands","🏝️ Yasawa Islands","🤿 Taveuni & Vanua Levu","🦈 Kadavu & Astrolabe Reef","🏙️ Suva & East Viti Levu"] },
  "Australia":       { general:["🤿 Great Barrier Reef snorkel","🏄 Surfing","🦘 Wildlife spotting","🍷 Wine tasting","🏜️ Outback safari","🪃 Aboriginal culture tour","🐋 Whale watching","🥾 Bushwalking","🎣 Deep sea fishing","⛵ Sailing the Whitsundays","🐊 Crocodile cruise","🌊 Sea kayaking"], landmarks:["🎭 Sydney Opera House","🏖️ Bondi Beach","🪨 Uluru (Ayers Rock)","🐠 Great Barrier Reef (UNESCO)","🌊 Great Ocean Road","🌿 Daintree Rainforest (UNESCO)","🏝️ Whitsunday Islands","🏔️ Blue Mountains","🐊 Kakadu National Park (UNESCO)","🌉 Sydney Harbour Bridge","🌆 Melbourne laneways","🌺 King's Park, Perth"], regions:["🌉 Sydney & New South Wales","🎨 Melbourne & Victoria","🌴 Queensland & Gold Coast","🐠 Great Barrier Reef","🪨 Uluru & Red Centre","🌊 Western Australia"] },
  // ── Middle East ─────────────────────────────────────────────────────────────
  "Israel":          { general:["🕌 Jerusalem Old City tour","🌊 Dead Sea float","🥾 Negev Desert hiking","🏖️ Tel Aviv beach & food","🏛️ Masada sunrise","⛵ Sea of Galilee boat trip","🏛️ Archaeological site visit","🍷 Wine tasting, Galilee","🤿 Scuba diving, Red Sea","🕊️ Yad Vashem memorial","🥙 Falafel food trail","🐪 Bedouin desert camp"], landmarks:["🕍 Western Wall, Jerusalem","🕌 Dome of the Rock","🌊 Dead Sea","🏯 Masada Fortress (UNESCO)","🏙️ Tel Aviv Bauhaus City (UNESCO)","🌊 Sea of Galilee","⛪ Church of the Holy Sepulchre","🏛️ Caesarea Maritima","🌿 Rosh Hanikra","🏰 Acre Old City (UNESCO)","🌋 Makhtesh Ramon Crater","🌺 Baha'i Gardens, Haifa (UNESCO)"], regions:["🕌 Jerusalem & Old City","🏖️ Tel Aviv & Coast","🏜️ Dead Sea & Negev Desert","🌿 Galilee & North","🤿 Eilat & Red Sea","🌋 Golan Heights"] },
  "Jordan":          { general:["🏛️ Petra by night","🏜️ Wadi Rum desert camp","🌊 Dead Sea float","🐪 Camel trek","🏛️ Roman ruins tour","🥙 Jordanian cooking class","🧖 Traditional hammam","🥾 Hiking Dana Biosphere","🤿 Scuba diving, Aqaba","🍽️ Food tour, Amman","🏰 Castle trail","🌅 Desert sunset watching"], landmarks:["🏛️ Petra: Rose-Red City (UNESCO)","🏜️ Wadi Rum Desert (UNESCO)","🌊 Dead Sea","🏛️ Jerash Roman Ruins","🏯 Amman Citadel","🏰 Ajloun Castle","🗺️ Madaba Mosaic Map","🌿 Dana Biosphere Reserve","🤿 Aqaba Coral Reefs","🏛️ Um Qais (Gadara)","🏰 Karak Castle","💧 Wadi Mujib"], regions:["🏙️ Amman & North Jordan","🏛️ Petra & Wadi Musa","🏜️ Wadi Rum & South","🌊 Dead Sea & Rift Valley","🤿 Aqaba & Red Sea","🏛️ Jerash & Roman Sites"] },
  "Oman":            { general:["💧 Wadi trekking","⛵ Dhow cruise","🏜️ Desert camping","🏰 Ancient fort tour","🐬 Dolphin watching","🌊 Scuba diving","🐢 Turtle watching","🛒 Frankincense souk","🎨 Traditional craft workshop","🏘️ Fishing village walk","🧗 Rock climbing","🦅 Falconry experience"], landmarks:["🛒 Mutrah Souq, Muscat","🕌 Sultan Qaboos Grand Mosque","🏜️ Wahiba Sands Desert","💧 Wadi Shab","🏰 Nizwa Fort & Souq","🌊 Musandam Fjords","💧 Bimmah Sinkhole","🏔️ Jebel Akhdar Green Mountain","🐢 Ras al-Jinz Turtle Reserve","🕳️ Al Hoota Cave","🏰 Bahla Fort (UNESCO)","🏯 Jabrin Palace"], regions:["🏙️ Muscat & North Coast","🏰 Nizwa & Interior","🌿 Salalah & Dhofar","🌊 Musandam Peninsula","🏜️ Wahiba Sands & Eastern","🐢 Sur & Ras al-Jinz"] }
};

function Chip({ label, selected, onToggle }) {
  return (
    <span onClick={onToggle} style={{
      display:"inline-block", cursor:"pointer",
      border:`1.5px solid ${selected ? COLORS.gold : COLORS.stone}`,
      background: selected ? COLORS.mist : COLORS.white,
      color: selected ? COLORS.dusk : COLORS.ink,
      fontSize:"0.8rem", padding:"0.45rem 0.9rem",
      fontWeight: selected ? 500 : 400,
      userSelect:"none", transition:"all 0.15s"
    }}>{label}</span>
  );
}

function RadioChips({ options, value, onChange }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
      {options.map(o => (
        <Chip key={o.value} label={o.label} selected={value === o.value} onToggle={() => onChange(o.value)} />
      ))}
    </div>
  );
}

function ChipGroup({ items, selected, onToggle }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
      {items.map(item => (
        <Chip key={item} label={item} selected={selected.includes(item)} onToggle={() => onToggle(item)} />
      ))}
    </div>
  );
}

export default function JenVoyagePage() {
  const [screen, setScreen] = useState("hero");
  const [tIdx, setTIdx] = useState(0);
  const [heroDropdown, setHeroDropdown] = useState(null); // null | "what" | "how"

  useEffect(() => {
    const id = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const [step, setStep]   = useState(1);
  const [dest, setDest]   = useState(null);
  const [enquiryId, setEnquiryId] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [proceeding, setProceeding] = useState(false);
  const [form, setForm]   = useState({
    departDate:"", returnDate:"", departCountry:"", preferredAirport:"", preferredAirportOther:"",
    adults:"2", children:"0", childrenAges:"",
    pace:"", accom:"", rooms:"1", beds:"1", accomNotes:"", budget:2500,
    activities:[], landmarks:[], regions:[],
    dietary:[], accessibility:"", notes:"",
    firstName:"", lastName:"", email:"", phone:"", referral:"",
    continent:"", otherCountry:""
  });

  const upd = (k,v) => setForm(f => ({...f,[k]:v}));
  const toggleArr = (key,val) => setForm(f => {
    const arr = f[key];
    return {...f,[key]: arr.includes(val) ? arr.filter(x=>x!==val) : [...arr,val]};
  });

  const goNext = () => {
    if (step===1 && !dest) { alert("Please select a destination."); return; }
    if (step===1 && dest==="somewhere_else" && !form.otherCountry) { alert("Please select a country."); return; }
    if (step<5) setStep(s=>s+1);
  };

  const submit = async () => {
    if (!form.firstName || !form.email) { alert("Please enter your name and email."); return; }
    const d = DESTINATIONS[dest];
    setScreen("generating");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          referral: form.referral,
          destination: form.otherCountry || dest,
          destinationName: form.otherCountry || d?.name || dest,
          continent: form.continent,
          brief: {
            departDate: form.departDate,
            returnDate: form.returnDate,
            departCountry: form.departCountry,
            preferredAirport: form.preferredAirport===OTHER_AIRPORT ? form.preferredAirportOther : form.preferredAirport,
            adults: form.adults,
            children: form.children,
            childrenAges: form.childrenAges,
            rooms: form.rooms,
            beds: form.beds,
            accomNotes: form.accomNotes,
            pace: form.pace,
            accom: form.accom,
            budget: form.budget,
            activities: form.activities,
            landmarks: form.landmarks,
            regions: form.regions,
            dietary: form.dietary,
            accessibility: form.accessibility,
            notes: form.notes,
          },
        }),
      });
      const data = await res.json();
      if (data?.id) {
        setEnquiryId(data.id);
      } else {
        setScreen("thankyou");
      }
    } catch {
      setScreen("thankyou");
    }
  };

  // Poll for the AI itinerary while on the "generating" screen, then reveal
  // the teaser. Falls back to the 48-hour thank-you screen if generation
  // fails or takes too long, so nobody gets stuck waiting.
  useEffect(() => {
    if (screen !== "generating" || !enquiryId) return;
    let cancelled = false;
    const startedAt = Date.now();

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/enquiry/${enquiryId}`);
        const data = await res.json();
        if (data.status && data.status !== "generating" && data.status !== "failed" && data.preview) {
          if (!cancelled) { setPreview(data.preview); setScreen("preview"); }
          return;
        }
        if (data.status === "failed") {
          if (!cancelled) setScreen("thankyou");
          return;
        }
      } catch {
        // transient error — keep polling until the timeout below
      }
      if (Date.now() - startedAt > 180000) {
        if (!cancelled) setScreen("thankyou");
        return;
      }
      if (!cancelled) setTimeout(poll, 3000);
    };

    poll();
    return () => { cancelled = true; };
  }, [screen, enquiryId]);

  const proceedToPayment = async () => {
    setProceeding(true);
    try {
      await fetch(`/api/enquiry/${enquiryId}/proceed`, { method: "POST" });
    } catch {}
    setProceeding(false);
    setScreen("proceeded");
  };

  // ── STYLES ────────────────────────────────────────────────────────────────
  const page  = { fontFamily:"Georgia,serif", background:COLORS.sand, minHeight:"100vh", color:COLORS.ink };
  const sans  = { fontFamily:"system-ui,sans-serif" };
  const logo  = { ...sans, fontSize:"0.85rem", letterSpacing:"0.35em", textTransform:"uppercase", color:COLORS.gold };
  const label = { ...sans, display:"block", fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:COLORS.dusk, marginBottom:"0.5rem" };
  const inp   = { width:"100%", background:COLORS.white, border:`1.5px solid ${COLORS.stone}`, color:COLORS.ink, fontFamily:"system-ui", fontSize:"0.92rem", padding:"0.75rem 0.9rem", outline:"none", boxSizing:"border-box", borderRadius:0 };
  const btnPrimary = { ...sans, background:COLORS.ink, color:COLORS.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2.25rem", cursor:"pointer" };
  const btnNext    = { ...sans, background:COLORS.ink, color:COLORS.white, border:"none", fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.85rem 1.75rem", cursor:"pointer" };
  const btnBack    = { ...sans, background:"none", border:"none", fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, cursor:"pointer" };
  const chipSecLbl = { ...sans, fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.gold, margin:"1.25rem 0 0.6rem", paddingBottom:"0.35rem", borderBottom:`1px solid ${COLORS.stone}` };
  const formNav    = { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"2.5rem", padding:"1.75rem 0", borderTop:`1px solid ${COLORS.stone}`, position:"sticky", bottom:0, background:COLORS.sand, zIndex:5 };
  const fieldGroup = { marginBottom:"1.75rem" };
  const fieldRow   = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" };

  const TESTIMONIALS = [
    { quote: "Jen planned our honeymoon in Japan and it was absolutely faultless. Every detail had been thought through, and we didn't have to worry about a thing from the moment we landed.", name: "Sophie & Tom", trip: "Tokyo & Kyoto, 12 nights" },
    { quote: "I've used big travel agencies before and the difference is night and day. Jen actually listens, then builds something around you rather than fitting you into a template.", name: "Marcus H.", trip: "Peru & Machu Picchu, 14 nights" },
    { quote: "The Thailand itinerary had something for every member of the family: the kids loved the elephant sanctuary, we loved the cooking class in Chiang Mai. Genuinely magical.", name: "Claire W.", trip: "Thailand, family of four, 10 nights" },
  ];

  // ── HERO ─────────────────────────────────────────────────────────────────
  if (screen==="hero") return (
    <div style={page}>
      <div style={{ minHeight:"100vh", position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"center", textAlign:"center", padding:"5rem 1.5rem 3rem", backgroundImage:"url('/map-bg.svg')", backgroundSize:"cover", backgroundPosition:"center" }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(242,237,228,0.52)" }} />

        {/* Nav links floating top-right */}
        <div style={{ position:"absolute", top:"1.25rem", right:"2rem", display:"flex", alignItems:"center", gap:"2rem", zIndex:2 }}>
          <a href="/inspiration" style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</a>
          <a href="/about" style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</a>
          <a href="/reviews" style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Reviews</a>
          <a href="/faq" style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>FAQ</a>
          <button onClick={()=>setScreen("pricing")} style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, background:"none", border:"none", cursor:"pointer", padding:0 }}>Pricing</button>
        </div>

        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem" }}>
          <div style={{ width:329, height:329, borderRadius:"50%", background:COLORS.sand, overflow:"hidden", boxShadow:"0 4px 24px rgba(28,26,23,0.18)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Image src="/logo.jpg" alt="Jen Voyage" width={297} height={297} style={{ objectFit:"contain", mixBlendMode:"multiply" }} priority />
          </div>
          <div style={{ width:40, height:1, background:COLORS.gold, margin:"0.25rem 0" }} />
          <h1 style={{ fontSize:"clamp(2rem,5vw,3.6rem)", fontWeight:300, lineHeight:1.05, maxWidth:"16ch", margin:0, color:"#1C3461" }}>
            Your Journey<br /><em>Your Way</em>
          </h1>
          <p style={{ ...sans, fontSize:"0.92rem", fontWeight:300, color:COLORS.ink, maxWidth:"44ch", lineHeight:1.7, margin:0 }}>
            At Jen Voyage we take the stress out of travel planning by crafting friendly, fully costed, tailormade itineraries that match your exact needs, putting the fun and excitement back into your next adventure.
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"1rem", flexWrap:"wrap", marginTop:"0.5rem" }}>
            <div style={{ position:"relative" }}>
              <button onClick={()=>setHeroDropdown(d=>d==="what"?null:"what")} style={{ ...sans, background:COLORS.white, border:`1px solid ${COLORS.stone}`, color:COLORS.dusk, fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.95rem 1.1rem", cursor:"pointer" }}>
                {HERO_INFO.what.label} {heroDropdown==="what" ? "▲" : "▼"}
              </button>
              {heroDropdown==="what" && (
                <div style={{ position:"absolute", top:"110%", left:"50%", transform:"translateX(-50%)", width:260, background:COLORS.white, border:`1px solid ${COLORS.stone}`, boxShadow:"0 8px 24px rgba(28,26,23,0.15)", padding:"1rem 1.25rem", zIndex:3, textAlign:"left" }}>
                  <p style={{ ...sans, fontSize:"0.8rem", color:COLORS.dusk, lineHeight:1.7, margin:0 }}>{HERO_INFO.what.body}</p>
                </div>
              )}
            </div>

            <button style={btnPrimary} onClick={() => setScreen("form")}>Begin Planning</button>

            <div style={{ position:"relative" }}>
              <button onClick={()=>setHeroDropdown(d=>d==="how"?null:"how")} style={{ ...sans, background:COLORS.white, border:`1px solid ${COLORS.stone}`, color:COLORS.dusk, fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.95rem 1.1rem", cursor:"pointer" }}>
                {HERO_INFO.how.label} {heroDropdown==="how" ? "▲" : "▼"}
              </button>
              {heroDropdown==="how" && (
                <div style={{ position:"absolute", top:"110%", left:"50%", transform:"translateX(-50%)", width:260, background:COLORS.white, border:`1px solid ${COLORS.stone}`, boxShadow:"0 8px 24px rgba(28,26,23,0.15)", padding:"1rem 1.25rem", zIndex:3, textAlign:"left" }}>
                  <p style={{ ...sans, fontSize:"0.8rem", color:COLORS.dusk, lineHeight:1.7, margin:0 }}>{HERO_INFO.how.body}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── PRICING ──────────────────────────────────────────────────────────────
  if (screen==="pricing") {
    const navLink = { ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"none" };
    const plans = [
      {
        name:"The Weekend Getaway", price:"£25",
        description:"Perfect for short breaks and city escapes.",
        features:["Trips up to 4 nights","Single destination","Personalised itinerary","1 revision included","48-hour delivery","No booking fees"],
        highlight:false
      },
      {
        name:"The Main Holiday", price:"£70",
        description:"Ideal for your annual holiday, tailored exactly to you.",
        features:["Trips of 5 – 14 nights","1 main destination","Fully personalised itinerary","72 hours to tweak and revise","48-hour delivery","Dedicated travel consultant","No booking fees"],
        highlight:true
      },
      {
        name:"The Epic Adventure", price:"£120",
        description:"For the big ones: multi-destination, long-haul and complex trips.",
        features:["Multi-destination planning","Fully bespoke itinerary","Unlimited revisions","Priority 48-hour delivery","Dedicated travel consultant","No booking fees"],
        highlight:false
      }
    ];
    return (
      <div style={page}>
        <div style={{ maxWidth:960, margin:"0 auto", padding:"4rem 1.5rem 6rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4rem" }}>
            <button onClick={()=>setScreen("hero")} style={navLink}>← Home</button>
            <button onClick={()=>setScreen("form")} style={btnPrimary}>Begin Planning</button>
          </div>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.75rem" }}>Planning Fees</div>
            <h2 style={{ fontSize:"clamp(2rem,5vw,3rem)", fontWeight:300, lineHeight:1.1, marginBottom:"1rem", color:"#1C3461" }}>Simple and transparent pricing</h2>
            <p style={{ ...sans, fontSize:"0.92rem", fontWeight:300, color:COLORS.dusk, maxWidth:"48ch", margin:"0 auto", lineHeight:1.8 }}>One flat fee covers everything: your itinerary, your consultant, your revisions. No hidden charges, and no upfront costs.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.5rem", alignItems:"start" }}>
            {plans.map(p => (
              <div key={p.name} style={{ background:p.highlight?COLORS.ink:COLORS.white, border:`1.5px solid ${p.highlight?COLORS.ink:COLORS.stone}`, padding:"2.25rem 2rem", display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                <div>
                  <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase", color:p.highlight?COLORS.gold:COLORS.gold, marginBottom:"0.5rem" }}>{p.highlight?"Most Popular":" "}</div>
                  <div style={{ fontSize:"1.35rem", fontWeight:400, color:p.highlight?COLORS.white:COLORS.ink, marginBottom:"0.3rem" }}>{p.name}</div>
                  <div style={{ fontSize:"2.8rem", fontWeight:300, color:p.highlight?COLORS.white:COLORS.ink, lineHeight:1 }}>{p.price}</div>
                </div>
                <p style={{ ...sans, fontSize:"0.84rem", fontWeight:300, color:p.highlight?COLORS.stone:COLORS.dusk, lineHeight:1.6, margin:0 }}>{p.description}</p>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                  {p.features.map(f => (
                    <li key={f} style={{ ...sans, fontSize:"0.84rem", color:p.highlight?COLORS.stone:COLORS.dusk, display:"flex", gap:"0.6rem", alignItems:"flex-start" }}>
                      <span style={{ color:COLORS.gold, flexShrink:0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={()=>setScreen("form")} style={{ ...btnPrimary, marginTop:"auto", background:p.highlight?COLORS.gold:COLORS.ink, border:"none", width:"100%", textAlign:"center" }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── GENERATING ───────────────────────────────────────────────────────────
  if (screen==="generating") {
    const d = DESTINATIONS[dest];
    return (
      <div style={page}>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"3rem 1.5rem" }}>
          <div style={{ width:44, height:44, borderRadius:"50%", border:`3px solid ${COLORS.stone}`, borderTopColor:COLORS.gold, animation:"spin 0.9s linear infinite", marginBottom:"2rem" }} />
          <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:300, lineHeight:1.1, maxWidth:"20ch", marginBottom:"1rem" }}>
            Crafting your {dest==="somewhere_else" ? form.otherCountry : d?.name} itinerary
          </h2>
          <p style={{ ...sans, fontSize:"0.92rem", fontWeight:300, color:COLORS.dusk, maxWidth:"40ch", lineHeight:1.8 }}>
            This usually takes less than a minute. Please don&apos;t close this page.
          </p>
        </div>
      </div>
    );
  }

  // ── PREVIEW ──────────────────────────────────────────────────────────────
  if (screen==="preview" && preview) {
    const day1 = preview.day1;
    return (
      <div style={page}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"4rem 1.5rem 5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2.5rem" }}>
            <button onClick={()=>setScreen("hero")} style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"none" }}>← Home</button>
            <button onClick={()=>setScreen("pricing")} style={{ ...sans, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, background:"none", border:"none", cursor:"pointer", padding:0 }}>Pricing</button>
          </div>
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <div style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.75rem" }}>A first look</div>
            <h2 style={{ fontSize:"clamp(1.8rem,4.5vw,2.8rem)", fontWeight:300, lineHeight:1.15, marginBottom:"1rem" }}>{preview.title}</h2>
            <p style={{ ...sans, fontSize:"0.95rem", fontWeight:300, color:COLORS.dusk, lineHeight:1.8 }}>{preview.overview}</p>
          </div>

          {day1 && (
            <div style={{ background:COLORS.white, border:`1px solid ${COLORS.stone}`, padding:"1.75rem 2rem", marginBottom:"2rem" }}>
              <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.5rem" }}>Day 1{preview.totalDays ? ` of ${preview.totalDays}` : ""}</div>
              <div style={{ fontSize:"1.2rem", fontWeight:400, marginBottom:"0.75rem" }}>{day1.title}</div>
              <div style={{ ...sans, fontSize:"0.88rem", color:COLORS.dusk, fontWeight:300, lineHeight:1.8 }}>
                {day1.description && <p style={{margin:0}}>{day1.description}</p>}
              </div>
            </div>
          )}

          <div style={{ textAlign:"center", borderTop:`1px solid ${COLORS.stone}`, paddingTop:"2.25rem" }}>
            <p style={{ ...sans, fontSize:"0.92rem", fontWeight:300, color:COLORS.dusk, maxWidth:"46ch", margin:"0 auto 1.5rem", lineHeight:1.8 }}>
              Here&apos;s what your first day might look like, but to see a fully personalised itinerary – including accommodation, flights and recommendations on trips or places to visit (all complete with links for easy, instant booking) – please continue to payment.
            </p>
            <button style={btnPrimary} onClick={proceedToPayment} disabled={proceeding}>
              {proceeding ? "One moment…" : "Proceed to payment →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PROCEEDED ────────────────────────────────────────────────────────────
  if (screen==="proceeded") {
    return (
      <div style={page}>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"3rem 1.5rem" }}>
          <div style={{ marginBottom:"2.5rem", width:40, height:1, background:COLORS.gold }} />
          <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:300, lineHeight:1.1, maxWidth:"18ch", marginBottom:"1.25rem" }}>
            Wonderful, {form.firstName}
          </h2>
          <p style={{ ...sans, fontSize:"1rem", fontWeight:300, color:COLORS.dusk, maxWidth:"44ch", lineHeight:1.8, marginBottom:"3rem" }}>
            Jen will be in touch with <strong style={{ color:COLORS.ink, fontWeight:500 }}>{form.email}</strong> shortly to take payment and get started on your fully personalised itinerary, complete with accommodation and flight recommendations.
          </p>
          <button style={btnPrimary} onClick={() => { setScreen("hero"); setStep(1); setDest(null); setEnquiryId(null); setPreview(null); setForm({ departDate:"", returnDate:"", departCountry:"", preferredAirport:"", preferredAirportOther:"", adults:"2", children:"0", childrenAges:"", pace:"", accom:"", rooms:"1", beds:"1", accomNotes:"", budget:2500, activities:[], landmarks:[], regions:[], dietary:[], accessibility:"", notes:"", firstName:"", lastName:"", email:"", phone:"", referral:"", continent:"", otherCountry:"" }); }}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // ── THANK YOU ────────────────────────────────────────────────────────────
  if (screen==="thankyou") {
    const d = DESTINATIONS[dest];
    return (
      <div style={page}>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"3rem 1.5rem" }}>
          <div style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, marginBottom:"1.5rem", flexShrink:0 }}>
            <Image src="/logo.jpg" alt="Jen Voyage" width={340} height={340} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:340, height:340, objectFit:"cover", mixBlendMode:"multiply" }} />
          </div>
          <div style={{ marginBottom:"2.5rem", width:40, height:1, background:COLORS.gold }} />
          <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:300, lineHeight:1.1, maxWidth:"18ch", marginBottom:"1.25rem" }}>
            Thank you {form.firstName}
          </h2>
          <p style={{ ...sans, fontSize:"1rem", fontWeight:300, color:COLORS.dusk, maxWidth:"44ch", lineHeight:1.8, marginBottom:"0.75rem" }}>
            We've received everything we need to start planning your {dest==="somewhere_else" ? form.otherCountry : d?.name} itinerary.
          </p>
          <p style={{ ...sans, fontSize:"1rem", fontWeight:300, color:COLORS.dusk, maxWidth:"44ch", lineHeight:1.8, marginBottom:"0.75rem" }}>
            Your personalised itinerary will be ready within <strong style={{ color:COLORS.ink, fontWeight:500 }}>48 hours</strong>. We'll send it directly to <strong style={{ color:COLORS.ink, fontWeight:500 }}>{form.email}</strong>, along with a few options for us to speak through the detail together.
          </p>
          <p style={{ ...sans, fontSize:"0.88rem", fontWeight:300, color:COLORS.stone, maxWidth:"40ch", lineHeight:1.8, marginBottom:"3rem" }}>
            In the meantime, if you have anything to add or want to get in touch sooner, just reply to the confirmation email you'll receive shortly.
          </p>
          <button style={btnPrimary} onClick={() => { setScreen("hero"); setStep(1); setDest(null); setForm({ departDate:"", returnDate:"", departCountry:"", preferredAirport:"", preferredAirportOther:"", adults:"2", children:"0", childrenAges:"", pace:"", accom:"", rooms:"1", beds:"1", accomNotes:"", budget:2500, activities:[], landmarks:[], regions:[], dietary:[], accessibility:"", notes:"", firstName:"", lastName:"", email:"", phone:"", referral:"", continent:"", otherCountry:"" }); }}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────────────
  const d = DESTINATIONS[dest];
  const d3 = dest === "somewhere_else"
    ? (COUNTRY_DATA[form.otherCountry] || CONTINENT_DATA[form.continent] || d)
    : d;
  return (
    <div style={page}>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ paddingBottom:"2rem", borderBottom:`1px solid ${COLORS.stone}`, marginBottom:"2.5rem", display:"flex", alignItems:"flex-start", gap:"2rem" }}>
          <div style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0 }}>
            <Image src="/logo.jpg" alt="Jen Voyage" width={340} height={340} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:340, height:340, objectFit:"cover", mixBlendMode:"multiply" }} />
          </div>
          <div style={{ paddingTop:"0.5rem" }}>
            <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:300, lineHeight:1.1, marginBottom:"0.5rem", color:"#1C3461" }}>Plan your journey</h2>
            <p style={{ ...sans, fontSize:"0.88rem", color:COLORS.dusk, fontWeight:300, margin:0 }}>A few questions to build your perfect itinerary.</p>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.4rem" }}>
          <div style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk }}>Step {step} of 5</div>
          <button style={{ ...sans, background:"none", border:`1px solid ${COLORS.stone}`, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, cursor:"pointer", padding:"0.3rem 0.75rem" }}
            onClick={()=>{ setScreen("hero"); setStep(1); setDest(null); setForm({ departDate:"", returnDate:"", departCountry:"", preferredAirport:"", preferredAirportOther:"", adults:"2", children:"0", childrenAges:"", pace:"", accom:"", rooms:"1", beds:"1", accomNotes:"", budget:2500, activities:[], landmarks:[], regions:[], dietary:[], accessibility:"", notes:"", firstName:"", lastName:"", email:"", phone:"", referral:"", continent:"", otherCountry:"" }); }}>
            ← Home
          </button>
        </div>
        <div style={{ width:"100%", height:"2px", background:COLORS.stone, marginBottom:"2.5rem" }}>
          <div style={{ height:"100%", background:COLORS.gold, width:`${step/5*100}%`, transition:"width 0.4s" }} />
        </div>

        {/* STEP 1 — Destination */}
        {step===1 && (
          <div>
            <h3 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:400, lineHeight:1.2, marginBottom:"1.5rem" }}>Where are you dreaming of?</h3>

            <div style={{ marginBottom:"2rem" }}>
              <label style={label}>Country</label>
              <select style={{...inp,appearance:"none"}} value={form.otherCountry} onChange={e=>{ const c=e.target.value; setDest(c ? "somewhere_else" : null); upd("otherCountry",c); upd("continent", continentForCountry(c)||""); }}>
                <option value="">Select a country…</option>
                {ALL_COUNTRIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>

            {form.otherCountry && (
              <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem", flexWrap:"wrap", border:`1px solid ${COLORS.stone}`, background:COLORS.white, padding:"0.85rem 1rem" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:COLORS.sand, border:`1px solid ${COLORS.stone}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem", flexShrink:0 }}>
                  {flagEmoji(form.otherCountry)}
                </div>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontSize:"0.95rem", fontWeight:500, marginBottom:"0.2rem" }}>{form.otherCountry}</div>
                  {countryKnownFor(form.otherCountry).length>0 && (
                    <div style={{ ...sans, fontSize:"0.72rem", color:COLORS.dusk }}>
                      <span style={{ letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.gold }}>Known for </span>
                      {countryKnownFor(form.otherCountry).join("  ·  ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={formNav}>
              <span />
              <button style={btnNext} onClick={goNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Essentials */}
        {step===2 && (
          <div>
            <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.75rem" }}>Step 2</div>
            <h3 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:400, lineHeight:1.2, marginBottom:"0.4rem" }}>The essentials</h3>
            <p style={{ ...sans, fontSize:"0.86rem", color:COLORS.dusk, fontWeight:300, marginBottom:"2rem" }}>A few practical details to shape your itinerary.</p>
            <div style={fieldGroup}>
              <DateRangePicker
                startDate={form.departDate}
                endDate={form.returnDate}
                onChange={({ start, end }) => setForm(f => ({ ...f, departDate:start, returnDate:end }))}
              />
            </div>
            <div style={fieldRow}>
              <div style={fieldGroup}>
                <label style={label}>Departure country</label>
                <select style={{...inp,appearance:"none"}} value={form.departCountry} onChange={e=>{ upd("departCountry",e.target.value); upd("preferredAirport",""); upd("preferredAirportOther",""); }}>
                  <option value="">Select a country…</option>
                  {ALL_COUNTRIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={fieldGroup}>
                <label style={label}>Preferred airport</label>
                <select style={{...inp,appearance:"none"}} value={form.preferredAirport} onChange={e=>{ upd("preferredAirport",e.target.value); upd("preferredAirportOther",""); }} disabled={!form.departCountry}>
                  <option value="">{form.departCountry ? "Select an airport…" : "Choose a country first"}</option>
                  {airportOptionsFor(form.departCountry).map(a=><option key={a}>{a}</option>)}
                </select>
                {form.preferredAirport===OTHER_AIRPORT && (
                  <input type="text" style={{...inp,marginTop:"0.5rem"}} value={form.preferredAirportOther} onChange={e=>upd("preferredAirportOther",e.target.value)} placeholder="Please specify your airport" />
                )}
              </div>
            </div>
            <div style={fieldRow}>
              <div style={fieldGroup}><label style={label}>Adults</label><input type="number" style={inp} min="1" max="20" value={form.adults} onChange={e=>upd("adults",e.target.value)} /></div>
              <div style={fieldGroup}><label style={label}>Children</label><input type="number" style={inp} min="0" max="10" value={form.children} onChange={e=>upd("children",e.target.value)} /></div>
            </div>
            {parseInt(form.children) > 0 && (
              <div style={fieldGroup}>
                <label style={label}>Children's ages</label>
                <input type="text" style={inp} value={form.childrenAges} onChange={e=>upd("childrenAges",e.target.value)} placeholder={parseInt(form.children)===1 ? "e.g. 7" : "e.g. 4, 7, 12"} />
              </div>
            )}
            <div style={fieldGroup}>
              <label style={label}>Trip pace</label>
              <RadioChips options={[{value:"relaxed",label:"🌿 Relaxed"},{value:"balanced",label:"⚖️ Balanced"},{value:"packed",label:"⚡ Action-packed"}]} value={form.pace} onChange={v=>upd("pace",v)} />
            </div>
            <div style={fieldGroup}>
              <label style={label}>Accommodation style</label>
              <RadioChips options={[{value:"airbnb",label:"🏠 Airbnb style"},{value:"hotels",label:"🏩 Hotels"},{value:"all-inclusive",label:"🌴 All Inclusive"},{value:"everything",label:"🌟 I'd like to see everything"}]} value={form.accom} onChange={v=>upd("accom",v)} />
            </div>
            <div style={fieldRow}>
              <div style={fieldGroup}><label style={label}>Number of rooms</label><input type="number" style={inp} min="1" max="20" value={form.rooms} onChange={e=>upd("rooms",e.target.value)} /></div>
              <div style={fieldGroup}><label style={label}>Number of beds</label><input type="number" style={inp} min="1" max="20" value={form.beds} onChange={e=>upd("beds",e.target.value)} /></div>
            </div>
            <div style={fieldGroup}><label style={label}>Anything else I need to know about your required accommodation?</label><textarea style={{...inp,minHeight:90,resize:"vertical"}} value={form.accomNotes} onChange={e=>upd("accomNotes",e.target.value)} placeholder="e.g. ground floor required, sea view preferred, cot needed..." /></div>
            <div style={fieldGroup}>
              <label style={label}>Budget per person (£)</label>
              <div style={{ fontSize:"1.8rem", fontWeight:300, marginBottom:"0.4rem" }}>{form.budget>=10000?"£10,000+":"£"+form.budget.toLocaleString()}</div>
              <input type="range" min="500" max="10000" step="250" value={form.budget} onChange={e=>upd("budget",parseInt(e.target.value))} style={{ width:"100%", accentColor:COLORS.gold }} />
              <div style={{ ...sans, display:"flex", justifyContent:"space-between", fontSize:"0.7rem", color:COLORS.dusk, marginTop:"0.35rem" }}><span>£500</span><span>£10,000+</span></div>
            </div>
            <div style={formNav}>
              <button style={btnBack} onClick={()=>setStep(s=>s-1)}>← Back</button>
              <button style={btnNext} onClick={goNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Country questions */}
        {step===3 && d3 && (
          <div>
            <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.75rem" }}>Step 3</div>
            <h3 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:400, lineHeight:1.2, marginBottom:"0.4rem" }}>Your {dest==="somewhere_else" ? form.otherCountry : d.name} preferences</h3>
            <p style={{ ...sans, fontSize:"0.86rem", color:COLORS.dusk, fontWeight:300, marginBottom:"2rem" }}>Select everything that appeals, and we'll weave it into your itinerary.</p>
            <div style={chipSecLbl}>Activities & experiences</div>
            <ChipGroup items={d3.general} selected={form.activities} onToggle={v=>toggleArr("activities",v)} />
            {d3.landmarks.length>0 && <><div style={chipSecLbl}>Landmarks & iconic sites</div>
            <ChipGroup items={d3.landmarks} selected={form.landmarks} onToggle={v=>toggleArr("landmarks",v)} /></>}
            {d3.regions.length>0 && <><div style={chipSecLbl}>Regions of interest</div>
            <ChipGroup items={d3.regions} selected={form.regions} onToggle={v=>toggleArr("regions",v)} /></>}
            <div style={formNav}>
              <button style={btnBack} onClick={()=>setStep(s=>s-1)}>← Back</button>
              <button style={btnNext} onClick={goNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Requirements */}
        {step===4 && (
          <div>
            <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.75rem" }}>Step 4</div>
            <h3 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:400, lineHeight:1.2, marginBottom:"0.4rem" }}>Any special requirements?</h3>
            <p style={{ ...sans, fontSize:"0.86rem", color:COLORS.dusk, fontWeight:300, marginBottom:"2rem" }}>Help us ensure every part of your trip is comfortable.</p>
            <div style={fieldGroup}>
              <label style={label}>Dietary requirements</label>
              <ChipGroup items={["🥗 Vegetarian","🌱 Vegan","🌾 Gluten-free","☪️ Halal","✡️ Kosher","✓ None"]} selected={form.dietary} onToggle={v=>toggleArr("dietary",v)} />
            </div>
            <div style={fieldGroup}><label style={label}>Mobility or accessibility needs</label><textarea style={{...inp,minHeight:90,resize:"vertical"}} value={form.accessibility} onChange={e=>upd("accessibility",e.target.value)} placeholder="Leave blank if not applicable." /></div>
            <div style={fieldGroup}><label style={label}>Anything else we should know?</label><textarea style={{...inp,minHeight:90,resize:"vertical"}} value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Special occasions, must-avoid experiences, previous trips you've loved..." /></div>
            <div style={formNav}>
              <button style={btnBack} onClick={()=>setStep(s=>s-1)}>← Back</button>
              <button style={btnNext} onClick={goNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 5 — Contact */}
        {step===5 && (
          <div>
            <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.75rem" }}>Step 5</div>
            <h3 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:400, lineHeight:1.2, marginBottom:"0.4rem" }}>Almost there</h3>
            <p style={{ ...sans, fontSize:"0.86rem", color:COLORS.dusk, fontWeight:300, marginBottom:"2rem" }}>Leave your details and we'll generate your draft itinerary instantly.</p>
            <div style={fieldRow}>
              <div style={fieldGroup}><label style={label}>First name</label><input type="text" style={inp} value={form.firstName} onChange={e=>upd("firstName",e.target.value)} placeholder="Sarah" /></div>
              <div style={fieldGroup}><label style={label}>Last name</label><input type="text" style={inp} value={form.lastName} onChange={e=>upd("lastName",e.target.value)} placeholder="Mitchell" /></div>
            </div>
            <div style={fieldGroup}><label style={label}>Email address</label><input type="email" style={inp} value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="sarah@example.com" /></div>
            <div style={fieldGroup}><label style={label}>Phone (optional)</label><input type="text" style={inp} value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+44 7700 900000" /></div>
            <div style={fieldGroup}>
              <label style={label}>How did you hear about Jen Voyage?</label>
              <select style={{...inp,appearance:"none"}} value={form.referral} onChange={e=>upd("referral",e.target.value)}>
                <option value="">Select…</option>
                <option>Instagram</option><option>Google search</option><option>Word of mouth</option><option>Travel blog</option><option>Other</option>
              </select>
            </div>
            <div style={formNav}>
              <button style={btnBack} onClick={()=>setStep(s=>s-1)}>← Back</button>
              <button style={btnNext} onClick={submit}>Send my brief →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}