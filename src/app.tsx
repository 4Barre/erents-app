import React, { useState, useMemo, useEffect } from ‘react’;
import {
Search, Bell, User, Home, Heart, Building2, Compass, ChevronDown, MapPin,
Bath, BedDouble, Layers, Car, Calendar, Phone, MessageCircle, ArrowLeft,
Share2, Info, Mail, Check, Plus, Edit3, Trash2, LogIn, FileText, HelpCircle,
Shield, LogOut, Users, BarChart3, SlidersHorizontal, X, Sparkles, Star,
Send, Clock, ChevronRight, Globe, MessageSquare, Camera, Zap, TrendingUp,
CheckCircle2, Eye, Filter, CreditCard, DollarSign, PieChart, Download,
Upload, Settings, Bookmark, Navigation, Wifi, Airplay, ShieldCheck,
Crown, Flame, Fingerprint, Lock, Unlock, Key, Menu, Grid3X3, Layout
} from ‘lucide-react’;
import ‘./App.css’;

// Types
interface Listing {
id: number;
title: string;
district: string;
area: string;
bedrooms: number;
bathrooms: number;
floor: number;
parking: number;
yearBuilt: number;
price: number;
verified: boolean;
agencyId?: number;
type: string;
deposit: number;
published: string;
owner: string;
phone: string;
email: string;
amenities: string[];
description: string;
color: string;
status: string;
landlordId: number;
rating: number;
reviewCount: number;
views: number;
inquiries: number;
latitude: number;
longitude: number;
photos: string[];
}

interface Agency {
id: number;
name: string;
tagline: string;
forBuy: number;
forRent: number;
phone: string;
email: string;
website?: string;
color: string;
verified: boolean;
founded: number;
rating: number;
employees: number;
languages: string[];
services: string[];
address: string;
description: string;
}

interface User {
id: number;
name: string;
role: ‘admin’ | ‘landlord’ | ‘tenant’;
email: string;
avatar?: string;
phone: string;
joined: string;
lastActive: string;
verified?: boolean;
properties?: number;
savedSearches?: number;
}

interface Notification {
id: number;
type: string;
title: string;
message: string;
time: string;
read: boolean;
icon: string;
color: string;
data?: any;
}

interface Chat {
id: number;
participantId: number;
participantName: string;
participantAvatar: string;
participantRole: string;
lastMessage: string;
lastMessageTime: string;
unreadCount: number;
propertyId: number;
isOnline: boolean;
messages: ChatMessage[];
}

interface ChatMessage {
id: number;
senderId: number | string;
content: string;
timestamp: string;
type: ‘text’ | ‘image’ | ‘file’;
}

interface Review {
id: number;
listingId: number;
userId: number;
userName: string;
userAvatar: string;
rating: number;
comment: string;
timestamp: string;
helpful: number;
}

// Constants
const DISTRICTS = [
“All”, “Hodan”, “Waberi”, “Abdiaziz”, “Dharkenley”, “Wadajir”,
“Yaqshid”, “Shibis”, “Hawl-Wadaag”, “Karaan”, “Dayniile”,
“Kahda”, “Deynile”, “Heliwa”, “Wardhigley”, “Shangani”
];

const PROPERTY_TYPES = [“All Property”, “Apartment”, “Villa”, “Office”, “Shop”, “Warehouse”, “Land”];
const PRICE_RANGES = [“Any”, “<$500”, “$500-$1000”, “$1000-$1500”, “$1500-$2000”, “>$2000”];

