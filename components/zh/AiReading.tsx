'use client';

import { useState } from 'react';
import { trackZh } from '@/lib/zh/analytics';

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
  token?: string;
}

interface Segment {
  heading?: string;
  body: string;
}

export function parse(text: string): Segment[] {
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

export default function AiReading({ params, type = 'general', enabled, token }: AiReadingProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [question, setQuestion] = useState('');

  if (!enabled) return null;

  const run = async () => {
    setLoading(true);
    setError('');
    setText('');
    setDone(false);
    const controller = new AbortController();
    trackZh('zh_ai_generate', { type });

    try {
      const res = await fetch('/api/zh/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, type, token, question }),
        signal: controller.signal,
      });

      if (res.status === 501) {
        setError('AI 解讀目前準備中，請使用上面的解讀。');
        setLoading(false);
        return;
      }
      if (res.status === 401) {
        setError('請從這個頁面再試一次。');
        setLoading(false);
        return;
      }
      if (res.status === 429) {
        let message = '次數限制已達，請稍後再試。';
        try {
          const body = (await res.json()) as { error?: string; message?: string };
          if (body.error === 'ai_daily_limit' && body.message) message = body.message;
        } catch {
          // 用預設文案
        }
        setError(message);
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
              setError('AI 解讀生成失敗，請稍後再試。');
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
        setError('AI 解讀生成失敗，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  };

  const segments = parse(text);

  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={{ fontSize: 20, letterSpacing: '0.1em', marginBottom: 8 }}>
        AI 深入解讀
      </h2>
      <p style={{ fontSize: 12.5, color: '#a49e8f', marginBottom: 16 }}>
        以命盤事實為基礎，把你關心的主題寫成文章（Beta 版）。
      </p>

      {!text && !loading && (
        <div className="ja-card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#a49e8f', marginBottom: 14 }}>
            想問什麼？（選填）例如：「他還會聯絡我嗎？」「這個月適合換工作嗎？」
          </p>
          <input
            type="text"
            placeholder="想問的問題（選填）"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={200}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(201,165,74,0.3)',
              background: 'rgba(10,14,28,0.6)',
              color: '#e6dfd0',
              fontSize: 13.5,
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />
          <button type="button" className="ja-btn ja-btn-sm" onClick={run}>
            生成 AI 解讀
          </button>
        </div>
      )}

      {(loading || text) && (
        <div className="ja-card" style={{ padding: '22px 22px' }}>
          {segments.length === 0 && loading && (
            <p style={{ fontSize: 13, color: '#a49e8f', margin: 0 }}>正在生成解讀…</p>
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
              再生成一次
            </button>
          )}
        </div>
      )}

      {error && <p style={{ fontSize: 12.5, color: '#e59a8a', marginTop: 10 }}>{error}</p>}

      <p style={{ fontSize: 11, color: '#8a8577', marginTop: 10, lineHeight: 1.8 }}>
        AI 生成的文章。請與盤面事實對照，作為參考閱讀。
      </p>
    </section>
  );
}
