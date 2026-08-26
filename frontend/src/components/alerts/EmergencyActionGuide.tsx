'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldAlert,
  PhoneCall,
  CheckSquare,
  Users,
  Home,
  Wheat,
  Anchor,
  Sparkles,
} from 'lucide-react';

export function EmergencyActionGuide() {
  const { t } = useLanguage();
  const [activeRole, setActiveRole] = useState<'citizen' | 'homeowner' | 'farmer' | 'marine'>('citizen');

  const emergencyContacts = [
    { label: 'NDRF National Disaster Helpline', number: '1078', badge: 'Toll-Free' },
    { label: 'State Disaster Emergency Operations (SEOC)', number: '1070', badge: '24x7 Control Room' },
    { label: 'Medical Emergency & Ambulance', number: '108', badge: 'Immediate Dispatch' },
    { label: 'Fire & Rescue Services', number: '101', badge: 'Rescue Boat' },
    { label: 'Coastal Hazard & Coast Guard', number: '1554', badge: 'Maritime SOS' },
  ];

  const roleChecklists = {
    citizen: [
      'Avoid driving through waterlogged underpasses and subways during heavy rain peaks.',
      'Charge all mobile phones, power banks, and portable LED torches.',
      'Store at least 15–20 liters of clean drinking water per family member.',
      'Do not touch exposed electrical poles, transformer boxes, or fallen cables on flooded streets.',
      'Stay tuned to WeatherGPT voice bulletins and official district collectorate announcements.',
    ],
    homeowner: [
      'Elevate essential appliances (refrigerators, washing machines, inverter batteries) above flood line.',
      'Secure loose rooftop tin sheets, solar panels, and water tank covers against 50+ km/h winds.',
      'Clear perimeter storm drains and roof rain gutters of leaves and plastic debris.',
      'Keep personal identity cards, property papers, and cash in sealed waterproof zip bags.',
      'Locate your nearest designated government cyclone/flood relief camp beforehand.',
    ],
    farmer: [
      'Suspend all sprinkler and canal irrigation immediately to prevent root flooding.',
      'Open cross-drains along paddy field bunds to allow excess rain runoff into collector canals.',
      'Halt chemical and biological pesticide spraying to eliminate wash-off losses.',
      'Move farm animals and livestock to elevated dry sheds away from low-lying pastures.',
      'Ensure grain storage sacks are stacked on elevated wooden pallets with plastic cover tarps.',
    ],
    marine: [
      'Total suspension of mechanized trawler and country boat trips into Southwest Bay of Bengal.',
      'Double-anchor fishing boats and secure all outboard motor engines at harbor docks.',
      'Maintain continuous watch on VHF Marine Radio Channel 16.',
      'Fish drying operations along open beaches must be dismantled and moved inland.',
    ],
  };

  return (
    <div className="p-6 rounded-3xl bg-card border shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h3 className="font-extrabold text-lg sm:text-xl text-foreground flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Disaster Decision Support ("What Should I Do?")
          </h3>
          <p className="text-xs text-muted-foreground">
            Role-tailored emergency safety SOPs verified by NDMA guidelines
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 border text-xs font-semibold">
          <button
            onClick={() => setActiveRole('citizen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeRole === 'citizen'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Citizen
          </button>
          <button
            onClick={() => setActiveRole('homeowner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeRole === 'homeowner'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Low-lying Resident
          </button>
          <button
            onClick={() => setActiveRole('farmer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeRole === 'farmer'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            Farmer
          </button>
          <button
            onClick={() => setActiveRole('marine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeRole === 'marine'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            Fisherfolk
          </button>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        <div className="font-bold text-xs uppercase tracking-wider text-primary">
          Mandatory Actions for {activeRole.toUpperCase()} Mode:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roleChecklists[activeRole].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-accent/40 border flex items-start gap-3 text-xs sm:text-sm font-medium text-foreground leading-relaxed hover:bg-accent/70 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 24x7 Emergency Helplines Direct Access */}
      <div className="pt-4 border-t space-y-3">
        <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-500" />
          Immediate Emergency SOS Helpline Numbers
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((contact, i) => (
            <a
              key={i}
              href={`tel:${contact.number}`}
              className="p-3 rounded-2xl bg-card border shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                  {contact.label}
                </div>
                <div className="text-[10px] text-muted-foreground">{contact.badge}</div>
              </div>
              <div className="text-base font-extrabold font-mono text-emerald-500 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                {contact.number}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