// Translation system
const translations = {
en: {
home: “Home”, agencies: “Agencies”, explore: “Explore”, favorites: “Favorites”,
profile: “Profile”, messages: “Messages”, search: “Search for a property”,
propertyType: “Property Type”, featured: “Featured Listings”, rent: “Rent”,
monthly: “/Monthly”, verified: “Verified”, bath: “Bath”, beds: “Beds”,
floor: “Floor”, park: “Park”, features: “Features”, amenities: “Amenities”,
address: “Address”, city: “City”, state: “State”, country: “Country”,
owner: “Owner details”, reviews: “Reviews”, similar: “Similar Properties”,
schedule: “Schedule Viewing”, login: “Login”, signup: “Sign Up”, logout: “Sign Out”,
notifications: “Notifications”, language: “Language”, aboutUs: “About Us”,
faq: “FAQ”, terms: “Terms & Conditions”, privacy: “Privacy & Policy”,
joinAgency: “Join Us as Agency”, settings: “Settings”, account: “Account”,
help: “Help”, myListings: “My Listings”, addListing: “Add Listing”,
title: “Title”, description: “Description”, bedrooms: “Bedrooms”,
bathrooms: “Bathrooms”, district: “District”, photos: “Photos”,
upload: “Upload”, analytics: “Analytics”, dashboard: “Dashboard”,
users: “Users”, listings: “Listings”, overview: “Overview”,
reports: “Reports”, revenue: “Revenue”, loading: “Loading…”,
error: “Error”, success: “Success”, warning: “Warning”, yes: “Yes”,
no: “No”, back: “Back”, next: “Next”, done: “Done”, save: “Save”,
cancel: “Cancel”, edit: “Edit”, delete: “Delete”, verify: “Verify”,
send: “Send”, call: “Call”, whatsapp: “WhatsApp”
},
so: {
home: “Hoyga”, agencies: “Wakaaladaha”, explore: “Sahan”,
favorites: “Kuwaan Jecelahay”, profile: “Akoonka”, messages: “Fariimaha”,
search: “Raadi guri”, propertyType: “Nooca Guryaha”,
featured: “Guryaha La Soo Jeediyay”, rent: “Kirayso”, monthly: “/Bishii”,
verified: “La Xaqiijiyay”, bath: “Musqul”, beds: “Sariir”,
floor: “Dabaq”, park: “Parking”, features: “Astaamaha”,
amenities: “Adeegyada”, address: “Ciwaanka”, city: “Magaalada”,
state: “Gobolka”, country: “Dalka”, owner: “Xogta Milkiilaha”,
reviews: “Dib-u-eegista”, similar: “Guryo La Mid Ah”,
schedule: “Qorshee Booqasho”, login: “Soo Gal”, signup: “Isdiiwaangeli”,
logout: “Ka Bax”, notifications: “Ogeysiisyada”, language: “Luqadda”,
aboutUs: “Nagu Saabsan”, faq: “Su’aalaha”, terms: “Shuruudaha”,
privacy: “Asturnaanta”, joinAgency: “Nagu Biir”, settings: “Dejinta”,
account: “Akoonka”, help: “Caawimaad”, myListings: “Liisaskaaga”,
addListing: “Ku Dar Guri”, title: “Cinwaanka”, description: “Sharraxaadda”,
bedrooms: “Qololka”, bathrooms: “Musqulka”, district: “Degmada”,
photos: “Sawirrada”, upload: “Soo Rar”, analytics: “Falanqayn”,
dashboard: “Barnaamijka”, users: “Isticmaaleyaasha”, listings: “Guryaha”,
overview: “Dulmar”, reports: “Warbixinnada”, revenue: “Dakhliga”,
loading: “Waa la rartaa…”, error: “Qalad”, success: “Waa ku guulaystay”,
warning: “Digniin”, yes: “Haa”, no: “Maya”, back: “Dib u noqo”,
next: “Kan xiga”, done: “Dhammaaday”, save: “Kaydi”, cancel: “Jooji”,
edit: “Wax ka Beddel”, delete: “Tirtir”, verify: “Xaqiiji”,
send: “Dir”, call: “Wac”, whatsapp: “WhatsApp”
}
};

