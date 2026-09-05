/**
 * İz (trace) geometrisi.
 *
 * `physical-trace.png` tek bir görselde 10 ayrı ayak izi barındırıyor. Bunları
 * tek blok halinde ekrana koymak yerine her izi ayrı bir sprite olarak kesip
 * viewport'a çizilen bir eğri boyunca yeniden diziyoruz. Böylece iz gerçekten
 * "takip edilebilir" bir yol oluyor ve her ekran boyutunda aynı ritmi koruyor.
 *
 * Aşağıdaki dikdörtgenler `scripts/measure-trace-steps.mjs` ile kaynak
 * görselin alfa kanalından ölçüldü (normalize, 0–1).
 */

export interface SpriteRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Kaynak görseldeki ayak izleri — yürüyüş sırasına göre (alttan üste). */
export const TRACE_SPRITES: SpriteRect[] = [
  { x: 0.1029, y: 0.7974, w: 0.1069, h: 0.0885 },
  { x: 0.2033, y: 0.7033, w: 0.0391, h: 0.0781 },
  { x: 0.2464, y: 0.626, w: 0.1077, h: 0.071 },
  { x: 0.4537, y: 0.6029, w: 0.0789, h: 0.0534 },
  { x: 0.5439, y: 0.547, w: 0.0702, h: 0.0582 },
  { x: 0.6228, y: 0.4697, w: 0.0702, h: 0.071 },
  { x: 0.7089, y: 0.3573, w: 0.0797, h: 0.0837 },
  { x: 0.7791, y: 0.2552, w: 0.0303, h: 0.0853 },
  { x: 0.7863, y: 0.1802, w: 0.051, h: 0.0606 },
  { x: 0.8365, y: 0.0989, w: 0.0789, h: 0.0781 },
];

/**
 * Yürüyüş: yol 10 sprite'tan daha uzun olsun diye iki iz tekrar kullanılıyor.
 * Ardışık tekrar yok, böylece göz aynı şekli iki kez yan yana görmüyor.
 */
const TRACE_WALK = [0, 1, 2, 3, 4, 2, 5, 6, 7, 4, 8, 9];

export const TRACE_STEP_COUNT = TRACE_WALK.length;

/** Adım sırasındaki bir noktanın hangi sprite'ı kullandığını verir. */
export function getStepSprite(step: number): SpriteRect {
  return TRACE_SPRITES[TRACE_WALK[step] ?? 0];
}

/**
 * İzin son adımının bittiği yer aynı zamanda zarfın durduğu yer. Tek kaynaktan
 * gelsin ki iz gerçekten nesneye çıksın.
 */
export function getTargetAnchor(width: number, height: number): { x: number; y: number } {
  const mobile = width <= 860;
  return mobile ? { x: width * 0.5, y: height * 0.4 } : { x: width * 0.72, y: height * 0.44 };
}

export interface StepPoint {
  /** Ekran koordinatı (px), sprite'ın merkezi. */
  x: number;
  y: number;
  /** Yolun teğetine göre küçük organik sapma (derece). */
  angle: number;
  /** Sprite'ın ekrandaki genişliği (px). */
  size: number;
  index: number;
  sprite: SpriteRect;
}

function cubic(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

/**
 * İz noktalarını, ekranın sol-altından hedefe uzanan kübik bir Bézier eğrisi
 * üzerine dizer. Eğri önce sağa doğru uzanır, sonra yükselir: yol daha uzun ve
 * daha "yürünmüş" hissettirir. Son nokta tam olarak hedef çapasıdır.
 */
export function buildTracePath(width: number, height: number): StepPoint[] {
  const mobile = width <= 860;
  const anchor = getTargetAnchor(width, height);
  // İz zarfın tam altında biter, üstünden geçmez: son adım nesnenin
  // eteğine değer, kompozisyonu bozmaz.
  const target = mobile
    ? { x: anchor.x, y: anchor.y + height * 0.15 }
    : { x: anchor.x - width * 0.07, y: anchor.y + height * 0.17 };

  // Dar ekranda yol yalnızca yukarı gitmez: sağa savrulur, geri döner, sonra
  // nesneye çıkar. Kontrol noktaları bilinçli olarak viewport dışındadır —
  // kısa dikey mesafede uzun bir yürüyüş hissi ancak böyle oluşur.
  const start = mobile
    ? { x: width * 0.26, y: height * 0.84 }
    : { x: width * 0.16, y: height * 0.84 };
  const c1 = mobile
    ? { x: width * 0.88, y: height * 0.87 }
    : { x: width * 0.36, y: height * 0.9 };
  const c2 = mobile
    ? { x: width * 0.12, y: height * 0.64 }
    : { x: width * 0.52, y: height * 0.63 };

  // Daha küçük izler (kullanıcı geri bildirimi): yol uzun, adımlar hafif.
  const spriteScale = mobile ? Math.min(42, width * 0.088) : Math.min(64, width * 0.038);

  return TRACE_WALK.map((spriteIndex, i) => {
    const t = i / (TRACE_WALK.length - 1);
    const x = cubic(start.x, c1.x, c2.x, target.x, t);
    const y = cubic(start.y, c1.y, c2.y, target.y, t);
    const sprite = TRACE_SPRITES[spriteIndex];
    // Deterministik ama düzenli olmayan bir sapma — her yenilemede aynı,
    // yine de mekanik bir dizilim gibi durmuyor.
    const angle = Math.sin(i * 2.399) * 11;
    return { x, y, angle, size: spriteScale * (sprite.w / 0.08), index: i, sprite };
  });
}

/** Kâğıt parçası izin ortasında, yolun biraz dışında durur. */
export function getFragmentAnchor(width: number, height: number): { x: number; y: number } {
  const path = buildTracePath(width, height);
  const mid = path[5] ?? path[0];
  const mobile = width <= 860;
  return {
    x: mobile ? width * 0.68 : mid.x - width * 0.035,
    y: mobile ? height * 0.72 : mid.y - height * 0.17,
  };
}

/** İzi yakalama yarıçapı — dokunmatikte parmak, masaüstünde imleç. */
export function getStepCatchRadius(width: number): number {
  return width <= 860 ? 62 : 80;
}
