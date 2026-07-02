<?php

namespace App\Actions\Reservations;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;

class ReservationConflictDetector
{
    public function hasConflict(int $vehicleId, CarbonInterface $startAt, CarbonInterface $endAt, ?int $ignoreReservationId = null): bool
    {
        return $this->conflicts($vehicleId, $startAt, $endAt, $ignoreReservationId)->isNotEmpty();
    }

    public function conflicts(int $vehicleId, CarbonInterface $startAt, CarbonInterface $endAt, ?int $ignoreReservationId = null): Collection
    {
        return Reservation::query()
            ->select(['id', 'vehicle_id', 'reservation_number', 'status', 'start_at', 'end_at', 'purpose'])
            ->where('vehicle_id', $vehicleId)
            ->whereIn('status', ReservationStatus::blockingValues())
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt)
            ->when($ignoreReservationId, fn ($query) => $query->where('id', '!=', $ignoreReservationId))
            ->orderBy('start_at')
            ->get();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function calendarEvents(?int $vehicleId, CarbonInterface $startAt, CarbonInterface $endAt): array
    {
        return Reservation::query()
            ->with(['vehicle:id,unit_number,plate_number'])
            ->select(['id', 'vehicle_id', 'reservation_number', 'status', 'start_at', 'end_at', 'purpose'])
            ->when($vehicleId, fn ($query) => $query->where('vehicle_id', $vehicleId))
            ->whereIn('status', ReservationStatus::blockingValues())
            ->where('start_at', '<=', $endAt)
            ->where('end_at', '>=', $startAt)
            ->orderBy('start_at')
            ->get()
            ->map(function (Reservation $reservation): array {
                return [
                    'id' => $reservation->id,
                    'vehicle_id' => $reservation->vehicle_id,
                    'vehicle_label' => $reservation->vehicle?->unit_number ?? 'Vehicle',
                    'title' => $reservation->purpose ?: $reservation->reservation_number,
                    'status' => $reservation->status,
                    'start_at' => $reservation->start_at?->toIso8601String(),
                    'end_at' => $reservation->end_at?->toIso8601String(),
                    'reservation_number' => $reservation->reservation_number,
                ];
            })
            ->all();
    }
}
