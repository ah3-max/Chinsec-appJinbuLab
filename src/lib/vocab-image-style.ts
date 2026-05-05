/**
 * Unified visual style for all vocabulary illustrations across the app.
 *
 * Style: 3D soft clay / Pixar toy aesthetic.
 * Rules enforced via prompt:
 *   - One image = one vocabulary meaning
 *   - Pure white background
 *   - Single centered subject (object or action)
 *   - No text inside the image
 *   - No complex multi-element scene
 *   - Meaning must be clear within 2 seconds
 *   - Consistent clay/pastel look across every card
 */

export const CLAY_STYLE_PROMPT =
  "3D soft clay toy illustration. " +
  "Pure white background. " +
  "Single centered subject — one clear object or action only. " +
  "Rounded puffy clay shapes with smooth glossy surface. " +
  "Soft pastel colors. " +
  "Pixar / Claymation aesthetic. " +
  "Clean minimal composition. " +
  "Soft studio lighting with subtle shadows. " +
  "No text. No words. No labels. " +
  "No complex multi-object scene. " +
  "The viewer must understand the meaning within 2 seconds.";

/**
 * Build the full DALL-E prompt for a given vocabulary word.
 * @param englishMeaning  English translation used to describe the subject
 * @param partOfSpeech    Optional POS hint (noun / verb / adj …)
 */
export function buildVocabImagePrompt(
  englishMeaning: string,
  partOfSpeech?: string | null,
): string {
  const pos = partOfSpeech ? ` (${partOfSpeech})` : "";
  return (
    `${CLAY_STYLE_PROMPT} ` +
    `Subject: "${englishMeaning}"${pos}. ` +
    `Illustrate the concept of "${englishMeaning}" as a single clay 3D object or scene.`
  );
}
