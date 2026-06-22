import { Program, MOCK_PROGRAMS } from '../data/mock-programs';

export const programService = {
  async getPrograms(): Promise<Program[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROGRAMS;
  },

  async getProgram(id: string): Promise<Program | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PROGRAMS.find(prog => prog.id === id);
  }
};
