import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { JobRecord, UploadRecord } from '../types/jobs';

interface QueueState {
  pendingJobIds: string[];
}

interface PersistedState {
  uploads: UploadRecord[];
  jobs: JobRecord[];
  queue: QueueState;
}

const DEFAULT_STATE: PersistedState = {
  uploads: [],
  jobs: [],
  queue: { pendingJobIds: [] },
};

export class PersistenceService {
  private readonly dataDir = config.dataDir;
  private readonly filePath = path.join(this.dataDir, 'state.json');

  constructor() {
    this.ensureStorage();
  }

  private ensureStorage() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
    }
  }

  readState(): PersistedState {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        uploads: parsed.uploads ?? [],
        jobs: parsed.jobs ?? [],
        queue: {
          pendingJobIds: parsed.queue?.pendingJobIds ?? [],
        },
      };
    } catch {
      return DEFAULT_STATE;
    }
  }

  writeState(state: PersistedState) {
    fs.writeFileSync(this.filePath, JSON.stringify(state, null, 2), 'utf-8');
  }
}

export const persistenceService = new PersistenceService();
