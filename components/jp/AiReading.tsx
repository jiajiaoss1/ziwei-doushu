'use client';

import { useState } from 'react';
import { trackJa } from '@/lib/jp/analytics';

interface AiReadingProps {
  params: {
    y: number;
    m: number;
    d: number;
    h: number;
    mi: number;
    u: boolean;
    g: 'm' | 'f';
    p: string;
  };
  type?: 'general' | 'love' | 'work';
  enabled: boolean;
}

interface Segment {
  heading?: string;
  body: string;
}

export function parse(text: string): Segment[] {
  // 見出しが本文と同一行に来ても分割できるようにする
  const normalized = text.replace(/\*\*【([^】]+)】\*\*/g, '\n**【$1】**\n');
  const lines = normalized.split('\n');
  const segments: Segment[] = [];
  let current: Segment = { body: '' };
  for (const line of lines) {
    const m = line.match(/^\*\*【(.+?)】\*\*$/);
    if (m) {
      if (current.body.trim()) segments.push(current);
      current = { heading: m[1], body: '' };
    } else {
      current.body += `${line}\n`;
    }
  }
  if (current.body.trim()) segments.push(current);
  return segments;
}

export default function AiReading({ params, type = 'general', enabled }: AiReadingProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!enabled) return null;

  const run = async () => {
    setLoading(true);
    setError('');
    setText('');
    setDone(false);
    const controller = new AbortController();
    trackJa('jp_ai_generate', { type });

    try {
      const res = await fetch('/api/ja/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, type }),
        signal: controller.signal,
      });

      if (res.status === 501) {
        setError('AI解説は現在準備中です。上の読み解きをご利用ください。');
        setLoading(false);
        return;
      }
      if (!res.ok || !res.body) throw new Error('failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let acc = '';

      while (true) {
        const { done: finished, value } = await reader.read();
        if (finished) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';
        for (const event of events) {
          const line = event.split('\n').find((l) => l.startsWith('data: '));
          if (!line) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string; message?: string };
            if (parsed.error) {
              setError('AI解説の生成に失敗しました。時間をおいて再度お試しください。');
            } else if (parsed.text) {
              acc += parsed.text;
              setText(acc);
            }
          } catch {
            // ignore
          }
        }
      }
      setDone(true);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('AI解説の生成に失敗しました。時間をおいて再度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  const segments = parse(text);

  return (
    <section style={{ marginTop: 36 }}>
      <h2 className="ja-serif" style={{ fontSize: 20, letterSpacing: '0.1em', marginBottom: 8 }}>
        AIで深掘りする
      </h2>
      <p style={{ fontSize: 12.5, color: '#a49e8f', marginBottom: 16 }}>
        命盤の事実をもとに、気になるテーマを文章で掘り下げます（β版）。
      </p>

      {!text && !loading && (
        <div className="ja-card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#a49e8f', marginBottom: 16 }}>
            本質・恋愛・仕事から、いま知りたいテーマを選んでください。
          </p>
          <button type="button" className="ja-btn ja-btn-sm" onClick={run}>
            AI解説を生成する
          </button>
        </div>
      )}

      {(loading || text) && (
        <div className="ja-card" style={{ padding: '22px 22px' }}>
          {segments.length === 0 && loading && (
            <p style={{ fontSize: 13, color: '#a49e8f', margin: 0 }}>読み解きを生成しています…</p>
          )}
          {segments.map((seg, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              {seg.heading && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#e3c473',
                    letterSpacing: '0.08em',
                    marginBottom: 6,
                  }}
                >
                  【{seg.heading}】
                </div>
              )}
              {seg.body
                .split('\n')
                .filter((l) => l.trim())
                .map((line, j) => (
                  <p key={j} style={{ fontSize: 13.5, lineHeight: 1.95, color: '#d9d3c5', margin: '0 0 8px' }}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
            </div>
          ))}
          {loading && (
            <p style={{ fontSize: 12, color: '#e3c473', margin: 0 }}>▍生成中…</p>
          )}
          {done && (
            <button
              type="button"
              className="ja-btn ja-btn-ghost ja-btn-sm"
              style={{ marginTop: 8 }}
              onClick={run}
            >
              もう一度生成する
            </button>
          )}
        </div>
      )}

      {error && <p style={{ fontSize: 12.5, color: '#e59a8a', marginTop: 10 }}>{error}</p>}

      <p style={{ fontSize: 11, color: '#8a8577', marginTop: 10, lineHeight: 1.8 }}>
        AIによる文章生成です。盤面の事実と照らし合わせ、参考としてお読みください。
      </p>
    </section>
  );
}
