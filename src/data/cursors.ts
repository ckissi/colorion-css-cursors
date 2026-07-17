export type CursorType =
  | 'dot'
  | 'ring'
  | 'blend'
  | 'glow'
  | 'trail'
  | 'snake'
  | 'spotlight'
  | 'crosshair'
  | 'magnet'
  | 'jelly'
  | 'ghost'
  | 'ripple'
  | 'label'
  | 'lens'
  | 'pixel'
  | 'neon'
  | 'goo'
  | 'arrow'
  | 'spring'
  | 'sparkle'
  | 'beam'
  | 'morph'
  | 'radar'
  | 'duo'
  | 'caret'
  | 'eclipse'
  | 'orbit'
  | 'paint'
  | 'focusbox'
  | 'glitch'
  | 'eye'
  | 'grid'
  | 'drop'
  | 'bubble'
  | 'heart'
  | 'chrome'
  | 'compass'
  | 'portal'
  | 'confetti';

export interface Cursor {
  index: string;
  name: string;
  type: CursorType;
  /** one-line description shown nowhere in the UI but used in the LLM prompt */
  blurb: string;
}

export const cursors: Cursor[] = [
  { index: '01', name: 'Nib', type: 'dot', blurb: 'a minimal solid dot that snaps to the pointer' },
  { index: '02', name: 'Halo', type: 'ring', blurb: 'a hollow ring that eases in behind the pointer' },
  { index: '03', name: 'Inkwell', type: 'blend', blurb: 'a difference-blend disc that inverts whatever it covers' },
  { index: '04', name: 'Aura', type: 'glow', blurb: 'a soft blurred glow orb' },
  { index: '05', name: 'Comet', type: 'trail', blurb: 'a head with a tapered tail pointing back along the motion' },
  { index: '06', name: 'Serpent', type: 'snake', blurb: 'a chain of segments that chase the pointer like a tail' },
  { index: '07', name: 'Limelight', type: 'spotlight', blurb: 'a dark veil pierced by a soft spotlight that reveals content' },
  { index: '08', name: 'Reticle', type: 'crosshair', blurb: 'full-span hairlines that cross at the pointer' },
  { index: '09', name: 'Lodestone', type: 'magnet', blurb: 'a ring that magnetically snaps onto a target' },
  { index: '10', name: 'Jellyroll', type: 'jelly', blurb: 'a blob that squashes and stretches along its motion' },
  { index: '11', name: 'Afterimage', type: 'ghost', blurb: 'staggered translucent echoes trailing the pointer' },
  { index: '12', name: 'Ripple', type: 'ripple', blurb: 'concentric rings pulsing outward from the pointer' },
  { index: '13', name: 'Tagalong', type: 'label', blurb: 'a pill label that trails a step behind the pointer' },
  { index: '14', name: 'Loupe', type: 'lens', blurb: 'a magnifier ring with a glass glare highlight' },
  { index: '15', name: '8-Bit', type: 'pixel', blurb: 'a chunky square that hops in stepped pixel jumps' },
  { index: '16', name: 'Nightclub', type: 'neon', blurb: 'a neon ring with a hue-cycling glow' },
  { index: '17', name: 'Metaball', type: 'goo', blurb: 'two gooey blobs that merge through an SVG filter' },
  { index: '18', name: 'Homing', type: 'arrow', blurb: 'an arrowhead that rotates to point the way it travels' },
  { index: '19', name: 'Overshoot', type: 'spring', blurb: 'a dot that springs past the pointer and settles back' },
  { index: '20', name: 'Stardust', type: 'sparkle', blurb: 'a twinkling star shedding a trail of sparkles' },
  { index: '21', name: 'Lighthouse', type: 'beam', blurb: 'a tall vertical light beam that follows the pointer' },
  { index: '22', name: 'Amoeba', type: 'morph', blurb: 'a ring that endlessly morphs its border-radius' },
  { index: '23', name: 'Radar', type: 'radar', blurb: 'a rotating targeting reticle with a sweeping arm' },
  { index: '24', name: 'Anaglyph', type: 'duo', blurb: 'magenta and cyan dots that split apart with speed' },
  { index: '25', name: 'Teletype', type: 'caret', blurb: 'a blinking text I-beam caret' },
  { index: '26', name: 'Eclipse', type: 'eclipse', blurb: 'a ring whose core fills in the faster you move' },
  { index: '27', name: 'Orbit', type: 'orbit', blurb: 'a satellite dot that orbits around the pointer' },
  { index: '28', name: 'Inkflow', type: 'paint', blurb: 'a hue-shifting smear of segments dragged behind the pointer' },
  { index: '29', name: 'Autofocus', type: 'focusbox', blurb: 'four camera-style corner brackets that frame the pointer and pulse as if focusing' },
  { index: '30', name: 'Datamosh', type: 'glitch', blurb: 'an RGB channel-split square that jitters and splits wider the faster you move' },
  { index: '31', name: 'Iris', type: 'eye', blurb: 'an eyeball whose pupil looks in the direction the pointer is travelling' },
  { index: '32', name: 'Snap-Grid', type: 'grid', blurb: 'a marker that snaps to the nearest point on a dotted grid using CSS round()' },
  { index: '33', name: 'Droplet', type: 'drop', blurb: 'a glossy teardrop that rotates to point the way it travels' },
  { index: '34', name: 'Soap', type: 'bubble', blurb: 'an iridescent soap bubble with a conic sheen that wobbles as it drifts' },
  { index: '35', name: 'Heartbeat', type: 'heart', blurb: 'a heart cursor that beats to a double-thump rhythm' },
  { index: '36', name: 'Liquid Metal', type: 'chrome', blurb: 'a molten chrome blob with a sliding metallic sheen' },
  { index: '37', name: 'Wayfinder', type: 'compass', blurb: 'a compass needle that turns to follow the pointer’s direction of travel' },
  { index: '38', name: 'Wormhole', type: 'portal', blurb: 'counter-rotating portal rings that tighten as the pointer speeds up' },
  { index: '39', name: 'Confetti', type: 'confetti', blurb: 'a colourful burst of paper strips that fans out behind the pointer' },
];

/** cursors rendered as a chain of N follower segments, each indexed with --i */
export const segmentCounts: Partial<Record<CursorType, number>> = {
  snake: 8,
  ghost: 6,
  sparkle: 5,
  paint: 7,
  orbit: 1,
  duo: 2,
  confetti: 7,
};

/** cursors whose demo acts on underlying content (the word stays visible) */
export const showsWord = new Set<CursorType>(['blend', 'spotlight', 'magnet']);
