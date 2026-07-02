<?php

namespace App\Http\Controllers;

use App\Actions\Reservations\ReservationConflictDetector;
use App\Enums\ReservationStatus;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Models\Reservation;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ReservationController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Reservation::class, 'reservation');
    }

    public function index(Request $request, ReservationConflictDetector $conflicts): Response
    {
        $filters = $request->only(['search', 'status', 'vehicle_id', 'month']);
        $month = Carbon::parse($filters['month'] ?? now()->format('Y-m-01'));
        $calendarStart = $month->copy()->startOfMonth()->startOfDay();
        $calendarEnd = $month->copy()->endOfMonth()->endOfDay();

        $reservations = Reservation::query()
            ->with(['vehicle:id,agency_id,unit_number,plate_number,status', 'vehicle.agency:id,name', 'requestedBy:id,name', 'approvedBy:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->search($search))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['vehicle_id'] ?? null, fn ($query, $vehicleId) => $query->where('vehicle_id', $vehicleId))
            ->latest('start_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('reservations/index', [
            'reservations' => $reservations,
            'filters' => $filters,
            'statusOptions' => array_map(
                fn (ReservationStatus $status) => ['value' => $status->value, 'label' => Str::headline($status->value)],
                ReservationStatus::all(),
            ),
            'vehicles' => Vehicle::query()->with('agency:id,name')->orderBy('unit_number')->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'calendarMonth' => $month->format('Y-m'),
            'calendarEvents' => $conflicts->calendarEvents(
                $filters['vehicle_id'] ? (int) $filters['vehicle_id'] : null,
                $calendarStart,
                $calendarEnd,
            ),
            'calendarStart' => $calendarStart->toIso8601String(),
            'calendarEnd' => $calendarEnd->toIso8601String(),
            'canCreate' => $request->user()?->can('create', Reservation::class) ?? false,
            'canManage' => $request->user()?->isFleetManager() || $request->user()?->isSuperAdmin(),
        ]);
    }

    public function create(Request $request, ReservationConflictDetector $conflicts): Response
    {
        $vehicleId = $request->integer('vehicle_id');
        $startAt = $request->date('start_at') ?? now();
        $endAt = $request->date('end_at') ?? now()->copy()->addHour();
        $calendarStart = now()->startOfMonth();
        $calendarEnd = now()->endOfMonth();

        return Inertia::render('reservations/create', [
            'vehicles' => Vehicle::query()->with('agency:id,name')->orderBy('unit_number')->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'statusOptions' => array_map(
                fn (ReservationStatus $status) => ['value' => $status->value, 'label' => Str::headline($status->value)],
                ReservationStatus::all(),
            ),
            'calendarMonth' => now()->format('Y-m'),
            'calendarEvents' => $conflicts->calendarEvents($vehicleId ?: null, $calendarStart, $calendarEnd),
            'selectedVehicleId' => $vehicleId ?: null,
            'selectedStartAt' => $startAt->toIso8601String(),
            'selectedEndAt' => $endAt->toIso8601String(),
        ]);
    }

    public function store(StoreReservationRequest $request): RedirectResponse
    {
        return $this->persist($request->validated(), null);
    }

    public function show(Reservation $reservation, ReservationConflictDetector $conflicts): Response
    {
        $reservation->load(['vehicle:id,agency_id,unit_number,plate_number,status', 'vehicle.agency:id,name', 'requestedBy:id,name', 'approvedBy:id,name']);

        return Inertia::render('reservations/show', [
            'reservation' => $reservation,
            'calendarEvents' => $conflicts->calendarEvents(
                $reservation->vehicle_id,
                $reservation->start_at->copy()->startOfMonth(),
                $reservation->end_at->copy()->endOfMonth(),
            ),
            'canManage' => request()->user()?->can('update', $reservation) ?? false,
        ]);
    }

    public function edit(Reservation $reservation, ReservationConflictDetector $conflicts): Response
    {
        $reservation->load(['vehicle:id,agency_id,unit_number,plate_number,status', 'vehicle.agency:id,name', 'requestedBy:id,name', 'approvedBy:id,name']);

        return Inertia::render('reservations/edit', [
            'reservation' => $reservation,
            'vehicles' => Vehicle::query()->orderBy('unit_number')->get(['id', 'unit_number', 'plate_number', 'status']),
            'statusOptions' => array_map(
                fn (ReservationStatus $status) => ['value' => $status->value, 'label' => Str::headline($status->value)],
                ReservationStatus::all(),
            ),
            'calendarMonth' => $reservation->start_at->format('Y-m'),
            'calendarEvents' => $conflicts->calendarEvents(
                $reservation->vehicle_id,
                $reservation->start_at->copy()->startOfMonth(),
                $reservation->end_at->copy()->endOfMonth(),
            ),
        ]);
    }

    public function update(UpdateReservationRequest $request, Reservation $reservation): RedirectResponse
    {
        return $this->persist($request->validated(), $reservation);
    }

    public function destroy(Reservation $reservation): RedirectResponse
    {
        $reservation->delete();

        return redirect()->route('reservations.index')->with('success', 'Reservation deleted successfully.');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function persist(array $data, ?Reservation $reservation): RedirectResponse
    {
        try {
            DB::transaction(function () use ($data, $reservation): void {
                $user = request()->user();

                $payload = [
                    'agency_id' => $data['agency_id'],
                    'vehicle_id' => $data['vehicle_id'],
                    'requested_by_user_id' => $reservation?->requested_by_user_id ?? $user?->id,
                    'approved_by_user_id' => $reservation?->approved_by_user_id,
                    'reservation_number' => $reservation?->reservation_number ?? $this->generateReservationNumber(),
                    'status' => $data['status'],
                    'start_at' => $data['start_at'],
                    'end_at' => $data['end_at'],
                    'purpose' => $data['purpose'] ?? null,
                    'notes' => $data['notes'] ?? null,
                ];

                if ($reservation) {
                    $reservation->update($payload);
                    return;
                }

                Reservation::query()->create($payload);
            });
        } catch (Throwable $throwable) {
            if (str_contains($throwable->getMessage(), 'reservations_vehicle_time_no_overlap')) {
                return back()->withErrors([
                    'start_at' => 'The selected vehicle is already reserved in this period.',
                ])->withInput();
            }

            throw $throwable;
        }

        return redirect()->route('reservations.index')->with('success', $reservation ? 'Reservation updated successfully.' : 'Reservation created successfully.');
    }

    private function generateReservationNumber(): string
    {
        return 'RSV-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5));
    }
}
