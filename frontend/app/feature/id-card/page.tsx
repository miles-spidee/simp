"use client";

import React, { useEffect, useState } from 'react';
import { IDCardService } from '@/src/services/idcard.service';
import { DigitalIDCard } from '@/src/types/idcard.types';
import { 
  IdCard, Loader2, Download, Printer, QrCode, RefreshCw, ShieldCheck
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';

interface BackgroundConfig {
  type: string;
  color1: string;
  color2: string;
  angle?: number;
}

interface Element {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qr' | 'barcode' | 'avatar';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isVisible: boolean;
  
  // Text Specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase';

  // Shape Specific
  shapeType?: 'rect' | 'circle' | 'line';
  fill?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';

  // Image Specific
  url?: string;
  binding?: string;
}

interface IDTemplate {
  themeName: 'blue' | 'dark' | 'green' | 'pink' | 'custom';
  primaryColor: string;
  accentColor: string;
  showLogo: boolean;
  showQrCode: boolean;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  showBloodGroup: boolean;
  showDepartment: boolean;
  showExpiry: boolean;
  customBackText: string;
}

const DEFAULT_TEMPLATE: IDTemplate = {
  themeName: 'blue',
  primaryColor: '#2563eb',
  accentColor: '#1d4ed8',
  showLogo: true,
  showQrCode: true,
  fontFamily: 'font-sans',
  showBloodGroup: true,
  showDepartment: true,
  showExpiry: true,
  customBackText: 'This identity pass is the official property of Pinesphere. It must be displayed prominently at all times on company premises.'
};

const DEFAULT_FRONT_ELEMENTS: Element[] = [
  {
    id: 'card_banner_shape',
    type: 'shape',
    name: 'Accent Header Banner',
    x: 0,
    y: 0,
    width: 320,
    height: 130,
    rotation: 0,
    zIndex: 1,
    isVisible: true,
    shapeType: 'rect',
    fill: '#3b82f6'
  },
  {
    id: 'card_logo_text',
    type: 'text',
    name: 'Organization Title',
    x: 20,
    y: 20,
    width: 200,
    height: 30,
    rotation: 0,
    zIndex: 2,
    isVisible: true,
    text: 'PINESPHERE ENTERPRISE',
    fontFamily: 'Orbitron',
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'left'
  },
  {
    id: 'card_role_badge_bg',
    type: 'shape',
    name: 'Badge Accent Color',
    x: 230,
    y: 18,
    width: 70,
    height: 20,
    rotation: 0,
    zIndex: 2,
    isVisible: true,
    shapeType: 'rect',
    fill: '#10b981',
    borderRadius: 10
  },
  {
    id: 'card_role_badge_text',
    type: 'text',
    name: 'Badge Text',
    x: 230,
    y: 20,
    width: 70,
    height: 18,
    rotation: 0,
    zIndex: 3,
    isVisible: true,
    text: 'STAFF',
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center'
  },
  {
    id: 'emp_avatar',
    type: 'avatar',
    name: 'Employee Photo Frame',
    x: 100,
    y: 70,
    width: 120,
    height: 120,
    rotation: 0,
    zIndex: 4,
    isVisible: true,
    binding: 'employee.photoUrl',
    borderRadius: 9999
  },
  {
    id: 'emp_name_val',
    type: 'text',
    name: 'Employee Name Value',
    x: 20,
    y: 205,
    width: 280,
    height: 35,
    rotation: 0,
    zIndex: 5,
    isVisible: true,
    text: '{{employee.studentName}}',
    binding: 'employee.studentName',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center'
  },
  {
    id: 'emp_role_val',
    type: 'text',
    name: 'Employee Role Value',
    x: 20,
    y: 235,
    width: 280,
    height: 25,
    rotation: 0,
    zIndex: 6,
    isVisible: true,
    text: '{{employee.program}}',
    binding: 'employee.program',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  {
    id: 'info_grid_bg',
    type: 'shape',
    name: 'Info Container Box',
    x: 20,
    y: 280,
    width: 280,
    height: 120,
    rotation: 0,
    zIndex: 7,
    isVisible: true,
    shapeType: 'rect',
    fill: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 16,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1
  },
  {
    id: 'label_emp_id',
    type: 'text',
    name: 'ID Label',
    x: 35,
    y: 295,
    width: 100,
    height: 15,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: 'EMPLOYEE ID',
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'left'
  },
  {
    id: 'val_emp_id',
    type: 'text',
    name: 'ID Value',
    x: 35,
    y: 310,
    width: 100,
    height: 20,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: '{{employee.studentId}}',
    binding: 'employee.studentId',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'left'
  },
  {
    id: 'label_dept',
    type: 'text',
    name: 'Dept Label',
    x: 170,
    y: 295,
    width: 120,
    height: 15,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: 'DEPARTMENT',
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'left'
  },
  {
    id: 'val_dept',
    type: 'text',
    name: 'Dept Value',
    x: 170,
    y: 310,
    width: 120,
    height: 20,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: '{{employee.department}}',
    binding: 'employee.department',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'left'
  },
  {
    id: 'label_blood',
    type: 'text',
    name: 'Blood Group Label',
    x: 35,
    y: 345,
    width: 100,
    height: 15,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: 'BLOOD GROUP',
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'left'
  },
  {
    id: 'val_blood',
    type: 'text',
    name: 'Blood Group Value',
    x: 35,
    y: 360,
    width: 100,
    height: 20,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: '{{employee.bloodGroup}}',
    binding: 'employee.bloodGroup',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'left'
  },
  {
    id: 'label_valid',
    type: 'text',
    name: 'Valid Label',
    x: 170,
    y: 345,
    width: 120,
    height: 15,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: 'EXPIRY DATE',
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'left'
  },
  {
    id: 'val_valid',
    type: 'text',
    name: 'Valid Value',
    x: 170,
    y: 360,
    width: 120,
    height: 20,
    rotation: 0,
    zIndex: 8,
    isVisible: true,
    text: '{{employee.expiryDate}}',
    binding: 'employee.expiryDate',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'left'
  },
  {
    id: 'strip_footer',
    type: 'shape',
    name: 'Decorative Footer Accent',
    x: 0,
    y: 474,
    width: 320,
    height: 6,
    rotation: 0,
    zIndex: 9,
    isVisible: true,
    shapeType: 'rect',
    fill: '#10b981'
  }
];

const DEFAULT_BACK_ELEMENTS: Element[] = [
  {
    id: 'back_header',
    type: 'text',
    name: 'Back Header Title',
    x: 20,
    y: 30,
    width: 280,
    height: 30,
    rotation: 0,
    zIndex: 1,
    isVisible: true,
    text: 'CARD RULES & INFORMATION',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center'
  },
  {
    id: 'back_divider',
    type: 'shape',
    name: 'Horizontal Rule',
    x: 30,
    y: 55,
    width: 260,
    height: 1,
    rotation: 0,
    zIndex: 2,
    isVisible: true,
    shapeType: 'line',
    fill: '#cbd5e1'
  },
  {
    id: 'back_qr',
    type: 'qr',
    name: 'Verification QR Code',
    x: 110,
    y: 80,
    width: 100,
    height: 100,
    rotation: 0,
    zIndex: 3,
    isVisible: true,
    binding: 'employee.qrCodeData',
  },
  {
    id: 'back_qr_label',
    type: 'text',
    name: 'QR Caption',
    x: 20,
    y: 190,
    width: 280,
    height: 20,
    rotation: 0,
    zIndex: 4,
    isVisible: true,
    text: 'SCAN TO VERIFY IDENTITY',
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center'
  },
  {
    id: 'back_terms_text',
    type: 'text',
    name: 'Policy Disclaimer Terms',
    x: 25,
    y: 230,
    width: 270,
    height: 100,
    rotation: 0,
    zIndex: 5,
    isVisible: true,
    text: 'This identity pass is the official property of Pinesphere. It must be displayed prominently at all times on company premises. If found, please return to nearest supervisor or post box.',
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: '400',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 1.4
  },
  {
    id: 'back_emergency_lbl',
    type: 'text',
    name: 'Emergency Headline',
    x: 20,
    y: 380,
    width: 280,
    height: 15,
    rotation: 0,
    zIndex: 6,
    isVisible: true,
    text: 'EMERGENCY HOTLINE',
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '800',
    color: '#ef4444',
    textAlign: 'center'
  },
  {
    id: 'back_emergency_val',
    type: 'text',
    name: 'Emergency Number',
    x: 20,
    y: 395,
    width: 280,
    height: 20,
    rotation: 0,
    zIndex: 7,
    isVisible: true,
    text: '{{employee.emergencyContact}}',
    binding: 'employee.emergencyContact',
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center'
  }
];

export default function IDCardPage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<DigitalIDCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Template visual elements states
  const [frontElements, setFrontElements] = useState<Element[]>([]);
  const [backElements, setBackElements] = useState<Element[]>([]);
  const [frontBg, setFrontBg] = useState<BackgroundConfig>({ type: 'solid', color1: '#ffffff', color2: '#f3f4f6', angle: 180 });
  const [backBg, setBackBg] = useState<BackgroundConfig>({ type: 'solid', color1: '#ffffff', color2: '#f3f4f6', angle: 180 });

  const generateFallbackCard = (activeUser: { name: string; roleName: string; user_id?: string }): DigitalIDCard => {
    const savedPhoto = typeof window !== 'undefined' ? localStorage.getItem('pinesphere_submitted_photo') : null;
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('pinesphere_submitted_name') : null;
    const savedProgram = typeof window !== 'undefined' ? localStorage.getItem('pinesphere_submitted_program') : null;

    const isStudent = activeUser.roleName === 'Student';
    const idVal = activeUser.user_id || '99';
    const cleanId = parseInt(idVal.replace(/\D/g, '')) || 99;
    return {
      id: `IDC-${idVal}`,
      cardNumber: `ID-2026-${1000 + cleanId}`,
      studentId: isStudent ? `STU-${100 + cleanId}` : `EMP-${500 + cleanId}`,
      studentName: savedName || activeUser.name,
      department: isStudent ? 'Engineering' : (activeUser.roleName === 'Super Admin' ? 'Management' : 'Operations'),
      program: savedProgram || (isStudent ? 'Intern' : `${activeUser.roleName} (Employee)`),
      batch: isStudent ? 'Class of 2026' : 'Staff',
      photoUrl: savedPhoto || `https://i.pravatar.cc/150?u=user${cleanId}`,
      qrCodeData: `https://pinesphere.com/verify/ID-2026-${1000 + cleanId}`,
      issueDate: new Date(Date.now() - 15552000000).toISOString(),
      expiryDate: new Date(Date.now() + 31536000000).toISOString(),
      status: 'Active',
      bloodGroup: 'B+',
      emergencyContact: '+1 (555) 019-9283'
    };
  };

  const loadTemplate = () => {
    // Attempt to load the advanced builder template first
    const savedAdvanced = localStorage.getItem('pinesphere_advanced_id_template');
    if (savedAdvanced) {
      try {
        const adv = JSON.parse(savedAdvanced);
        if (adv.frontElements) setFrontElements(adv.frontElements);
        if (adv.backElements) setBackElements(adv.backElements);
        if (adv.frontBg) setFrontBg(adv.frontBg);
        if (adv.backBg) setBackBg(adv.backBg);
        return;
      } catch (e) {
        console.error("Failed to parse advanced template", e);
      }
    }

    // Legacy parameters config mapping if no advanced template is found
    const saved = localStorage.getItem('pinesphere_id_template');
    let legacy = DEFAULT_TEMPLATE;
    if (saved) {
      try {
        legacy = { ...DEFAULT_TEMPLATE, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }

    // Map legacy parameters to DEFAULT layouts for dynamic render
    const mappedFront = DEFAULT_FRONT_ELEMENTS.map(el => {
      if (el.id === 'card_banner_shape') {
        return { ...el, fill: legacy.primaryColor };
      }
      if (el.id === 'emp_name_val') {
        return { ...el, fontFamily: legacy.fontFamily === 'font-serif' ? 'Playfair Display' : legacy.fontFamily === 'font-mono' ? 'Courier Prime' : 'Inter' };
      }
      if (el.id === 'card_logo_text') {
        return { ...el, isVisible: legacy.showLogo };
      }
      if (el.id === 'val_dept' || el.id === 'label_dept') {
        return { ...el, isVisible: legacy.showDepartment };
      }
      if (el.id === 'val_blood' || el.id === 'label_blood') {
        return { ...el, isVisible: legacy.showBloodGroup };
      }
      if (el.id === 'val_valid' || el.id === 'label_valid') {
        return { ...el, isVisible: legacy.showExpiry };
      }
      return el;
    });

    const mappedBack = DEFAULT_BACK_ELEMENTS.map(el => {
      if (el.id === 'back_qr') {
        return { ...el, isVisible: legacy.showQrCode };
      }
      if (el.id === 'back_terms_text') {
        return { ...el, text: legacy.customBackText };
      }
      return el;
    });

    setFrontElements(mappedFront);
    setBackElements(mappedBack);
    setFrontBg({ type: 'solid', color1: '#ffffff', color2: '#ffffff', angle: 180 });
    setBackBg({ type: 'solid', color1: '#ffffff', color2: '#ffffff', angle: 180 });
  };

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let data = await IDCardService.getMyIDCard(user.user_id);
      if (!data) {
        data = generateFallbackCard(user);
      } else {
        // Override with submitted application details if present in localStorage
        const savedPhoto = localStorage.getItem('pinesphere_submitted_photo');
        const savedName = localStorage.getItem('pinesphere_submitted_name');
        const savedProgram = localStorage.getItem('pinesphere_submitted_program');
        if (savedPhoto) data.photoUrl = savedPhoto;
        if (savedName) data.studentName = savedName;
        if (savedProgram) data.program = savedProgram;
      }
      setCard(data);
    } catch (e) {
      console.error(e);
      setCard(generateFallbackCard(user));
    } finally {
      setLoading(false);
    }
  };

  // Load standard fonts on mount and load template data
  useEffect(() => {
    const googleFontsList = ['Inter', 'Roboto', 'Montserrat', 'Orbitron', 'Playfair Display', 'Courier Prime'];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${googleFontsList.map(f => f.replace(' ', '+')).join('&family=')}:wght@400;700&display=swap`;
    document.head.appendChild(link);

    let active = true;
    const init = async () => {
      await Promise.resolve();
      if (!active) return;
      loadData();
      loadTemplate();
    };
    init();

    return () => {
      document.head.removeChild(link);
      active = false;
    };
  }, [user]);

  const handleDownloadPDF = () => {
    alert("Digital ID Card PDF is being generated and compiled. Check your browser downloads!");
    const element = document.createElement("a");
    const file = new Blob(["Digital ID Card Data\n\nName: " + card?.studentName + "\nID: " + card?.studentId + "\nCard Number: " + card?.cardNumber], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${card?.studentName?.replace(/\s+/g, '_')}_ID_Card.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const resolveBackground = (bg: BackgroundConfig) => {
    if (!bg) return '#ffffff';
    if (bg.type === 'solid') return bg.color1;
    return `linear-gradient(${bg.angle || 180}deg, ${bg.color1}, ${bg.color2})`;
  };

  // Dynamic values binding parser
  const resolveDynamicValue = (text: string | undefined, binding: string | undefined, cardData: DigitalIDCard) => {
    if (binding) {
      const cleanKey = binding.replace('employee.', '') as keyof DigitalIDCard;
      if (cardData[cleanKey]) {
        return String(cardData[cleanKey]);
      }
    }
    
    let result = text || '';
    if (result.includes('{{')) {
      Object.keys(cardData).forEach((k) => {
        const val = cardData[k as keyof DigitalIDCard];
        result = result.replace(new RegExp(`\\{\\{employee\\.${k}\\}\\}`, 'g'), String(val || ''));
      });
    }
    return result;
  };

  if (!hasPermission('idcard.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500 font-sans">
        <p className="font-semibold">You do not have permission to view ID cards.</p>
      </div>
    );
  }

  if (loading || !card) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-405" />
      </div>
    );
  }

  const renderSideElements = (elements: Element[]) => {
    return elements
      .filter(el => el.isVisible)
      .map((el) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            transform: `rotate(${el.rotation || 0}deg)`,
            zIndex: el.zIndex || 1,
          }}
          className="select-none absolute pointer-events-none"
        >
          {/* Shapes */}
          {el.type === 'shape' && (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: el.shapeType !== 'line' ? el.fill : undefined,
                borderStyle: el.borderStyle || 'solid',
                borderWidth: el.borderWidth || 0,
                borderColor: el.borderColor || 'transparent',
                borderRadius: el.borderRadius || 0,
                borderTop: el.shapeType === 'line' ? `${el.height}px ${el.borderStyle || 'solid'} ${el.fill}` : undefined
              }}
              className="w-full h-full select-none"
            />
          )}

          {/* Texts */}
          {el.type === 'text' && (
            <div 
              style={{
                width: '100%',
                height: '100%',
                fontFamily: el.fontFamily,
                fontSize: `${el.fontSize || 12}px`,
                fontWeight: el.fontWeight,
                fontStyle: el.fontStyle,
                textDecoration: el.textDecoration,
                color: el.color,
                textAlign: el.textAlign,
                letterSpacing: `${el.letterSpacing || 0}px`,
                lineHeight: el.lineHeight || 1.2,
                textTransform: el.textTransform,
                wordWrap: 'break-word',
                overflow: 'hidden'
              }}
              className="w-full h-full select-none flex items-center justify-center p-1"
            >
              {resolveDynamicValue(el.text, el.binding, card)}
            </div>
          )}

          {/* Avatars/Images */}
          {(el.type === 'avatar' || el.type === 'image') && (
            <div 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: el.borderRadius || 0,
                backgroundImage: `url(${el.binding === 'employee.photoUrl' ? (card.photoUrl || el.url) : el.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="w-full h-full select-none bg-slate-100"
            />
          )}

          {/* Barcode */}
          {el.type === 'barcode' && (
            <div className="w-full h-full bg-white select-none border border-slate-205 p-1 flex flex-col justify-between items-center text-black">
              <div className="w-full flex-grow flex items-stretch gap-[2px] opacity-80 pt-1 px-1">
                <div className="w-1 bg-black" /><div className="w-[1px] bg-black" /><div className="w-1 bg-black" /><div className="w-[2px] bg-black" />
                <div className="w-[1px] bg-black" /><div className="w-1.5 bg-black" /><div className="w-1 bg-black" /><div className="w-[1px] bg-black" />
                <div className="w-2 bg-black" /><div className="w-[1px] bg-black" /><div className="w-1 bg-black" /><div className="w-[2px] bg-black" />
                <div className="w-[1px] bg-black" /><div className="w-1.5 bg-black" /><div className="w-1 bg-black" /><div className="w-[1px] bg-black" />
                <div className="w-1 bg-black" /><div className="w-[1px] bg-black" /><div className="w-1 bg-black" /><div className="w-[2px] bg-black" />
              </div>
              <span className="text-[7px] font-mono select-none block">{resolveDynamicValue('', el.binding, card)}</span>
            </div>
          )}

          {/* QR Code */}
          {el.type === 'qr' && (
            <div className="w-full h-full bg-white border border-slate-205 p-1 flex items-center justify-center text-black relative select-none">
              <QrCode className="w-full h-full text-slate-850 opacity-90" />
              <span className="absolute bg-white px-1 text-[6px] font-bold tracking-widest text-slate-500 uppercase bottom-0">VERIFY</span>
            </div>
          )}
        </div>
      ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IdCard className="w-6 h-6 text-teal-605" />
            Digital Identity Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Access and print your official enterprise digital identity card.</p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission('idcard.print') && (
            <button 
              onClick={handlePrint}
              className="bg-white border border-slate-205 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Card
            </button>
          )}
          {hasPermission('idcard.download') && (
            <button 
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Info
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Card Side Column (3D Interactive ID Card Card) */}
        <div className="lg:col-span-5 flex flex-col items-center p-6 bg-slate-50/50 border border-slate-150 rounded-3xl">
          <div className="mb-4 text-center">
            <span className="text-xxs uppercase tracking-wider font-extrabold text-slate-450">3D Interactive Preview</span>
            <p className="text-xs text-slate-400 mt-1">Click the ID card to flip between front and back views.</p>
          </div>

          {/* Interactive Card Body Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="[perspective:1000px] w-full max-w-[320px] h-[480px] cursor-pointer group"
          >
            <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}>
              
              {/* --- FRONT SIDE --- */}
              <div 
                style={{
                  background: resolveBackground(frontBg)
                }}
                className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 relative"
              >
                {renderSideElements(frontElements)}
              </div>

              {/* --- BACK SIDE --- */}
              <div 
                style={{
                  background: resolveBackground(backBg)
                }}
                className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 relative"
              >
                {renderSideElements(backElements)}
              </div>

            </div>
          </div>

          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="mt-6 flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Flip ID Card
          </button>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Verified Badge */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 flex gap-4 items-start">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-50 border border-teal-150 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Identity Verification Status</h3>
              <p className="text-xs text-slate-505 mt-1 leading-relaxed">
                Your digital ID card serves as an official proof of identity within the Pinesphere ecosystem. Keep it secure and do not share the verification QR code publicly.
              </p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                <span>Card ID: {card.cardNumber}</span>
                <span>Issued: {new Date(card.issueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Profile Information details sync */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Verification Metadata</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-450 font-medium">Full Name</span>
                <span className="font-bold text-slate-805">{card.studentName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-450 font-medium">Enterprise Role</span>
                <span className="font-bold text-slate-805">{card.program}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-450 font-medium">System Identifier</span>
                <span className="font-bold text-slate-805">{card.studentId}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-450 font-medium">Emergency Line</span>
                <span className="font-bold text-slate-805">{card.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
