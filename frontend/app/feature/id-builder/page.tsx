"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  IdCard, Layout, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Trash2, 
  Copy, Lock, Unlock, Eye, EyeOff, Save, Download, 
  Sparkles, Plus, Image as ImageIcon, Type, Square, 
  Circle, Grid, Sliders, Layers, Upload, Move, ArrowLeft, 
  RefreshCw, Smartphone, CheckCircle, HelpCircle as HelpIcon, 
  Barcode as BarcodeIcon, QrCode as QrIcon, FileText
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { IDCardService } from '@/src/services/idcard.service';
import { DigitalIDCard } from '@/src/types/idcard.types';

// Supported Fonts list
const GOOGLE_FONTS = [
  { name: 'Inter', family: 'var(--font-sans, Inter, sans-serif)' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Orbitron', family: 'Orbitron, sans-serif' },
  { name: 'Playfair Display', family: 'Playfair Display, serif' },
  { name: 'Courier Prime', family: 'Courier Prime, monospace' }
];

interface Element {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qr' | 'barcode' | 'avatar';
  name: string;
  x: number; // relative to canvas
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isLocked: boolean;
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
  shapeType?: 'rect' | 'circle' | 'triangle' | 'line';
  fill?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientType?: 'linear' | 'radial' | 'none';
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';

  // Image Specific
  url?: string;
  opacity?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;

  // Dynamic Binding
  binding?: string; // e.g. "employee.name", "employee.studentId"
  qrType?: 'url' | 'vcard' | 'attendance';
  barcodeType?: 'code128' | 'qrcode' | 'ean13';
}



const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 480;
const GRID_SIZE = 10;

// Unique ID Generator outside component to avoid React impurity flags
let globalUniqueCounter = 0;
const generateUniqueId = (prefix: string) => {
  globalUniqueCounter++;
  return `${prefix}_${globalUniqueCounter}_${Math.random().toString(36).substring(2, 9)}`;
};

// Dynamic Bindings list
const DYNAMIC_FIELDS = [
  { label: 'Full Name', value: '{{employee.studentName}}', field: 'studentName' },
  { label: 'Employee ID', value: '{{employee.studentId}}', field: 'studentId' },
  { label: 'Role / Program', value: '{{employee.program}}', field: 'program' },
  { label: 'Department', value: '{{employee.department}}', field: 'department' },
  { label: 'Blood Group', value: '{{employee.bloodGroup}}', field: 'bloodGroup' },
  { label: 'Expiry Date', value: '{{employee.expiryDate}}', field: 'expiryDate' },
  { label: 'Emergency Contact', value: '{{employee.emergencyContact}}', field: 'emergencyContact' },
  { label: 'Card Number', value: '{{employee.cardNumber}}', field: 'cardNumber' },
  { label: 'Status', value: '{{employee.status}}', field: 'status' }
];

export default function AdvancedDesignerPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  const [employee, setEmployee] = useState<DigitalIDCard | null>(null);

  // Design Canvas States
  const [templateName, setTemplateName] = useState('New Custom Template');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [frontElements, setFrontElements] = useState<Element[]>([]);
  const [backElements, setBackElements] = useState<Element[]>([]);
  const [frontBg, setFrontBg] = useState({ type: 'solid', color1: '#ffffff', color2: '#f3f4f6', angle: 180 });
  const [backBg, setBackBg] = useState({ type: 'solid', color1: '#ffffff', color2: '#f3f4f6', angle: 180 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Editor View Options
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showSafeAreas, setShowSafeAreas] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState<'templates' | 'components' | 'uploads' | 'bindings'>('templates');
  const [activeRightTab, setActiveRightTab] = useState<'properties' | 'layers'>('properties');

  // History Undo/Redo Stacks
  const [history, setHistory] = useState<{ front: Element[], back: Element[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Local uploads list
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // UI interaction refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<{ 
    elementId: string; 
    action: 'drag' | 'resize' | 'rotate'; 
    startX: number; 
    startY: number;
    initialX: number; 
    initialY: number;
    initialW: number;
    initialH: number;
    initialRot: number;
    handleDirection?: string;
  } | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // List of elements on the active side
  const activeElements = useMemo(() => {
    return activeSide === 'front' ? frontElements : backElements;
  }, [activeSide, frontElements, backElements]);

  // Selected element
  const selectedElement = useMemo(() => {
    return activeElements.find(el => el.id === selectedId) || null;
  }, [selectedId, activeElements]);

  // Push to history
  const pushState = useCallback((newFront: Element[], newBack: Element[]) => {
    setHistory(prev => {
      const updatedHistory = prev.slice(0, historyIndex + 1);
      updatedHistory.push({ front: JSON.parse(JSON.stringify(newFront)), back: JSON.parse(JSON.stringify(newBack)) });
      
      // Cap history length at 50
      if (updatedHistory.length > 50) {
        updatedHistory.shift();
      }
      return updatedHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const updateActiveElements = (updater: (prev: Element[]) => Element[]) => {
    if (activeSide === 'front') {
      const next = updater(frontElements);
      setFrontElements(next);
      pushState(next, backElements);
    } else {
      const next = updater(backElements);
      setBackElements(next);
      pushState(frontElements, next);
    }
  };

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setFrontElements(JSON.parse(JSON.stringify(history[prevIndex].front)));
      setBackElements(JSON.parse(JSON.stringify(history[prevIndex].back)));
      showToast('Undo action', 'info');
    }
  }, [historyIndex, history, showToast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setFrontElements(JSON.parse(JSON.stringify(history[nextIndex].front)));
      setBackElements(JSON.parse(JSON.stringify(history[nextIndex].back)));
      showToast('Redo action', 'info');
    }
  }, [historyIndex, history, showToast]);

  // Delete Element
  const handleDeleteElement = useCallback((id: string) => {
    if (activeSide === 'front') {
      const next = frontElements.filter(el => el.id !== id);
      setFrontElements(next);
      pushState(next, backElements);
    } else {
      const next = backElements.filter(el => el.id !== id);
      setBackElements(next);
      pushState(frontElements, next);
    }
    if (selectedId === id) {
      setSelectedId(null);
    }
    showToast('Element deleted', 'info');
  }, [activeSide, frontElements, backElements, selectedId, pushState, showToast]);

  // Duplicate Element
  const handleDuplicateElement = useCallback((id: string) => {
    const src = activeElements.find(el => el.id === id);
    if (!src) return;
    const copy: Element = {
      ...JSON.parse(JSON.stringify(src)),
      id: generateUniqueId(`${src.type}_copy`),
      name: `${src.name} (Copy)`,
      x: Math.min(src.x + 20, CANVAS_WIDTH - 50),
      y: Math.min(src.y + 20, CANVAS_HEIGHT - 50),
      zIndex: activeElements.length + 1
    };
    
    if (activeSide === 'front') {
      const next = [...frontElements, copy];
      setFrontElements(next);
      pushState(next, backElements);
    } else {
      const next = [...backElements, copy];
      setBackElements(next);
      pushState(frontElements, next);
    }
    setSelectedId(copy.id);
    showToast('Element duplicated');
  }, [activeSide, frontElements, backElements, activeElements, pushState, showToast]);

  // Load Templates
  const handleLoadTemplatePreset = useCallback((preset: 'corp' | 'student' | 'vip' | 'event', empData?: DigitalIDCard | null) => {
    let front: Element[] = [];
    let back: Element[] = [];
    let fBg = { type: 'solid', color1: '#ffffff', color2: '#f3f4f6', angle: 180 };
    let bBg = { type: 'solid', color1: '#ffffff', color2: '#f3f4f6', angle: 180 };
    let currentTempName = templateName;

    const activeEmp = empData !== undefined ? empData : employee;

    if (preset === 'corp') {
      currentTempName = 'Corporate Premium Blue';
      fBg = { type: 'linear', color1: '#1e3a8a', color2: '#0f172a', angle: 135 };
      bBg = { type: 'solid', color1: '#0f172a', color2: '#ffffff', angle: 180 };

      front = [
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
          isLocked: true,
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
          isLocked: false,
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
          isLocked: false,
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
          isLocked: false,
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
          isLocked: false,
          isVisible: true,
          url: activeEmp?.photoUrl || '',
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.studentName}}',
          binding: 'employee.studentName',
          fontFamily: 'Inter',
          fontSize: 20,
          fontWeight: '800',
          color: '#ffffff',
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.program}}',
          binding: 'employee.program',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#60a5fa',
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
          isLocked: true,
          isVisible: true,
          shapeType: 'rect',
          fill: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 16,
          borderColor: 'rgba(255, 255, 255, 0.1)',
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
          isLocked: true,
          isVisible: true,
          text: 'EMPLOYEE ID',
          fontFamily: 'Inter',
          fontSize: 8,
          fontWeight: '700',
          color: '#94a3b8',
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.studentId}}',
          binding: 'employee.studentId',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
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
          isLocked: true,
          isVisible: true,
          text: 'DEPARTMENT',
          fontFamily: 'Inter',
          fontSize: 8,
          fontWeight: '700',
          color: '#94a3b8',
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.department}}',
          binding: 'employee.department',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
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
          isLocked: true,
          isVisible: true,
          text: 'BLOOD GROUP',
          fontFamily: 'Inter',
          fontSize: 8,
          fontWeight: '700',
          color: '#94a3b8',
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.bloodGroup}}',
          binding: 'employee.bloodGroup',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
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
          isLocked: true,
          isVisible: true,
          text: 'EXPIRY DATE',
          fontFamily: 'Inter',
          fontSize: 8,
          fontWeight: '700',
          color: '#94a3b8',
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.expiryDate}}',
          binding: 'employee.expiryDate',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
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
          isLocked: true,
          isVisible: true,
          shapeType: 'rect',
          fill: '#10b981'
        }
      ];

      back = [
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
          isLocked: false,
          isVisible: true,
          text: 'CARD RULES & INFORMATION',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '800',
          color: '#ffffff',
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
          isLocked: true,
          isVisible: true,
          shapeType: 'line',
          fill: '#334155'
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
          isLocked: false,
          isVisible: true,
          binding: 'employee.qrCodeData',
          qrType: 'url'
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
          isLocked: true,
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
          isLocked: false,
          isVisible: true,
          text: 'This identity pass is the official property of Pinesphere. It must be displayed prominently at all times on company premises. If found, please return to nearest supervisor or post box.',
          fontFamily: 'Inter',
          fontSize: 9,
          fontWeight: '400',
          color: '#94a3b8',
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
          isLocked: true,
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
          isLocked: false,
          isVisible: true,
          text: '{{employee.emergencyContact}}',
          binding: 'employee.emergencyContact',
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center'
        }
      ];
    } else if (preset === 'student') {
      currentTempName = 'Academic Emerald Forest';
      fBg = { type: 'linear', color1: '#064e3b', color2: '#065f46', angle: 180 };
      bBg = { type: 'solid', color1: '#064e3b', color2: '#ffffff', angle: 180 };

      front = [
        {
          id: 's_banner_top',
          type: 'shape',
          name: 'Banner Top Accent',
          x: 0,
          y: 0,
          width: 320,
          height: 80,
          rotation: 0,
          zIndex: 1,
          isLocked: true,
          isVisible: true,
          shapeType: 'rect',
          fill: '#047857'
        },
        {
          id: 's_academy_logo',
          type: 'text',
          name: 'University Title',
          x: 20,
          y: 25,
          width: 280,
          height: 30,
          rotation: 0,
          zIndex: 2,
          isLocked: false,
          isVisible: true,
          text: 'PINESPHERE UNIVERSITY',
          fontFamily: 'Playfair Display',
          fontSize: 13,
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center'
        },
        {
          id: 's_photo',
          type: 'avatar',
          name: 'Student Photo placeholder',
          x: 100,
          y: 90,
          width: 120,
          height: 120,
          rotation: 0,
          zIndex: 3,
          isLocked: false,
          isVisible: true,
          url: activeEmp?.photoUrl || '',
          binding: 'employee.photoUrl',
          borderRadius: 16,
          borderColor: '#ffffff',
          borderWidth: 4
        },
        {
          id: 's_name',
          type: 'text',
          name: 'Student Name',
          x: 20,
          y: 225,
          width: 280,
          height: 30,
          rotation: 0,
          zIndex: 4,
          isLocked: false,
          isVisible: true,
          text: '{{employee.studentName}}',
          binding: 'employee.studentName',
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'center'
        },
        {
          id: 's_dept',
          type: 'text',
          name: 'Course Department',
          x: 20,
          y: 250,
          width: 280,
          height: 20,
          rotation: 0,
          zIndex: 5,
          isLocked: false,
          isVisible: true,
          text: '{{employee.department}}',
          binding: 'employee.department',
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: '500',
          color: '#a7f3d0',
          textAlign: 'center'
        },
        {
          id: 's_id_bg',
          type: 'shape',
          name: 'Card Info Plate',
          x: 30,
          y: 290,
          width: 260,
          height: 80,
          rotation: 0,
          zIndex: 6,
          isLocked: true,
          isVisible: true,
          shapeType: 'rect',
          fill: '#022c22',
          borderRadius: 8
        },
        {
          id: 's_id_label',
          type: 'text',
          name: 'Reg No Label',
          x: 40,
          y: 305,
          width: 100,
          height: 15,
          rotation: 0,
          zIndex: 7,
          isLocked: true,
          isVisible: true,
          text: 'STUDENT REG NO',
          fontFamily: 'Inter',
          fontSize: 8,
          fontWeight: '700',
          color: '#059669',
          textAlign: 'left'
        },
        {
          id: 's_id_val',
          type: 'text',
          name: 'Reg No Value',
          x: 40,
          y: 320,
          width: 100,
          height: 20,
          rotation: 0,
          zIndex: 7,
          isLocked: false,
          isVisible: true,
          text: '{{employee.studentId}}',
          binding: 'employee.studentId',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'left'
        },
        {
          id: 's_batch_label',
          type: 'text',
          name: 'Batch Year Label',
          x: 160,
          y: 305,
          width: 110,
          height: 15,
          rotation: 0,
          zIndex: 7,
          isLocked: true,
          isVisible: true,
          text: 'GRADUATION YEAR',
          fontFamily: 'Inter',
          fontSize: 8,
          fontWeight: '700',
          color: '#059669',
          textAlign: 'left'
        },
        {
          id: 's_batch_val',
          type: 'text',
          name: 'Batch Year Value',
          x: 160,
          y: 320,
          width: 110,
          height: 20,
          rotation: 0,
          zIndex: 7,
          isLocked: false,
          isVisible: true,
          text: '2026',
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          color: '#ffffff',
          textAlign: 'left'
        },
        {
          id: 's_footer',
          type: 'text',
          name: 'Verified Badge Text',
          x: 20,
          y: 430,
          width: 280,
          height: 20,
          rotation: 0,
          zIndex: 8,
          isLocked: false,
          isVisible: true,
          text: 'STUDENT IDENTITY CARD',
          fontFamily: 'Inter',
          fontSize: 9,
          fontWeight: '800',
          color: '#a7f3d0',
          textAlign: 'center',
          letterSpacing: 1
        }
      ];

      back = [
        {
          id: 'sb_heading',
          type: 'text',
          name: 'Instructions Header',
          x: 20,
          y: 30,
          width: 280,
          height: 20,
          rotation: 0,
          zIndex: 1,
          isLocked: true,
          isVisible: true,
          text: 'UNIVERSITY REGULATIONS',
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: '800',
          color: '#ffffff',
          textAlign: 'center'
        },
        {
          id: 'sb_qr',
          type: 'qr',
          name: 'QR verification',
          x: 110,
          y: 80,
          width: 100,
          height: 100,
          rotation: 0,
          zIndex: 2,
          isLocked: false,
          isVisible: true,
          binding: 'employee.qrCodeData'
        },
        {
          id: 'sb_disclaim',
          type: 'text',
          name: 'Disclaim text',
          x: 30,
          y: 200,
          width: 260,
          height: 120,
          rotation: 0,
          zIndex: 3,
          isLocked: false,
          isVisible: true,
          text: 'This card is strictly for academic and administrative identification. Loss must be reported instantly to the campus registrar. Cardholder is bound by the honor code of Pinesphere University.',
          fontFamily: 'Inter',
          fontSize: 9,
          fontWeight: '400',
          color: '#a7f3d0',
          textAlign: 'center',
          lineHeight: 1.4
        }
      ];
    } else {
      // Basic fallback
      currentTempName = 'Simple Design Template';
      fBg = { type: 'solid', color1: '#ffffff', color2: '#ffffff', angle: 180 };
      front = [
        {
          id: 'fallback_name',
          type: 'text',
          name: 'Name Field',
          x: 20,
          y: 200,
          width: 280,
          height: 30,
          rotation: 0,
          zIndex: 1,
          isLocked: false,
          isVisible: true,
          text: '{{employee.studentName}}',
          binding: 'employee.studentName',
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: '700',
          color: '#000000',
          textAlign: 'center'
        }
      ];
    }

    setTemplateName(currentTempName);
    setFrontElements(front);
    setBackElements(back);
    setFrontBg(fBg);
    setBackBg(bBg);
    
    // Clear & push clean slate history
    setHistory([{ front: JSON.parse(JSON.stringify(front)), back: JSON.parse(JSON.stringify(back)) }]);
    setHistoryIndex(0);
    
    setSelectedId(null);
    showToast(`${currentTempName} template loaded`);
  }, [employee, templateName, showToast]);

  const loadEmployeeData = useCallback(async () => {
    try {
      if (user) {
        let cardData = await IDCardService.getMyIDCard(user.user_id);
        if (!cardData) {
          cardData = {
            id: 'IDC-1234',
            cardNumber: 'ID-2026-1552',
            studentId: 'STU-4820',
            studentName: user.name || 'Alex Pinesphere',
            department: 'AI Research Division',
            program: 'Technical Lead',
            batch: 'Staff',
            photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`,
            qrCodeData: 'https://pinesphere.com/verify/ID-2026-1552',
            issueDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 31536000000).toISOString(),
            status: 'Active',
            bloodGroup: 'AB+',
            emergencyContact: '+1 (555) 492-9381'
          };
        }
        setEmployee(cardData);
        // Load default template with the fetched data
        handleLoadTemplatePreset('corp', cardData);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user, handleLoadTemplatePreset]);

  useEffect(() => {
    const fonts = GOOGLE_FONTS.map(f => f.name);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fonts.map(f => f.replace(' ', '+')).join('&family=')}:wght@400;700&display=swap`;
    document.head.appendChild(link);

    let active = true;
    const init = async () => {
      await Promise.resolve();
      if (!active) return;
      loadEmployeeData();
    };
    init();

    return () => {
      document.head.removeChild(link);
      active = false;
    };
  }, [loadEmployeeData]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Undo
      if (cmdCtrl && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      
      // Redo (Ctrl+Y)
      if (cmdCtrl && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }

      // Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        // Prevent deletion while typing in an input
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        handleDeleteElement(selectedId);
      }

      // Duplicate (Ctrl+D)
      if (cmdCtrl && e.key === 'd' && selectedId) {
        e.preventDefault();
        handleDuplicateElement(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, historyIndex, history, handleDeleteElement, handleDuplicateElement, handleUndo, handleRedo]);

  // Actions
  const handleAddText = (styleType: 'heading' | 'subheading' | 'body' | 'label') => {
    const newText: Element = {
      id: generateUniqueId('text'),
      type: 'text',
      name: `Text (${styleType})`,
      x: 40,
      y: 100,
      width: 240,
      height: styleType === 'heading' ? 40 : styleType === 'subheading' ? 30 : 20,
      rotation: 0,
      zIndex: activeElements.length + 1,
      isLocked: false,
      isVisible: true,
      text: styleType === 'heading' ? 'HEADING TEXT' : styleType === 'subheading' ? 'Subheading Title' : 'Click to edit template text',
      fontFamily: 'Inter',
      fontSize: styleType === 'heading' ? 20 : styleType === 'subheading' ? 14 : 11,
      fontWeight: styleType === 'heading' ? '800' : styleType === 'subheading' ? '700' : '400',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#1e293b',
      textAlign: styleType === 'heading' || styleType === 'subheading' ? 'center' : 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none'
    };
    updateActiveElements(prev => [...prev, newText]);
    setSelectedId(newText.id);
    showToast('Text block added');
  };

  const handleAddShape = (shapeType: 'rect' | 'circle' | 'line') => {
    const newShape: Element = {
      id: generateUniqueId('shape'),
      type: 'shape',
      name: `Shape (${shapeType})`,
      x: 60,
      y: 150,
      width: shapeType === 'line' ? 200 : 100,
      height: shapeType === 'line' ? 2 : 100,
      rotation: 0,
      zIndex: activeElements.length + 1,
      isLocked: false,
      isVisible: true,
      shapeType,
      fill: shapeType === 'line' ? '#cbd5e1' : '#3b82f6',
      borderRadius: shapeType === 'circle' ? 9999 : 0,
      borderWidth: 0,
      borderColor: '#000000',
      borderStyle: 'solid'
    };
    updateActiveElements(prev => [...prev, newShape]);
    setSelectedId(newShape.id);
    showToast(`${shapeType.toUpperCase()} shape added`);
  };

  const handleAddIdentityComponent = (type: 'photo' | 'qr' | 'barcode' | 'sig') => {
    const defaultWidth = type === 'photo' ? 100 : type === 'qr' ? 90 : type === 'barcode' ? 150 : 120;
    const defaultHeight = type === 'photo' ? 100 : type === 'qr' ? 90 : type === 'barcode' ? 50 : 60;
    
    const newComponent: Element = {
      id: generateUniqueId(`identity_${type}`),
      type: type === 'photo' ? 'avatar' : type === 'qr' ? 'qr' : type === 'barcode' ? 'barcode' : 'image',
      name: type === 'photo' ? 'Employee Photo' : type === 'qr' ? 'QR Code' : type === 'barcode' ? 'Barcode' : 'Signature Stamp',
      x: (CANVAS_WIDTH - defaultWidth) / 2,
      y: 120,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
      zIndex: activeElements.length + 1,
      isLocked: false,
      isVisible: true,
      url: type === 'photo' 
        ? (employee?.photoUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Pinesphere')
        : type === 'sig' 
          ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><path d="M 10 30 Q 30 10, 50 30 T 90 20" fill="none" stroke="black" stroke-width="2"/></svg>'
          : undefined,
      binding: type === 'photo' ? 'employee.photoUrl' : type === 'qr' ? 'employee.qrCodeData' : type === 'barcode' ? 'employee.cardNumber' : undefined,
      qrType: type === 'qr' ? 'url' : undefined,
      barcodeType: type === 'barcode' ? 'code128' : undefined
    };
    updateActiveElements(prev => [...prev, newComponent]);
    setSelectedId(newComponent.id);
    showToast(`${newComponent.name} placeholder added`);
  };

  const handleAddDynamicField = (field: typeof DYNAMIC_FIELDS[0]) => {
    const newField: Element = {
      id: generateUniqueId(`field_${field.field}`),
      type: 'text',
      name: `Dynamic - ${field.label}`,
      x: 20,
      y: 200,
      width: 280,
      height: 24,
      rotation: 0,
      zIndex: activeElements.length + 1,
      isLocked: false,
      isVisible: true,
      text: field.value,
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '600',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#334155',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      binding: `employee.${field.field}`
    };
    updateActiveElements(prev => [...prev, newField]);
    setSelectedId(newField.id);
    showToast(`Dynamic Field ${field.label} added`);
  };

  // Image Upload handler
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setUploadedImages(prev => [base64Url, ...prev]);
      
      // Auto add to canvas
      const newImage: Element = {
        id: generateUniqueId('image'),
        type: 'image',
        name: 'Uploaded Image',
        x: 60,
        y: 120,
        width: 120,
        height: 120,
        rotation: 0,
        zIndex: activeElements.length + 1,
        isLocked: false,
        isVisible: true,
        url: base64Url,
        opacity: 1
      };
      updateActiveElements(prev => [...prev, newImage]);
      setSelectedId(newImage.id);
      showToast('Image uploaded and placed');
    };
    reader.readAsDataURL(file);
  };

  // Properties Updates
  const handleUpdateElementProperty = <K extends keyof Element>(key: K, val: Element[K]) => {
    if (!selectedId) return;
    updateActiveElements(prev => 
      prev.map(el => el.id === selectedId ? { ...el, [key]: val } : el)
    );
  };

  // Layers controls
  const handleMoveLayer = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const elIndex = activeElements.findIndex(el => el.id === id);
    if (elIndex === -1) return;

    let targetElements = [...activeElements].sort((a, b) => a.zIndex - b.zIndex);
    const element = targetElements.find(el => el.id === id)!;
    
    const curIdx = targetElements.indexOf(element);

    if (direction === 'up' && curIdx < targetElements.length - 1) {
      targetElements[curIdx] = targetElements[curIdx + 1];
      targetElements[curIdx + 1] = element;
    } else if (direction === 'down' && curIdx > 0) {
      targetElements[curIdx] = targetElements[curIdx - 1];
      targetElements[curIdx - 1] = element;
    } else if (direction === 'top') {
      targetElements = targetElements.filter(el => el.id !== id);
      targetElements.push(element);
    } else if (direction === 'bottom') {
      targetElements = targetElements.filter(el => el.id !== id);
      targetElements.unshift(element);
    }

    // Re-index zIndex
    const reindexed = targetElements.map((el, i) => ({ ...el, zIndex: i + 1 }));
    
    if (activeSide === 'front') {
      setFrontElements(reindexed);
      pushState(reindexed, backElements);
    } else {
      setBackElements(reindexed);
      pushState(frontElements, reindexed);
    }
  };

  // Alignment Toolbar Utilities
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedElement) return;
    
    let nextX = selectedElement.x;
    let nextY = selectedElement.y;

    if (alignment === 'left') {
      nextX = 10;
    } else if (alignment === 'center') {
      nextX = (CANVAS_WIDTH - selectedElement.width) / 2;
    } else if (alignment === 'right') {
      nextX = CANVAS_WIDTH - selectedElement.width - 10;
    } else if (alignment === 'top') {
      nextY = 10;
    } else if (alignment === 'middle') {
      nextY = (CANVAS_HEIGHT - selectedElement.height) / 2;
    } else if (alignment === 'bottom') {
      nextY = CANVAS_HEIGHT - selectedElement.height - 10;
    }

    // Snap to grid support
    if (snapToGrid) {
      nextX = Math.round(nextX / GRID_SIZE) * GRID_SIZE;
      nextY = Math.round(nextY / GRID_SIZE) * GRID_SIZE;
    }

    updateActiveElements(prev => 
      prev.map(el => el.id === selectedId ? { ...el, x: nextX, y: nextY } : el)
    );
    showToast(`Aligned element to ${alignment}`);
  };

  // Drag and Drop & Resize interactions
  const handlePointerDown = (e: React.PointerEvent, element: Element, action: 'drag' | 'resize' | 'rotate', direction?: string) => {
    if (element.isLocked) return;
    e.stopPropagation();
    
    setSelectedId(element.id);
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (!canvasBounds) return;

    transformRef.current = {
      elementId: element.id,
      action,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x,
      initialY: element.y,
      initialW: element.width,
      initialH: element.height,
      initialRot: element.rotation,
      handleDirection: direction
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!transformRef.current) return;
    const ref = transformRef.current;
    
    const dx = (e.clientX - ref.startX) / zoom;
    const dy = (e.clientY - ref.startY) / zoom;

    if (ref.action === 'drag') {
      let nextX = ref.initialX + dx;
      let nextY = ref.initialY + dy;
      
      // Grid snapping
      if (snapToGrid) {
        nextX = Math.round(nextX / GRID_SIZE) * GRID_SIZE;
        nextY = Math.round(nextY / GRID_SIZE) * GRID_SIZE;
      }
      
      // Boundaries
      nextX = Math.max(-50, Math.min(CANVAS_WIDTH - 20, nextX));
      nextY = Math.max(-50, Math.min(CANVAS_HEIGHT - 20, nextY));

      setElementsOnlyNoHistory(ref.elementId, { x: nextX, y: nextY });
    } else if (ref.action === 'resize' && ref.handleDirection) {
      let nextW = ref.initialW;
      let nextH = ref.initialH;
      let nextX = ref.initialX;
      let nextY = ref.initialY;

      const dir = ref.handleDirection;
      
      if (dir.includes('e')) nextW = Math.max(10, ref.initialW + dx);
      if (dir.includes('s')) nextH = Math.max(10, ref.initialH + dy);
      if (dir.includes('w')) {
        const potentialW = ref.initialW - dx;
        if (potentialW > 10) {
          nextW = potentialW;
          nextX = ref.initialX + dx;
        }
      }
      if (dir.includes('n')) {
        const potentialH = ref.initialH - dy;
        if (potentialH > 10) {
          nextH = potentialH;
          nextY = ref.initialY + dy;
        }
      }

      if (snapToGrid) {
        nextW = Math.round(nextW / GRID_SIZE) * GRID_SIZE;
        nextH = Math.round(nextH / GRID_SIZE) * GRID_SIZE;
        nextX = Math.round(nextX / GRID_SIZE) * GRID_SIZE;
        nextY = Math.round(nextY / GRID_SIZE) * GRID_SIZE;
      }

      setElementsOnlyNoHistory(ref.elementId, { x: nextX, y: nextY, width: nextW, height: nextH });
    } else if (ref.action === 'rotate') {
      // Find element center in screen space
      const canvasBounds = canvasRef.current?.getBoundingClientRect();
      if (!canvasBounds) return;

      const activeList = activeSide === 'front' ? frontElements : backElements;
      const element = activeList.find(el => el.id === ref.elementId);
      if (!element) return;

      const screenCenterX = canvasBounds.left + (element.x + element.width / 2) * zoom;
      const screenCenterY = canvasBounds.top + (element.y + element.height / 2) * zoom;

      const rad = Math.atan2(e.clientY - screenCenterY, e.clientX - screenCenterX);
      let angle = rad * (180 / Math.PI) - 90; // offset for rotating from handle

      if (e.shiftKey) {
        // Snap rotation to 15 degree marks
        angle = Math.round(angle / 15) * 15;
      }

      setElementsOnlyNoHistory(ref.elementId, { rotation: angle });
    }
  };

  const handlePointerUp = () => {
    if (!transformRef.current) return;
    
    // Commit the current state to history
    pushState(frontElements, backElements);

    transformRef.current = null;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  // Helper to adjust position/rotation in UI state immediately without filling history stack
  const setElementsOnlyNoHistory = (id: string, updates: Partial<Element>) => {
    if (activeSide === 'front') {
      setFrontElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    } else {
      setBackElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    }
  };

  // Resolves binding string to actual mock/employee data values
  const resolveBindingText = (element: Element) => {
    if (!element.binding) return element.text || '';
    if (!employee) return element.text || '';

    const formatDate = (val: any) => {
      if (!val) return '';
      try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      } catch (e) {}
      return String(val);
    };

    // Match bindings like 'employee.studentName'
    const cleanKey = element.binding.replace('employee.', '') as keyof DigitalIDCard;
    if (employee[cleanKey]) {
      if (cleanKey === 'expiryDate' || cleanKey === 'issueDate') {
        return formatDate(employee[cleanKey]);
      }
      return String(employee[cleanKey]);
    }
    return element.text || '';
  };

  // High Resolution Export as Print Ready SVG
  const handleExportSVG = () => {
    const elements = activeSide === 'front' ? frontElements : backElements;
    const bg = activeSide === 'front' ? frontBg : backBg;
    
    // Generate background SVG snippet
    let bgSvg = '';
    if (bg.type === 'solid') {
      bgSvg = `<rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="${bg.color1}" />`;
    } else if (bg.type === 'linear') {
      bgSvg = `
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${bg.color1}" />
            <stop offset="100%" stop-color="${bg.color2}" />
          </linearGradient>
        </defs>
        <rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#bgGrad)" />
      `;
    }

    // Generate elements SVG snippet
    const elementsSvg = elements
      .filter(el => el.isVisible)
      .map(el => {
        const rotationTransform = el.rotation ? `transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"` : '';
        
        if (el.type === 'shape') {
          if (el.shapeType === 'circle') {
            const r = el.width / 2;
            return `<circle cx="${el.x + r}" cy="${el.y + r}" r="${r}" fill="${el.fill}" ${rotationTransform} />`;
          } else if (el.shapeType === 'line') {
            return `<line x1="${el.x}" y1="${el.y}" x2="${el.x + el.width}" y2="${el.y}" stroke="${el.fill}" stroke-width="${el.height}" ${rotationTransform} />`;
          } else {
            return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.borderRadius || 0}" fill="${el.fill}" stroke="${el.borderColor}" stroke-width="${el.borderWidth || 0}" ${rotationTransform} />`;
          }
        } else if (el.type === 'text') {
          const resolvedText = resolveBindingText(el);
          return `
            <text x="${el.x + (el.textAlign === 'center' ? el.width / 2 : el.textAlign === 'right' ? el.width : 0)}" 
                  y="${el.y + el.height / 2 + (el.fontSize || 12) / 3}" 
                  font-family="${el.fontFamily}" 
                  font-size="${el.fontSize}" 
                  font-weight="${el.fontWeight}" 
                  font-style="${el.fontStyle}"
                  fill="${el.color}" 
                  text-anchor="${el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start'}" 
                  ${rotationTransform}>
              ${resolvedText}
            </text>
          `;
        } else if (el.type === 'avatar' || el.type === 'image') {
          const resolvedUrl = el.binding === 'employee.photoUrl' ? (employee?.photoUrl || el.url) : el.url;
          return `
            <image href="${resolvedUrl}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" clip-path="${el.borderRadius ? 'circle()' : 'none'}" ${rotationTransform} />
          `;
        } else if (el.type === 'qr') {
          return `
            <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="white" stroke="#e2e8f0" stroke-width="1" />
            <!-- Draw barcode/qr indicator -->
            <path d="M ${el.x + 10} ${el.y + 10} L ${el.x + el.width - 10} ${el.y + 10} L ${el.x + el.width - 10} ${el.y + el.height - 10} L ${el.x + 10} ${el.y + el.height - 10} Z" fill="none" stroke="#475569" stroke-width="3" stroke-dasharray="5,5" />
            <text x="${el.x + el.width / 2}" y="${el.y + el.height / 2 + 3}" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#64748b">QR CODE</text>
          `;
        } else if (el.type === 'barcode') {
          return `
            <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="white" stroke="#e2e8f0" stroke-width="1" />
            <!-- Bar lines placeholder -->
            <line x1="${el.x + 10}" y1="${el.y + 5}" x2="${el.x + 10}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="2" />
            <line x1="${el.x + 16}" y1="${el.y + 5}" x2="${el.x + 16}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="1" />
            <line x1="${el.x + 22}" y1="${el.y + 5}" x2="${el.x + 22}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="3" />
            <line x1="${el.x + 30}" y1="${el.y + 5}" x2="${el.x + 30}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="1" />
            <line x1="${el.x + 36}" y1="${el.y + 5}" x2="${el.x + 36}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="4" />
            <line x1="${el.x + 46}" y1="${el.y + 5}" x2="${el.x + 46}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="2" />
            <line x1="${el.x + 54}" y1="${el.y + 5}" x2="${el.x + 54}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="1" />
            <line x1="${el.x + 60}" y1="${el.y + 5}" x2="${el.x + 60}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="3" />
            <line x1="${el.x + 68}" y1="${el.y + 5}" x2="${el.x + 68}" y2="${el.y + el.height - 10}" stroke="black" stroke-width="1" />
            <text x="${el.x + el.width / 2}" y="${el.y + el.height - 2}" font-family="sans-serif" font-size="8" text-anchor="middle" fill="black">ID-2026-1552</text>
          `;
        }
        return '';
      })
      .join('');

    const fullSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
        ${bgSvg}
        ${elementsSvg}
      </svg>
    `;

    const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '_')}_${activeSide}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Exported ${activeSide.toUpperCase()} side vector SVG`);
  };

  const handleSaveToLocalStorage = () => {
    const designerTemplate = {
      name: templateName,
      frontElements,
      backElements,
      frontBg,
      backBg
    };
    localStorage.setItem('pinesphere_advanced_id_template', JSON.stringify(designerTemplate));
    showToast('Template design saved to browser storage', 'success');
  };

  if (!hasPermission('idcard.view')) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-slate-500 font-sans">
        <p className="font-semibold">You do not have permission to design ID card templates.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* Toast Alert Box */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl text-xs font-bold tracking-wide animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Editor Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <Link href="/feature/id-card" className="p-2 rounded-lg hover:bg-slate-850 transition-colors text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div className="h-4.5 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              D
            </div>
            <div>
              <input 
                type="text" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="bg-transparent border border-transparent hover:border-slate-800 focus:border-slate-700 hover:bg-slate-900 focus:bg-slate-900 rounded px-2 py-0.5 text-xs font-black text-white focus:outline-none transition-all w-48"
              />
              <p className="text-[10px] text-slate-500 px-2 mt-0.5">Advanced Visual Builder</p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Tools */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button 
              onClick={handleUndo} 
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-md transition-colors ${historyIndex <= 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'}`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-md transition-colors ${historyIndex >= history.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'}`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button 
              onClick={() => setZoom(prev => Math.max(0.25, prev - 0.25))}
              className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(2.0, prev + 0.25))}
              className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${showGrid ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
              title="Show Grid Lines"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${snapToGrid ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
              title="Snap to Grid"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowSafeAreas(!showSafeAreas)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${showSafeAreas ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
              title="Show Margins & Safe Area"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSaveToLocalStorage}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Design
            </button>

            <button 
              onClick={handleExportSVG}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export SVG
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden select-none">
        
        {/* Left Library Tabbed Sidebar */}
        <aside className="w-72 border-r border-slate-800 bg-slate-950 flex select-none z-30">
          {/* Icons Vertical Ribbon */}
          <div className="w-16 border-r border-slate-900 flex flex-col items-center py-4 gap-4 bg-slate-950">
            <button 
              onClick={() => setActiveLeftTab('templates')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${activeLeftTab === 'templates' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
              title="Presets Layouts"
            >
              <Layout className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveLeftTab('components')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${activeLeftTab === 'components' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
              title="Design Components"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveLeftTab('uploads')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${activeLeftTab === 'uploads' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
              title="Media Uploads"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveLeftTab('bindings')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${activeLeftTab === 'bindings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
              title="Dynamic Data Fields"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Panel Contents */}
          <div className="flex-1 p-4 overflow-y-auto select-none">
            {activeLeftTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">ID Templates</h3>
                <p className="text-xxs text-slate-500 mt-1 leading-relaxed">Load pre-built corporate or academic formats to start designing.</p>
                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  <button 
                    onClick={() => handleLoadTemplatePreset('corp')}
                    className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl text-left border border-slate-800 transition-all cursor-pointer hover:border-indigo-650"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-200">Corporate Premium</span>
                      <span className="text-[8px] bg-indigo-900/40 text-indigo-400 px-1.5 py-0.5 rounded">Staff</span>
                    </div>
                    <div className="w-full h-12 bg-gradient-to-br from-indigo-900/40 to-slate-950 rounded-lg mt-2 flex items-center justify-center border border-slate-800/80">
                      <IdCard className="w-6 h-6 text-slate-650" />
                    </div>
                  </button>

                  <button 
                    onClick={() => handleLoadTemplatePreset('student')}
                    className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl text-left border border-slate-800 transition-all cursor-pointer hover:border-emerald-650"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-200">Academic Emerald</span>
                      <span className="text-[8px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded">Student</span>
                    </div>
                    <div className="w-full h-12 bg-gradient-to-br from-emerald-900/40 to-slate-950 rounded-lg mt-2 flex items-center justify-center border border-slate-800/80">
                      <IdCard className="w-6 h-6 text-slate-650" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeLeftTab === 'components' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">Component Panel</h3>
                
                {/* Text Section */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Text Types</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleAddText('heading')}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-[10px] font-bold text-left flex items-center gap-1.5 cursor-pointer text-slate-300"
                    >
                      <Type className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      Heading Text
                    </button>
                    <button 
                      onClick={() => handleAddText('body')}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-[10px] font-bold text-left flex items-center gap-1.5 cursor-pointer text-slate-300"
                    >
                      <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Paragraph Body
                    </button>
                  </div>
                </div>

                {/* Shape Section */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shapes</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleAddShape('rect')}
                      className="p-2.5 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-300"
                    >
                      <Square className="w-4 h-4 text-indigo-400" />
                      <span className="text-[8px] font-bold">Square</span>
                    </button>
                    <button 
                      onClick={() => handleAddShape('circle')}
                      className="p-2.5 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-300"
                    >
                      <Circle className="w-4 h-4 text-indigo-400" />
                      <span className="text-[8px] font-bold">Circle</span>
                    </button>
                    <button 
                      onClick={() => handleAddShape('line')}
                      className="p-2.5 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-300"
                    >
                      <div className="w-4 h-[2px] bg-indigo-400 my-1.5" />
                      <span className="text-[8px] font-bold">Divider</span>
                    </button>
                  </div>
                </div>

                {/* Identity Components Section */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Identity Assets</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleAddIdentityComponent('photo')}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-[10px] font-bold text-left flex items-center gap-1.5 cursor-pointer text-slate-300"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      Employee Photo
                    </button>
                    <button 
                      onClick={() => handleAddIdentityComponent('qr')}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-[10px] font-bold text-left flex items-center gap-1.5 cursor-pointer text-slate-300"
                    >
                      <QrIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      QR Verification
                    </button>
                    <button 
                      onClick={() => handleAddIdentityComponent('barcode')}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-[10px] font-bold text-left flex items-center gap-1.5 cursor-pointer text-slate-300"
                    >
                      <BarcodeIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      Barcode Value
                    </button>
                    <button 
                      onClick={() => handleAddIdentityComponent('sig')}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-[10px] font-bold text-left flex items-center gap-1.5 cursor-pointer text-slate-300"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      Signature Field
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === 'uploads' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">Media Library</h3>
                
                {/* File Upload zone */}
                <div className="border-2 border-dashed border-slate-850 rounded-2xl p-4 text-center hover:border-indigo-650 transition-all relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLocalImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <span className="text-[10px] font-bold block text-slate-300">Upload Logo or Image</span>
                  <span className="text-[8px] text-slate-500 block mt-1">PNG, JPG, SVG, WEBP</span>
                </div>

                {/* Uploaded items view */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Uploaded Items</span>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((img, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            // Add to active elements
                            const newImg: Element = {
                              id: generateUniqueId(`image_uploaded_${idx}`),
                              type: 'image',
                              name: 'Custom Graphic Asset',
                              x: 60,
                              y: 120,
                              width: 80,
                              height: 80,
                              rotation: 0,
                              zIndex: activeElements.length + 1,
                              isLocked: false,
                              isVisible: true,
                              url: img,
                              opacity: 1
                            };
                            updateActiveElements(prev => [...prev, newImg]);
                            setSelectedId(newImg.id);
                          }}
                          className="h-20 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:border-indigo-500"
                        >
                          <img src={img} alt="Uploaded Graphic" className="max-w-full max-h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === 'bindings' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">Dynamic Bindings</h3>
                <p className="text-xxs text-slate-500 leading-relaxed">
                  These blocks bind directly to actual employee records when rendering cards in production.
                </p>
                <div className="flex flex-col gap-1.5 pt-2">
                  {DYNAMIC_FIELDS.map((field) => (
                    <button 
                      key={field.field}
                      onClick={() => handleAddDynamicField(field)}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800/80 text-[10px] font-bold text-left flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-slate-350">{field.label}</span>
                      <span className="text-[8px] font-mono text-indigo-400 group-hover:text-indigo-300">{field.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Editing Viewport */}
        <main className="flex-1 bg-slate-900 overflow-auto flex flex-col items-center justify-between p-6 select-none relative">
          
          {/* Top Canvas Side Switcher Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-850 gap-1.5 shrink-0 z-10">
            <button 
              onClick={() => {
                setActiveSide('front');
                setSelectedId(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${activeSide === 'front' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Front Face Design
            </button>
            <button 
              onClick={() => {
                setActiveSide('back');
                setSelectedId(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${activeSide === 'back' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Back Face Design
            </button>
          </div>

          {/* Actual Canvas Render Area */}
          <div 
            className="flex-1 flex items-center justify-center my-6 relative overflow-auto w-full select-none"
            onClick={() => setSelectedId(null)}
          >
            {/* Margins/Rulers Guides & Bleed Box wrapper */}
            <div 
              ref={canvasRef}
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                backgroundImage: showGrid ? 'radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)' : 'none',
                backgroundSize: showGrid ? `${GRID_SIZE}px ${GRID_SIZE}px` : 'none',
                // Resolve Background styles (Solid or Linear Gradient)
                background: (() => {
                  const bg = activeSide === 'front' ? frontBg : backBg;
                  if (bg.type === 'solid') return bg.color1;
                  return `linear-gradient(${bg.angle}deg, ${bg.color1}, ${bg.color2})`;
                })()
              }}
              className="relative shadow-2xl overflow-hidden rounded-2xl select-none transition-all duration-200 border border-slate-800"
            >
              {/* Safe Area Guideline */}
              {showSafeAreas && (
                <div className="absolute inset-2 border border-dashed border-red-500/20 rounded-xl pointer-events-none z-40">
                  <span className="absolute top-1 left-1 text-[6px] text-red-500/30 uppercase font-black">Margin 10px</span>
                </div>
              )}

              {/* Elements Renderer */}
              {activeElements.map((el) => {
                if (!el.isVisible) return null;
                const isSelected = el.id === selectedId;
                
                return (
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
                    onPointerDown={(e) => handlePointerDown(e, el, 'drag')}
                    className={`select-none absolute group ${
                      el.isLocked ? 'pointer-events-none' : 'cursor-move'
                    } ${
                      isSelected ? 'ring-2 ring-indigo-500 ring-offset-0' : 'hover:ring-1 hover:ring-slate-700'
                    }`}
                  >
                    
                    {/* Render Shapes */}
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
                          // Line Shape override
                          borderTop: el.shapeType === 'line' ? `${el.height}px ${el.borderStyle || 'solid'} ${el.fill}` : undefined
                        }}
                        className="w-full h-full select-none"
                      />
                    )}

                    {/* Render Text */}
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
                        className={`w-full h-full select-none flex items-center p-1 ${
                          el.textAlign === 'left' ? 'justify-start text-left' : 
                          el.textAlign === 'right' ? 'justify-end text-right' : 
                          'justify-center text-center'
                        }`}
                      >
                        {resolveBindingText(el)}
                      </div>
                    )}

                    {/* Render Avatars/Images */}
                    {(el.type === 'avatar' || el.type === 'image') && (
                      <div 
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: el.borderRadius || 0,
                          backgroundImage: `url(${el.binding === 'employee.photoUrl' ? (employee?.photoUrl || el.url) : el.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: isSelected ? '1px solid #6366f1' : 'none'
                        }}
                        className="w-full h-full select-none bg-slate-800"
                      />
                    )}

                    {/* Render Barcode placeholders */}
                    {el.type === 'barcode' && (
                      <div className="w-full h-full bg-white select-none border border-slate-200 p-1 flex flex-col justify-between items-center text-black">
                        {/* Simulate Barcode Lines */}
                        <div className="w-full flex-grow flex items-stretch gap-[2px] opacity-80 pt-1 px-1">
                          <div className="w-1 bg-black" /><div className="w-[1px] bg-black" /><div className="w-1 bg-black" /><div className="w-[2px] bg-black" />
                          <div className="w-[1px] bg-black" /><div className="w-1.5 bg-black" /><div className="w-1 bg-black" /><div className="w-[1px] bg-black" />
                          <div className="w-2 bg-black" /><div className="w-[1px] bg-black" /><div className="w-1 bg-black" /><div className="w-[2px] bg-black" />
                          <div className="w-[1px] bg-black" /><div className="w-1.5 bg-black" /><div className="w-1 bg-black" /><div className="w-[1px] bg-black" />
                          <div className="w-1 bg-black" /><div className="w-[1px] bg-black" /><div className="w-1 bg-black" /><div className="w-[2px] bg-black" />
                        </div>
                        <span className="text-[7px] font-mono select-none block">ID-2026-1552</span>
                      </div>
                    )}

                    {/* Render QR code placeholder */}
                    {el.type === 'qr' && (
                      <div className="w-full h-full bg-white border border-slate-200 p-1 flex items-center justify-center text-black relative select-none">
                        <QrIcon className="w-full h-full text-slate-850 opacity-90" />
                        <span className="absolute bg-white px-1 text-[6px] font-bold tracking-widest text-slate-500 uppercase bottom-0">VERIFY</span>
                      </div>
                    )}

                    {/* Drag resize & Rotate handles rendering if element is selected */}
                    {isSelected && !el.isLocked && (
                      <>
                        {/* 4 Corner Resize Handles */}
                        <div 
                          className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-650 rounded-full cursor-nwse-resize z-50 hover:scale-125 transition-transform" 
                          onPointerDown={(e) => handlePointerDown(e, el, 'resize', 'nw')}
                        />
                        <div 
                          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-650 rounded-full cursor-nesw-resize z-50 hover:scale-125 transition-transform" 
                          onPointerDown={(e) => handlePointerDown(e, el, 'resize', 'ne')}
                        />
                        <div 
                          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-650 rounded-full cursor-nesw-resize z-50 hover:scale-125 transition-transform" 
                          onPointerDown={(e) => handlePointerDown(e, el, 'resize', 'sw')}
                        />
                        <div 
                          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-650 rounded-full cursor-nwse-resize z-50 hover:scale-125 transition-transform" 
                          onPointerDown={(e) => handlePointerDown(e, el, 'resize', 'se')}
                        />

                        {/* Rotate handle hook */}
                        <div 
                          className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                          onPointerDown={(e) => handlePointerDown(e, el, 'rotate')}
                        >
                          <div className="w-[1px] h-3 bg-indigo-500" />
                          <div className="w-5 h-5 bg-white border-2 border-indigo-650 rounded-full flex items-center justify-center shadow-md">
                            <RefreshCw className="w-3 h-3 text-indigo-700" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Guides Footer bar */}
          <div className="h-6 flex items-center justify-between text-[10px] text-slate-500 select-none w-full border-t border-slate-850 pt-3 max-w-lg shrink-0">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-slate-600" />
              Drag elements to position
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-slate-600" />
              Rotate 15° with Shift
            </span>
            <span className="flex items-center gap-1">
              <HelpIcon className="w-3 h-3 text-slate-600" />
              Use Backspace to Delete
            </span>
          </div>
        </main>

        {/* Right Configuration & Layers Panel */}
        <aside className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col select-none z-30">
          {/* Header tabs switcher */}
          <div className="flex border-b border-slate-850 shrink-0">
            <button 
              onClick={() => setActiveRightTab('properties')}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${activeRightTab === 'properties' ? 'border-indigo-600 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Properties
            </button>
            <button 
              onClick={() => setActiveRightTab('layers')}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${activeRightTab === 'layers' ? 'border-indigo-600 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Layers ({activeElements.length})
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto select-none">
            
            {/* Layers Tab Panel */}
            {activeRightTab === 'layers' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Visual Layer Hierarchy
                </h3>
                
                {activeElements.length === 0 ? (
                  <div className="text-center py-8 text-xxs text-slate-500 leading-relaxed border border-dashed border-slate-850 rounded-xl">
                    Canvas is currently empty.<br />Click components to add them.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {[...activeElements]
                      .sort((a, b) => b.zIndex - a.zIndex)
                      .map((el) => {
                        const isSelected = el.id === selectedId;
                        return (
                          <div 
                            key={el.id}
                            onClick={() => setSelectedId(el.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                              isSelected 
                                ? 'bg-slate-900 border-indigo-650 shadow-md' 
                                : 'bg-slate-900/50 border-slate-850 hover:bg-slate-900/80'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                              {el.type === 'text' && <Type className="w-4 h-4 text-indigo-400 shrink-0" />}
                              {el.type === 'shape' && <Square className="w-4 h-4 text-emerald-400 shrink-0" />}
                              {el.type === 'avatar' && <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />}
                              {el.type === 'image' && <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />}
                              {el.type === 'qr' && <QrIcon className="w-4 h-4 text-purple-400 shrink-0" />}
                              {el.type === 'barcode' && <BarcodeIcon className="w-4 h-4 text-cyan-400 shrink-0" />}
                              
                              <input 
                                type="text"
                                value={el.name}
                                onChange={(e) => {
                                  setSelectedId(el.id);
                                  handleUpdateElementProperty('name', e.target.value);
                                }}
                                className="bg-transparent border-none text-[10px] font-bold text-slate-200 focus:outline-none truncate w-full"
                              />
                            </div>

                            {/* Visibility, Locking, Delete Tools */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(el.id);
                                  handleUpdateElementProperty('isVisible', !el.isVisible);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-slate-300"
                              >
                                {el.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-700" />}
                              </button>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(el.id);
                                  handleUpdateElementProperty('isLocked', !el.isLocked);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-slate-300"
                              >
                                {el.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>

                              <div className="h-3 w-[1px] bg-slate-800 mx-0.5" />

                              {/* Ordering */}
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMoveLayer(el.id, 'up'); }}
                                className="p-1 text-[10px] text-slate-500 hover:text-slate-300 font-bold"
                                title="Bring Forward"
                              >
                                ▲
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMoveLayer(el.id, 'down'); }}
                                className="p-1 text-[10px] text-slate-500 hover:text-slate-300 font-bold"
                                title="Send Backward"
                              >
                                ▼
                              </button>

                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                                className="p-1 text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Properties Tab Panel */}
            {activeRightTab === 'properties' && (
              <div className="space-y-4">
                
                {/* Background Configuration (rendered when nothing is selected) */}
                {!selectedElement ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">Canvas Background</h3>
                    
                    {/* Background solid/gradient selection */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Background Type</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {
                            const setter = activeSide === 'front' ? setFrontBg : setBackBg;
                            setter(prev => ({ ...prev, type: 'solid' }));
                          }}
                          className={`p-2 bg-slate-900 border rounded-lg text-[10px] font-bold text-center cursor-pointer ${
                            (activeSide === 'front' ? frontBg.type : backBg.type) === 'solid' 
                              ? 'border-indigo-650 text-indigo-400' 
                              : 'border-slate-800 text-slate-450'
                          }`}
                        >
                          Solid Color
                        </button>
                        <button 
                          onClick={() => {
                            const setter = activeSide === 'front' ? setFrontBg : setBackBg;
                            setter(prev => ({ ...prev, type: 'linear' }));
                          }}
                          className={`p-2 bg-slate-900 border rounded-lg text-[10px] font-bold text-center cursor-pointer ${
                            (activeSide === 'front' ? frontBg.type : backBg.type) === 'linear' 
                              ? 'border-indigo-650 text-indigo-400' 
                              : 'border-slate-800 text-slate-450'
                          }`}
                        >
                          Linear Gradient
                        </button>
                      </div>
                    </div>

                    {/* Color Inputs */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold block">Primary Color</span>
                        <input 
                          type="color" 
                          value={activeSide === 'front' ? frontBg.color1 : backBg.color1}
                          onChange={(e) => {
                            const setter = activeSide === 'front' ? setFrontBg : setBackBg;
                            setter(prev => ({ ...prev, color1: e.target.value }));
                          }}
                          className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                      </div>

                      {(activeSide === 'front' ? frontBg.type : backBg.type) === 'linear' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold block">Secondary Color</span>
                            <input 
                              type="color" 
                              value={activeSide === 'front' ? frontBg.color2 : backBg.color2}
                              onChange={(e) => {
                                const setter = activeSide === 'front' ? setFrontBg : setBackBg;
                                setter(prev => ({ ...prev, color2: e.target.value }));
                              }}
                              className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                              <span>Gradient Angle</span>
                              <span>{activeSide === 'front' ? frontBg.angle : backBg.angle}°</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="360" 
                              value={activeSide === 'front' ? frontBg.angle : backBg.angle}
                              onChange={(e) => {
                                const setter = activeSide === 'front' ? setFrontBg : setBackBg;
                                setter(prev => ({ ...prev, angle: parseInt(e.target.value) }));
                              }}
                              className="w-full accent-indigo-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  
                  // Active Element Sizing, Align, Properties panel
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                      <div>
                        <h4 className="text-xs font-black text-slate-200">{selectedElement.name}</h4>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{selectedElement.type} element</span>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleDuplicateElement(selectedElement.id)}
                          className="p-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-white"
                          title="Duplicate Element"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteElement(selectedElement.id)}
                          className="p-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-red-400"
                          title="Delete Element"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sizing & Positions */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Geometry</span>
                      <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-slate-400">
                        <div>
                          <span>Position X (px)</span>
                          <input 
                            type="number"
                            value={selectedElement.x}
                            onChange={(e) => handleUpdateElementProperty('x', parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-100 focus:outline-none w-full"
                          />
                        </div>
                        <div>
                          <span>Position Y (px)</span>
                          <input 
                            type="number"
                            value={selectedElement.y}
                            onChange={(e) => handleUpdateElementProperty('y', parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-100 focus:outline-none w-full"
                          />
                        </div>
                        <div>
                          <span>Width (px)</span>
                          <input 
                            type="number"
                            value={selectedElement.width}
                            onChange={(e) => handleUpdateElementProperty('width', Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-100 focus:outline-none w-full"
                          />
                        </div>
                        <div>
                          <span>Height (px)</span>
                          <input 
                            type="number"
                            value={selectedElement.height}
                            onChange={(e) => handleUpdateElementProperty('height', Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-100 focus:outline-none w-full"
                          />
                        </div>
                        <div className="col-span-2">
                          <span>Rotation (degrees)</span>
                          <input 
                            type="range"
                            min="0"
                            max="360"
                            value={selectedElement.rotation || 0}
                            onChange={(e) => handleUpdateElementProperty('rotation', parseInt(e.target.value))}
                            className="w-full mt-1.5 accent-indigo-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alignment Tools (Shorthands) */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Alignments</span>
                      <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => handleAlign('left')} className="p-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-white cursor-pointer">Left</button>
                        <button onClick={() => handleAlign('center')} className="p-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-white cursor-pointer">Center</button>
                        <button onClick={() => handleAlign('right')} className="p-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-white cursor-pointer">Right</button>
                        <button onClick={() => handleAlign('top')} className="p-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-white cursor-pointer">Top</button>
                        <button onClick={() => handleAlign('middle')} className="p-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-white cursor-pointer">Middle</button>
                        <button onClick={() => handleAlign('bottom')} className="p-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-white cursor-pointer">Bottom</button>
                      </div>
                    </div>

                    {/* Text Element Properties editor */}
                    {selectedElement.type === 'text' && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Typography</span>
                        
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-slate-450 font-bold">Edit Text Content</span>
                          <textarea 
                            value={selectedElement.text || ''}
                            onChange={(e) => handleUpdateElementProperty('text', e.target.value)}
                            rows={3}
                            className="bg-slate-900 border border-slate-850 rounded p-2 text-xxs text-slate-200 focus:outline-none w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-slate-400">
                          <div>
                            <span>Font Family</span>
                            <select 
                              value={selectedElement.fontFamily || 'Inter'}
                              onChange={(e) => handleUpdateElementProperty('fontFamily', e.target.value)}
                              className="bg-slate-900 border border-slate-850 rounded px-2 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                            >
                              {GOOGLE_FONTS.map(f => (
                                <option key={f.name} value={f.name}>{f.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <span>Font Size (px)</span>
                            <input 
                              type="number" 
                              value={selectedElement.fontSize || 12}
                              onChange={(e) => handleUpdateElementProperty('fontSize', Math.max(1, parseInt(e.target.value) || 1))}
                              className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                            />
                          </div>
                          <div>
                            <span>Color</span>
                            <div className="flex gap-1.5 items-center mt-1">
                              <input 
                                type="color" 
                                value={selectedElement.color || '#000000'}
                                onChange={(e) => handleUpdateElementProperty('color', e.target.value)}
                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer shrink-0"
                              />
                              <input 
                                type="text"
                                value={selectedElement.color || '#000000'}
                                onChange={(e) => handleUpdateElementProperty('color', e.target.value)}
                                className="bg-slate-900 border border-slate-850 rounded px-2 py-1 text-slate-200 w-full focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <span>Alignment</span>
                            <select 
                              value={selectedElement.textAlign || 'left'}
                              onChange={(e) => handleUpdateElementProperty('textAlign', e.target.value as 'left' | 'center' | 'right')}
                              className="bg-slate-900 border border-slate-850 rounded px-2 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                          <div>
                            <span>Weight</span>
                            <select 
                              value={selectedElement.fontWeight || '400'}
                              onChange={(e) => handleUpdateElementProperty('fontWeight', e.target.value)}
                              className="bg-slate-900 border border-slate-850 rounded px-2 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                            >
                              <option value="400">Regular</option>
                              <option value="600">Semi Bold</option>
                              <option value="700">Bold</option>
                              <option value="800">Black</option>
                            </select>
                          </div>
                          <div>
                            <span>Decorations</span>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              <button 
                                onClick={() => handleUpdateElementProperty('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
                                className={`p-1 bg-slate-900 border rounded text-[9px] font-bold ${selectedElement.fontStyle === 'italic' ? 'border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-500'}`}
                              >
                                Italic
                              </button>
                              <button 
                                onClick={() => handleUpdateElementProperty('textDecoration', selectedElement.textDecoration === 'underline' ? 'none' : 'underline')}
                                className={`p-1 bg-slate-900 border rounded text-[9px] font-bold ${selectedElement.textDecoration === 'underline' ? 'border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-500'}`}
                              >
                                Underline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shape Element Properties editor */}
                    {selectedElement.type === 'shape' && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shape Styles</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-slate-400">
                          <div>
                            <span>Fill Color</span>
                            <div className="flex gap-1.5 items-center mt-1">
                              <input 
                                type="color" 
                                value={selectedElement.fill || '#000000'}
                                onChange={(e) => handleUpdateElementProperty('fill', e.target.value)}
                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer shrink-0"
                              />
                              <input 
                                type="text"
                                value={selectedElement.fill || '#000000'}
                                onChange={(e) => handleUpdateElementProperty('fill', e.target.value)}
                                className="bg-slate-900 border border-slate-850 rounded px-2 py-1 text-slate-200 w-full focus:outline-none"
                              />
                            </div>
                          </div>

                          {selectedElement.shapeType !== 'line' && (
                            <div>
                              <span>Corner Radius (px)</span>
                              <input 
                                type="number" 
                                value={selectedElement.borderRadius || 0}
                                onChange={(e) => handleUpdateElementProperty('borderRadius', Math.max(0, parseInt(e.target.value) || 0))}
                                className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-slate-400 pt-2 border-t border-slate-850">
                          <div>
                            <span>Border Color</span>
                            <input 
                              type="color" 
                              value={selectedElement.borderColor || '#000000'}
                              onChange={(e) => handleUpdateElementProperty('borderColor', e.target.value)}
                              className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer mt-1"
                            />
                          </div>
                          <div>
                            <span>Border Width (px)</span>
                            <input 
                              type="number" 
                              value={selectedElement.borderWidth || 0}
                              onChange={(e) => handleUpdateElementProperty('borderWidth', Math.max(0, parseInt(e.target.value) || 0))}
                              className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Element Properties editor */}
                    {(selectedElement.type === 'image' || selectedElement.type === 'avatar') && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Image Attributes</span>
                        
                        <div className="space-y-1.5 text-xxs font-bold text-slate-400">
                          <span>Image URL source</span>
                          <input 
                            type="text" 
                            value={selectedElement.url || ''}
                            onChange={(e) => handleUpdateElementProperty('url', e.target.value)}
                            className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-slate-400 pt-1">
                          <div>
                            <span>Border Radius (px)</span>
                            <input 
                              type="number" 
                              value={selectedElement.borderRadius || 0}
                              onChange={(e) => handleUpdateElementProperty('borderRadius', Math.max(0, parseInt(e.target.value) || 0))}
                              className="bg-slate-900 border border-slate-850 rounded px-2.5 py-1 mt-1 text-slate-200 w-full focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
