<?php

namespace App\Http\Controllers;

use App\Enums\MaintenanceStatus;
use App\Http\Requests\Maintenance\StoreMaintenanceRequest;
use App\Http\Requests\Maintenance\UpdateMaintenanceRequest;
use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Maintenance::class, 'maintenance');
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'vehicle_id']);

        $maintenances = Maintenance::query()
            ->with(['vehicle:id,agency_id,unit_number,plate_number,status', 'vehicle.agency:id,name'])
            ->search($filters['search'] ?? null)
            ->status($filters['status'] ?? null)
            ->vehicleId($filters['vehicle_id'] ?? null)
            ->latest('scheduled_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('maintenances/index', [
            'maintenances' => $maintenances,
            'filters' => $filters,
            'statusOptions' => array_map(
                fn (MaintenanceStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                MaintenanceStatus::all(),
            ),
            'vehicles' => Vehicle::query()
                ->with('agency:id,name')
                ->orderBy('unit_number')
                ->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'canCreate' => $request->user()?->can('create', Maintenance::class) ?? false,
            'canManage' => $request->user()?->can('update', Maintenance::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $selectedVehicleId = $request->integer('vehicle_id');
        $selectedVehicle = $selectedVehicleId
            ? Vehicle::query()->with('agency:id,name')->find($selectedVehicleId)
            : null;

        return Inertia::render('maintenances/create', [
            'vehicles' => Vehicle::query()
                ->with('agency:id,name')
                ->orderBy('unit_number')
                ->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'statusOptions' => array_map(
                fn (MaintenanceStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                MaintenanceStatus::all(),
            ),
            'selectedVehicleId' => $selectedVehicle?->id,
            'selectedAgencyId' => $selectedVehicle?->agency_id,
            'selectedDate' => now()->toDateString(),
        ]);
    }

    public function store(StoreMaintenanceRequest $request): RedirectResponse
    {
        $maintenance = DB::transaction(function () use ($request): Maintenance {
            $data = $request->validated();

            return Maintenance::query()->create([
                'agency_id' => $data['agency_id'],
                'vehicle_id' => $data['vehicle_id'],
                'created_by_user_id' => $request->user()?->id,
                'maintenance_number' => $this->generateMaintenanceNumber(),
                'type' => $data['type'] ?? 'general',
                'status' => $data['status'],
                'scheduled_at' => $data['scheduled_at'],
                'cost' => $data['cost'],
                'currency' => 'USD',
                'description' => $data['description'],
                'vendor_name' => $data['vendor_name'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);
        });

        return redirect()->route('maintenances.show', $maintenance)->with('success', 'Maintenance logged successfully.');
    }

    public function show(Maintenance $maintenance): Response
    {
        $maintenance->load([
            'vehicle:id,agency_id,unit_number,plate_number,status',
            'vehicle.agency:id,name',
            'createdBy:id,name',
        ]);

        return Inertia::render('maintenances/show', [
            'maintenance' => $maintenance,
            'canManage' => request()->user()?->can('update', $maintenance) ?? false,
        ]);
    }

    public function edit(Maintenance $maintenance): Response
    {
        $maintenance->load([
            'vehicle:id,agency_id,unit_number,plate_number,status',
            'vehicle.agency:id,name',
        ]);

        return Inertia::render('maintenances/edit', [
            'maintenance' => $maintenance,
            'vehicles' => Vehicle::query()
                ->with('agency:id,name')
                ->orderBy('unit_number')
                ->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'statusOptions' => array_map(
                fn (MaintenanceStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                MaintenanceStatus::all(),
            ),
        ]);
    }

    public function update(UpdateMaintenanceRequest $request, Maintenance $maintenance): RedirectResponse
    {
        $data = $request->validated();

        $maintenance->update([
            'agency_id' => $data['agency_id'],
            'vehicle_id' => $data['vehicle_id'],
            'type' => $data['type'] ?? $maintenance->type,
            'status' => $data['status'],
            'scheduled_at' => $data['scheduled_at'],
            'cost' => $data['cost'],
            'description' => $data['description'],
            'vendor_name' => $data['vendor_name'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('maintenances.show', $maintenance)->with('success', 'Maintenance updated successfully.');
    }

    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $maintenance->delete();

        return redirect()->route('maintenances.index')->with('success', 'Maintenance deleted successfully.');
    }

    private function generateMaintenanceNumber(): string
    {
        return 'MNT-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5));
    }
}
