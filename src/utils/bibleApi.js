export const TRANSLATIONS = [
  { id: 'kjv',    label: 'KJV — King James Version' },
  { id: 'web',    label: 'WEB — World English Bible' },
  { id: 'asv',    label: 'ASV — American Standard (1901)' },
  { id: 'bbe',    label: 'BBE — Bible in Basic English' },
  { id: 'oeb-us', label: 'OEB — Open English Bible' },
]

export async function fetchVerse(reference, translation = 'kjv') {
  const encoded = encodeURIComponent(reference)
  const res = await fetch(`https://bible-api.com/${encoded}?translation=${translation}`)
  if (!res.ok) throw new Error('Verse not found')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return { reference: data.reference, text: data.text.trim() }
}
