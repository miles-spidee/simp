import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/batch/page.tsx', 'r') as f:
    content = f.read()

# Add handleDeleteBatch
new_create_batch = """  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const newB = await batchService.createBatch({
      program_id: editForm.programId,

      name: editForm.name,
      code: `BATCH-${Date.now()}`,

      start_date: editForm.startDate || '2026-05-01',
      end_date: editForm.endDate || '2026-08-01',

      max_capacity: Number(editForm.capacity) || 30,
      internship_type: editForm.internshipType
    } as any);

    if (newB) {
      setBatches([...batches, newB]);
      showToast(`Cohort Batch "${newB.name}" created under ID ${newB.code}`);
      setActiveActionModal(null);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    const success = await batchService.deleteBatch(batchId);
    if (success) {
      setBatches(batches.filter(b => b.id !== batchId));
      showToast('Batch deleted successfully', 'success');
      if (activeProfile?.id === batchId) {
        setIsProfileDrawerOpen(false);
        setActiveProfile(null);
      }
    } else {
      showToast('Failed to delete batch', 'error');
    }
  };"""

content = re.sub(r'  const handleCreateBatch = async \(e: React\.FormEvent\) => \{.*?    \}\n  \};', new_create_batch, content, flags=re.DOTALL)


# Update Actions render
new_actions = """              {
                key: 'actions',
                label: 'Actions',
                className: 'text-right',
                render: (b) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => handleOpenProfile(b)} className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-text-secondary transition-colors" title="Cohort Command Drawer">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => openEditModal(b)} className="p-1 hover:text-amber-600 hover:bg-slate-100 rounded text-text-secondary transition-colors" title="Edit Cohort Parameters">
                      <PlusCircle className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteBatch(b.id)} className="p-1 hover:text-red-600 hover:bg-slate-100 rounded text-text-secondary transition-colors" title="Delete Batch">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },"""

content = re.sub(r'              \{\n                key: \'actions\',.*?\n              \},', new_actions, content, flags=re.DOTALL)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/batch/page.tsx', 'w') as f:
    f.write(content)

print("Done")
