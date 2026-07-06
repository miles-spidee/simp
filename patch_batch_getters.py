import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'r') as f:
    content = f.read()

new_getters = """  async getBatches(): Promise<ExtendedBatch[]> {
    try {
      const data = await batchApi.getBatches();
      if (Array.isArray(data)) {
        let mappings: any[] = [];
        try {
            mappings = await mentorApi.getBatchMappings();
        } catch(e) {}
        
        let mentorsMap: any = {};
        if (mappings && mappings.length > 0) {
            try {
                const mentorsData = await mentorApi.getMentorProfiles();
                mentorsMap = mentorsData.reduce((acc: any, m: any) => {
                    acc[m.mentor_profile_id] = m;
                    return acc;
                }, {});
            } catch(e) {}
        }

        return data.map(b => {
           const ext = this.mapToExtended(b);
           const mapping = mappings.find((m: any) => m.batch_id === b.batch_id);
           if (mapping) {
               const mentorProfile = mentorsMap[mapping.mentor_id];
               ext.mentor.id = mapping.mentor_id;
               if (mentorProfile) {
                   ext.mentor.name = mentorProfile.employeeName || mentorProfile.user_id;
                   ext.mentor.expertise = mentorProfile.mentor_expertise?.join(', ') || mentorProfile.mentor_bio || '';
               }
           }
           return ext;
        });
      }
    } catch (e) {
      console.warn('Backend API unavailable or failed.', e);
    }
    return [];
  },

  async getBatch(id: string): Promise<ExtendedBatch | undefined> {
    try {
      const data = await batchApi.getBatch(id);
      const ext = this.mapToExtended(data);
      try {
          const mappings = await mentorApi.getBatchMappings();
          const mapping = mappings.find((m: any) => m.batch_id === id);
          if (mapping) {
              ext.mentor.id = mapping.mentor_id;
              const mentorProfile = await mentorApi.getMentorProfile(mapping.mentor_id);
              if (mentorProfile) {
                   ext.mentor.name = mentorProfile.employeeName || mentorProfile.user_id;
                   ext.mentor.expertise = mentorProfile.mentor_expertise?.join(', ') || mentorProfile.mentor_bio || '';
              }
          }
      } catch (e) {}
      
      return ext;
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },"""

content = re.sub(r'  async getBatches\(\): Promise<ExtendedBatch\[\]> \{.*?  async getBatchesByProgram', new_getters + "\n\n  async getBatchesByProgram", content, flags=re.DOTALL)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'w') as f:
    f.write(content)

print("Done")
