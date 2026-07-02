<?php

namespace App\Http\Controllers;

use App\Enums\VehicleStatus;
use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Models\Agency;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Vehicle::class, 'vehicle');
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'vehicle_type']);

        $vehicles = Vehicle::query()
            ->with('agency')
            ->search($filters['search'] ?? null)
            ->status($filters['status'] ?? null)
            ->vehicleType($filters['vehicle_type'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('vehicles/index', [
            'vehicles' => $vehicles,
            'filters' => $filters,
            'statusOptions' => array_map(
                fn (VehicleStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                VehicleStatus::all(),
            ),
            'vehicleTypes' => Vehicle::query()
                ->whereNotNull('vehicle_type')
                ->distinct()
                ->orderBy('vehicle_type')
                ->pluck('vehicle_type')
                ->values(),
            'agencies' => Agency::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'canCreate' => $request->user()?->can('create', Vehicle::class) ?? false,
            'canManage' => $request->user()?->can('update', Vehicle::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('vehicles/create', [
            'agencies' => Agency::query()->orderBy('name')->get(['id', 'name']),
            'statusOptions' => array_map(
                fn (VehicleStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                VehicleStatus::all(),
            ),
        ]);
    }

    public function store(StoreVehicleRequest $request)
    {
        $vehicle = Vehicle::create($request->validated());

        return redirect()->route('vehicles.show', $vehicle)->with('success', 'Vehicle created successfully.');
    }

    public function show(Vehicle $vehicle): Response
    {
        $vehicle->load('agency');

        return Inertia::render('vehicles/show', [
            'vehicle' => $vehicle,
            'canManage' => request()->user()?->can('update', $vehicle) ?? false,
        ]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        $vehicle->load('agency');

        return Inertia::render('vehicles/edit', [
            'vehicle' => $vehicle,
            'agencies' => Agency::query()->orderBy('name')->get(['id', 'name']),
            'statusOptions' => array_map(
                fn (VehicleStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                VehicleStatus::all(),
            ),
        ]);
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $vehicle->update($request->validated());

        return redirect()->route('vehicles.show', $vehicle)->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted successfully.');
    }
}
