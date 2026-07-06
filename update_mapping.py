import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/mentor/profile/BatchMappingView.tsx', 'r') as f:
    content = f.read()

# Add imports
imports = """import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Package, Link2, Users } from 'lucide-react';
import { mentorService } from '@/src/services/mentor.service';
import { batchService } from '@/src/services/batch.service';
import { MentorBatchMapping, MentorProfile } from '@/src/types/api/mentor.types';
import { BatchResponse } from '@/src/types/api/batch.types';
import { apiClient } from '@/src/api/api.client';
"""

content = re.sub(r'import React.*?from \'@/src/types/api/mentor\.types\';', imports, content, flags=re.DOTALL)

# Add state and logic
state_and_logic = """export default function MentorBatchMappingPage() {
  const [mappings, setMappings] = useState<MentorBatchMapping[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapForm, setMapForm] = useState({
    mentor_profile_id: '',
    batch_id: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const [mapData, mData, bData] = await Promise.all([
      mentorService.getBatchMappings(),
      mentorService.getMentorProfiles(),
      batchService.getBatches()
    ]);
    setMappings(mapData);
    setMentors(mData);
    setBatches(bData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapForm.mentor_profile_id || !mapForm.batch_id) {
      alert("Please select both a mentor and a batch");
      return;
    }
    
    try {
      await apiClient.post('/api/v1/allocation', {
        source_type: "MENTOR",
        source_id: mapForm.mentor_profile_id,
        target_type: "BATCH",
        target_id: mapForm.batch_id,
        role: "LEAD_MENTOR",
        status: "ACTIVE"
      });
      alert("Successfully mapped mentor to batch!");
      
      // Update mock mapping for UI preview
      const mentor = mentors.find(m => m.mentor_profile_id === mapForm.mentor_profile_id);
      const batch = batches.find(b => b.id === mapForm.batch_id);
      
      if (mentor && batch) {
        await mentorService.createBatchMapping({
          mentorProfileId: mentor.mentor_profile_id,
          mentorName: mentor.employeeName || 'Unknown',
          employeeId: mentor.employee_id,
          batchId: batch.id,
          batchName: batch.name || 'Unknown Batch',
          batchCode: batch.code || 'UNKNOWN',
          programName: batch.program_name || 'Program',
          studentCount: 0,
          batchCapacity: batch.max_capacity || 50,
          mappedDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          mappedBy: 'Current User'
        });
      }
      
      setIsMapOpen(false);
      setMapForm({ mentor_profile_id: '', batch_id: '' });
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to create mapping");
    }
  };
"""

content = re.sub(r'export default function MentorBatchMappingPage\(\) \{.*?(?=  const filtered)', state_and_logic, content, flags=re.DOTALL)

# Add modal to UI
modal_html = """
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-secondary text-sm">No batch mappings match your filters.</div>
        )}
      </div>

      {isMapOpen && (
        <div className="absolute inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-in">
            <h3 className="text-lg font-bold text-text-primary mb-4">Map Mentor to Batch</h3>
            
            <form onSubmit={handleMapSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-secondary uppercase">Select Mentor</label>
                <select 
                  required
                  value={mapForm.mentor_profile_id}
                  onChange={e => setMapForm({...mapForm, mentor_profile_id: e.target.value})}
                  className="w-full p-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Choose Mentor --</option>
                  {mentors.map(m => (
                    <option key={m.mentor_profile_id} value={m.mentor_profile_id}>
                      {m.employeeName || 'Unknown Mentor'} ({m.employee_id || m.mentor_profile_id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-secondary uppercase">Select Batch</label>
                <select 
                  required
                  value={mapForm.batch_id}
                  onChange={e => setMapForm({...mapForm, batch_id: e.target.value})}
                  className="w-full p-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Choose Batch --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code || b.id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsMapOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-bold text-text-secondary hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700"
                >
                  Confirm Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"""

content = re.sub(r'        \{filtered.length === 0 && \(.*', modal_html, content, flags=re.DOTALL)

content = content.replace(
    '<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">',
    '<button onClick={() => setIsMapOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">'
)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/mentor/profile/BatchMappingView.tsx', 'w') as f:
    f.write(content)

print("Done")
