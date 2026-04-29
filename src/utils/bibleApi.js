export const TRANSLATIONS = [
  { id: 'kjv',    label: 'KJV — King James Version',         shortLabel: 'KJV' },
  { id: 'web',    label: 'WEB — World English Bible',        shortLabel: 'WEB' },
  { id: 'asv',    label: 'ASV — American Standard (1901)',   shortLabel: 'ASV' },
  { id: 'bbe',    label: 'BBE — Bible in Basic English',     shortLabel: 'BBE' },
  { id: 'ylt',    label: "YLT — Young's Literal Translation", shortLabel: 'YLT' },
  { id: 'oeb-us', label: 'OEB — Open English Bible',         shortLabel: 'OEB' },
  { id: 'webbe',  label: 'WEBBE — World English (British)',  shortLabel: 'WEBBE' },
  { id: 'darby',  label: 'DBY — Darby Bible',                shortLabel: 'DBY' },
]

export async function fetchVerse(reference, translation = 'kjv') {
  const encoded = encodeURIComponent(reference)
  const res = await fetch(`https://bible-api.com/${encoded}?translation=${translation}`)
  if (!res.ok) throw new Error('Verse not found')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return { reference: data.reference, text: data.text.trim() }
}
