import { describe, expect, it, vi } from 'vitest';
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { parseRanking, syncRanking } from './sync-ranking.js';

describe('legacy article popularity ranking', () => {
  it('validates the generated Analytics ranking', () => {
    expect(parseRanking({ articleIdList: [17, 290, 193] })).toEqual([17, 290, 193]);
    expect(() => parseRanking({ articleIdList: [17, 17] })).toThrow('duplicate');
    expect(() => parseRanking({ articleIdList: ['invalid'] })).toThrow('positive integer');
  });

  it('stores one-based ranks only for migrated articles', async () => {
    const send = vi.fn(async (command: ScanCommand | UpdateCommand) => {
      if (command instanceof ScanCommand) return { Items: [{ id: '17' }, { id: '193' }, { id: '88', popularityRank: 1 }] };
      return {};
    });
    const report = await syncRanking({ send } as never, 'Articles', [17, 290, 193]);
    expect(report).toEqual({ supplied: 3, matched: 2, missing: 1, updated: 2, cleared: 1 });
    const updates = send.mock.calls.map(([command]) => command).filter((command) => command instanceof UpdateCommand);
    expect(updates.filter((command) => command.input.UpdateExpression?.startsWith('SET')).map((command) => command.input.ExpressionAttributeValues)).toEqual([{ ':rank': 1 }, { ':rank': 2 }]);
    expect(updates.at(-1)?.input.UpdateExpression).toBe('REMOVE popularityRank');
  });
});
