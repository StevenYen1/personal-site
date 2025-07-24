
export function getMapImageUrl(
  selectedCoordinates: { lat: number; lng: number } | null | undefined,
  selectedLocationName: string | null | undefined,
  apiKey: string
): string | null {
  if (!selectedCoordinates || !selectedLocationName) return null;

  const { lat, lng } = selectedCoordinates;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=6&size=600x400&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
}