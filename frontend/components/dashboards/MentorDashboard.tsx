"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { Users, Briefcase, UserCheck, Activity, AlertTriangle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { mentorService } from '@/src/services/mentor.service';
import { MentorProfile } from '@/src/data/mock-mentors';

export default function MentorDashboard() {
  const [profiles, setProfiles] = useState<MentorProfile[]>([]);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [batchMappingCount, setBatchMappingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [mentors, assignments, mappings] = await Promise.all([
        mentorService.getMentorProfiles(),
        mentorService.getAssignments(),
        mentorService.getBatchMappings(),
      ]);
      setProfiles(mentors);
      setAssignmentCount(assignments.filter(a => a.status === 'Active').length);
      setBatchMappingCount(mappings.filter(m => m.status === 'Active').length);
      setLoading(false);
    }
    load();
  }, []);

  const totalMentors = profiles.length;
  const availableMentors = profiles.filter(m => m.is_available).length;
  const totalStudents = profiles.reduce((sum, m) => sum + m.current_student_count, 0);
  const totalCapacity = profiles.reduce((sum, m) => sum + m.max_student_capacity, 0);
  const utilization = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;
  const atCapacity = profiles.filter(m => m.current_student_count >= m.max_student_capacity);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Mentors</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalMentors}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Available Mentors</p>
              <h3 className="text-2xl font-bold text-slate-900">{availableMentors}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Assignments</p>
              <h3 className="text-2xl font-bold text-slate-900">{assignmentCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Capacity Utilization</p>
              <h3 className="text-2xl font-bold text-slate-900">{utilization}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mentor Workload</h3>
          <div className="space-y-3">
            {profiles.map(m => {
              const pct = Math.round((m.current_student_count / m.max_student_capacity) * 100);
              const overloaded = m.current_student_count >= m.max_student_capacity;
              return (
                <div key={m.mentor_profile_id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{m.employeeName}</span>
                    <span>{m.current_student_count} / {m.max_student_capacity}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${overloaded ? 'bg-red-500' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Capacity Alerts
          </h3>
          {atCapacity.length > 0 ? (
            <div className="space-y-2">
              {atCapacity.map(m => (
                <div key={m.mentor_profile_id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                  <span className="font-bold">{m.employeeName}</span> has reached max capacity ({m.max_student_capacity} students).
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">All mentors are within capacity limits.</p>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link href="/admin/mentor/batch-mapping" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2"><Package className="h-4 w-4 text-blue-500" /> Active Batch Mappings</span>
              <span className="flex items-center gap-1 text-blue-600">{batchMappingCount} <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
            <Link href="/admin/mentor/assignment" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" /> Student Assignments</span>
              <span className="flex items-center gap-1 text-blue-600">{assignmentCount} active <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