// Theme system
const themes = {
light: {
bg: “#f8fafc”, card: “#ffffff”, text: “#0f172a”, textMuted: “#64748b”,
textLight: “#94a3b8”, primary: “#1e40af”, primaryLight: “#3b82f6”,
accent: “#2563eb”, border: “#e2e8f0”, borderLight: “#f1f5f9”,
success: “#16a34a”, successBg: “#dcfce7”, warning: “#f59e0b”,
warningBg: “#fef3c7”, error: “#dc2626”, errorBg: “#fee2e2”,
whatsapp: “#22c55e”, iconBg: “#eff6ff”,
gradient: “linear-gradient(135deg,#06b6d4,#3b82f6)”
},
dark: {
bg: “#0f172a”, card: “#1e293b”, text: “#f1f5f9”, textMuted: “#94a3b8”,
textLight: “#64748b”, primary: “#3b82f6”, primaryLight: “#60a5fa”,
accent: “#2563eb”, border: “#334155”, borderLight: “#475569”,
success: “#22c55e”, successBg: “#15803d”, warning: “#f59e0b”,
warningBg: “#d97706”, error: “#ef4444”, errorBg: “#dc2626”,
whatsapp: “#25d366”, iconBg: “#1e40af”,
gradient: “linear-gradient(135deg,#0891b2,#1e40af)”
}
};

// Sample data
const SAMPLE_LISTINGS: Listing[] = [
{
id: 1,
title: “Luxury Penthouse with Ocean View”,
district: “Hodan”,
area: “Lido Beach”,
bedrooms: 4,
bathrooms: 3,
floor: 15,
parking: 2,
yearBuilt: 2025,
price: 2500,
verified: true,
agencyId: 1,
type: “Apartment”,
deposit: 2500,
published: “2026-04-12”,
owner: “Hassan Mohamed”,
phone: “+252615001001”,
email: “hassan@erents.so”,
amenities: [“Ocean View”, “A/C”, “WiFi”, “24 Hour Security”, “Swimming Pool”, “Gym”, “Elevator”, “Backup Generator”],
description: “Stunning oceanfront penthouse featuring panoramic views of the Indian Ocean. This luxury apartment comes fully furnished with modern amenities and 24/7 concierge service.”,
color: “#1e40af”,
status: “active”,
landlordId: 2,
rating: 4.9,
reviewCount: 47,
views: 1240,
inquiries: 89,
latitude: 2.0469,
longitude: 45.3182,
photos: [“https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800”]
},
{
id: 2,
title: “Modern 3BR Family Home”,
district: “Waberi”,
area: “Howl-wadag Road”,
bedrooms: 3,
bathrooms: 2,
floor: 2,
parking: 2,
yearBuilt: 2024,
price: 1200,
verified: true,
agencyId: 2,
type: “Villa”,
deposit: 1200,
published: “2026-04-10”,
owner: “Amina Hassan”,
phone: “+252615001002”,
email: “amina@erents.so”,
amenities: [“Garden”, “A/C”, “WiFi”, “24 Hour Security”, “Parking”, “Water Tank”, “Solar Power”],
description: “Perfect for families looking for a peaceful neighborhood. Features a private garden and modern interior design.”,
color: “#059669”,
status: “active”,
landlordId: 3,
rating: 4.7,
reviewCount: 32,
views: 890,
inquiries: 54,
latitude: 2.0370,
longitude: 45.3338,
photos: [“https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800”]
}
];

// Main App Component
const App: React.FC = () => {
// Core state
const [role, setRole] = useState<‘tenant’ | ‘landlord’ | ‘admin’>(‘tenant’);
const [language, setLanguage] = useState<‘en’ | ‘so’>(‘en’);
const [theme, setTheme] = useState<‘light’ | ‘dark’>(‘light’);
const [loading, setLoading] = useState(false);

// Navigation state
const [tenantTab, setTenantTab] = useState(‘home’);
const [landlordTab, setLandlordTab] = useState(‘dashboard’);
const [adminTab, setAdminTab] = useState(‘overview’);

// Data state
const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
const [favorites, setFavorites] = useState<number[]>([1]);

// Search & filter state
const [searchQuery, setSearchQuery] = useState(’’);
const [selectedPropertyType, setSelectedPropertyType] = useState(‘All Property’);
const [selectedDistrict, setSelectedDistrict] = useState(‘All’);
const [bedroomFilter, setBedroomFilter] = useState(‘Any’);
const [viewMode, setViewMode] = useState<‘list’ | ‘grid’ | ‘map’>(‘list’);

// Modal state
const [showOnboarding, setShowOnboarding] = useState(true);
const [onboardingStep, setOnboardingStep] = useState(0);
const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
const [toast, setToast] = useState<{message: string; type: string} | null>(null);

// Get translations and theme
const t = translations[language];
const T = themes[theme];

// Utility functions
const showToast = (message: string, type = ‘success’) => {
setToast({message, type});
setTimeout(() => setToast(null), 3000);
};

const toggleFavorite = (listingId: number) => {
setFavorites(prev =>
prev.includes(listingId)
? prev.filter(id => id !== listingId)
: […prev, listingId]
);
};

// Filter listings
const filteredListings = useMemo(() => {
return listings.filter(listing => {
if (listing.status !== “active”) return false;

```
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      listing.title.toLowerCase().includes(query) ||
      listing.district.toLowerCase().includes(query) ||
      listing.area.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query);
    if (!matchesQuery) return false;
  }
  
  if (selectedPropertyType !== "All Property" && listing.type !== selectedPropertyType) return false;
  if (selectedDistrict !== "All" && listing.district !== selectedDistrict) return false;
  if (bedroomFilter !== "Any" && listing.bedrooms !== parseInt(bedroomFilter)) return false;
  
  return true;
});
```

}, [listings, searchQuery, selectedPropertyType, selectedDistrict, bedroomFilter]);

// Styles
const styles = {
app: {
fontFamily: “‘Inter’, system-ui, -apple-system, sans-serif”,
background: T.bg,
color: T.text,
minHeight: “100vh”,
maxWidth: 430,
margin: “0 auto”,
position: “relative” as const,
boxShadow: “0 0 50px rgba(0,0,0,0.1)”,
overflow: “hidden”
},
header: {
background: T.card,
borderBottom: `1px solid ${T.border}`,
padding: “12px 16px”,
display: “flex”,
alignItems: “center”,
justifyContent: “space-between”,
position: “sticky” as const,
top: 0,
zIndex: 50
},
content: {
paddingBottom: 90,
minHeight: “calc(100vh - 120px)”
},
bottomNav: {
position: “fixed” as const,
bottom: 0,
left: “50%”,
transform: “translateX(-50%)”,
width: “100%”,
maxWidth: 430,
background: T.card,
borderTop: `1px solid ${T.border}`,
display: “flex”,
paddingBottom: 8,
zIndex: 60
},
roleSwitch: {
display: “flex”,
background: T.card,
borderBottom: `1px solid ${T.border}`,
position: “sticky” as const,
top: 0,
zIndex: 55
},
roleBtn: (active: boolean) => ({
flex: 1,
padding: “10px 8px”,
border: “none”,
background: “transparent”,
color: active ? T.primary : T.textMuted,
fontWeight: active ? 700 : 500,
fontSize: “.75rem”,
cursor: “pointer”,
borderBottom: active ? `2px solid ${T.primary}` : “2px solid transparent”,
transition: “all 0.2s”
}),
navBtn: (active: boolean) => ({
flex: 1,
padding: “10px 4px 8px”,
border: “none”,
background: “transparent”,
color: active ? T.primary : T.textMuted,
fontSize: “.7rem”,
cursor: “pointer”,
display: “flex”,
flexDirection: “column” as const,
alignItems: “center”,
gap: 4,
fontWeight: active ? 700 : 500,
transition: “all 0.2s”
}),
card: {
background: T.card,
borderRadius: 16,
border: `1px solid ${T.border}`,
overflow: “hidden”,
marginBottom: 16,
cursor: “pointer”,
transition: “all 0.2s”,
boxShadow: “0 2px 8px rgba(0,0,0,0.04)”
},
cardImage: (color: string) => ({
height: 200,
background: `linear-gradient(135deg, ${color}CC, ${color}77)`,
position: “relative” as const,
display: “flex”,
alignItems: “center”,
justifyContent: “center”
}),
toast: {
position: “fixed” as const,
bottom: 100,
left: “50%”,
transform: “translateX(-50%)”,
background: T.text,
color: T.card,
padding: “12px 24px”,
borderRadius: 30,
fontSize: “.85rem”,
fontWeight: 600,
zIndex: 200,
boxShadow: “0 4px 20px rgba(0,0,0,0.3)”
}
};

// Components
const HeaderBar: React.FC<{title?: string}> = ({ title }) => (
<div style={styles.header}>
<div>
<div style={{fontSize: “.75rem”, color: T.textMuted, textTransform: “uppercase”, letterSpacing: 1}}>
{role === “tenant” ? “Tenant” : role === “landlord” ? “Landlord” : “Admin”}
</div>
<div style={{fontSize: “1rem”, fontWeight: 700, color: T.text}}>
{title || “E-Rents”}
</div>
</div>
<div style={{display: “flex”, gap: 8}}>
<button style={{
width: 40, height: 40, borderRadius: 10, background: T.card,
border: `1px solid ${T.border}`, display: “flex”, alignItems: “center”,
justifyContent: “center”, cursor: “pointer”
}}>
<Bell size={18} color={T.text} />
</button>
<button style={{
width: 40, height: 40, borderRadius: 10, background: T.card,
border: `1px solid ${T.border}`, display: “flex”, alignItems: “center”,
justifyContent: “center”, cursor: “pointer”
}}>
<User size={18} color={T.text} />
</button>
</div>
</div>
);

const SearchBar: React.FC = () => (
<div style={{
display: “flex”, gap: 12, padding: “8px 16px”, background: T.bg,
borderBottom: `1px solid ${T.border}`
}}>
<div style={{
flex: 1, display: “flex”, alignItems: “center”, gap: 12,
background: T.card, border: `1px solid ${T.border}`,
borderRadius: 12, padding: “10px 14px”
}}>
<Search size={18} color={T.textMuted} />
<input
style={{
flex: 1, border: “none”, outline: “none”, background: “transparent”,
fontSize: “.9rem”, color: T.text, fontFamily: “inherit”
}}
placeholder={t.search}
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
/>
</div>
<button style={{
width: 44, height: 44, background: T.card, border: `1px solid ${T.border}`,
borderRadius: 12, display: “flex”, alignItems: “center”,
justifyContent: “center”, cursor: “pointer”
}}>
<Filter size={18} color={T.text} />
</button>
</div>
);

const PropertyCard: React.FC<{listing: Listing}> = ({ listing }) => (
<div style={styles.card} onClick={() => setSelectedListing(listing)}>
<div style={styles.cardImage(listing.color)}>
{listing.verified && (
<div style={{
position: “absolute”, top: 12, left: 12, background: T.success,
color: “#fff”, padding: “4px 10px”, borderRadius: 8,
fontSize: “.7rem”, fontWeight: 700, display: “flex”,
alignItems: “center”, gap: 4
}}>
<CheckCircle2 size={12} />
{t.verified}
</div>
)}
<button
style={{
position: “absolute”, top: 12, right: 12, width: 36, height: 36,
background: “#fff”, border: “none”, borderRadius: 8,
display: “flex”, alignItems: “center”, justifyContent: “center”,
cursor: “pointer”
}}
onClick={(e) => {
e.stopPropagation();
toggleFavorite(listing.id);
}}
>
<Heart
size={16}
color={favorites.includes(listing.id) ? “#ef4444” : T.textMuted}
fill={favorites.includes(listing.id) ? “#ef4444” : “none”}
/>
</button>
<Building2 size={56} color=”#fff” style={{opacity: 0.3}} />
</div>

```
  <div style={{padding: 16}}>
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8}}>
      <h3 style={{fontSize: "1.05rem", fontWeight: 800, color: T.text, marginBottom: 4, lineHeight: 1.3}}>
        {listing.title}
      </h3>
      <span style={{
        background: T.primary + "20", color: T.primary, padding: "4px 12px",
        borderRadius: 20, fontSize: ".75rem", fontWeight: 600
      }}>
        {t.rent}
      </span>
    </div>
    
    {listing.rating > 0 && (
      <div style={{display: "flex", alignItems: "center", gap: 6, marginBottom: 6}}>
        <div style={{display: "flex", gap: 1}}>
          {[1,2,3,4,5].map(star => (
            <Star 
              key={star} size={12} color="#fbbf24"
              fill={star <= Math.round(listing.rating) ? "#fbbf24" : "none"}
            />
          ))}
        </div>
        <span style={{fontSize: ".75rem", color: T.textMuted}}>
          {listing.rating} ({listing.reviewCount})
        </span>
      </div>
    )}
    
    <div style={{fontSize: ".8rem", color: T.textMuted, lineHeight: 1.5, marginBottom: 12}}>
      📍 {listing.district}, {listing.area}<br/>
      Published: {listing.published}
    </div>
    
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingTop: 12, borderTop: `1px solid ${T.borderLight}`
    }}>
      <div style={{display: "flex", alignItems: "center", gap: 8}}>
        <MapPin size={14} color={T.primary} />
        <span style={{fontSize: ".8rem", color: T.textMuted}}>Mogadishu</span>
      </div>
      <div style={{textAlign: "right"}}>
        <div style={{fontSize: "1.1rem", fontWeight: 800, color: T.primary}}>
          ${listing.price}
        </div>
        <div style={{fontSize: ".75rem", color: T.textMuted}}>
          {t.monthly}
        </div>
      </div>
    </div>
    
    <div style={{
      display: "flex", gap: 12, marginTop: 12, paddingTop: 12,
      borderTop: `1px solid ${T.borderLight}`, fontSize: ".75rem", color: T.textMuted
    }}>
      <span style={{display: "flex", alignItems: "center", gap: 4}}>
        <Bath size={12} /> {listing.bathrooms}
      </span>
      <span style={{display: "flex", alignItems: "center", gap: 4}}>
        <BedDouble size={12} /> {listing.bedrooms}
      </span>
      <span style={{display: "flex", alignItems: "center", gap: 4}}>
        <Layers size={12} /> {listing.floor}F
      </span>
      <span style={{display: "flex", alignItems: "center", gap: 4}}>
        <Car size={12} /> {listing.parking}
      </span>
    </div>
  </div>
</div>
```

);

// Onboarding Screen
const OnboardingScreen: React.FC = () => {
const slides = [
{
icon: Home,
title: “Find Your Perfect Home”,
description: “Browse verified apartments across Somalia with transparent pricing and detailed information.”,
color: T.primary
},
{
icon: ShieldCheck,
title: “100% Verified Listings”,
description: “Every property is reviewed by our team. No scams, no fake offers — just trusted properties.”,
color: T.success
},
{
icon: MessageSquare,
title: “Connect Instantly”,
description: “Chat directly with landlords and agencies. Schedule viewings with one tap.”,
color: “#7c3aed”
}
];

```
const currentSlide = slides[onboardingStep];
const Icon = currentSlide.icon;

return (
  <div style={{
    ...styles.app, paddingBottom: 0, display: "flex",
    flexDirection: "column", minHeight: "100vh"
  }}>
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 32px", textAlign: "center"
    }}>
      <div style={{
        width: 140, height: 140, borderRadius: 70,
        background: currentSlide.color + "18", display: "flex",
        alignItems: "center", justifyContent: "center", marginBottom: 40
      }}>
        <Icon size={64} color={currentSlide.color} />
      </div>
      
      <h1 style={{
        fontSize: "1.8rem", fontWeight: 900, color: T.text,
        marginBottom: 16, lineHeight: 1.2
      }}>
        {currentSlide.title}
      </h1>
      
      <p style={{
        fontSize: "1rem", color: T.textMuted, lineHeight: 1.6, maxWidth: 320
      }}>
        {currentSlide.description}
      </p>
    </div>
    
    <div style={{padding: "0 32px 40px"}}>
      <div style={{display: "flex", gap: 8, justifyContent: "center", marginBottom: 24}}>
        {slides.map((_, index) => (
          <div 
            key={index}
            style={{
              height: 6, borderRadius: 3,
              width: index === onboardingStep ? 24 : 6,
              background: index === onboardingStep ? T.primary : T.border,
              transition: "all 0.3s"
            }}
          />
        ))}
      </div>
      
      <button 
        style={{
          background: T.gradient, color: "#fff", fontWeight: 700,
          padding: 14, borderRadius: 12, border: "none", width: "100%",
          fontSize: ".95rem", cursor: "pointer"
        }}
        onClick={() => {
          if (onboardingStep < slides.length - 1) {
            setOnboardingStep(onboardingStep + 1);
          } else {
            setShowOnboarding(false);
          }
        }}
      >
        {onboardingStep < slides.length - 1 ? `${t.next} →` : `${t.done} →`}
      </button>
      
      <button 
        style={{
          background: "transparent", border: "none", color: T.textMuted,
          width: "100%", padding: 14, fontSize: ".85rem", cursor: "pointer", marginTop: 8
        }}
        onClick={() => setShowOnboarding(false)}
      >
        Skip
      </button>
    </div>
  </div>
);
```

};

// Home Screen
const HomeScreen: React.FC = () => (
<div>
<HeaderBar title={t.home} />
<SearchBar />

```
  <div style={{
    padding: "16px", borderBottom: `1px solid ${T.border}`, background: T.bg
  }}>
    <div style={{
      display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4
    }}>
      {PROPERTY_TYPES.map(type => (
        <button
          key={type}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
            borderRadius: 12, 
            border: selectedPropertyType === type ? `1px solid ${T.primary}` : `1px solid ${T.border}`,
            background: selectedPropertyType === type ? T.primary + "10" : T.card,
            color: selectedPropertyType === type ? T.primary : T.text,
            fontSize: ".8rem", fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s"
          }}
          onClick={() => setSelectedPropertyType(type)}
        >
          {type === "Apartment" && <Home size={14} />}
          {type === "Villa" && <Building2 size={14} />}
          {type}
        </button>
      ))}
    </div>
  </div>
  
  <div style={styles.content}>
    <div style={{padding: "16px"}}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16
      }}>
        <div>
          <h2 style={{fontSize: "1.1rem", fontWeight: 700, marginBottom: 4}}>{t.featured}</h2>
          <p style={{fontSize: ".9rem", color: T.textMuted}}>
            {filteredListings.length} properties found
          </p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          {[
            {mode: 'list', icon: Menu},
            {mode: 'grid', icon: Grid3X3},
            {mode: 'map', icon: MapPin}
          ].map(({mode, icon: Icon}) => (
            <button
              key={mode}
              style={{
                width: 36, height: 36, border: `1px solid ${T.border}`,
                background: viewMode === mode ? T.primary + "20" : T.card,
                borderRadius: 8, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer"
              }}
              onClick={() => setViewMode(mode as 'list' | 'grid' | 'map')}
            >
              <Icon size={16} color={viewMode === mode ? T.primary : T.textMuted} />
            </button>
          ))}
        </div>
      </div>
      
      {filteredListings.length === 0 ? (
        <div style={{textAlign: "center", padding: "60px 20px", color: T.textMuted}}>
          <Search size={48} color={T.textLight} style={{marginBottom: 16}} />
          <h3 style={{fontSize: "1.1rem", fontWeight: 700, marginBottom: 8}}>
            No properties found
          </h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: viewMode === "grid" ? "grid" : "block",
          gridTemplateColumns: viewMode === "grid" ? "1fr 1fr" : "none",
          gap: viewMode === "grid" ? 12 : 0
        }}>
          {filteredListings.map(listing => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  </div>
</div>
```

);

// Property Detail Screen
const PropertyDetailScreen: React.FC<{listing: Listing}> = ({ listing }) => (
<div style={{…styles.app, paddingBottom: 0}}>
{/* Hero Image */}
<div style={{
height: 250,
background: `linear-gradient(135deg, ${listing.color}CC, ${listing.color}77)`,
position: “relative”, display: “flex”, alignItems: “center”, justifyContent: “center”
}}>
<div style={{
position: “absolute”, top: 16, left: 0, right: 0,
display: “flex”, alignItems: “center”, justifyContent: “space-between”, padding: “0 16px”
}}>
<button
style={{
width: 40, height: 40, background: “rgba(255,255,255,0.9)”,
border: “none”, borderRadius: 10, display: “flex”,
alignItems: “center”, justifyContent: “center”, cursor: “pointer”
}}
onClick={() => setSelectedListing(null)}
>
<ArrowLeft size={18} color={T.text} />
</button>

```
      <div style={{display: "flex", gap: 8}}>
        <button 
          style={{
            width: 40, height: 40, background: "rgba(255,255,255,0.9)",
            border: "none", borderRadius: 10, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}
          onClick={() => toggleFavorite(listing.id)}
        >
          <Heart 
            size={18} 
            color={favorites.includes(listing.id) ? "#ef4444" : T.text}
            fill={favorites.includes(listing.id) ? "#ef4444" : "none"}
          />
        </button>
        <button 
          style={{
            width: 40, height: 40, background: T.primary,
            border: "none", borderRadius: 10, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}
          onClick={() => showToast("Share link copied!")}
        >
          <Share2 size={16} color="#fff" />
        </button>
      </div>
    </div>
    
    <Building2 size={80} color="#fff" style={{opacity: 0.3}} />
  </div>
  
  <div style={{
    background: T.card, padding: 16, minHeight: "calc(100vh - 250px)",
    overflowY: "auto", paddingBottom: 100
  }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12
    }}>
      <h1 style={{fontSize: "1.4rem", fontWeight: 800, color: T.text, flex: 1, lineHeight: 1.3}}>
        {listing.title}
      </h1>
      <span style={{
        background: T.primary + "20", color: T.primary, padding: "4px 14px",
        borderRadius: 8, fontSize: ".76rem", fontWeight: 600
      }}>
        {t.rent}
      </span>
    </div>
    
    {listing.rating > 0 && (
      <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 12}}>
        <div style={{display: "flex", gap: 2}}>
          {[1,2,3,4,5].map(star => (
            <Star 
              key={star} size={16} color="#fbbf24"
              fill={star <= Math.round(listing.rating) ? "#fbbf24" : "none"}
            />
          ))}
        </div>
        <span style={{fontSize: ".9rem", fontWeight: 700}}>{listing.rating}</span>
        <span style={{fontSize: ".8rem", color: T.textMuted}}>· {listing.reviewCount} reviews</span>
      </div>
    )}
    
    <div style={{fontSize: ".9rem", color: T.textMuted, lineHeight: 1.6, marginBottom: 16}}>
      📍 {listing.district}, {listing.area}<br/>
      Deposit: ${listing.deposit}<br/>
      Published: {listing.published}
    </div>
    
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`
    }}>
      <div style={{display: "flex", alignItems: "center", gap: 12}}>
        <Building2 size={24} color={T.primary} />
        <span style={{fontSize: "1rem", fontWeight: 600}}>{listing.type}</span>
      </div>
      <div style={{textAlign: "right"}}>
        <div style={{fontSize: "1.6rem", fontWeight: 800, color: T.primary}}>
          ${listing.price}
        </div>
        <div style={{fontSize: ".8rem", color: T.textMuted}}>{t.monthly}</div>
      </div>
    </div>
    
    <div style={{padding: "20px 0", borderBottom: `1px solid ${T.border}`}}>
      <h3 style={{fontSize: "1.05rem", fontWeight: 800, marginBottom: 14}}>{t.features}</h3>
      <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16}}>
        {[
          {icon: Bath, value: listing.bathrooms, label: "Bathrooms"},
          {icon: BedDouble, value: listing.bedrooms, label: "Bedrooms"},
          {icon: Layers, value: listing.floor, label: "Floor"},
          {icon: Car, value: listing.parking, label: "Parking"},
          {icon: Calendar, value: listing.yearBuilt, label: "Year Built"},
          {icon: Eye, value: `${listing.views || 0}+`, label: "Views"}
        ].map(({icon: Icon, value, label}) => (
          <div key={label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8
          }}>
            <div style={{
              width: 50, height: 50, background: T.iconBg, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon size={20} color={T.primary} />
            </div>
            <div>
              <div style={{fontSize: ".75rem", color: T.textMuted, marginBottom: 2}}>{label}</div>
              <div style={{fontSize: ".9rem", fontWeight: 700, color: T.text}}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div style={{padding: "20px 0", borderBottom: `1px solid ${T.border}`}}>
      <h3 style={{fontSize: "1.05rem", fontWeight: 800, marginBottom: 10}}>Description</h3>
      <p style={{fontSize: ".88rem", color: T.textMuted, lineHeight: 1.7}}>
        {listing.description}
      </p>
    </div>
    
    <div style={{padding: "20px 0", borderBottom: `1px solid ${T.border}`}}>
      <h3 style={{fontSize: "1.05rem", fontWeight: 800, marginBottom: 14}}>{t.amenities}</h3>
      <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
        {listing.amenities.map(amenity => (
          <div 
            key={amenity}
            style={{
              padding: "8px 12px", background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 8, fontSize: ".8rem", fontWeight: 500
            }}
          >
            {amenity}
          </div>
        ))}
      </div>
    </div>
    
    <div style={{padding: "20px 0"}}>
      <h3 style={{fontSize: "1.05rem", fontWeight: 800, marginBottom: 8}}>{t.owner}</h3>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: 16,
        background: T.bg, borderRadius: 12
      }}>
        <div style={{
          width: 50, height: 50, background: T.gradient, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <User size={24} color="#fff" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: ".95rem", fontWeight: 700}}>{listing.owner}</div>
          <div style={{fontSize: ".75rem", color: T.textMuted, marginTop: 2}}>
            Landlord since {listing.published.slice(0, 4)}
          </div>
        </div>
        <button 
          style={{
            width: 36, height: 36, background: T.primary + "20", border: "none",
            borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer"
          }}
          onClick={() => showToast("Opening chat...")}
        >
          <MessageCircle size={18} color={T.primary} />
        </button>
      </div>
    </div>
  </div>
  
  {/* Sticky Bottom Bar */}
  <div style={{
    position: "sticky", bottom: 0, background: T.card, padding: 16,
    display: "flex", gap: 12, borderTop: `1px solid ${T.border}`,
    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)"
  }}>
    <button 
      style={{
        flex: 1, padding: 12, background: "transparent", border: `1px solid ${T.primary}`,
        color: T.primary, borderRadius: 12, fontWeight: 700, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}
      onClick={() => showToast("Schedule viewing...")}
    >
      <Calendar size={16} />
      Schedule Viewing
    </button>
    <button 
      style={{
        width: 48, height: 48, background: T.whatsapp, border: "none",
        borderRadius: 12, display: "flex", alignItems: "center",
        justifyContent: "center", cursor: "pointer"
      }}
      onClick={() => showToast("Opening WhatsApp...")}
    >
      <MessageCircle size={20} color="#fff" />
    </button>
    <button 
      style={{
        width: 48, height: 48, background: T.gradient, border: "none",
        borderRadius: 12, display: "flex", alignItems: "center",
        justifyContent: "center", cursor: "pointer"
      }}
      onClick={() => showToast("Calling...")}
    >
      <Phone size={20} color="#fff" />
    </button>
  </div>
</div>
```

);

// Render logic
if (showOnboarding) {
return <OnboardingScreen />;
}

if (selectedListing) {
return <PropertyDetailScreen listing={selectedListing} />;
}

// Navigation configuration
const getNavItems = () => {
switch (role) {
case “tenant”:
return [
{id: “home”, icon: Home, label: t.home},
{id: “agencies”, icon: Building2, label: t.agencies},
{id: “explore”, icon: Compass, label: t.explore},
{id: “favorites”, icon: Heart, label: t.favorites},
{id: “profile”, icon: User, label: t.profile}
];
case “landlord”:
return [
{id: “dashboard”, icon: BarChart3, label: “Dashboard”},
{id: “listings”, icon: Home, label: “Listings”},
{id: “add”, icon: Plus, label: “Add”},
{id: “messages”, icon: MessageCircle, label: “Messages”},
{id: “profile”, icon: User, label: “Profile”}
];
case “admin”:
return [
{id: “overview”, icon: BarChart3, label: “Overview”},
{id: “listings”, icon: Building2, label: “Listings”},
{id: “users”, icon: Users, label: “Users”},
{id: “reports”, icon: FileText, label: “Reports”}
];
default:
return [];
}
};

const getCurrentTab = () => {
switch (role) {
case “tenant”: return tenantTab;
case “landlord”: return landlordTab;
case “admin”: return adminTab;
default: return “home”;
}
};

const setCurrentTab = (tab: string) => {
switch (role) {
case “tenant”: setTenantTab(tab); break;
case “landlord”: setLandlordTab(tab); break;
case “admin”: setAdminTab(tab); break;
}
};

const navItems = getNavItems();
const currentTab = getCurrentTab();

return (
<div style={styles.app}>
{/* Role Switcher */}
<div style={styles.roleSwitch}>
{[
{key: “tenant”, icon: User, label: “Tenant”},
{key: “landlord”, icon: Home, label: “Landlord”},
{key: “admin”, icon: Crown, label: “Admin”}
].map(({key, icon: Icon, label}) => (
<button
key={key}
style={styles.roleBtn(role === key)}
onClick={() => setRole(key as ‘tenant’ | ‘landlord’ | ‘admin’)}
>
<div style={{display: “flex”, alignItems: “center”, justifyContent: “center”, gap: 6}}>
<Icon size={14} />
{label}
</div>
</button>
))}
</div>

```
  {/* Main Content */}
  <div style={styles.content}>
    <HomeScreen />
  </div>
  
  {/* Bottom Navigation */}
  <div style={styles.bottomNav}>
    {navItems.map(item => {
      const Icon = item.icon;
      const isActive = currentTab === item.id;
      
      return (
        <button
          key={item.id}
          style={styles.navBtn(isActive)}
          onClick={() => setCurrentTab(item.id)}
        >
          <Icon 
            size={20} 
            color={isActive ? T.primary : T.textMuted}
            strokeWidth={isActive ? 2.5 : 2}
          />
          {item.label}
        </button>
      );
    })}
  </div>
  
  {/* Toast */}
  {toast && (
    <div style={{
      ...styles.toast,
      background: toast.type === "error" ? T.error : 
                 toast.type === "warning" ? T.warning : T.text
    }}>
      {toast.message}
    </div>
  )}
</div>
```

);
};

export default App;
