'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Text, TextArea, XStack, YStack } from '@hanzo/gui';
import { ThumbsDown, ThumbsUp } from '@hanzogui/lucide-icons-2';
import { useAnalytics } from '@hanzo/docs-analytics';
import { Action } from '@/components/action';
import { muted } from '@/lib/ink';

/**
 * "Was this page useful?" at the foot of every page.
 *
 * The answer goes where every other signal from this site goes: an event on
 * the one telemetry stream (`docs.feedback`, POST /v1/event), with the page, the
 * verdict and whatever the reader wrote. It used to be handed to a stub that
 * logged it to the reader's own console and thanked them, so nothing anyone
 * said reached anyone. A page remembers that it was answered, in this browser.
 */
type Verdict = 'good' | 'bad';

export function Feedback() {
  const page = usePathname();
  const analytics = useAnalytics();
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const key = `docs.feedback:${page}`;

  useEffect(() => {
    try {
      setSent(localStorage.getItem(key) !== null);
    } catch {
      /* storage refused: ask again */
    }
    setVerdict(null);
    setNote('');
  }, [key]);

  const send = () => {
    if (!verdict) return;
    analytics.capture('docs.feedback', { page, verdict, note: note.trim() || undefined });
    try {
      localStorage.setItem(key, verdict);
    } catch {
      /* the event is what matters */
    }
    setSent(true);
  };

  return (
    <YStack mt={48} py={16} gap={12} borderTopWidth={1} borderBottomWidth={1} borderColor="$borderColor">
      {sent ? (
        <Text fontSize="$3" {...muted}>
          Thanks — that reached the team.
        </Text>
      ) : (
        <>
          <XStack gap={8} items="center" flexWrap="wrap">
            <Text fontSize="$3" fontWeight="500" color="$color12" mr={4}>
              Was this page useful?
            </Text>
            {(['good', 'bad'] as const).map((v) => (
              <Action
                key={v}
                tone={verdict === v ? 'loud' : 'line'}
                render="button"
                type="button"
                aria-pressed={verdict === v}
                onPress={() => setVerdict(v)}
                rounded={999}
              >
                {v === 'good' ? (
                  <ThumbsUp size={14} color={verdict === v ? '$background' : '$color11'} />
                ) : (
                  <ThumbsDown size={14} color={verdict === v ? '$background' : '$color11'} />
                )}
                <Text fontSize="$2" fontWeight="500" color={verdict === v ? '$background' : '$color11'}>
                  {v === 'good' ? 'Yes' : 'No'}
                </Text>
              </Action>
            ))}
          </XStack>
          {verdict && (
            <YStack gap={8}>
              <TextArea
                value={note}
                onChangeText={setNote}
                placeholder={verdict === 'good' ? 'What helped? (optional)' : 'What was missing or wrong? (optional)'}
                aria-label="Feedback"
                minH={84}
                p={10}
                fontSize="$3"
                rounded="$3"
                borderWidth={1}
                borderColor="$borderColor"
                bg="$panel"
                color="$color12"
                placeholderTextColor="$color10"
              />
              <XStack>
                <Action tone="loud" render="button" type="button" onPress={send}>
                  Send
                </Action>
              </XStack>
            </YStack>
          )}
        </>
      )}
    </YStack>
  );
}
