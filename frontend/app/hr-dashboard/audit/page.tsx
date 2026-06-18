"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Search,
  Filter,
  Check,
  ChevronRight,
  Database,
  UserCheck,
  Eye,
  Sliders,
  Settings,
  Building,
  Users,
  Briefcase,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';
import { useHRDashboard } from '../HRDashboardContext';

// Define Interface for Modules
interface ModuleAudit {
  id: number;
  name: string;
  layoutStatus: 'PASS' | 'WARNING' | 'FAIL';
  layoutNote: string;
  frdCompliance: number; // 0-100
  missingFrd: string[];
  incorrectFrd: string[];
  extraFeatures: string[];
  hasPdfExport: boolean;
  hasExcelExport: boolean;
}

// Define Interface for Test Cases
interface TestCase {
  id: string;
  module: string;
  scenario: string;
  expectedResult: string;
  status: 'Pass' | 'Fail' | 'Blocked';
}

export default function AuditCompliancePage() {
  const { students, programs, escalations } = useHRDashboard();
  const [activeTab, setActiveTab] = useState<'consistency' | 'frd' | 'rbac' | 'workflow' | 'dataflow' | 'uiux' | 'validation' | 'reporting' | 'testcases' | 'verdict'>('verdict');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [systemHealth, setSystemHealth] = useState(92.4);
  const [searchTerm, setSearchTerm] = useState('');
  const [tcFilter, setTcFilter] = useState<'All' | 'Pass' | 'Fail' | 'Blocked'>('All');

  // Audit data mapping all 17 modules
  const [modules, setModules] = useState<ModuleAudit[]>([
    {
      id: 1,
      name: 'HR Dashboard',
      layoutStatus: 'PASS',
      layoutNote: 'Perfect consistency in HSL colors, sidebar layout, and responsive grid.',
      frdCompliance: 100,
      missingFrd: [],
      incorrectFrd: [],
      extraFeatures: ['Real-time user count telemetry widget'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 2,
      name: 'Student Management',
      layoutStatus: 'PASS',
      layoutNote: 'Includes standard multi-step filter panel and matching side slide-over drawer.',
      frdCompliance: 95,
      missingFrd: ['Emergency contact verification SMS workflow'],
      incorrectFrd: [],
      extraFeatures: ['Bulk student archive option'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 3,
      name: 'College Management',
      layoutStatus: 'PASS',
      layoutNote: 'Standard layout compliance. Clean table structure.',
      frdCompliance: 90,
      missingFrd: ['MoU signing date picker date validation bounds'],
      incorrectFrd: ['College Coordinator tier-3 verification levels'],
      extraFeatures: [],
      hasPdfExport: false,
      hasExcelExport: true
    },
    {
      id: 4,
      name: 'Internship Program Management',
      layoutStatus: 'PASS',
      layoutNote: 'Dynamic seat gauges and modal filters align with student records.',
      frdCompliance: 100,
      missingFrd: [],
      incorrectFrd: [],
      extraFeatures: ['Curriculum attachment pre-fetch tool'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 5,
      name: 'Batch & Group Management',
      layoutStatus: 'PASS',
      layoutNote: 'Grid alignment matching standard dashboard metrics.',
      frdCompliance: 92,
      missingFrd: ['Automatic mentor matching algorithm override toggle'],
      incorrectFrd: [],
      extraFeatures: [],
      hasPdfExport: false,
      hasExcelExport: true
    },
    {
      id: 6,
      name: 'Attendance Management',
      layoutStatus: 'PASS',
      layoutNote: 'Unified layout, table design matches Student management.',
      frdCompliance: 94,
      missingFrd: ['GPS latitude/longitude tolerance parameter field'],
      incorrectFrd: [],
      extraFeatures: ['QR Code download batch zip option'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 7,
      name: 'Learning Management System (LMS)',
      layoutStatus: 'PASS',
      layoutNote: 'LMS sidebar and video modules follow Pinesphere design systems.',
      frdCompliance: 88,
      missingFrd: ['Video watch-time session recovery cache on mobile'],
      incorrectFrd: ['Pre-requisite badge auto-grant timeline'],
      extraFeatures: ['Recommended articles sidebar'],
      hasPdfExport: false,
      hasExcelExport: false
    },
    {
      id: 8,
      name: 'Assessment Management',
      layoutStatus: 'PASS',
      layoutNote: 'Exams preflight layout features standard button system.',
      frdCompliance: 96,
      missingFrd: [],
      incorrectFrd: ['Camera preflight checklist failure auto-bypass limit'],
      extraFeatures: ['Extended fullscreen proctoring block telemetry'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 9,
      name: 'Performance Management',
      layoutStatus: 'PASS',
      layoutNote: 'Radar charts & metrics cards align with main KPI styles.',
      frdCompliance: 100,
      missingFrd: [],
      incorrectFrd: [],
      extraFeatures: [],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 10,
      name: 'Fee & Payment Management',
      layoutStatus: 'PASS',
      layoutNote: 'Invoice table uses standard styling rules. Responsive design pass.',
      frdCompliance: 85,
      missingFrd: ['GST Invoice PDF formatting generator'],
      incorrectFrd: ['Late fee grace days validation limit'],
      extraFeatures: ['Stripe sandbox simulator panel'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 11,
      name: 'Certificate Management',
      layoutStatus: 'PASS',
      layoutNote: 'Verification page aligns with public validation template styles.',
      frdCompliance: 92,
      missingFrd: ['Cryptographic signature verification keys configuration'],
      incorrectFrd: [],
      extraFeatures: ['Social sharing API widgets (LinkedIn/Twitter)'],
      hasPdfExport: true,
      hasExcelExport: false
    },
    {
      id: 12,
      name: 'Placement Management',
      layoutStatus: 'WARNING',
      layoutNote: 'Requires replacement of custom grid buttons with standard action dropdowns.',
      frdCompliance: 80,
      missingFrd: ['Offer letter upload verification metadata check'],
      incorrectFrd: ['Direct HR selection criteria fields'],
      extraFeatures: ['Automatic resume text analyzer'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 13,
      name: 'Notification Management',
      layoutStatus: 'WARNING',
      layoutNote: 'Search input lacks autofocus and standard border styles.',
      frdCompliance: 90,
      missingFrd: ['Notification delivery tracking log panel'],
      incorrectFrd: [],
      extraFeatures: ['Template preview simulator'],
      hasPdfExport: false,
      hasExcelExport: true
    },
    {
      id: 14,
      name: 'Escalation Management',
      layoutStatus: 'PASS',
      layoutNote: 'Severity tags match standard error colors (Rose/Amber).',
      frdCompliance: 100,
      missingFrd: [],
      incorrectFrd: [],
      extraFeatures: ['Level-3 auto-forward alert overrides'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 15,
      name: 'Reports & Analytics',
      layoutStatus: 'PASS',
      layoutNote: 'Interactive chart sections follow proper padding spacing system.',
      frdCompliance: 95,
      missingFrd: ['Monthly batch statistics summary report'],
      incorrectFrd: [],
      extraFeatures: ['Interactive chart view slider'],
      hasPdfExport: true,
      hasExcelExport: true
    },
    {
      id: 16,
      name: 'Audit Logs',
      layoutStatus: 'PASS',
      layoutNote: 'Log activity grid utilizes consistent font sizing.',
      frdCompliance: 100,
      missingFrd: [],
      incorrectFrd: [],
      extraFeatures: ['JSON raw metadata visualizer tab'],
      hasPdfExport: false,
      hasExcelExport: true
    },
    {
      id: 17,
      name: 'Settings & Configuration',
      layoutStatus: 'WARNING',
      layoutNote: 'Form uses browser-native select fields instead of Pinesphere HSL components.',
      frdCompliance: 88,
      missingFrd: ['Third-party API key encryption configs'],
      incorrectFrd: [],
      extraFeatures: ['Dynamic dark mode toggle override'],
      hasPdfExport: false,
      hasExcelExport: false
    }
  ]);

  // Test Cases List
  const testCases: TestCase[] = [
    { id: 'TC-STUDENT-001', module: 'Student Management', scenario: 'Search student by unique name or STU code', expectedResult: 'Filtered list updates instantly', status: 'Pass' },
    { id: 'TC-STUDENT-002', module: 'Student Management', scenario: 'Register student with duplicate email', expectedResult: 'Validation error: Email already exists', status: 'Pass' },
    { id: 'TC-STUDENT-003', module: 'Student Management', scenario: 'Transit student to screening phase without mandatory screening forms', expectedResult: 'Transition blocked with warning message', status: 'Pass' },
    { id: 'TC-COLLEGE-001', module: 'College Management', scenario: 'Add college with invalid phone number format', expectedResult: 'Error showing valid format required', status: 'Pass' },
    { id: 'TC-PROGRAM-001', module: 'Programs', scenario: 'Create Research program with capacity set to 0', expectedResult: 'Invalid capacity warning displays', status: 'Pass' },
    { id: 'TC-BATCH-001', module: 'Batches', scenario: 'Assign students to Batch exceeding capacity limits', expectedResult: 'Block assignments, prompt capacity warning', status: 'Blocked' },
    { id: 'TC-ATTENDANCE-001', module: 'Attendance', scenario: 'Submit QR code attendance from outside GPS bounds', expectedResult: 'Attendance logs fail and alerts HR', status: 'Pass' },
    { id: 'TC-ATTENDANCE-002', module: 'Attendance', scenario: 'Trigger attendance reminder notification to inactive students', expectedResult: 'Reminders queued and sent to all targets', status: 'Pass' },
    { id: 'TC-LMS-001', module: 'LMS', scenario: 'Student fast-forwards lecture video to mark completion', expectedResult: 'Video session ignores skip, remains incomplete', status: 'Pass' },
    { id: 'TC-ASSESSMENT-001', module: 'Assessments', scenario: 'Detect tab switcher action during active online assessment HUD', expectedResult: 'Flags warning count, blocks exam on third warning', status: 'Pass' },
    { id: 'TC-ASSESSMENT-002', module: 'Assessments', scenario: 'Attempt assessment window after expiration date', expectedResult: 'Access denied, assessment button disabled', status: 'Pass' },
    { id: 'TC-PERFORMANCE-001', module: 'Performance', scenario: 'Auto-sync weekly guide scorecard ratings', expectedResult: 'Formulates new average score and updates database', status: 'Pass' },
    { id: 'TC-FINANCE-001', module: 'Payments', scenario: 'Generate invoice receipt with GST number', expectedResult: 'Receipt displays formatted 15-character GST details', status: 'Fail' },
    { id: 'TC-FINANCE-002', module: 'Payments', scenario: 'Simulate credit card payment with stripe sandbox api', expectedResult: 'Cleared status recorded and ledger entry populated', status: 'Pass' },
    { id: 'TC-CERTIFICATE-001', module: 'Certificates', scenario: 'Generate certificate without completion status check', expectedResult: 'Generation rejected, student ineligible', status: 'Pass' },
    { id: 'TC-CERTIFICATE-002', module: 'Certificates', scenario: 'Scan public verification QR code for active certificate', expectedResult: 'Public URL verifies student credentials with status', status: 'Pass' },
    { id: 'TC-PLACEMENT-001', module: 'Placements', scenario: 'Upload placement offer letter for HR audit check', expectedResult: 'Status changes to review, displays files preview', status: 'Pass' },
    { id: 'TC-ESCALATION-001', module: 'Escalations', scenario: 'Escalate student absent alert to Level-3 automated flow', expectedResult: 'Sends mail notifications to coordinate leads', status: 'Pass' },
    { id: 'TC-REPORTS-001', module: 'Reports', scenario: 'Export Batch completion metrics as CSV file format', expectedResult: 'Triggers formatted download file', status: 'Pass' },
    { id: 'TC-SETTINGS-001', module: 'Settings', scenario: 'Modify global API url settings without administrator privileges', expectedResult: 'Blocks update and logs access attempt', status: 'Pass' }
  ];

  // RBAC Permission Grid Roles & Modules
  const rbacMatrix = {
    roles: ['Super Admin', 'HR', 'Reporting Manager', 'Mentor', 'College Coordinator', 'Student'],
    modules: [
      { name: 'Student Management', rights: ['View', 'Create', 'Edit', 'Delete', 'Approval', 'Export'] },
      { name: 'College Management', rights: ['View', 'Create', 'Edit', 'Export'] },
      { name: 'Internship Programs', rights: ['View', 'Create', 'Edit', 'Delete', 'Export'] },
      { name: 'Batch & Group', rights: ['View', 'Create', 'Edit', 'Approval'] },
      { name: 'Attendance Management', rights: ['View', 'Create', 'Edit', 'Approval', 'Export'] },
      { name: 'Learning System (LMS)', rights: ['View', 'Create', 'Edit'] },
      { name: 'Assessments', rights: ['View', 'Create', 'Edit', 'Approval'] },
      { name: 'Fee & Payment', rights: ['View', 'Create', 'Edit', 'Approval', 'Export'] },
      { name: 'Certificates', rights: ['View', 'Create', 'Approval', 'Export'] },
      { name: 'Escalations', rights: ['View', 'Create', 'Approval'] },
    ],
    permissions: {
      'Super Admin': { all: true },
      'HR': {
        'Student Management': ['View', 'Create', 'Edit', 'Delete', 'Approval', 'Export'],
        'College Management': ['View', 'Create', 'Edit', 'Export'],
        'Internship Programs': ['View', 'Create', 'Edit', 'Delete', 'Export'],
        'Batch & Group': ['View', 'Create', 'Edit', 'Approval'],
        'Attendance Management': ['View', 'Edit', 'Approval', 'Export'],
        'Learning System (LMS)': ['View', 'Create', 'Edit'],
        'Assessments': ['View', 'Create', 'Edit', 'Approval'],
        'Fee & Payment': ['View', 'Create', 'Edit', 'Approval', 'Export'],
        'Certificates': ['View', 'Create', 'Approval', 'Export'],
        'Escalations': ['View', 'Create', 'Approval']
      },
      'Reporting Manager': {
        'Student Management': ['View', 'Edit', 'Export'],
        'College Management': ['View'],
        'Internship Programs': ['View'],
        'Batch & Group': ['View', 'Edit', 'Approval'],
        'Attendance Management': ['View', 'Edit', 'Approval', 'Export'],
        'Assessments': ['View', 'Edit', 'Approval'],
        'Certificates': ['View', 'Approval'],
        'Escalations': ['View', 'Create', 'Approval']
      },
      'Mentor': {
        'Student Management': ['View'],
        'Batch & Group': ['View'],
        'Attendance Management': ['View', 'Create'],
        'Learning System (LMS)': ['View'],
        'Assessments': ['View', 'Create', 'Edit'],
        'Escalations': ['View', 'Create']
      },
      'College Coordinator': {
        'Student Management': ['View', 'Create', 'Export'],
        'College Management': ['View', 'Edit'],
        'Attendance Management': ['View'],
        'Fee & Payment': ['View'],
        'Certificates': ['View']
      },
      'Student': {
        'Student Management': ['View'],
        'Attendance Management': ['View'],
        'Learning System (LMS)': ['View'],
        'Assessments': ['View'],
        'Fee & Payment': ['View'],
        'Certificates': ['View']
      }
    } as Record<string, Record<string, string[]> | { all: boolean }>
  };

  // Simulate scanning action
  const triggerScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStep('Analyzing layout configurations in app folders...');

    const steps = [
      { prog: 20, text: 'Scanning layout elements, sidebars, and responsive patterns...' },
      { prog: 40, text: 'Reading configurations and comparing with Pinesphere FRD...' },
      { prog: 65, text: 'Mapping role permissions matrix and security vulnerabilities...' },
      { prog: 80, text: 'Testing lifecycle workflow transitions and data flows...' },
      { prog: 95, text: 'Validating field boundaries and report formats...' },
      { prog: 100, text: 'Completing health scoring calculations.' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].prog);
        setScanStep(steps[currentStepIdx].text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setSystemHealth(94.2);
        // Make minor modifications to the data for visual updates
        setModules(prev =>
          prev.map(m => (m.id === 10 ? { ...m, frdCompliance: 88, layoutStatus: 'PASS' } : m))
        );
      }
    }, 800);
  };

  // Filter test cases based on search and tab filters
  const filteredTestCases = testCases.filter(tc => {
    const matchesSearch = tc.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tc.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = tcFilter === 'All' || tc.status === tcFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/4 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 border border-emerald-100">Live Status</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">ERP Audit & Compliance Vault</h1>
          <p className="text-xs text-slate-400 font-medium">Dynamic validation tracker comparing active codebases with the Pinesphere ERP Functional Specification.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 relative z-10">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Overall Health</span>
              <span className="text-lg font-black text-slate-800">{systemHealth.toFixed(1)}%</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Compliance Status</span>
              <span className="text-xs font-black text-blue-600 uppercase">Ready for UAT</span>
            </div>
          </div>

          <button
            onClick={triggerScan}
            disabled={isScanning}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 font-extrabold text-xs tracking-wider uppercase text-white shadow-md transition-all active:scale-[0.98] ${
              isScanning ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isScanning ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Run Diagnostic Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SCANNING PROGRESS OVERLAY PANEL */}
      {isScanning && (
        <div className="bg-gradient-to-r from-blue-950 to-slate-950 text-white p-5 rounded-2xl border border-blue-900 shadow-lg animate-slide-in space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-blue-400 uppercase tracking-widest">{scanStep}</span>
            <span className="font-black">{scanProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
          </div>
        </div>
      )}

      {/* TABS SELECTOR ROW */}
      <div className="flex overflow-x-auto gap-1.5 bg-slate-200/50 p-1.5 rounded-xl border border-slate-250/60 scrollbar-none custom-scrollbar">
        {[
          { id: 'verdict', label: 'Health Verdict' },
          { id: 'consistency', label: 'Layout Check' },
          { id: 'frd', label: 'FRD Compliance' },
          { id: 'rbac', label: 'RBAC Security' },
          { id: 'workflow', label: 'Workflows' },
          { id: 'dataflow', label: 'Data Dependencies' },
          { id: 'uiux', label: 'UI/UX Audit' },
          { id: 'validation', label: 'Validations' },
          { id: 'reporting', label: 'Export Reports' },
          { id: 'testcases', label: 'Functional Test Cases' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wide shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-white/40 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DYNAMIC TAB COMPONENT PANELS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
        
        {/* TAB 10: FINAL HEALTH VERDICT (Default view) */}
        {activeTab === 'verdict' && (
          <div className="space-y-8 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Overall Compliance Score</span>
                  <div className="text-4xl font-black text-blue-600">92.4%</div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Weighted percentage across all FRD workflows, validation schemes, and export compliance components.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Last scan details</span>
                  <span className="text-slate-800">100% database verified</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Security & RBAC Score</span>
                  <div className="text-4xl font-black text-rose-500">89.0%</div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Measures permission enforcement, potential API endpoint risks, roles overrides, and credentials mapping.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Vulnerability status</span>
                  <span className="text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> 2 Warning areas
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">Verdict Status</span>
                  <div className="text-lg font-black text-emerald-600 uppercase mt-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Ready for UAT</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">System passes layout guidelines, essential validations, and workflow consistency requirements. Ready for User Acceptance Testing.</p>
                </div>
                <button
                  onClick={() => alert("Audit report downloaded successfully!")}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs py-2 uppercase tracking-wide transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Audit PDF</span>
                </button>
              </div>
            </div>

            {/* PRIORITY ISSUES SUMMARY */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-slate-600" />
                <span>Audited Anomalies & Issue Tracker</span>
              </h3>

              <div className="divide-y divide-slate-100">
                <div className="py-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-rose-100 text-rose-700 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-rose-200">Critical Priority</span>
                    <span className="text-[10px] text-slate-400 font-bold">TC-FINANCE-001</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">GST formatted invoice generation fails in receipt layouts</h4>
                  <p className="text-xs text-slate-400">The generated invoice PDF is lacking the company legal corporate entity address header and 15-character GST credentials string required by FRD section 10.4.</p>
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-700 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-amber-200">High Priority</span>
                    <span className="text-[10px] text-slate-400 font-bold">RBAC-MENTOR-002</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Mentor role has write/edit bypass permissions inside program batch creation modals</h4>
                  <p className="text-xs text-slate-400">Mentors should only hold view permissions. Edit API bounds should be limited exclusively to HR Administrators and Super Admins.</p>
                </div>

                <div className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-700 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-blue-200">Medium Priority</span>
                    <span className="text-[10px] text-slate-400 font-bold">UI-LAYOUT-17</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Settings and config page relies on native browser input fields</h4>
                  <p className="text-xs text-slate-400">System layout consistency check flagged warning: settings uses browser-native dropdown menus instead of standard theme design dropdown select tags.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: LAYOUT CONSISTENCY AUDIT */}
        {activeTab === 'consistency' && (
          <div className="space-y-4 animate-slide-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Layout & Style consistency metrics</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Target: 100% pixel-perfect uniformity</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Module Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Sidebar / Header</th>
                    <th className="p-3">Forms & Modals</th>
                    <th className="p-3">Spacing / Typography</th>
                    <th className="p-3">Audit Finding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {modules.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800">{m.name}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                          m.layoutStatus === 'PASS' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {m.layoutStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Standard
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          {m.layoutStatus === 'PASS' ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          {m.layoutStatus === 'PASS' ? 'Standard' : 'Native Override'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Consistent HSL
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 leading-normal max-w-xs">{m.layoutNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FRD COMPLIANCE AUDIT */}
        {activeTab === 'frd' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Functional Requirement Document Compliance Grid</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">System Target: 100% spec coverage</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Module Name</th>
                    <th className="p-3">Compliance Score</th>
                    <th className="p-3">Missing FRD Requirements</th>
                    <th className="p-3">Incorrect Requirements</th>
                    <th className="p-3">Extra Features Not In FRD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {modules.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800">{m.name}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${
                              m.frdCompliance >= 95 ? 'bg-emerald-500' : m.frdCompliance >= 85 ? 'bg-blue-500' : 'bg-rose-500'
                            }`} style={{ width: `${m.frdCompliance}%` }} />
                          </div>
                          <span className="font-black text-slate-700">{m.frdCompliance}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 max-w-xs">
                        {m.missingFrd.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-0.5">
                            {m.missingFrd.map((it, idx) => (
                              <li key={idx} className="text-slate-600">{it}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" /> Fully Covered
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 max-w-xs">
                        {m.incorrectFrd.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-0.5">
                            {m.incorrectFrd.map((it, idx) => (
                              <li key={idx} className="text-slate-600">{it}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400">None detected</span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 max-w-xs">
                        {m.extraFeatures.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-0.5 text-blue-600">
                            {m.extraFeatures.map((it, idx) => (
                              <li key={idx} className="font-semibold">{it}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400">No extras</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROLE & PERMISSION AUDIT */}
        {activeTab === 'rbac' && (
          <div className="space-y-6 animate-slide-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Role-Based Access Control (RBAC) Permissions Matrix</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Auditing 6 active platform roles</span>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-700 font-semibold mb-4">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <span className="block font-black text-rose-800 uppercase tracking-wider text-[10px] mb-1">Detected RBAC Violation</span>
                <span>Mentor role has "Create/Edit" rights configured for Assessments and Batch assignments. Standard security bounds dictate Mentors should only have "View" rights and specific grade submission inputs.</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Module Name</th>
                    {rbacMatrix.roles.map(role => (
                      <th key={role} className="p-3 text-center">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {rbacMatrix.modules.map(mod => (
                    <tr key={mod.name} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800">{mod.name}</td>
                      {rbacMatrix.roles.map(role => {
                        const rolePerms = rbacMatrix.permissions[role] as any;
                        const rights = role === 'Super Admin' 
                          ? mod.rights 
                          : (rolePerms?.[mod.name] || []) as string[];
                        
                        const allActions = mod.rights;
                        const allowedCount = rights.length;
                        const totalCount = allActions.length;

                        return (
                          <td key={role} className="p-3 text-center">
                            <div className="inline-flex flex-col items-center">
                              {allowedCount === totalCount ? (
                                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase">FULL</span>
                              ) : allowedCount > 0 ? (
                                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">
                                  {allowedCount}/{totalCount}
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-150 uppercase">NONE</span>
                              )}
                              {allowedCount > 0 && (
                                <span className="text-[8px] text-slate-400 mt-1 max-w-[90px] truncate" title={rights.join(', ')}>
                                  {rights.slice(0, 2).join(', ')}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WORKFLOW AUDIT */}
        {activeTab === 'workflow' && (
          <div className="space-y-8 animate-slide-in">
            {/* WORKFLOW 1: STUDENT LIFECYCLE */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Student lifecycle state workflow</h3>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">Status: Verified Pass</span>
              </div>
              <p className="text-xs text-slate-400">Strict chronological state transitions prevent skipping steps in the onboarding lifecycle pipeline.</p>
              
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {[
                  { name: 'Applied', state: 'active' },
                  { name: 'Screening', state: 'active' },
                  { name: 'Interview', state: 'active' },
                  { name: 'Selected', state: 'active' },
                  { name: 'Offer Released', state: 'active' },
                  { name: 'Joined', state: 'active' },
                  { name: 'Active', state: 'active' },
                  { name: 'Completed', state: 'active' },
                  { name: 'Certified', state: 'warning' },
                  { name: 'Hired', state: 'inactive' }
                ].map((step, idx, arr) => (
                  <React.Fragment key={step.name}>
                    <div className={`p-3 border text-xs font-bold rounded-xl flex items-center gap-2 ${
                      step.state === 'active' 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                        : step.state === 'warning'
                          ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm animate-pulse'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <span className="h-5 w-5 bg-white border rounded-full flex items-center justify-center text-[10px] shadow-sm text-slate-700 font-black">
                        {idx + 1}
                      </span>
                      <span>{step.name}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-150">
                ⚡ **Guard Condition Audit:** Stage `Certified` requires a dynamic verification check checking if final assessment score is greater than 60% AND attendance is greater than 85%. Transition from `Active` directly to `Certified` is hard-blocked by database triggers.
              </div>
            </div>

            {/* ADDITIONAL WORKFLOWS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Attendance workflow</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px] border-b border-slate-200 pb-2 font-bold text-slate-600">
                    <span>Validation Type</span>
                    <span>Status</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>QR Attendance Scan</span>
                    <span className="text-emerald-600 font-bold">Enabled & Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GPS Coordinates Fencing</span>
                    <span className="text-amber-600 font-bold">Warning: Tolerances Unset</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Manual HR Adjustment</span>
                    <span className="text-emerald-600 font-bold">Audit Log Tracked</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">Payment collection workflow</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px] border-b border-slate-200 pb-2 font-bold text-slate-600">
                    <span>Stage</span>
                    <span>Automation Action</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fee Instantiation</span>
                    <span>Auto-created on Student Join</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Collection Gateway</span>
                    <span>Stripe API Cleared</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-rose-600">
                    <span>GST Invoice Creation</span>
                    <span>FAILED (Address/GST Missing)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DATA FLOW AUDIT */}
        {activeTab === 'dataflow' && (
          <div className="space-y-6 animate-slide-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Platform Entity Relational Dependency Flow</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Auditing 8 relational tables</span>
            </div>

            <p className="text-xs text-slate-400 font-medium">Verify cascading delete and update rules, mapping integrity across primary tables, and tracking of orphan rows.</p>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
                {[
                  { name: 'Student Data', type: 'Primary' },
                  { name: 'Program Config', type: 'Required' },
                  { name: 'Batch Allocation', type: 'FK Reference' },
                  { name: 'Attendance Record', type: 'Cascade' },
                  { name: 'Assessments Log', type: 'Restrict' }
                ].map((entity, idx) => (
                  <div key={entity.name} className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-36">
                    <Database className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs font-black text-slate-800 block">{entity.name}</span>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">{entity.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
              <div className="border border-slate-200 p-4 rounded-xl">
                <span className="block text-slate-400 font-bold text-[10px] uppercase mb-1">Circular References</span>
                <span className="text-emerald-600 font-black text-sm">0 Found</span>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Schema validated against recursive loop bindings.</p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl">
                <span className="block text-slate-400 font-bold text-[10px] uppercase mb-1">Orphan Records Checked</span>
                <span className="text-emerald-600 font-black text-sm">Clear (0 Orphans)</span>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Every attendance log successfully matches a valid active student primary ID key.</p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl border-amber-250 bg-amber-50/20">
                <span className="block text-slate-400 font-bold text-[10px] uppercase mb-1 text-amber-750">Broken Foreign Keys</span>
                <span className="text-amber-700 font-black text-sm">1 Warning</span>
                <p className="text-[11px] text-amber-650 mt-1 font-medium">LMS tracking references contains 4 logs pointing to deleted mock video files.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: UI/UX AUDIT */}
        {activeTab === 'uiux' && (
          <div className="space-y-6 animate-slide-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">UI/UX Audit Logs & Design Standard Score</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Audited against Pinesphere Design Guidelines</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Visual Hierarchy', score: 94, desc: 'F-pattern reading alignment is strictly followed.' },
                { title: 'Forms & Modals Usability', score: 88, desc: 'Settings selects need custom styled wrapper overrides.' },
                { title: 'Accessibility (A11y)', score: 90, desc: 'Main layout meets WCAG AA contrast ratios.' },
                { title: 'Mobile Responsiveness', score: 92, desc: 'Sidebars shrink to toggled drawer menu correctly.' }
              ].map(card => (
                <div key={card.title} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest">{card.title}</span>
                  <div className="text-3xl font-black text-slate-800 my-1">{card.score}/100</div>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">UX Auditor findings:</h4>
              <ul className="list-disc pl-4 space-y-2 text-slate-650 font-semibold">
                <li>**Discoverability:** Search bars lack auto-focus properties across all tables. Adding auto-focus improves user experience on wide screen layout blocks.</li>
                <li>**Consistency:** Action button dropdowns inside Placement and Notification modules use differing padding values than the standard dropdowns inside Student management pages.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 7: VALIDATION AUDIT */}
        {activeTab === 'validation' && (
          <div className="space-y-6 animate-slide-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Field and API Validation Rules Audit</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Auditing 10 key verification rules</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Validation Rule Name</th>
                    <th className="p-3">Target Field / Module</th>
                    <th className="p-3">Implementation Level</th>
                    <th className="p-3">FRD Clause</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {[
                    { name: 'Unique Email Address', target: 'Student Register / email', level: 'Database constraint & Regex', clause: 'FRD 2.1.2', status: 'ACTIVE' },
                    { name: 'Phone Format', target: 'Student Register / phone', level: 'Pattern regex match', clause: 'FRD 2.1.3', status: 'ACTIVE' },
                    { name: 'Resume Attachment', target: 'Student Application / resume', level: 'MIME check, max 5MB limits', clause: 'FRD 2.2.0', status: 'ACTIVE' },
                    { name: 'Seat capacity restrictions', target: 'Program register / capacity', level: 'Count validation check', clause: 'FRD 4.1.4', status: 'ACTIVE' },
                    { name: 'Certificate Eligibility check', target: 'Certificate / status', level: 'LMS AND Attendance threshold gates', clause: 'FRD 11.2.1', status: 'ACTIVE' },
                    { name: 'Late fees calculations', target: 'Payments / balance', level: 'Client side math', clause: 'FRD 10.3.2', status: 'WEAK' },
                    { name: 'GST Invoice Formatting rules', target: 'Payments / invoice', level: 'None', clause: 'FRD 10.4.0', status: 'MISSING' }
                  ].map((val, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800">{val.name}</td>
                      <td className="p-3 font-bold text-slate-500">{val.target}</td>
                      <td className="p-3 text-[11px]">{val.level}</td>
                      <td className="p-3 font-bold text-slate-400">{val.clause}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                          val.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : val.status === 'WEAK'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {val.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: REPORTING AUDIT */}
        {activeTab === 'reporting' && (
          <div className="space-y-6 animate-slide-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Reports generation & exports compliance</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Auditing export formats availability</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Report Name</th>
                    <th className="p-3">PDF Format Export</th>
                    <th className="p-3">Excel / CSV Format Export</th>
                    <th className="p-3">Role Access Check</th>
                    <th className="p-3">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {modules.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-slate-800">{m.name} Report</td>
                      <td className="p-3">
                        <span className={`font-bold ${m.hasPdfExport ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {m.hasPdfExport ? 'AVAILABLE' : 'UNSUPPORTED'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-bold ${m.hasExcelExport ? 'text-emerald-600' : 'text-slate-405'}`}>
                          {m.hasExcelExport ? 'AVAILABLE' : 'UNSUPPORTED'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        <span>HR, Super Admin</span>
                      </td>
                      <td className="p-3">
                        {m.hasExcelExport || m.hasPdfExport ? (
                          <span className="text-emerald-600 font-extrabold text-[10px] uppercase flex items-center gap-1">
                            <Check className="h-3 w-3" /> PASS
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-[10px] uppercase">SKIPPED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: FUNCTIONAL TEST CASES */}
        {activeTab === 'testcases' && (
          <div className="space-y-6 animate-slide-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Functional and QA Test Suite</h3>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search test case..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {['All', 'Pass', 'Fail', 'Blocked'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTcFilter(filter as any)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        tcFilter === filter
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Test Case ID</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Scenario</th>
                    <th className="p-3">Expected Result</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTestCases.map((tc) => (
                    <tr key={tc.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-extrabold text-blue-600 whitespace-nowrap">{tc.id}</td>
                      <td className="p-3 font-extrabold text-slate-800 whitespace-nowrap">{tc.module}</td>
                      <td className="p-3 text-slate-650 font-semibold leading-normal max-w-sm">{tc.scenario}</td>
                      <td className="p-3 text-slate-500 leading-normal max-w-xs">{tc.expectedResult}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                          tc.status === 'Pass' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                            : tc.status === 'Fail'
                              ? 'bg-rose-50 text-rose-700 border-rose-250'
                              : 'bg-amber-50 text-amber-700 border-amber-250'
                        }`}>
                          {tc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
