export interface PointCalculationInput {
  currentPoints: number;
  delta: number;
  reason: string;
}

export interface PointCalculationResult {
  newPoints: number;
  delta: number;
  isAlert: boolean; // True if drop >= 20 or final points < 60
  alertMessage?: string;
  statusBadge: {
    label: string;
    colorScheme: 'green' | 'amber' | 'red';
  };
}

/**
 * Calculates updated student points and evaluates automatic counseling alerts
 */
export function calculateStudentPoints(input: PointCalculationInput): PointCalculationResult {
  const newPoints = Math.max(0, input.currentPoints + input.delta);
  const isDropAlert = input.delta <= -20;
  const isLowTotalAlert = newPoints < 60;
  const isAlert = isDropAlert || isLowTotalAlert;

  let alertMessage: string | undefined;
  if (isDropAlert && isLowTotalAlert) {
    alertMessage = `Peringatan Khusus BK: Poin Anda turun drastis (${input.delta} poin) dan total poin berada di bawah batas aman (${newPoints} poin). Silakan segera jadwalkan konsultasi dengan Guru BK.`;
  } else if (isDropAlert) {
    alertMessage = `Notifikasi BK: Terjadi penurunan poin signifikan (${input.delta} poin) terkait: "${input.reason}". Perhatikan catatan pembinaan dari Guru BK.`;
  } else if (isLowTotalAlert) {
    alertMessage = `Peringatan Disiplin BK: Akumulasi poin Anda saat ini berada di kategori Waspada (${newPoints} poin). Mohon tingkatkan keaktifan dan kepatuhan sekolah.`;
  }

  let statusBadge: { label: string; colorScheme: 'green' | 'amber' | 'red' };
  if (newPoints >= 85) {
    statusBadge = { label: 'Sangat Baik / Berprestasi', colorScheme: 'green' };
  } else if (newPoints >= 65) {
    statusBadge = { label: 'Baik & Stabil', colorScheme: 'green' };
  } else if (newPoints >= 50) {
    statusBadge = { label: 'Perlu Pembinaan BK', colorScheme: 'amber' };
  } else {
    statusBadge = { label: 'Waspada / Perhatian Khusus', colorScheme: 'red' };
  }

  return {
    newPoints,
    delta: input.delta,
    isAlert,
    alertMessage,
    statusBadge,
  };
}
